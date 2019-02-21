package com.dragon.portal.web.controller;

import com.ecnice.privilege.constant.PrivilegeConstant;
import com.ecnice.privilege.model.privilege.User;
import com.ecnice.privilege.vo.privilege.UserAcls;

import javax.servlet.http.HttpServletRequest;

/**
 * @author : admin
 * @date : 2018-10-09 15:16:32
 * description : 基本的Controller
 */
public class BaseController {

    public static final String USER_VIEW = "USER";
    public static final String GROUP_VIEW = "GROUP";
    public static final String PRIVILEGE_VIEW = "PRIVILEGE";

    /**
     * 获取登录用户
     * @param request
     * @return
     */
    public User getLoginUser(HttpServletRequest request) {
        User user = new User();
        user.setUsername("admin");
        return user;
    }

}
