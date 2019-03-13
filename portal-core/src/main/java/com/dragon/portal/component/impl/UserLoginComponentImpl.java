package com.dragon.portal.component.impl;

import com.dragon.portal.client.AuthUtils;
import com.dragon.portal.component.IUserLoginComponent;
import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.service.idm.IIdmService;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.util.CryptUtils;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.vo.user.UserSessionRedisInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.ecnice.privilege.vo.idm.IdmReturnEntity;
import com.ecnice.privilege.vo.idm.IdmUser;
import com.mhome.tools.common.UUIDGenerator;
import com.ys.atds.utils.CommUtils;
import com.ys.mis.utils.Cookies;
import com.ys.tools.common.JsonUtils;
import com.ys.tools.common.ReadProperty;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.vo.LeaderDepartmentVo;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class UserLoginComponentImpl implements IUserLoginComponent {

	private static Logger logger = Logger.getLogger(UserLoginComponentImpl.class);
	@Autowired
	private AuthUtils authUtils;

	@Autowired
	private RedisService redisService;
	@Autowired
	private IPersonnelApi personnelApi;
	@Autowired
	private IOrgApi orgApi;
	@Autowired
	private CommonProperties commonProperties;
	@Autowired
	private IIdmService idmService;

	@Override
	public UserSessionInfo getCurrentUser(String siamTgt, HttpServletRequest request, HttpServletResponse response) {
		if(StringUtils.isBlank(siamTgt)){
			return null;
		}

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("ticketValue", siamTgt);
		params.put("ticketName", "SIAMTGT");
		try {
			IdmReturnEntity idmReturnEntity = idmService.checkLoginStatus(siamTgt);
			if(null != idmReturnEntity && null != idmReturnEntity.getUser()){
				IdmUser idmUser = idmReturnEntity.getUser();
				idmUser.getUid();

				UserSessionInfo result = this.userLogin(idmUser.getUid(), request, response);
				return result;
			}

		}catch (Exception e){

		}
		return null;
	}

	/**
	 * 根据用户会话id获取用户会话信息对象
	 *
	 * @return
	 */
	public UserSessionRedisInfo getUserSessionRedisInfos(String ssid, String userNo, HttpServletResponse response) {
		if (CommUtils.isEmpty(ssid)) {
			UserSessionRedisInfo usi = new UserSessionRedisInfo();
			ssid = UUIDGenerator.generate();
			usi.putValue(PortalConstant.COOKIE_USER_SESSION_ID, ssid);
			Cookies.crossDomainPut(response, PortalConstant.COOKIE_USER_SESSION_ID, ssid);
			return usi;
		}

		if (!CommUtils.isEmpty(userNo)) {
			String urid = "";
			try {
				urid = CryptUtils.getCryPasswd(PortalConstant.USER_REDIS_ID_PREFIX+userNo);
			} catch (Exception e) {
				e.printStackTrace();
			}
			Object obj = redisService.get(urid);
			if (CommUtils.isNull(obj)) {
				UserSessionRedisInfo usri = new UserSessionRedisInfo();
				usri.putValue(PortalConstant.COOKIE_USER_SESSION_ID, ssid);
				return usri;
			} else {
				UserSessionRedisInfo usri = (UserSessionRedisInfo) obj;
				return usri;
			}
		}else{
			UserSessionRedisInfo usri = new UserSessionRedisInfo();
			usri.putValue(PortalConstant.COOKIE_USER_SESSION_ID, ssid);
			return usri;
		}
	}


	public UserSessionInfo userLogin(String userNo, HttpServletRequest request, HttpServletResponse response) {
		// 用户SessionId
		try {
			HttpSession session = request.getSession();
			String ssid = session.getId();
			UserSessionRedisInfo urInfo = getUserSessionRedisInfos(ssid, userNo, response);

			UserSessionInfo userSessionInfo = getUserSessionInfo(urInfo);
			if (null == userSessionInfo) {
				try {
					com.ys.tools.vo.ReturnVo<PersonnelApiVo> returnVo = this.personnelApi.getPersonnelApiVoByNo(userNo);
					//用户登录
					if (returnVo.getCode() == UcenterConstant.SUCCESS) {
						if (null != returnVo.getData()) {
							PersonnelApiVo personVo = returnVo.getData();
							List<LeaderDepartmentVo> leaderDeptList = null;
							if (null != personVo && org.apache.commons.lang.StringUtils.isNotBlank(personVo.getNo())) {
								com.ys.tools.vo.ReturnVo<LeaderDepartmentVo> returnVos = this.orgApi.getDepartmentsByLeaderCode(personVo.getNo());
								if (returnVos != null && CollectionUtils.isNotEmpty(returnVos.getDatas())) {
									leaderDeptList = returnVos.getDatas();
								}
							}
							UserSessionInfo usr = genUserSessionInfo(personVo);
							userSessionInfo = usr;
							doLogin(usr, urInfo, leaderDeptList);
						} else {
							//如果人员主数据系统中查不到此人，则认为是临时人员登录
							//登录临时人员
							UserSessionInfo usr = genTempUserSessionInfo(userNo);
							doLogin(usr, urInfo, null);
						}
					} else {
						logger.error("获取人员主数据接口出错！" + returnVo.getMsg());
					}
				} catch (Exception e) {
					logger.error("调用人员主数据接口异常！" + e);
					e.printStackTrace();
				}
			} else {
				//验证用户是否被迫下线
				if (!urInfo.get(PortalConstant.COOKIE_USER_SESSION_ID).equals(ssid)) {
					//logger.info("正常请求......");
					Cookies.remove(response, PortalConstant.COOKIE_PERSONINFO);
					Cookies.remove(response, PortalConstant.COOKIE_USERNAME);
					Cookies.remove(response, PortalConstant.COOKIE_USER_SESSION_ID);
					Cookies.remove(response, PortalConstant.COOKIE_JSESSIONID);
					Cookies.remove(response, PortalConstant.SESSION);

					// 如果请求是Ajax进来
					if (checkAjaxReq(request, response)) {
						//response.sendRedirect("/portal/ulogin/outline.jhtml");
						//return false;
						userSessionInfo = null;
					}
					PrintWriter out = response.getWriter();
					logger.info("");
					//设置response缓冲区的编码
					response.setCharacterEncoding("UTF-8");
					//设置浏览器打开文件的编码
					response.setHeader("Content-Type", "text/html;charset=UTF-8");
					response.setHeader("Cache-Control", "no-cache");
					response.setHeader("Pragma", "no-cache");
					response.setDateHeader("Expires", 0);
					out.write(getOfflineHtmlContent(request, "您已经被迫下线，请重新登录！"));
					out.flush();
					out.close();
					//return false;
					userSessionInfo = null;
				}
			}
			return userSessionInfo;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
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
				String msg = "被迫下线，或会话已过期，请刷新页面重试!";
				ReturnVo<String> rvo = new ReturnVo<String>();
				response.setContentType("text/html");
				response.setCharacterEncoding("utf-8");
				rvo.setCode(ReturnCode.FAIL);
				rvo.setMsg(msg);
				PrintWriter printWriter = response.getWriter();
				// JsonUtils.toJson(rvo);
				net.sf.json.JSONObject jsn = net.sf.json.JSONObject.fromObject(rvo);
				jsn.element("responseCode", ReturnCode.FAIL);
				jsn.element("responseMsg", msg);
				jsn.element("rows", "[]");
				printWriter.write(jsn.toString());
				printWriter.flush();
				printWriter.close();
				return true;
			}
		} catch (IOException e) {
			logger.error("判断请求是否是异步请求异常！" ,e);
		}
		return false;
	}

	/**
	 * 用户自动登录
	 * @param u
	 * @param u
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 上午9:31:59
	 * @param leaderDeptList
	 */
	private void doLogin(UserSessionInfo u, UserSessionRedisInfo usIdInfo, List<LeaderDepartmentVo> leaderDeptList) throws Exception {
		//用户登录成功
		logger.info(u.getName()+"进入登录操作！.......");
		//用户信息保存到缓存中
		setPersonInfo(u, usIdInfo, leaderDeptList);
	}

	/**
	 * 把用户登录信息保存到Redis中
	 * @param leaderDeptList
	 * @return
	 */
	private void setPersonInfo(UserSessionInfo u, UserSessionRedisInfo usIdInfo, List<LeaderDepartmentVo> leaderDeptList) {
		if(!CommUtils.isNull(u)) {
			String userStr = com.mhome.tools.common.JsonUtils.toJson(u);

			//设置用户信息到Redis中
			usIdInfo.putValue(PortalConstant.SESSION_PERSON_INFO, userStr);
			//设置用户领导部门集合到Redis中

			if(CollectionUtils.isNotEmpty(leaderDeptList)){
				String userLeaderDeptListStr = com.mhome.tools.common.JsonUtils.toJson(leaderDeptList);
				usIdInfo.putValue(PortalConstant.SESSION_PERSON_LEADERDEPT_INFO, userLeaderDeptListStr);
			}

			String urid = u.getNo();
			try {
				urid = CryptUtils.getCryPasswd(PortalConstant.USER_REDIS_ID_PREFIX+u.getNo());
			} catch (Exception e) {
				logger.error("用户工号加密异常！" + e);
				e.printStackTrace();
			}
			putUserSessionRedisInfo(urid, usIdInfo);
		}
	}

	/**
	 * 根据用户id保存用户会话信息对象
	 *
	 * @return
	 */
	public void putUserSessionRedisInfo(String usid, UserSessionRedisInfo usi) {
		String usiStr = com.mhome.tools.common.JsonUtils.toJson(usi);
		if (StringUtils.isNotBlank(usid)) {
			redisService.put(usid, usiStr, PortalConstant.SESSION_INFO_TTL, TimeUnit.HOURS);
		}
	}

	/**
	 * 组装临时人员信息
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午4:45:18
	 */
	public UserSessionInfo genTempUserSessionInfo(String userNo){
		UserSessionInfo userInfo = new UserSessionInfo();
		userInfo.setNo(userNo);
		userInfo.setName(userNo);
		return userInfo;
	}

	/**
	 * @Titile:session中取用户登录信息,用于判断Redis中是否有该用户信息
	 * @return 返回null
	 */
	private UserSessionInfo getUserSessionInfo(UserSessionRedisInfo usIdInfo) {
		UserSessionInfo u = null;
		String uo = usIdInfo.getValue(PortalConstant.SESSION_PERSON_INFO);
		if(!CommUtils.isEmpty(uo) && uo instanceof String) {
			u = (UserSessionInfo) com.mhome.tools.common.JsonUtils.jsonToObj(uo, UserSessionInfo.class);
			// logger.info("从Redis中获取登录用户: " + u.getName());
		}else{
			//logger.info("Redis中获取用户信息为空！");
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
			if(org.apache.commons.lang.StringUtils.isBlank(person.getParentDeptId())){
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
	 * 组装被迫下线页面信息
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午3:25:31
	 */
	private String getOfflineHtmlContent(HttpServletRequest request, String msg){
		String reqPath = request.getServletPath();
		String toUrlJs = "var toUrl='"+reqPath+"';try {toUrl = window.top.document.referrer ;} catch(M) {if (window.parent) {try {toUrl = window.parent.document.referrer;} catch(L) {toUrl = '';} }}if (toUrl === '') {toUrl = document.referrer;}";
		StringBuffer sb = new StringBuffer();
		String idmLogoutUrl = commonProperties.getIdmLogoutUrl();
//		String seeyonBasePath = readProperty.getValue("seeyon.domain");
		msg = StringEscapeUtils.escapeHtml(msg);//StringEscapeUtils.escapeHtml("您已经被迫下线，请重新登录。正在跳转......");//"&#24744;&#24050;&#34987;&#36843;&#19979;&#32447;&#65292;&#35831;&#37325;&#26032;&#30331;&#24405;&#12290;&#27491;&#22312;&#36339;&#36716;&#46;&#46;&#46;&#46;&#46;&#46;";
		String timeTxt = StringEscapeUtils.escapeHtml("秒后自动跳转");
		String sorryTxt = StringEscapeUtils.escapeHtml("Sorry，");
		String btnTxt = StringEscapeUtils.escapeHtml("立即前往");
		String fontTxt = StringEscapeUtils.escapeHtml("微软雅黑");
		String titleTxt = StringEscapeUtils.escapeHtml("亚厦股份 - 被迫下线通知");
		sb.append("<!DOCTYPE HTML>");
		sb.append("<html><head>");
		sb.append("    <meta http-equiv='pragma' content='no-cache'>");
		sb.append("    <meta http-equiv='cache-control' content='no-cache'>");
		sb.append("    <meta http-equiv='expires' content='0'>");
		sb.append("    <meta charset='utf-8'><title>"+titleTxt+"</title>");
		sb.append("    <style>*{margin: 0;padding: 0;font-family: '"+fontTxt+"';text-align: center;}html,body,.main{width: 100%;height: 100%;}body {margin: 0 auto;}.main {position: relative;overflow: hidden;}.unauthorized {position: absolute;top:50%;left: 50%;margin-top: -256px;margin-left: -306px;width: 612px;height: 512px;}");
		sb.append("        .unauthorized-msg {color: #0b4d5c;line-height: 40px;}.unauthorized-msg .msg-title {font-size: 40px;}.unauthorized-msg .msg-how {font-size: 24px;}.unauthorized-action {width: 100px;margin: 30px auto;}");
		sb.append("        .btn-unauthorized {display: inline-block;width: 100px;height: 38px;line-height: 38px;color: #fbfeff;font-size: 12px;background: #0e65af;border-radius: 4px;text-decoration: none;}");
		sb.append("        .btn-unauthorized:hover {opacity: 0.9;}.setTimeOut{margin-top: 16px;color:#a4a4a4;font-size: 14px;line-height: 24px;}.setTimeOut span{display: inline-block;width: 20px;color:#f00000;}.hide{width:0;height:0;border:0;overflow:hidden;}");
		sb.append("    </style>");
		sb.append("    </head><body id='body'><div class='main'>");
		sb.append("    <div class='unauthorized'><iframe border='0' width='0' height='0' class='hide' src='"+idmLogoutUrl+"' ></iframe>");
		sb.append("        <div class='unauthorized-msg'><span class='msg-title'>"+sorryTxt+"</span><span class='msg-how'>"+msg+"</span></div>");
		sb.append("        <div class='setTimeOut'><span id='time'>3</span>"+timeTxt+"</div>");
		sb.append("        <div class='unauthorized-action'><a class='btn-unauthorized' href='javascript:void(0);' onclick='toLogin();'>"+btnTxt+"</a></div>");
		sb.append("        <div class='unauthorized-img'><img src='/assets/img/hr-service/unauthorized-bg.png' /></div></div></div>");
		//sb.append("        <script>"+toUrlJs+" var timer=null; function toLogin(){window.location.href=toUrl;clearInterval(timer);}function run(){var s = document.getElementById('time');if(s.innerHTML == 1){toLogin();return false;}s.innerHTML = s.innerHTML * 1 - 1;} timer = window.setInterval('run();', 1000);</script>");
		// $.ajax({dataType:'jsonp',url:"${seeyonPath}/seeyon/main.do?method=logoutFromhome"});
		sb.append("        <script>"+toUrlJs+" var timer=null; function toLogin(){window.location.href=toUrl;clearInterval(timer);}function run(){var s = document.getElementById('time');if(s.innerHTML == 1){toLogin();return false;}s.innerHTML = s.innerHTML * 1 - 1;} timer = window.setInterval('run();', 1000);</script>");
		sb.append("</body></html>");


		return sb.toString();
	}

}
