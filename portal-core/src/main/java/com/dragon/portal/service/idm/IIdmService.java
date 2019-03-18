package com.dragon.portal.service.idm;

import com.ecnice.privilege.vo.idm.IdmReturnEntity;

/**
 * @Description: IDM集成service
 * @Author: Bruce.liu
 * @Since:12:01 2018/5/10
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
public interface IIdmService {

    /**
     * 判断登录状态
     * @param ticketValue
     * @return
     */
    public IdmReturnEntity checkLoginStatus(String ticketValue) throws Exception;
}
