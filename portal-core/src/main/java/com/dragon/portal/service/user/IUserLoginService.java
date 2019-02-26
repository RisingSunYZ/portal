		
package com.dragon.portal.service.user;

import com.dragon.tools.vo.ReturnVo;

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
     * 修改密码
     * @param password
     * @return
     * @throws Exception
     */
    public ReturnVo updatePwd(String password, HttpSession session) throws Exception;
}
