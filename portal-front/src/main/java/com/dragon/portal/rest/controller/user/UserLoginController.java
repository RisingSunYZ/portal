package com.dragon.portal.rest.controller.user;

import com.dragon.portal.constant.FormConstant;
import com.dragon.portal.customLabel.ApiJsonObject;
import com.dragon.portal.customLabel.ApiJsonProperty;
import com.dragon.portal.model.user.UserLogin;
import com.dragon.portal.service.user.IUserLoginService;
import com.dragon.portal.web.controller.BaseController;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
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

    /**
     * 登录
     * @return
     */
    @PostMapping("/login")
    @ApiOperation("登录")
    public ReturnVo<String> login(@ApiJsonObject({
            @ApiJsonProperty(key="userName",description = "用户名"),
            @ApiJsonProperty(key="password",description = "密码")})@RequestBody UserLogin userLogin, HttpServletRequest request) {

        HttpSession session = request.getSession();
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "查询失败！");
        try {
            returnVo = userLoginService.updateCheckLogin(userLogin.getUserName(),userLogin.getPassword(),session);
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
            try {
//                urid = CryptUtils.getCryPasswd("1");
//                this..delKey(urid);
                session.setAttribute(FormConstant.USER_UID,null);
                session.setAttribute(FormConstant.SYS_USER,null);
            } catch (Exception e) {
                e.printStackTrace();
                logger.error("清除Redis中保存的用户信息异常！" , e);
            }
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
    public ReturnVo updatePwdBeforeLogin(@ApiJsonObject({
            @ApiJsonProperty(key="password",description = "密码")
    })@RequestBody(required = false) UserLogin userLogin,HttpServletRequest request) {
        HttpSession session = request.getSession();
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败！");
        try {
            if(StringUtils.isNotEmpty(userLogin.getPassword())){
                returnVo = userLoginService.updatePwdBeforeLogin(userLogin.getPassword(),session);
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
    public ReturnVo updatePwdAfterLogin(@ApiJsonObject({
            @ApiJsonProperty(key="oldPassword",description = "原始密码"),
            @ApiJsonProperty(key="password",description = "密码" )
    })@RequestBody(required = false) UserLogin userLogin,HttpServletRequest request) {
        HttpSession session = request.getSession();
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败！");
        try {
            if(StringUtils.isNotEmpty(userLogin.getPassword())&&StringUtils.isNotEmpty(userLogin.getOldPassword())){
                returnVo = userLoginService.updatePwdAfterLogin(userLogin.getOldPassword(),userLogin.getPassword(),session);
            }
        } catch (Exception e) {
            logger.error("UserLoginController-updatePwdAfterLogin:", e);
            e.printStackTrace();
            returnVo.setMsg("修改失败！" + e.getMessage());
        }
        return returnVo;
    }

}
