
package com.dragon.portal.service.user.impl;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.dao.user.IUserLoginDao;
import com.dragon.portal.model.user.UserLogin;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.service.user.IUserLoginService;
import com.dragon.tools.common.MD5Util;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.mhome.se.api.ISendSmsApi;
import com.mhome.se.eum.SmsModeTypeEnum;
import com.mhome.se.model.sms.SmsInfo;
import com.mhome.se.vo.SeReturnVo;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
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
	/**
	 * 登录验证
	 * @param username
	 * @param password
	 * @param session
	 * @return
	 * @throws Exception
	 */
	public ReturnVo updateCheckLogin(String username , String password, HttpSession session)throws Exception{
		ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL,"登录失败");
		//查询用户id
		List<UserLogin> list = userLoginDao.getUserLoginByUserName(username);
		if(CollectionUtils.isNotEmpty(list)) {
			UserLogin user = list.get(0);
			//登录
			boolean check = MD5Util.checkPassword(password, user.getPassword());
			if (check) {
				//记录上次登录时间
				user.setLastLoginTime(new Date());
				userLoginDao.updateUserLogin(user);

				//返回结果
				returnVo = new ReturnVo(ReturnCode.SUCCESS,"登录成功");
				user.setPassword(null);
				returnVo.setData(user);

				//保存session
				session.setAttribute("uid", user.getUserName());
				session.setAttribute("user", user);
			} else {
				returnVo.setMsg("登录失败");
			}
		} else {
			returnVo.setMsg("登录失败");
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
		ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL,"验证码发送失败");
		UserLogin user = new UserLogin();
		user.setUserNo(userNo);
		List<UserLogin> userLoginList = userLoginDao.getAll(user);
		if(CollectionUtils.isNotEmpty(userLoginList)){
			user = userLoginList.get(0);
			String mobile = user.getMobile();
			String code = String.valueOf((int)((Math.random()*9+1)*100000));

			session.setAttribute("verificationCode", code);
			session.setAttribute("temporaryUserNo",userNo);//记录工号，后续验证时使用
			//将生成的验证码 存入redis 10分钟过期
			redisService.set(userNo+"-sendVerificationCode", code,900l);
			//发短信
			SmsInfo smsInfo = new SmsInfo(commonProperties.getSmsMobileCode());
			smsInfo.setType(SmsModeTypeEnum.PROMPT.getType());
			smsInfo.setTelNum(mobile);
			smsInfo.setContent("{\"code\":\""+code+"\"}");
			SeReturnVo<SmsInfo> seReturnVo = sendSmsApi.sendSmsInfo(smsInfo);
			if(seReturnVo.getStatus()==Integer.valueOf(ReturnCode.SUCCESS)){
				returnVo = new ReturnVo(ReturnCode.SUCCESS,"验证码发送成功");
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
		ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL,"验证码错误");
		String userNo = (String)session.getAttribute("temporaryUserNo");
		if(StringUtils.isNotEmpty(userNo)) {
			String verificationCode = (String) redisService.get(userNo + "-sendVerificationCode");
			if (StringUtils.isNotEmpty(code) && StringUtils.trim(code).equals(verificationCode)) {
				//记录当前用户已通过手机短信校验
				redisService.set(userNo+"-checkCodeFlag",PortalConstant.SUCCESS,900l);//
				returnVo = new ReturnVo(ReturnCode.SUCCESS, "验证成功");
			}
		}
		return returnVo;
	}

	/**
	 * 修改密码
	 * @param password
	 * @return
	 * @throws Exception
	 */
	public ReturnVo updatePwd(String password, HttpSession session) throws Exception{
		ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL,"修改失败");
		//手机验证时记录的工号
		String userNo = (String)session.getAttribute("temporaryUserNo");
		if(StringUtils.isNotEmpty(userNo)) {
			List<UserLogin> userLoginList = userLoginDao.getUserLoginByUserName(userNo);
			//获取手机验证码校验记录
			String checkCodeFlag = (String) redisService.get(userNo + "-checkCodeFlag");
			if (CollectionUtils.isNotEmpty(userLoginList) && PortalConstant.SUCCESS.equals(checkCodeFlag)) {
				UserLogin userLogin = userLoginList.get(0);
				String pwd = MD5Util.getMD5String(password);
				userLogin.setPassword(pwd);
				userLoginDao.updateUserLogin(userLogin);
				returnVo = new ReturnVo(ReturnCode.SUCCESS, "修改成功");
			}
		}
		return returnVo;
	}


}

