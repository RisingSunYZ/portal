package com.dragon.portal.component;


import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.vo.user.UserSessionRedisInfo;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 用户登录相关公共组件
 */
public interface IUserLoginComponent {

	/**
	 * 获取当前登录用户
	 * @param siamTgt
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午2:44:27
	 */
	public UserSessionInfo getCurrentUser(String siamTgt, HttpServletRequest request, HttpServletResponse response);

	public UserSessionRedisInfo getUserSessionRedisInfos(String ssid, String userNo, HttpServletResponse response);

	public void putUserSessionRedisInfo(String usid, UserSessionRedisInfo usi);


}
