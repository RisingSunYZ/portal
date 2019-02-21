package com.dragon.portal.main;

import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @Description: 流程服务启动类
 * @Author: Bruce.liu
 * @Since:16:24 2018/10/31
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
@SpringBootApplication
@ComponentScan(basePackages = {"com.dragon", "com.ecnice"})
@MapperScan("com.dragon.*.dao.*")
@EnableTransactionManagement
public class PortalServerApplication {

    public static void main(String[] args) {
        Logger logger = LoggerFactory.getLogger(PortalServerApplication.class);
        SpringApplication.run(PortalServerApplication.class, args);
//        SpringApplication app = new SpringApplication(FlowServerApplication.class);
//        app.setWebApplicationType(WebApplicationType.NONE);
//        app.run(args);
        logger.info("流程接口服务程序启动......");
    }

}
