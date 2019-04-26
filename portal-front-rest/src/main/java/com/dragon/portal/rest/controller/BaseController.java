package com.dragon.portal.rest.controller;

import com.dragon.portal.component.IUserLoginComponent;
import com.dragon.portal.config.PropertiesConfig;
import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.utils.CommUtils;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.vo.user.UserSessionRedisInfo;
import com.dragon.tools.common.JsonUtils;
import com.dragon.tools.utils.CookiesUtil;
import com.ys.mis.utils.Cookies;
import com.ys.ucenter.model.vo.LeaderDepartmentVo;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

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
    @Autowired
    private RedisService redisService;
    @Autowired
    private IUserLoginComponent userLoginComponent;
    @Autowired
    private CommonProperties commonProperties;

    //部分继承Controller需要使用，现添加至此
    public final int ERROR = 0;
    public final int SUCCESS = 1;
    public final int WEIGTH_ERROR = 2;

    /**
     * 获取当前登录信息
     * @param request
     * @param response
     * @return
     */
    public UserSessionInfo getLoginUser(HttpServletRequest request, HttpServletResponse response){
        return getUserSessionInfo(request, response);
    }

    //FIXME 用户登录接口暂未完成，完成后需用注释部分
    /**
     * @Titile:session中取用户登录信息
     * @param request
     * @return 返回null
     */
    public UserSessionInfo getUserSessionInfo(HttpServletRequest request, HttpServletResponse response) {
        UserSessionInfo userInfo = getPersonInfo(request, response);
        return userInfo;
    }

    //FIXME 用户登录接口暂未完成，完成后需用注释部分
    /**
     * 从用户会话信息中获取登录用户的信息
     * @param request
     * @return
     */
    public UserSessionInfo getPersonInfo(HttpServletRequest request, HttpServletResponse response) {

        UserSessionInfo u = null;
        try {
            if(Boolean.TRUE.toString().equals(commonProperties.getLoginSwitch())) {
                String userNo = CookiesUtil.get(request, PortalConstant.COOKIE_USERNAME);
                String ssid = request.getSession().getId();
                UserSessionRedisInfo userSessionInfo = userLoginComponent.getUserSessionRedisInfos(ssid, userNo, response);

                String uo = userSessionInfo.getValue(PortalConstant.SESSION_PERSON_INFO);
                String leaderDeptJson = userSessionInfo.getValue(PortalConstant.SESSION_PERSON_LEADERDEPT_INFO);

                if (!StringUtils.isBlank(uo)) {
                    u = (UserSessionInfo) JsonUtils.jsonToObj(uo, UserSessionInfo.class);
                    try {
                        if (!"null".equals(leaderDeptJson) && StringUtils.isNotEmpty(leaderDeptJson) && !CommUtils.isEmpty(leaderDeptJson) && leaderDeptJson instanceof String) {
                            net.sf.json.JSONArray jsonArr = net.sf.json.JSONArray.fromObject(leaderDeptJson);
                            List<LeaderDepartmentVo> leaderDeptList = jsonArr.toList(jsonArr, LeaderDepartmentVo.class);
                            u.setLeaderDeptList(leaderDeptList);
                        }
                    } catch (Exception e) {
                        logger.error("设置用户领导部门集合信息异常！" + e);
                        e.printStackTrace();
                    }
                    //log.info("从Redis中获取登录用户: " + (u!=null?u.getName():""));
                    return u;
                }
            }else{
                u = (UserSessionInfo) request.getSession().getAttribute(PortalConstant.SESSION_SYS_USER);
            }
        } catch(Exception e) {
            e.printStackTrace();
            logger.error("从用户会话信息中获取登录用户的信息出错",e);
        }
        return u;
    }

    //FIXME 用户登录接口暂未完成，完成后需用注释部分
    /**
     * 用户自动登录
     * @param request
     * @param response
     * @param u
     * @param autoLogin
     * @param loginType
     * @throws Exception
     * @Description:
     * @author xietongjian 2017 上午9:31:59
     */
    public void doLogin(HttpServletRequest request, HttpServletResponse response, UserSessionInfo u, Integer autoLogin,Integer loginType) throws Exception {
        //用户登录成功
        setPersonInfoCookies(u, request, response, autoLogin);
        //用户手机,邮箱是否认证标记
        //用户信息保存到缓存中
        setPersonInfo(request, response, u);
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
        if(null==u) return ;
        String usid = Cookies.get(request, PortalConstant.COOKIE_USER_SESSION_ID);
        Cookies.crossDomainPut(response, PortalConstant.COOKIE_USER_SESSION_ID, usid, PortalConstant.COOKIE_TITLE_MONTH);
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
