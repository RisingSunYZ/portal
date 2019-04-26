package com.dragon.portal.interceptor;

import com.dragon.portal.component.IUserLoginComponent;
import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.service.idm.IIdmService;
import com.dragon.portal.service.redis.RedisService;
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
import org.springframework.web.servlet.ModelAndView;

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
	private RedisService redisService;
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
				logger.info(JsonUtils.toJson(urInfo));
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
//		userInfo.setDepName(request.getParameter("department"));
//		userInfo.setCompanyName(request.getParameter("companyName"));
//		userInfo.setUserImgUrl(request.getParameter("userImgUrl"));
//		userInfo.setUserPost(request.getParameter("userPost"));
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
			// logger.info("从Redis中获取登录用户: " + u.getName());
		}else{
			//logger.info("Redis中获取用户信息为空！");
		}
		return u;
	}

	/**
	 * 获取门户Redis里面皮肤主题
	 * (non-Javadoc)
	 * @see org.springframework.web.servlet.handler.HandlerInterceptorAdapter#postHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.Object, org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	public void postHandle(HttpServletRequest request,HttpServletResponse response, 
			Object handler,	ModelAndView modelAndView) throws Exception {

	}

	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
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
	/**
	 * 检查请求是否是异步请求
	 * @param request
	 * @param response
	 * @return true 是异步请求 false不是
	 */
	private boolean checkAjaxReq(HttpServletRequest request,HttpServletResponse response) {
		try {
			//获得请求类型
			String reqType = request.getHeader("X-Requested-With");
			if ("XMLHttpRequest".equalsIgnoreCase(reqType)) {
			    return true;
			}
		} catch (Exception e) {
			logger.error("判断请求是否是异步请求异常！" ,e);
		}
		return false;
	}
	

	
	/**
	 * 组装被迫下线页面信息
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午3:25:31
	 */
	private String getOfflineHtmlContent(HttpServletRequest request, String msg){
//		String reqPath = request.getServletPath();
//		String toUrlJs = "var toUrl='"+reqPath+"';try {toUrl = window.top.document.referrer ;} catch(M) {if (window.parent) {try {toUrl = window.parent.document.referrer;} catch(L) {toUrl = '';} }}if (toUrl === '') {toUrl = document.referrer;}";
		StringBuffer sb = new StringBuffer();
//		String idmLogoutUrl = readProperty.getValue("idm.logouturl");
//		String seeyonBasePath = readProperty.getValue("seeyon.domain");
//		msg = StringEscapeUtils.escapeHtml(msg);//StringEscapeUtils.escapeHtml("您已经被迫下线，请重新登录。正在跳转......");//"&#24744;&#24050;&#34987;&#36843;&#19979;&#32447;&#65292;&#35831;&#37325;&#26032;&#30331;&#24405;&#12290;&#27491;&#22312;&#36339;&#36716;&#46;&#46;&#46;&#46;&#46;&#46;";
//		String timeTxt = StringEscapeUtils.escapeHtml("秒后自动跳转");
//		String sorryTxt = StringEscapeUtils.escapeHtml("Sorry，");
//		String btnTxt = StringEscapeUtils.escapeHtml("立即前往");
//		String fontTxt = StringEscapeUtils.escapeHtml("微软雅黑");
//		String titleTxt = StringEscapeUtils.escapeHtml("亚厦股份 - 被迫下线通知");
//		sb.append("<!DOCTYPE HTML>");
//		sb.append("<html><head>");
//		sb.append("    <meta http-equiv='pragma' content='no-cache'>");
//		sb.append("    <meta http-equiv='cache-control' content='no-cache'>");
//		sb.append("    <meta http-equiv='expires' content='0'>");
//		sb.append("    <meta charset='utf-8'><title>"+titleTxt+"</title>");
//		sb.append("    <style>*{margin: 0;padding: 0;font-family: '"+fontTxt+"';text-align: center;}html,body,.main{width: 100%;height: 100%;}body {margin: 0 auto;}.main {position: relative;overflow: hidden;}.unauthorized {position: absolute;top:50%;left: 50%;margin-top: -256px;margin-left: -306px;width: 612px;height: 512px;}");
//		sb.append("        .unauthorized-msg {color: #0b4d5c;line-height: 40px;}.unauthorized-msg .msg-title {font-size: 40px;}.unauthorized-msg .msg-how {font-size: 24px;}.unauthorized-action {width: 100px;margin: 30px auto;}");
//		sb.append("        .btn-unauthorized {display: inline-block;width: 100px;height: 38px;line-height: 38px;color: #fbfeff;font-size: 12px;background: #0e65af;border-radius: 4px;text-decoration: none;}");
//		sb.append("        .btn-unauthorized:hover {opacity: 0.9;}.setTimeOut{margin-top: 16px;color:#a4a4a4;font-size: 14px;line-height: 24px;}.setTimeOut span{display: inline-block;width: 20px;color:#f00000;}.hide{width:0;height:0;border:0;overflow:hidden;}");
//		sb.append("    </style>");
//		sb.append("    </head><body id='body'><div class='main'>");
//		sb.append("    <div class='unauthorized'><img class='hide' src='"+seeyonBasePath+"/seeyon/main.do?method=logoutFromhome'/><iframe border='0' width='0' height='0' class='hide' src='"+idmLogoutUrl+"' ></iframe>");
//		sb.append("        <div class='unauthorized-msg'><span class='msg-title'>"+sorryTxt+"</span><span class='msg-how'>"+msg+"</span></div>");
//		sb.append("        <div class='setTimeOut'><span id='time'>3</span>"+timeTxt+"</div>");
//		sb.append("        <div class='unauthorized-action'><a class='btn-unauthorized' href='javascript:void(0);' onclick='toLogin();'>"+btnTxt+"</a></div>");
//		sb.append("        <div class='unauthorized-img'><img src='/assets/img/hr-service/unauthorized-bg.png' /></div></div></div>");
//		//sb.append("        <script>"+toUrlJs+" var timer=null; function toLogin(){window.location.href=toUrl;clearInterval(timer);}function run(){var s = document.getElementById('time');if(s.innerHTML == 1){toLogin();return false;}s.innerHTML = s.innerHTML * 1 - 1;} timer = window.setInterval('run();', 1000);</script>");
//		// $.ajax({dataType:'jsonp',url:"${seeyonPath}/seeyon/main.do?method=logoutFromhome"});
//		sb.append("        <script>"+toUrlJs+" var timer=null; function toLogin(){window.location.href=toUrl;clearInterval(timer);}function run(){var s = document.getElementById('time');if(s.innerHTML == 1){toLogin();return false;}s.innerHTML = s.innerHTML * 1 - 1;} timer = window.setInterval('run();', 1000);</script>");
//		sb.append("</body></html>");
		
		
		return sb.toString();
	}
	
}
