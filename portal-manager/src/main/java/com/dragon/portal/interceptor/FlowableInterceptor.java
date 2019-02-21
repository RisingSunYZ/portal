package com.dragon.portal.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @Description: 流程拦截器
 * @Author: Bruce.liu
 * @Since:14:11 2018/11/1
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
public class FlowableInterceptor implements HandlerInterceptor {
    Logger logger = LoggerFactory.getLogger(FlowableInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        //获取session
//        FlowableAppUser currentFlowableAppUser = SecurityUtils.getCurrentFlowableAppUser();
//
//        //判断用户ID是否存在，不存在就跳转到登录界面
//        if (currentFlowableAppUser != null) {
//            return true;
//        } else {
//            response.sendRedirect(request.getContextPath() + "/login");
//            return false;
//        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
    }
}
