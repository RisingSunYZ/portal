package com.dragon.portal.web.controller;

import com.dragon.portal.vo.user.UserSessionInfo;
import org.apache.log4j.Logger;
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

}
