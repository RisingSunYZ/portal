package com.dragon.portal.interceptor;

import com.dragon.portal.component.IUserLoginComponent;
import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.service.idm.IIdmService;
import com.dragon.portal.util.CryptUtils;
import com.dragon.portal.utils.CommUtil;
import com.dragon.portal.utils.CommUtils;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.vo.user.UserSessionRedisInfo;
import com.dragon.tools.common.JsonUtils;
import com.dragon.tools.utils.CookiesUtil;
import com.ecnice.privilege.vo.idm.IdmReturnEntity;
import com.ecnice.privilege.vo.idm.IdmUser;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.vo.LeaderDepartmentVo;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 登录拦截器
 * @Title:
 * @Description:
 * @Author:wentaoxiang
 * @Since:2016年1月22日 下午5:30:23
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@Component
public class LoginCheckInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(LoginCheckInterceptor.class);

    @Resource
	private IPersonnelApi personnelApi;
	@Resource
	private IOrgApi orgApi;
	@Resource
	private CommonProperties commonProperties;
	@Resource
	private IIdmService idmService;
	@Autowired
	private IUserLoginComponent userLoginComponent;
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        logger.info(request.getRequestURI());
		HttpSession session = request.getSession();
		// 判断是否IDM登录
		if(Boolean.TRUE.toString().equals(commonProperties.getLoginSwitch())){
			// 验证IDM接口是否已经登录
			Cookie cookie = CommUtil.getCookieByName(request, "SIAMTGT");
			String siamTgt = null == cookie?null:cookie.getValue();
			if(StringUtils.isBlank(siamTgt)){
//				response.getWriter().write("");
//				response.sendRedirect(commonProperties.getIdmLogoutUrl());
				logger.warn("您的IDM登录会话已经失效，请重新登录！");
				response.setStatus(HttpStatus.SC_UNAUTHORIZED);
				response.setHeader("msg", "no idm login, please do login.");
//				return false;
			}
			long start = System.currentTimeMillis();
			IdmReturnEntity idmReturnEntity = idmService.checkLoginStatus(siamTgt);
			long end = System.currentTimeMillis();
			logger.info("获取当前登录状态耗时：" + (end - start) +"ms");

			if(null != idmReturnEntity && null != idmReturnEntity.getUser()){
				IdmUser idmUser = idmReturnEntity.getUser();
				String userNo = idmUser.getUid();

				// String userNo = CookiesUtil.get(request,PortalConstant.COOKIE_USERNAME);
				// 如果IDM是登录状态，将获取用户信息存入缓存中
				UserSessionRedisInfo urInfo = userLoginComponent.getUserSessionRedisInfos(session.getId(), idmUser.getUid(), response);
				UserSessionInfo userSessionInfo = getUserSessionInfo(urInfo);
				if(null == userSessionInfo){
					try {
						com.ys.tools.vo.ReturnVo<PersonnelApiVo> returnVo = this.personnelApi.getPersonnelApiVoByNo(userNo);
						//用户登录
						if(returnVo.getCode() == UcenterConstant.SUCCESS) {
							if(null != returnVo.getData()){
								PersonnelApiVo personVo = returnVo.getData();
								List<LeaderDepartmentVo> leaderDeptList = null;
								if(null!=personVo && StringUtils.isNotBlank(personVo.getNo())){
									com.ys.tools.vo.ReturnVo<LeaderDepartmentVo> returnVos = this.orgApi.getDepartmentsByLeaderCode(personVo.getNo());
									if(returnVos != null && CollectionUtils.isNotEmpty(returnVos.getDatas())){
										leaderDeptList = returnVos.getDatas();
									}
								}
								UserSessionInfo usr = genUserSessionInfo(personVo);

								setPersonInfo(usr, urInfo, leaderDeptList, response);
							}else{
								//如果人员主数据系统中查不到此人，则认为是临时人员登录
								//登录临时人员
								UserSessionInfo usr = genTempUserSessionInfo(idmUser);
								setPersonInfo(usr, urInfo, null, response);
							}
						}else{
							logger.error("获取人员主数据接口出错！" + returnVo.getMsg());
						}
					} catch (Exception e) {
						logger.error("调用人员主数据接口异常！"+e);
						e.printStackTrace();
					}
				}
				return true;
			}else{
				logger.warn("您的IDM登录会话已经失效，请重新登录！");
				response.setStatus(HttpStatus.SC_UNAUTHORIZED);
				response.setHeader("msg", "no idm login, please do login.");
				return false;
			}
		}else{
			UserSessionInfo u = (UserSessionInfo) request.getSession().getAttribute(PortalConstant.SESSION_SYS_USER);
			if(null == u){
				logger.warn("您的登录会话已经失效，请重新登录！");
				response.setStatus(HttpStatus.SC_UNAUTHORIZED);
				response.setHeader("msg", "no login, please do login.");
				return false;
			}
			return true;
		}
	}

	/**
	 * 组装临时人员信息
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午4:45:18
	 */
	public UserSessionInfo genTempUserSessionInfo(IdmUser idmUser){
		UserSessionInfo userInfo = new UserSessionInfo();
		String userName = idmUser.getUid();

		userInfo.setNo(userName);
		userInfo.setName(userName);
		return userInfo;
	}

	/**
	 * 把用户登录信息保存到Redis中
	 * @param leaderDeptList
	 * @return
	 */
	private void setPersonInfo(UserSessionInfo u, UserSessionRedisInfo usIdInfo, List<LeaderDepartmentVo> leaderDeptList, HttpServletResponse response) {
		if(!CommUtils.isNull(u)) {
			String userStr = JsonUtils.toJson(u);

			//设置用户信息到Redis中
			usIdInfo.putValue(PortalConstant.SESSION_PERSON_INFO, userStr);
			//设置用户领导部门集合到Redis中

			if(CollectionUtils.isNotEmpty(leaderDeptList)){
				String userLeaderDeptListStr = JsonUtils.toJson(leaderDeptList);
				usIdInfo.putValue(PortalConstant.SESSION_PERSON_LEADERDEPT_INFO, userLeaderDeptListStr);
			}

			String urid = u.getNo();
			try {
				urid = CryptUtils.getCryPasswd(PortalConstant.USER_REDIS_ID_PREFIX+u.getNo());

				CookiesUtil.crossDomainPut(response, PortalConstant.COOKIE_USERNAME, u.getNo());
			} catch (Exception e) {
				logger.error("用户工号加密异常！" + e);
				e.printStackTrace();
			}
			userLoginComponent.putUserSessionRedisInfo(urid, usIdInfo);
		}
	}

		/**
		 * @Titile:session中取用户登录信息,用于判断Redis中是否有该用户信息
		 * @return 返回null
		 */
	private UserSessionInfo getUserSessionInfo(UserSessionRedisInfo usIdInfo) {
		UserSessionInfo u = null;
		String uo = usIdInfo.getValue(PortalConstant.SESSION_PERSON_INFO);
		if(StringUtils.isNotEmpty(uo)) {
			u = (UserSessionInfo)JsonUtils.jsonToObj(uo, UserSessionInfo.class);
		}
		return u;
	}

	/**
	 * 封装登录用户信息
	 * @param person
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午2:42:12
	 */
	public UserSessionInfo genUserSessionInfo(PersonnelApiVo person){
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
