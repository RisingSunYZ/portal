package com.dragon.portal.rest.controller;

import com.dragon.portal.config.PropertiesConfig;
import com.dragon.portal.vo.user.UserSessionInfo;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @Description:
 * @author: xietongjian
 * @Since: 2019/1/23 14:03
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 亚厦股份有限公司 2018 ~ 2020 版权所有
 */
@Controller
public class BaseController {

    private static Logger logger = Logger.getLogger(BaseController.class);

    @Autowired
    private PropertiesConfig propertiesConfig;


    /**
     * 获取当前登录信息
     * @param request
     * @param response
     * @return
     */
    public UserSessionInfo getLoginUser(HttpServletRequest request, HttpServletResponse response){
        UserSessionInfo userSessionInfo = new UserSessionInfo();
        userSessionInfo.setName("admin");
        userSessionInfo.setNo("00004907");
        return userSessionInfo;
    }

    //FIXME 用户登录接口暂未完成，完成后需用注释部分
    /**
     * @Titile:session中取用户登录信息
     * @param request
     * @return 返回null
     */
    public UserSessionInfo getUserSessionInfo(HttpServletRequest request, HttpServletResponse response) {

        UserSessionInfo userSessionInfo = new UserSessionInfo();
        userSessionInfo.setName("admin");
        userSessionInfo.setNo("00000001");
        return userSessionInfo;


//        UserSessionInfo userInfo = getPersonInfo(request, response);
//        if (null == userInfo){
//            //开发环境使用,默认账号
////            String developerNo = readProperty.getValue("developer.no");
//            String developerNo = propertiesConfig.getDeveloperNo();
//            if(StringUtils.isNotBlank(developerNo)){
//                try {
//                    this.doLogin(request, response, userInfo, developerNo, 1, 1);
//                    userInfo = getPersonInfo(request, response);
//                } catch (Exception e) {
//                    e.printStackTrace();
//                    logger.error( "获取当前登录信息失败！" );
//                }
//            }
//        }
//        return userInfo;
    }

    //FIXME 用户登录接口暂未完成，完成后需用注释部分
    /**
     * 从用户会话信息中获取登录用户的信息
     * @param request
     * @return
     */
    public UserSessionInfo getPersonInfo(HttpServletRequest request,HttpServletResponse response) {

        UserSessionInfo userSessionInfo = new UserSessionInfo();
        userSessionInfo.setName("admin");
        userSessionInfo.setNo("00000001");
        return userSessionInfo;

//        UserSessionInfo u = null;
//        try {
//
//            HttpSession session = request.getSession();
//            final Assertion assertion = (Assertion) session.getAttribute(AbstractCasFilter.CONST_CAS_ASSERTION);
//            if(null != assertion){
//                //登录成功，获取用户名和返回属性
//                AttributePrincipal principal = assertion.getPrincipal();
//                //工号test2/123-->test2
//                String userNo = principal.getName();
//                String ssid = session.getId();
//                UserSessionRedisInfo userSessionInfo = redisService.getUserSessionRedisInfos(ssid, userNo, response);
//
//                String uo = userSessionInfo.getValue(YsportalConstant.SESSION_PERSON_INFO);
//                String leaderDeptJson = userSessionInfo.getValue(YsportalConstant.SESSION_PERSON_LEADERDEPT_INFO);
//
//
//                if(!CommUtils.isEmpty(uo) && uo instanceof String) {
//                    u = (UserSessionInfo) JsonUtils.jsonToObj(uo, UserSessionInfo.class);
//                    try {
//                        if(!"null".equals(leaderDeptJson)&&StringUtils.isNotEmpty(leaderDeptJson) && !CommUtils.isEmpty(leaderDeptJson) && leaderDeptJson instanceof String){
//                            net.sf.json.JSONArray jsonArr = net.sf.json.JSONArray.fromObject(leaderDeptJson);
//                            List<LeaderDepartmentVo> leaderDeptList = jsonArr.toList(jsonArr, LeaderDepartmentVo.class);
//                            u.setLeaderDeptList(leaderDeptList);
//                        }
//                    } catch (Exception e) {
//                        logger.error("设置用户领导部门集合信息异常！"+e);
//                        e.printStackTrace();
//                    }
//                    return u;
//                }
//            }else{
//                String userNo = Cookies.get(request, YsportalConstant.COOKIE_USERNAME);
//                String ssid = session.getId();
//                UserSessionRedisInfo userSessionInfo = redisService.getUserSessionRedisInfos(ssid, userNo, response);
//
//                String uo = userSessionInfo.getValue(YsportalConstant.SESSION_PERSON_INFO);
//                String leaderDeptJson = userSessionInfo.getValue(YsportalConstant.SESSION_PERSON_LEADERDEPT_INFO);
//
//                if(!CommUtils.isEmpty(uo) && uo instanceof String) {
//                    u = (UserSessionInfo)JsonUtils.jsonToObj(uo, UserSessionInfo.class);
//                    try {
//                        if(!"null".equals(leaderDeptJson)&&StringUtils.isNotEmpty(leaderDeptJson) && !CommUtils.isEmpty(leaderDeptJson) && leaderDeptJson instanceof String){
//                            net.sf.json.JSONArray jsonArr = net.sf.json.JSONArray.fromObject(leaderDeptJson);
//                            List<LeaderDepartmentVo> leaderDeptList = jsonArr.toList(jsonArr, LeaderDepartmentVo.class);
//                            u.setLeaderDeptList(leaderDeptList);
//                        }
//                    } catch (Exception e) {
//                        logger.error("设置用户领导部门集合信息异常！"+e);
//                        e.printStackTrace();
//                    }
//                    //log.info("从Redis中获取登录用户: " + (u!=null?u.getName():""));
//                    return u;
//                }
//            }
//        } catch(Exception e) {
//            e.printStackTrace();
//            logger.error("从用户会话信息中获取登录用户的信息出错",e);
//        }
//        return u;
    }

