package com.dragon.portal.manager.main;

import com.dragon.portal.servlet.AppDispatcherServletConfiguration;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @ClassName FlowManagerApplication
 * @Description 后台管理入口
 * @Author bruce.liu
 * @Date 2018/9/16/016 20:52
 * @Version 1.0
 **/
@Import({
        AppDispatcherServletConfiguration.class
})
@SpringBootApplication
@ComponentScan(basePackages = {"com.dragon", "com.ecnice"})
@MapperScan("com.dragon.*.dao.*")
@EnableTransactionManagement
@EnableAutoConfiguration
public class PortalManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(PortalManagerApplication.class, args);
        System.out.print("后台程序正在运行。。。。。。。。。。。。。");
    }
}
