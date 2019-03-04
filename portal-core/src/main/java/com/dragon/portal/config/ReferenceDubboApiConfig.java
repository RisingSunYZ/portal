package com.dragon.portal.config;

import com.alibaba.dubbo.config.annotation.Reference;
import com.dragon.flow.api.ICusFlowApi;
import com.dragon.flow.api.IFlowApi;
import com.ecnice.privilege.api.privilege.IPrivilegeApi;
import com.ys.mis.api.IMisApi;
import com.ys.mqpms.api.IMqPmsApi;
import com.ys.pms.api.IPmsApi;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @Description: 对接的dubbo接口
 * @Author: Bruce.liu
 * @Since:13:06 2018/10/15
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
@Configuration
public class ReferenceDubboApiConfig {

    @Reference(version = "1.0",check = false)
    private IFlowApi flowApi;

    @Reference(version = "1.0",check = false)
    private ICusFlowApi cusFlowApi;

    @Reference(version = "1.0",check = false)
    private IMisApi misApi;

    @Reference(version = "1.0",check = false)
    private IMqPmsApi iMqPmsApi;

    @Reference(version = "1.0",check = false)
    private IPmsApi iPmsApi;

    @Reference(version = "1.0",check = false)
    private IPersonnelApi personnelApi;

    @Reference(version = "1.0",check = false)
    private IOrgApi orgApi;

    @Reference(version = "1.0",check = false)
    private IPrivilegeApi privilegeApi;


    @Bean
    public IMisApi misApi() {
        return misApi;
    }

    @Bean
    public IMqPmsApi iMqPmsApi() {
        return iMqPmsApi;
    }

    @Bean
    public IPmsApi iPmsApi() {
        return iPmsApi;
    }

    @Bean
    public IPersonnelApi personnelApi() {
        return personnelApi;
    }

    @Bean
    public IOrgApi orgApi() {
        return orgApi;
    }

    @Bean
    public IPrivilegeApi privilegeApi(){return privilegeApi;}

    @Bean
    public IFlowApi flowApi(){
        return flowApi;
    }

    @Bean
    public ICusFlowApi cusFlowApi(){
        return cusFlowApi;
    }
}
