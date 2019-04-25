package com.dragon.portal.api.impl;

import com.dragon.portal.api.IPortalApi;
import com.dragon.tools.vo.ReturnVo;
import org.apache.dubbo.config.annotation.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * @Description:
 * @Author: Bruce.liu
 * @Since:18:16 2018/9/6
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
@Component
@Service(version = "1.0")
public class PortalApiImpl implements IPortalApi {

    private static final Logger LOGGER = LoggerFactory.getLogger(PortalApiImpl.class);

    @Override
    public ReturnVo testPortalApi(){
        return null;
    }

}
