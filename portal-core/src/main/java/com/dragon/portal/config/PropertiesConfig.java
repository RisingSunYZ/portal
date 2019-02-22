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
public class PropertiesConfig {

    /**
     * 开发环境使用,默认账号
     */
    @Value("${dic.developer.no}")
    private String developerNo;

    public String getDeveloperNo() {
        return developerNo;
    }

    public void setDeveloperNo(String developerNo) {
        this.developerNo = developerNo;
    }
}
