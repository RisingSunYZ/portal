package com.dragon.portal.model.hr;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:意见分类
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-08 10:15:25
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class OpinionType extends BaseModel implements Serializable{
    
    /**
	 * 
	 */
	private static final long serialVersionUID = -7663454880855754764L;

	/**
     * 
     */
    private String id;
    
    /**
     * 
     */
    private String typeName;
    
    /**
     * 
     */
    private String remark;
    
    /**
     * 排序
     */
    private Integer sortNo;
    
    
    
    
    
    public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTypeName() {
        return typeName;
    }
    
    public void setTypeName(String typeName) {
        this.typeName = typeName;
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
}