    //FIXME 用户登录接口暂未完成，完成后需用注释部分
    /**
     * 用户自动登录
     * @param request
     * @param response
     * @param u
     * @param userNo
     * @param autoLogin
     * @param loginType
     * @throws Exception
     * @Description:
     * @author xietongjian 2017 上午9:31:59
     */
    public void doLogin(HttpServletRequest request, HttpServletResponse response, UserSessionInfo u, String userNo,Integer autoLogin,Integer loginType) throws Exception {
//        //用户登录成功
//        setPersonInfoCookies(u, request, response, autoLogin);
//        //用户手机,邮箱是否认证标记
//        //用户信息保存到缓存中
//        setPersonInfo(request, response, u);
    }

    //FIXME 用户登录接口暂未完成，完成后需用注释部分
    /**
     * 设置登录信息到Cookie中
     * @param u
     * @param request
     * @param response
     * @param autoLogin
     * @throws Exception
     * @Description:
     * @author xietongjian 2017 上午9:32:09
     */
    private void setPersonInfoCookies(UserSessionInfo u, HttpServletRequest request, HttpServletResponse response, Integer autoLogin) throws Exception {
//        if(null==u) return ;
//        String usid = Cookies.get(request, PortalConstant.COOKIE_USER_SESSION_ID);
//        Cookies.crossDomainPut(response, PortalConstant.COOKIE_USER_SESSION_ID, usid, PortalConstant.COOKIE_TITLE_MONTH);
    }

    //FIXME 用户登录接口暂未完成，完成后需用注释部分
    /**
     * 把用户登录信息保存到会话中
     * @return
     */
    public void setPersonInfo(HttpServletRequest request,HttpServletResponse response,UserSessionInfo u) {
//        String usid = com.ys.portal.utils.Cookies.get(request, YsportalConstant.COOKIE_USER_SESSION_ID);
//        if(!CommUtils.isNull(u)) {
//            String userStr = JsonUtils.toJson(u);
//            UserSessionRedisInfo userSessionInfo = redisService.getUserSessionRedisInfo(usid, response);
//            if(CommUtils.isEmpty(usid)) usid = userSessionInfo.getUsid();
//            userSessionInfo.putValue(YsportalConstant.SESSION_PERSON_INFO, userStr);
//            redisService.putUserSessionRedisInfo(usid, userSessionInfo);
//        } else {
//            UserSessionRedisInfo userSessionInfo = redisService.getUserSessionRedisInfo(usid, response);
//            if(CommUtils.isEmpty(usid)) usid = userSessionInfo.getUsid();
//            userSessionInfo.removeSessionInfo(YsportalConstant.SESSION_PERSON_INFO);
//            redisService.putUserSessionRedisInfo(usid, userSessionInfo);
//        }
    }
}
