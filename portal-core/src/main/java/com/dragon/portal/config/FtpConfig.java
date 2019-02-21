package com.dragon.portal.config;

import com.dragon.portal.properties.CommonProperties;
import com.dragon.tools.ftp.FtpTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Ftp配置
 */
@Configuration
public class FtpConfig {

    @Autowired
    private CommonProperties commonProperties;

    @Bean
    public FtpTools ftpTools(){
        return new FtpTools(
                this.commonProperties.getIp(),
                this.commonProperties.getUsername(),
                this.commonProperties.getPassword(),
                this.commonProperties.getPort());
    }
}
