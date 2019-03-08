package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议室管理地点管理
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 10:17:17
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingroomAddr extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 1201097375840355167L;

	/**
     * id
     */
    private String id;
    
    /**
     * 详细地址
     */
    private String address;
    
    /**
     * 备注
     */
    private String remark;
    
    /**
     * 排序号
     */
    private Integer sortNo;
    /**
     * 显示管理人
     */
    private String adminName;
    
    
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    public String getRemark() {
        return remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }
    public Integer getSortNo() {
        return sortNo;
    }
    
    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }

	public String getAdminName() {
		return adminName;
	}

	public void setAdminName(String adminName) {
		this.adminName = adminName;
	}
    
}
