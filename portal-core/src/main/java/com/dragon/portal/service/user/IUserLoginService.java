		
package com.dragon.portal.service.user;

import com.dragon.portal.model.user.UserLogin;
import com.dragon.tools.vo.ReturnVo;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * UserLoginService
 *
 * @author ruanzg
 * @Date 2019-02-25 13:47
 *  description : 用户Service接口
 */
public interface IUserLoginService{
    /**
     * 登录验证
     * @param username
     * @param password
     * @param session
     * @return
     * @throws Exception
     */
    public ReturnVo updateCheckLogin(String username ,String password, HttpSession session)throws Exception;

    /**
     * 获取手机验证码
     * @param userNo
     * @return
     */
    public ReturnVo createVerificationCode(String userNo, HttpSession session)throws Exception;


    /**
     * 验证码校验
     * @param code
     * @return
     * @throws Exception
     */
    public ReturnVo getVerificationCodeCheck(String code, HttpSession session) throws Exception;


    /**
     * 忘记密码-》修改密码
     * @param password
     * @return
     * @throws Exception
     */
    public ReturnVo updatePwdBeforeLogin(String password, HttpSession session) throws Exception;

    /**
     * 登录后-》修改密码
     * @Param [oldPassword,password,session]
     * @return
     * @throws Exception
     */
    public ReturnVo updatePwdAfterLogin(String oldPassword,String password, String userNo) throws Exception;


    /*
    *
     * @Author yangzhao
     * @Description //TODO 登录回调 用户信息存储到Session
     * @Date 17:05 2019/3/11
     * @Param [password, session]
     * @return com.dragon.tools.vo.ReturnVo
     **/
    public ReturnVo loginCallback(String userNo, HttpSession session, HttpServletResponse response) throws Exception;

    /**
     * 修改用户
     * @param userLogin
     * @throws Exception
     */
    public boolean updateUserLoginByNo(UserLogin userLogin)throws Exception;

}
