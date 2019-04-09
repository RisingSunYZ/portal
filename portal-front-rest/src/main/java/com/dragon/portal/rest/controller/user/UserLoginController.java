package com.dragon.portal.rest.controller.user;

import com.alibaba.fastjson.JSONObject;
import com.dragon.portal.client.AuthUtils;
import com.dragon.portal.config.PropertiesConfig;
import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.customLabel.ApiJsonObject;
import com.dragon.portal.customLabel.ApiJsonProperty;
import com.dragon.portal.model.idm.client.WsAttribute;
import com.dragon.portal.model.user.UserLogin;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.service.user.IUserLoginService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.utils.CookiesUtil;
import com.dragon.tools.vo.ReturnVo;
import com.mhome.se.api.ISendSmsApi;
import com.mhome.se.eum.SmsModeTypeEnum;
import com.mhome.se.model.sms.SmsInfo;
import com.mhome.se.vo.SeReturnVo;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.model.user.Personnel;
import com.ys.ucenter.model.user.PersonnelExt;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * @Description:
 * @author: xietongjian
 * @Since: 2019/2/21 13:34
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 亚厦股份有限公司 2018 ~ 2020 版权所有
 */
@RestController
@RequestMapping("/rest/portal/user/userLogin")
@Api(value="用户登录", description = "用户登录", tags={"用户登录 /rest/portal/user/userLogin"})
public class UserLoginController extends BaseController{

    private static Logger logger = LoggerFactory.getLogger(UserLoginController.class);

    @Autowired
    private IUserLoginService userLoginService;
    @Resource
    private AuthUtils authUtils;
    @Autowired
    private CommonProperties commonProperties;
    @Autowired
    private IPersonnelApi personnelApi;

    @Autowired
    private RedisService redisService;

    @Autowired
    private ISendSmsApi sendSmsApi;


    /**
     * 登录
     * @return
     */
    @PostMapping("/login")
    @ApiOperation("登录")
    public ReturnVo<String> login(@ApiJsonObject({
            @ApiJsonProperty(key="userName",description = "用户名"),
            @ApiJsonProperty(key="password",description = "密码")})@RequestBody UserLogin userLogin,
                                  HttpServletRequest request,
                                  HttpServletResponse response) {

        HttpSession session = request.getSession();
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "查询失败！");
        try {
            returnVo = userLoginService.updateCheckLogin(userLogin.getUserName(),userLogin.getPassword(),session, response);
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
    public ReturnVo out(HttpServletRequest request, HttpServletResponse response) {
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "注销失败！");
        try {
            HttpSession session = request.getSession();
            session.removeAttribute(PortalConstant.SESSION_SYS_USER);
            session.removeAttribute(PortalConstant.SESSION_USER_UID);
            CookiesUtil.removeAll(request, response);

            returnVo = new ReturnVo(ReturnCode.SUCCESS, "注销成功！");
        } catch (Exception e) {
            logger.error("UserLoginController-out:", e);
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
    public ReturnVo verificationCode(@PathVariable String userNo, HttpServletRequest request,HttpServletResponse response) {
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "验证码发送失败！");
        try {
            if(StringUtils.isEmpty(userNo)){
                UserSessionInfo loginUser = this.getPersonInfo(request, response);
                if(loginUser!=null)userNo = loginUser.getNo();
            }
            if (StringUtils.isNotEmpty(userNo)) {
                returnVo = userLoginService.createVerificationCode(userNo,request.getSession());
            }
        } catch (Exception e) {
            logger.error("UserLoginController-verificationCode:", e);
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
            @ApiJsonProperty(key="oldPassword",description = "密码" ),
            @ApiJsonProperty(key="password",description = "密码" )
    })@RequestBody(required = false) UserLogin userLogin, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败！");
        try {
            UserSessionInfo loginUser = this.getPersonInfo(request, response);
            if(loginUser!=null&&StringUtils.isNotEmpty(loginUser.getNo())) {
                if (Boolean.TRUE.toString().equals(commonProperties.getLoginSwitch())) {
                    Map<String, Object> params = new HashMap<>();
                    params.put("userName", loginUser.getNo());
                    params.put("oldPwd", userLogin.getOldPassword());
                    params.put("newPwd", userLogin.getPassword());
                    String modifyStr = authUtils.getApiResponseFromServer("/rest/user/modify_password", params);
                    JSONObject jsonObject = JSONObject.parseObject(modifyStr);
                    if (jsonObject.getInteger("resultCode") == 1) {
                        returnVo.setCode(ReturnCode.SUCCESS);
                        returnVo.setMsg("密码修改成功");
                    } else if (jsonObject.getInteger("resultCode") == 603) {
                        returnVo.setMsg("原始密码错误！");
                    } else {
                        returnVo.setMsg(jsonObject.getString("message"));
                    }
                } else {
                    if (StringUtils.isNotEmpty(userLogin.getPassword()) && StringUtils.isNotEmpty(userLogin.getOldPassword())) {
                        returnVo = userLoginService.updatePwdAfterLogin(userLogin.getOldPassword(), userLogin.getPassword(),loginUser.getNo());
                    }
                }
            }
        } catch (Exception e) {
            logger.error("UserLoginController-updatePwdAfterLogin:", e);
            returnVo.setMsg("修改失败！" + e.getMessage());
        }
        return returnVo;
    }
    /**
     * 用户信息编辑页面
     * @param request
     * @param response
     * @Description:
     * @author xietongjian 2017 下午11:24:46
     */
    @GetMapping("/getEditUserInfo")
    @ApiOperation("用户信息编辑页面")
    public ReturnVo getEditUserInfo(HttpServletRequest request, HttpServletResponse response){
        ReturnVo<PersonnelApiVo> returnVo = new ReturnVo<>(ReturnCode.FAIL, "查询失败！");
        try {
            UserSessionInfo loginUser = this.getPersonInfo(request, response);
            if(loginUser!=null&&StringUtils.isNotEmpty(loginUser.getNo())) {
                returnVo = new ReturnVo(ReturnCode.FAIL, "查询成功！");
                com.ys.tools.vo.ReturnVo<PersonnelApiVo> personnelApiVoByNo = personnelApi.getPersonnelApiVoByNo(loginUser.getNo());
                returnVo.setData(personnelApiVoByNo.getData());
            }else{
                returnVo.setMsg("用户已注销，请重新登录");
            }
        } catch (Exception e) {
            logger.error("UserLoginController-getEditUserInfo-error:", e);
        }
        return returnVo;
    }

