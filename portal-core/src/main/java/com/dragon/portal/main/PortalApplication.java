package com.dragon.portal.main;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @Description: 启动类
 * @Author: Bruce.liu
 * @Since:15:59 2018/9/6
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
@SpringBootApplication
@ComponentScan(basePackages = {"com.dragon", "com.ecnice"})
@MapperScan("com.dragon.*.dao.*")
@EnableTransactionManagement
public class PortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortalApplication.class, args);
    }
}
