
package com.dragon.portal.service.user.impl;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.dao.user.IUserLoginDao;
import com.dragon.portal.model.user.UserLogin;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.service.idm.IImdLoginService;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.service.user.IUserLoginService;
import com.dragon.tools.common.MD5Util;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.mhome.se.api.ISendSmsApi;
import com.mhome.se.eum.SmsModeTypeEnum;
import com.mhome.se.model.sms.SmsInfo;
import com.mhome.se.vo.SeReturnVo;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import com.ys.yahu.vo.idm.LoginRvo;
import com.ys.yahu.vo.idm.User;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
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

	@Autowired
	private Environment environment;

    @Autowired
    private IImdLoginService iImdLoginService;

	@Resource
	private IPersonnelApi personnelApi;
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

        final String loginSwitch = environment.getProperty("idm.login.switch");
		UserLogin user = new UserLogin();
		boolean check = false;

        if("true".equals(loginSwitch)){//启用IDM登录
            LoginRvo loginRvo = iImdLoginService.loginIDM(username, password);
			if (null != loginRvo && null != loginRvo.getUser() && StringUtils.isNotBlank(loginRvo.getUser().getUid())) {
				User userTemp = loginRvo.getUser();
				user.setUserNo(userTemp.getUid());
				//获取头像和姓名
				com.ys.tools.vo.ReturnVo<PersonnelApiVo> rvo = personnelApi.getPersonnelApiVoByNo(userTemp.getUid());
				if (null != rvo && PortalConstant.SUCCESS.equals(rvo.getCode()+"") && null != rvo.getData()) {
					PersonnelApiVo personnel = rvo.getData();
					user.setUserName(personnel.getName());
					user.setEmail(personnel.getSelfEmail());
					user.setMobile(personnel.getMobilePhone());
				}
				check = true;
			}
        }else{
            //查询用户id
            List<UserLogin> list = userLoginDao.getUserLoginByUserName(username);
            if(CollectionUtils.isNotEmpty(list)) {
                user = list.get(0);
            }
			//对比不加密密码
			check = MD5Util.checkPassword(password, user.getPassword());
			if(!check){//对比加密密码
				check= password.equals(user.getPassword());
			}
        }

		if (check) {
			userLoginDao.updateUserLogin(user);
			//记录上次登录时间
			user.setLastLoginTime(new Date());

			//返回结果
			returnVo = new ReturnVo(ReturnCode.SUCCESS,"登录成功！");
			user.setPassword(null);
			returnVo.setData(user);

			//保存session
			session.setAttribute(PortalConstant.USER_UID, user.getUserName());
			session.setAttribute(PortalConstant.SYS_USER, user);
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


}

