package com.dragon.portal.service.idm;

import com.ys.yahu.vo.idm.IdmWraper;
import com.ys.yahu.vo.idm.LoginRvo;

public interface IImdLoginService {
    /**
     * IDM登录验证
     *
     * @param userName
     * @param password
     * @return
     * @throws Exception
     * @Description:
     * @author wangzequan 2016 下午1:07:08
     */
    public LoginRvo loginIDM(String userName, String password) throws Exception;

    /**
     * 得到授权模块
     *
     * @param username
     * @return
     * @throws Exception
     * @Description:
     * @author wangzequan 2016 下午6:45:50
     */
    public IdmWraper getGrantedServices(String username) throws Exception;

    /**
     * 获取权限
     *
     * @return
     * @throws Exception
     */
    public String getResponseFromServer(String id) throws Exception;
}
