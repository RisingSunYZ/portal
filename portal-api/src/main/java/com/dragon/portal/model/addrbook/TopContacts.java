package com.dragon.portal.model.addrbook;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:常用联系人管理
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-22 11:34:04
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class TopContacts extends BaseModel implements Serializable{
    
	private static final long serialVersionUID = -7014978744053227793L;

	/**
     * ID
     */
    private String id;
    
    /**
     * 个人工号
     */
    private String ownerNo;
    
    /**
     * 联系人工号
     */
    private String contactNo;
    
    /**
     * 排序编号
     */
    private Integer sortNo;
    
    /**
     * 备注
     */
    private String remark;
    
    
    
    
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getOwnerNo() {
        return ownerNo;
    }
    
    public void setOwnerNo(String ownerNo) {
        this.ownerNo = ownerNo;
    }
    public String getContactNo() {
        return contactNo;
    }
    
    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }
    public Integer getSortNo() {
        return sortNo;
    }
    
    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }
    public String getRemark() {
        return remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }
}
