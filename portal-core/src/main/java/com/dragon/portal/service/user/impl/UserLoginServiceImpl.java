
package com.dragon.portal.service.user.impl;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.dao.user.IUserLoginDao;
import com.dragon.portal.model.user.UserLogin;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.service.user.IUserLoginService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.MD5Util;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.mhome.se.api.ISendSmsApi;
import com.mhome.se.eum.SmsModeTypeEnum;
import com.mhome.se.model.sms.SmsInfo;
import com.mhome.se.vo.SeReturnVo;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.vo.LeaderDepartmentVo;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.List;


/**
 * UserLoginService
 *
 * @author ruanzg
 * @Date 2019-02-25 13:47
 * description : 用户Service接口
 */
@Service
public class UserLoginServiceImpl implements IUserLoginService {

	@Autowired
	private IUserLoginDao userLoginDao;

	@Resource
	private ISendSmsApi sendSmsApi;

	@Resource
	private CommonProperties commonProperties;

	@Resource
	private RedisService redisService;

	@Resource
	private IPersonnelApi personnelApi;
	@Resource
	private IOrgApi orgApi;

	private static Logger logger = Logger.getLogger(UserLoginServiceImpl.class);
	/**
	 * 登录验证
	 * @param username
	 * @param password
	 * @param session
	 * @return
	 * @throws Exception
	 */
	public ReturnVo updateCheckLogin(String username , String password, HttpSession session)throws Exception{
		ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL,"用户或密码错误！");
		UserLogin userLogin = new UserLogin();
		userLogin.setUserName(username);
		userLogin.setPassword(MD5Util.getMD5String(password));
		List<UserLogin> list = userLoginDao.getUserByNameAndPwd(userLogin);
		if(CollectionUtils.isNotEmpty(list)) {
			UserLogin user = list.get(0);
			//记录上次登录时间
			user.setLastLoginTime(new Date());
			userLoginDao.updateUserLogin(user);

			//返回结果
			returnVo = new ReturnVo(ReturnCode.SUCCESS,"登录成功！");
			user.setPassword(null);
			returnVo.setData(user);

			//保存session
			session.setAttribute(PortalConstant.USER_UID, user.getUserName());
			session.setAttribute(PortalConstant.SYS_USER, user);
			this.loginCallback(user.getUserNo(),session);
		}
		return returnVo;
	}

	/**
	 * 获取手机验证码
	 * @param userNo
	 * @return
	 */
	@Override
	public ReturnVo createVerificationCode(String userNo, HttpSession session) throws Exception {
		ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL,"工号不存在或已被禁用！");
		UserLogin user = new UserLogin();
		user.setUserNo(userNo);
		List<UserLogin> userLoginList = userLoginDao.getAll(user);
		if(CollectionUtils.isNotEmpty(userLoginList)){
			user = userLoginList.get(0);
			String mobile = user.getMobile();
			String code = String.valueOf((int)((Math.random()*9+1)*100000));

			session.setAttribute(PortalConstant.VERIFICATION_CODE, code);
			session.setAttribute(PortalConstant.TEMPORARY_USER_UID,userNo);//记录工号，后续验证时使用
			//将生成的验证码 存入redis 10分钟过期
			redisService.set(userNo+"-"+PortalConstant.VERIFICATION_CODE, code,900l);
			//发短信
			SmsInfo smsInfo = new SmsInfo(commonProperties.getSmsMobileCode());
			smsInfo.setType(SmsModeTypeEnum.PROMPT.getType());
			smsInfo.setTelNum(mobile);
			smsInfo.setContent("{\"code\":\""+code+"\"}");
			SeReturnVo<SmsInfo> seReturnVo = sendSmsApi.sendSmsInfo(smsInfo);
			if(seReturnVo.getStatus()==Integer.valueOf(ReturnCode.SUCCESS)){
				returnVo = new ReturnVo(ReturnCode.SUCCESS,"验证码发送成功");
				UserLogin u = new UserLogin();
				u.setMobile(mobile);
				returnVo.setData(u);//返回手机号
			}else{
				returnVo.setMsg("短信验证码发送失败！");
			}
		}

		return returnVo;
	}
	/**
	 * 验证码校验
	 * @param code
	 * @return
	 * @throws Exception
	 */
	public ReturnVo getVerificationCodeCheck(String code, HttpSession session) throws Exception{
		ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL,"短信验证码不正确!");
		//临时用户
		String userNo = (String)session.getAttribute(PortalConstant.TEMPORARY_USER_UID);
		if(StringUtils.isNotEmpty(userNo)) {
			String verificationCode = (String) redisService.get(userNo + "-"+PortalConstant.VERIFICATION_CODE);
			if (StringUtils.isNotEmpty(code) && StringUtils.trim(code).equals(verificationCode)) {
				//记录当前用户已通过手机短信校验
				redisService.set(userNo+"-"+PortalConstant.CHECK_CODE_FLAG,PortalConstant.SUCCESS,900l);//
				returnVo = new ReturnVo(ReturnCode.SUCCESS, "验证码成功！");
			}
		}
		return returnVo;
	}

	/**
	 * 忘记密码-》修改密码
	 * @param password
	 * @return
	 * @throws Exception
	 */
	public ReturnVo updatePwdBeforeLogin(String password, HttpSession session) throws Exception{
		ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL,"修改失败！");

		//手机验证时记录的工号
		String userNo = (String)session.getAttribute(PortalConstant.TEMPORARY_USER_UID);
		if(StringUtils.isNotEmpty(userNo)) {
			//获取手机验证码校验记录
			String checkCodeFlag = (String) redisService.get(userNo + "-"+PortalConstant.CHECK_CODE_FLAG);
			List<UserLogin> userLoginList = userLoginDao.getUserLoginByUserName(userNo);
			if (CollectionUtils.isNotEmpty(userLoginList) && PortalConstant.SUCCESS.equals(checkCodeFlag)) {
                UserLogin user = userLoginList.get(0);
				//修改密码
				this.updatePwd(user,password);
				returnVo = new ReturnVo(ReturnCode.SUCCESS, "修改成功！");
			}else{
				returnVo.setMsg("修改失败！短信验证码已过期，请重新认证！");
			}
		}
		return returnVo;
	}

	/**
	 * 登录后-》修改密码
     * @param password
     * @param session
	 * @return
	 * @throws Exception
	 */
	public ReturnVo updatePwdAfterLogin(String password, HttpSession session) throws Exception{
		ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL,"修改失败！");
		//获取登录后的工号
		String userNo = (String)session.getAttribute(PortalConstant.USER_UID);
		if(StringUtils.isNotEmpty(userNo)) {
			List<UserLogin> userLoginList = userLoginDao.getUserLoginByUserName(userNo);
			if (CollectionUtils.isNotEmpty(userLoginList)) {
                UserLogin user = userLoginList.get(0);
                this.updatePwd(user, password);
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "修改成功！");
			}
		}else{
			returnVo.setMsg("用户已过期");
		}
		return returnVo;
	}

	/*
	*
	 * @Author yangzhao
	 * @Description //TODO 登录回调 用户信息封装Session
	 * @Date 16:10 2019/3/12
	 * @Param [userNo, session]
	 * @return com.dragon.tools.vo.ReturnVo
	 **/
	@Override
	public ReturnVo loginCallback(String userNo, HttpSession session) throws Exception {
		ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL,"用户信息存储Session失败！");
		if(StringUtils.isNotBlank(userNo)){
			com.ys.tools.vo.ReturnVo<PersonnelApiVo> returnVoYs = this.personnelApi.getPersonnelApiVoByNo(userNo);
			//用户登录
			if(returnVoYs.getCode() == UcenterConstant.SUCCESS) {
				if(null != returnVoYs.getData()){
					PersonnelApiVo personVo = returnVoYs.getData();
					List<LeaderDepartmentVo> leaderDeptList = null;
					if(null!=personVo && StringUtils.isNotBlank(personVo.getNo())){
						com.ys.tools.vo.ReturnVo<LeaderDepartmentVo> returnVos = this.orgApi.getDepartmentsByLeaderCode(personVo.getNo());
						if(returnVos != null && CollectionUtils.isNotEmpty(returnVos.getDatas())){
							leaderDeptList = returnVos.getDatas();
						}
					}
					UserSessionInfo user = genUserSessionInfo(personVo);
					session.setAttribute("user",user);
					session.setAttribute("leaderDeptList",leaderDeptList);
					returnVo = new ReturnVo(ReturnCode.SUCCESS,"用户信息存储Session成功！");
				}
			}else{
				logger.error("获取人员主数据接口出错！" + returnVo.getMsg());
			}
		}
		return returnVo;
	}

	/**
	 * 修改密码
	 * @param user
	 * @param password
	 * @throws Exception
	 */
	private void updatePwd(UserLogin user,String password)throws Exception{
		String pwd = MD5Util.getMD5String(password);
		user.setPassword(pwd);
		userLoginDao.updateUserLogin(user);
	}

	/**
	 * 封装登录用户信息
	 * @param person
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午2:42:12
	 */
	private UserSessionInfo genUserSessionInfo(PersonnelApiVo person){
		UserSessionInfo userInfo = null;
		if(null != person){
			userInfo = new UserSessionInfo();
			userInfo.setId(person.getId());
			userInfo.setNo(person.getNo());
			userInfo.setCompanyId(person.getCompanyId());
			userInfo.setCompanyCode(person.getCompanyId());
			userInfo.setCompanyName(person.getCompanyName());
			userInfo.setDepId(person.getDeptId());
			userInfo.setDepCode(person.getDeptId());
			userInfo.setDepName(person.getDeptName());
			// 如果没有上级部门，将本部门赋值给上级部门
			if(StringUtils.isBlank(person.getParentDeptId())){
				userInfo.setParentDepId(person.getDeptId());
				userInfo.setParentDepName(person.getDeptName());
			}else{
				userInfo.setParentDepId(person.getParentDeptId());
				userInfo.setParentDepName(person.getParentDeptName());
			}
			userInfo.setPhone(person.getPhone());
			userInfo.setName(person.getName());
			userInfo.setUserImgUrl(person.getHeadImg());
			userInfo.setMobile(person.getMobilePhone());
			userInfo.setUserPost(person.getJobStation());
		}

		return userInfo;
	}



}

