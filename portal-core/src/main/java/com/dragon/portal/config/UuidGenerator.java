package com.dragon.portal.config;

import java.util.UUID;

/**
 * @Description:
 * @Author: Bruce.liu
 * @Since:13:26 2018/9/8
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
public class UuidGenerator {

    public String getNextId() {
        String uuid = UUID.randomUUID().toString();
        uuid = uuid.replaceAll("-", "");
        return uuid;
    }

}
