package com.dragon.portal.rest.controller.user;

import com.dragon.portal.model.user.UserLogin;
import com.dragon.portal.service.user.IUserLoginService;
import com.dragon.portal.web.controller.BaseController;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @Description:
 * @author: xietongjian
 * @Since: 2019/2/21 13:34
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 亚厦股份有限公司 2018 ~ 2020 版权所有
 */
@RestController
@RequestMapping("/portal/user/userLogin")
@Api(value="用户登录", description = "用户登录", tags={"用户登录 /portal/user/userLogin"})
public class UserLoginController extends BaseController{

    private static Logger logger = LoggerFactory.getLogger(UserLoginController.class);

    @Resource
    private IUserLoginService userLoginService;
//    /**
//     * Test
//     * @param id
//     * @return
//     */
//    @GetMapping("/getById/{id}")
//    @ApiOperation("通过ID获取数据")
//    @ApiImplicitParam(name = "id", value = "ID", paramType = "path", required = true, dataType = "String")
//    public ReturnVo getById(@PathVariable String id) {
//        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "查询失败！");
//        try {
//
//            returnVo.setMsg("查询数据成功！");
//        } catch (Exception e) {
//            logger.error("UserLoginController-getById:", e);
//            e.printStackTrace();
//            returnVo.setMsg("通过ID：【"+id+"】查询数据异常！" + e.getMessage());
//        }
//        return returnVo;
//    }

    /**
     * 登录
     * @return
     */
    @PostMapping("/login")
    @ApiOperation("登录")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "username", value = "用户名", paramType = "form", required = true, dataType = "String"),
            @ApiImplicitParam(name = "password", value = "密码", paramType = "form", required = true, dataType = "String")
    })
    public ReturnVo login(@RequestParam String username ,@RequestParam String password,HttpServletRequest request) {

        HttpSession session = request.getSession();
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "查询失败！");
        try {
            String a = (String)session.getAttribute("uid");
            returnVo = userLoginService.updateCheckLogin(username,password,session);
        } catch (Exception e) {
            logger.error("UserLoginController-login:", e);
            e.printStackTrace();
            returnVo.setMsg("登录异常！" + e.getMessage());
        }
        return returnVo;
    }

    /**
     * 退出
     * @return
     */
    @GetMapping("/out")
    @ApiOperation("注销用户")
    public ReturnVo out(HttpServletRequest request) {
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "注销失败！");
        try {
            HttpSession session = request.getSession();
            session.setAttribute("uid",null);
            session.setAttribute("user",null);
            returnVo = new ReturnVo(ReturnCode.SUCCESS, "注销成功！");
        } catch (Exception e) {
            logger.error("UserLoginController-out:", e);
            e.printStackTrace();
            returnVo.setMsg("服务器异常！" + e.getMessage());
        }
        return returnVo;
    }

    /**
     * 发送手机验证码
     * @return
     */
    @GetMapping("/verificationCode/{userNo}")
    @ApiOperation("发送手机验证码")
    @ApiImplicitParam(name = "userNo", value = "工号", paramType = "path", required = true, dataType = "String")
    public ReturnVo verificationCode(@PathVariable String userNo, HttpServletRequest request) {
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "验证码发送失败！");
        try {
            returnVo = userLoginService.createVerificationCode(userNo,request.getSession());
        } catch (Exception e) {
            logger.error("UserLoginController-verificationCode:", e);
            e.printStackTrace();
            returnVo.setMsg("验证码发送失败！" + e.getMessage());
        }
        return returnVo;
    }

    /**
     * 校验手机验证码
     * @return
     */
    @GetMapping("/checkVerificationCode/{code}")
    @ApiOperation("校验手机验证码")
    @ApiImplicitParam(name = "code", value = "验证码", paramType = "path", required = true, dataType = "String")
    public ReturnVo checkVerificationCode(@PathVariable String code, HttpServletRequest request) {
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "验证码错误！");
        HttpSession session = request.getSession();
        try{
            returnVo = userLoginService.getVerificationCodeCheck(code,session);
        }catch (Exception e){
            logger.error("UserLoginController-checkVerificationCode:", e);
            e.printStackTrace();
            returnVo.setMsg("服务器异常：" + e.getMessage());
        }
        return returnVo;
    }

    /**
     * 忘记密码->修改密码
     * @return
     */
    @PostMapping("/updatePwdBeforeLogin")
    @ApiOperation("忘记密码->修改密码")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "password", value = "密码", paramType = "form", required = true, dataType = "String")
    })
    public ReturnVo updatePwdBeforeLogin(@RequestParam String password,HttpServletRequest request) {
        HttpSession session = request.getSession();
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败！");
        try {
            if(StringUtils.isNotEmpty(password)){
                returnVo = userLoginService.updatePwdBeforeLogin(password,session);
            }
        } catch (Exception e) {
            logger.error("UserLoginController-updatePwdBeforeLogin:", e);
            e.printStackTrace();
            returnVo.setMsg("修改失败！" + e.getMessage());
        }
        return returnVo;
    }

    /**
     * 登录后->修改密码
     * @return
     */
    @PostMapping("/updatePwdAfterLogin")
    @ApiOperation("登录后->修改密码")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "password", value = "密码", paramType = "form", required = true, dataType = "String")
    })
    public ReturnVo updatePwdAfterLogin(@RequestParam String password,HttpServletRequest request) {
        HttpSession session = request.getSession();
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败！");
        try {
            if(StringUtils.isNotEmpty(password)){
                returnVo = userLoginService.updatePwdAfterLogin(password,session);
            }
        } catch (Exception e) {
            logger.error("UserLoginController-updatePwdAfterLogin:", e);
            e.printStackTrace();
            returnVo.setMsg("修改失败！" + e.getMessage());
        }
        return returnVo;
    }



}
