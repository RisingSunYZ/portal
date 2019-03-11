package com.dragon.portal.properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * @Description: 获取配置文件变量的公共方法
 * @author: xietongjian
 * @Since: 2018/12/17 10:37
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 亚厦股份有限公司 2018 ~ 2020 版权所有
 */
@Configuration
public class CommonProperties {

    // ############################# FTP 配置信息 start #############################
    @Value("${ftp.ip}")
    private String ip;
    @Value("${ftp.username}")
    private String username;
    @Value("${ftp.password}")
    private String password;
    @Value("${ftp.port}")
    private int port;
    @Value("${ftp.host}")
    private String ftpHost;
    // ############################# FTP 配置信息 end #############################

    /**
     * 获取当前环境变量
     */
    @Value("${spring.profiles.active}")
    private String profilesActive;


    // ############################# 数据字典 配置信息 start #############################
    /**
     * (是否走流程底表的数据字典) 请求数据字典code
     */
    @Value("${dict.form.flow-base-list.code}")
    private String flowBaseListCode;

    // ############################# 数据字典 配置信息 end #############################


    // ############################# 短信 配置信息 start #############################
    /**
     * (是否走流程底表的数据字典) 请求数据字典code
     */
    @Value("${sms.mobile.code}")
    private String smsMobileCode;

    // ############################# 短信 配置信息 end #############################

    // ############################# Exchange start #############################
    /**
     * Exchange 用户名
     */
    @Value("${exchange.admin.name}")
    private String exchangeAdminName;
    /**
     * Exchange 密码
     */
    @Value("${exchange.admin.password}")
    private String exchangeAdminPwd;
    /**
     * Exchange
     */
    @Value("${exchange.domain}")
    private String exchangeDomain;
    /**
     * Exchange uri
     */
    @Value("${exchange.uri}")
    private String exchangeUri;
    // ############################# Exchange end #############################
    // ############################# itsm Path start #############################
    @Value("${itsm.path}")
    private String itsmPath;

    /**
     * 开发环境使用,默认账号
     */
    @Value("${dic.developer.no}")
    private String developerNo;


    public String getIp() {
        return ip;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getPort() {
        return port;
    }

    public String getFtpHost() {
        return ftpHost;
    }

    public String getProfilesActive() {
        return profilesActive;
    }

    public String getFlowBaseListCode() {
        return flowBaseListCode;
    }

    public String getSmsMobileCode() {
        return smsMobileCode;
    }

    public String getExchangeAdminName() {
        return exchangeAdminName;
    }

    public String getExchangeAdminPwd() {
        return exchangeAdminPwd;
    }

    public String getExchangeDomain() {
        return exchangeDomain;
    }

    public String getExchangeUri() {
        return exchangeUri;
    }

    public String getItsmPath() {
        return itsmPath;
    }

    public String getDeveloperNo() {
        return developerNo;
    }
}
