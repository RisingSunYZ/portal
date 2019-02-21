package com.dragon.portal.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

/**
 * @author : freemarker 配置
 * @date : 2018/6/25 15:29
 * description : freemarker config
 */
@Configuration
public class FreeMarkerConfig {

    @Value("${bath.path}")
    private String bathPath;
    @Value("${boot.url}")
    private String bootPath;
    @Value("${ftp.host}")
    private String ftpHost;

    @Autowired
    private freemarker.template.Configuration configuration;
//    @Resource
//    private CheckPrivileges checkPrivileges;

    @PostConstruct
    public void setConfigure() throws Exception {
        String var = System.currentTimeMillis() + "";
        configuration.setSharedVariable("basePath", bathPath);
        configuration.setSharedVariable("bootPath", bootPath);
        configuration.setSharedVariable("model", 500);
        configuration.setSharedVariable("v", var);
//        configuration.setSharedVariable("checkPrivileges", checkPrivileges);
        configuration.setSharedVariable("systemSn", "flow");
        configuration.setSharedVariable("ftpHost", ftpHost);
    }
}
