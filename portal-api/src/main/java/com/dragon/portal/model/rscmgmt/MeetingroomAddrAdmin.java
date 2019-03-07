package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议室-地点管理员
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-14 10:11:42
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingroomAddrAdmin extends BaseModel implements Serializable{
    
	private static final long serialVersionUID = 6425381614302727371L;

	/**
     * id
     */
    private String id;
    
    /**
     * 会议室地址ID
     */
    private String addrId;
    
    /**
     * 管理员工号
     */
    private String adminNo;
    
    /**
     * 管理员姓名
     */
    private String adminName;
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getAddrId() {
        return addrId;
    }
    
    public void setAddrId(String addrId) {
        this.addrId = addrId;
    }
    public String getAdminNo() {
        return adminNo;
    }
    
    public void setAdminNo(String adminNo) {
        this.adminNo = adminNo;
    }
    public String getAdminName() {
        return adminName;
    }
    
    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }
}