    /**
     * 用户信息保存
     * @param request
     * @param response
     */
    @PostMapping("/saveUserInfo")
    @ApiOperation("用户信息保存")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "mobilePhone", value = "手机号", paramType = "form", required = true, dataType = "String"),
            @ApiImplicitParam(name = "shortPhone", value = "短号", paramType = "form", required = true, dataType = "String"),
            @ApiImplicitParam(name = "companyMobile", value = "座机号码", paramType = "form", required = true, dataType = "String"),
            @ApiImplicitParam(name = "shortWorkPhone", value = "座机短号", paramType = "form", required = true, dataType = "String"),
            @ApiImplicitParam(name = "qqNo", value = "QQ", paramType = "form", required = true, dataType = "String"),
    })
    public ReturnVo saveUserInfo(HttpServletRequest request, HttpServletResponse response,
                                 @ApiIgnore Personnel personnel, @ApiIgnore PersonnelExt personnelExt){
        ReturnVo<String> returnVo = new ReturnVo<>(ReturnCode.FAIL, "资料保存失败！");
        try {
            UserSessionInfo loginUser = this.getPersonInfo(request, response);
            if(loginUser!=null&&StringUtils.isNotEmpty(loginUser.getNo())) {
                personnel.setNo(loginUser.getNo());

                com.ys.tools.vo.ReturnVo<PersonnelExt> personnelExtByNo = personnelApi.getPersonnelExtByNo(loginUser.getNo());
                personnelExt.setId(personnelExtByNo.getData().getId());
                personnelApi.updatePersonnelExt(personnelExt);

                com.ys.tools.vo.ReturnVo<PersonnelApiVo> personnelApiVoByNos = personnelApi.getPersonnelApiVoByNos(Arrays.asList(loginUser.getNo()));
                personnel.setId(personnelApiVoByNos.getDatas().get(0).getId());
                personnelApi.updatePersonnel(personnel);

                returnVo.setCode(ReturnCode.SUCCESS);
                returnVo.setMsg("资料保存成功！");

            }else{
                returnVo.setMsg("用户已注销，请重新登录");
            }
        } catch (Exception e) {
            logger.error("UserLoginController-saveUserInfo-error:", e);
        }
        return returnVo;
    }

    /**
     * 保存用户手机号
     * @param request
     * @param response
     * @Description: 保存用户手机号
     */
    @PostMapping("/saveUserMobile")
    @ApiOperation("保存用户手机号")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "mobile", value = "手机号", paramType = "form", required = true, dataType = "String"),
            @ApiImplicitParam(name = "smCode", value = "校验码", paramType = "form", required = true, dataType = "String"),
    })
    public ReturnVo saveUserMobile(HttpServletRequest request, HttpServletResponse response,
                                 String smCode,String mobile){
        ReturnVo<String> returnVo = new ReturnVo<>(ReturnCode.FAIL, "手机号修改失败！");
        try{
            UserSessionInfo loginUser = this.getPersonInfo(request, response);
            if(loginUser==null||StringUtils.isEmpty(loginUser.getNo())){
                returnVo.setMsg("用户已过期，请重新登录！");
                return returnVo;
            }

            String verificationCode = (String) redisService.get(PortalConstant.SYSTEM_SN + loginUser.getNo() + PortalConstant.SESSION_VERIFICATION_CODE);

            if (StringUtils.isEmpty(verificationCode)) {
                returnVo.setMsg("验证码已过期！");
                return returnVo;
            }
            if (!(StringUtils.isNotEmpty(smCode) && smCode.length() == 6 && verificationCode.contains(smCode))) {
                returnVo.setMsg("验证码错误！");
                return returnVo;
            }
            //IDM登录
            if (Boolean.TRUE.toString().equals(commonProperties.getLoginSwitch())) {
                Map<String, Object> params = new HashMap<>();
                WsAttribute username = new WsAttribute();
                username.setName("username");
                username.setValue(loginUser.getNo());
                WsAttribute secureMobile = new WsAttribute();
                secureMobile.setName("securemobile");
                secureMobile.setValue(mobile);

                WsAttribute[] attributes = {username, secureMobile};
                params.put("attributes", attributes);

                String modifyStr = authUtils.getApiResponseFromServer("/rest/user/modify_user", params);
                JSONObject jsonObject = JSONObject.parseObject(modifyStr);
                if (jsonObject.getInteger("resultCode") == 400) {
                    returnVo.setCode(ReturnCode.SUCCESS);
                    returnVo.setMsg("手机号修改成功");
                } else {
                    returnVo.setMsg(jsonObject.getString("message"));
                }
            }else{
                UserLogin userLogin = new UserLogin();
                userLogin.setUserNo(loginUser.getNo());
                userLogin.setMobile(mobile);
                boolean flag = userLoginService.updateUserLoginByNo(userLogin);
                if(flag){
                    returnVo.setCode(ReturnCode.SUCCESS);
                    returnVo.setMsg("手机号修改成功");
                }
            }
        }catch(Exception e){
            logger.debug("手机号修改异常",e);
        }
        return returnVo;
    }
    /**
     * 发送手机验证码
     * @return
     */
    @GetMapping("/getVerificationCode")
    @ApiOperation("发送手机验证码")
    public ReturnVo getVerificationCode( HttpServletRequest request,HttpServletResponse response) {
        ReturnVo<UserLogin> returnVo = new ReturnVo(ReturnCode.FAIL, "验证码发送失败,请稍后重试！");
        try {
            UserSessionInfo loginUser = this.getPersonInfo(request, response);
            com.ys.tools.vo.ReturnVo<PersonnelApiVo> personnelApiVoByNo = personnelApi.getPersonnelApiVoByNo(loginUser.getNo());
            String mobile = personnelApiVoByNo.getData().getMobile();

            String code = String.valueOf((int) ((Math.random() * 9 + 1) * 100000));
            request.getSession().setAttribute(PortalConstant.SESSION_VERIFICATION_CODE, code);

            //将生成的验证码 存入redis 15分钟过期
            redisService.put(loginUser.getNo() + PortalConstant.SESSION_VERIFICATION_CODE, "{\"code\":\"" + code + "\"}", 15, TimeUnit.MINUTES);

            //发短信
            SmsInfo smsInfo = new SmsInfo(commonProperties.getSmsMobileCode());
            smsInfo.setType(SmsModeTypeEnum.PROMPT.getType());
            smsInfo.setTelNum(mobile);
            smsInfo.setContent("{\"code\":\"" + code + "\"}");
            SeReturnVo<SmsInfo> seReturnVo = sendSmsApi.sendSmsInfo(smsInfo);
            if (seReturnVo.getStatus() == com.ys.tools.common.ReturnCode.SUCCESS) {
                returnVo.setMsg("验证码发送成功");
                returnVo.setCode(ReturnCode.SUCCESS);
            }
        }catch (Exception e){
            logger.error("UserLoginController-getVerificationCode-error:",e);
        }
        return returnVo;
    }

}
