package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议室-开放范围
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:54:56
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingroomOpenrange extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 3541799669965352477L;

	/**
     * id
     */
    private String id;
    
    /**
     * 会议室ID
     */
    private String mettingroomId;
    
    /**
     * 部门ID
     */
    private String deptId;
    
    /**
     * 部门编码
     */
    private String deptNo;
    
    /**
     * 组织类型（1：公司；2：部门）
     */
    private Integer refType;
    
    private String deptName;
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getMettingroomId() {
        return mettingroomId;
    }
    
    public void setMettingroomId(String mettingroomId) {
        this.mettingroomId = mettingroomId;
    }
    public String getDeptId() {
        return deptId;
    }
    
    public void setDeptId(String deptId) {
        this.deptId = deptId;
    }
    public String getDeptNo() {
        return deptNo;
    }
    
    public void setDeptNo(String deptNo) {
        this.deptNo = deptNo;
    }

	public Integer getRefType() {
		return refType;
	}

	public void setRefType(Integer refType) {
		this.refType = refType;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	
    
}
