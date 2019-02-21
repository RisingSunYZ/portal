package com.dragon.portal.main;

import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @Description:
 * @Author: Bruce.liu
 * @Since:17:32 2019/1/9
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
@SpringBootApplication(scanBasePackages ="com.dragon", exclude = DataSourceAutoConfiguration.class)
@ComponentScan(basePackages = { "com.dragon" })
@MapperScan("com.dragon.*.dao.*")
@EnableTransactionManagement
@EnableAutoConfiguration
public class PortalFrontApplication {

    public static void main(String[] args) {
        Logger logger = LoggerFactory.getLogger(PortalFrontApplication.class);
        SpringApplication.run(PortalFrontApplication.class, args);
        logger.info("门户前台程序正在运行。。。。。。。。。。。。。");
    }
}
