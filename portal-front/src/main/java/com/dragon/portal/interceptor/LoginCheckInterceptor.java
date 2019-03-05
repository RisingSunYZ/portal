package com.dragon.portal.interceptor;

import com.alibaba.fastjson.JSONObject;
import com.dragon.portal.constant.FormConstant;
import com.dragon.portal.model.user.UserLogin;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 登录拦截器
 * @Title:
 * @Description:
 * @Author:wentaoxiang
 * @Since:2016年1月22日 下午5:30:23
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public class LoginCheckInterceptor implements HandlerInterceptor {
	
	private static final Logger logger = Logger.getLogger(LoginCheckInterceptor.class);
	@Resource
	private IPersonnelApi personnelApi;
	@Resource
	private IOrgApi orgApi;
	@Resource
	private RedisService redisService;
	@Resource
	private CommonProperties commonProperties;
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		//判断是否IDM登录
		if("true".equals("")){



			return true;
		}else{
			UserLogin userLogin = (UserLogin)request.getSession().getAttribute(FormConstant.SYS_USER);
			if (null != userLogin) {
				return true;
			} else {
				logger.error("Request Intercept : " + request.getRequestURI());
				ReturnVo vo = new ReturnVo(ReturnCode.FAIL, "您的登录会话已经失效，请重新登录");
				response.setContentType("application/json;charset=UTF-8");
				response.getWriter().write(JSONObject.toJSONString(vo));
				return false;
			}
		}
	}

	/*
	 * 获取门户Redis里面皮肤主题
	 * (non-Javadoc)
	 * @see org.springframework.web.servlet.handler.HandlerInterceptorAdapter#postHandle(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.Object, org.springframework.web.servlet.ModelAndView)
	 */
	@Override
	public void postHandle(HttpServletRequest request,HttpServletResponse response, 
			Object handler,	ModelAndView modelAndView) throws Exception {
		String a =null;
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
