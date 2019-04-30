package com.dragon.portal.main;

import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @Description:
 * @Author: Bruce.liu
 * @Since:17:32 2019/1/9
 * 浙江亚厦 2018 ~ 2030 版权所有
 * @MapperScan("", "")可以指定要扫描的Mapper类的包的路径，允许指定多个;
 */
@SpringBootApplication(scanBasePackages = {"com.dragon", "com.ecnice", "org.apache.dubbo"})
@MapperScan("com.dragon.*.dao.*")
@EnableSwagger2             //启动swagger注解
public class PortalFrontApplication {

    public static void main(String[] args) {
        Logger logger = LoggerFactory.getLogger(PortalFrontApplication.class);
        SpringApplication.run(PortalFrontApplication.class, args);
        logger.info("门户前台程序正在运行。。。。。。。。。。。。。");
    }
}
