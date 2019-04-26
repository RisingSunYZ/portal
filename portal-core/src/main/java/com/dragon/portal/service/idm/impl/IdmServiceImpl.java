package com.dragon.portal.service.idm.impl;

import com.dragon.portal.client.AuthUtils;
import com.dragon.portal.config.PropertiesConfig;
import com.dragon.portal.service.idm.IIdmService;
import com.dragon.tools.common.JsonUtils;
import com.ecnice.privilege.vo.idm.IdmReturnEntity;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * @Description:
 * @Author: Bruce.liu
 * @Since:12:06 2018/5/10
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
@Service
public class IdmServiceImpl implements IIdmService {

    private static final Logger logger = Logger.getLogger(IdmServiceImpl.class);


    @Autowired
    private PropertiesConfig propertiesConfig;
    @Autowired
    private AuthUtils util;

    @Override
    public IdmReturnEntity checkLoginStatus(String ticketValue)throws Exception {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("ticketValue", ticketValue);
        params.put("ticketName", "SIAMTGT");
        String url = propertiesConfig.getIdmUrl() + "/siam/rest/auth/validate";
        String retStr = util.getResponseFromServer(url, params);
        logger.info("开始IDM验证...");
        IdmReturnEntity idmReturnEntity = (IdmReturnEntity) JsonUtils.jsonToObj(retStr,IdmReturnEntity.class);
        logger.info("IDM验证结果：" + JsonUtils.toJson(idmReturnEntity));
        return idmReturnEntity;
    }


}
