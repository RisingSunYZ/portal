package com.dragon.portal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * @Description:
 * @author: xietongjian
 * @Since: 2019/1/30 14:55
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 亚厦股份有限公司 2018 ~ 2020 版权所有
 */
@Configuration
@ConfigurationProperties
public class PropertiesConfig {

    /**
     * 接口路径
     */
    @Value("${dic.base-list-code}")
    private String baseListCode;

    public String getBaseListCode() {
        return baseListCode;
    }

    public void setBaseListCode(String baseListCode) {
        this.baseListCode = baseListCode;
    }
}
