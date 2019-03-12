package com.dragon.portal.model.fnc;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;


/**
 * @Title:财务服务-意见类型
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:14:28
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class OpinionType extends BaseModel implements Serializable{
    
    
	/**
	 *
	 */
		
	private static final long serialVersionUID = 4929414635164910582L;

	/**
     * ID
     */
    private String id;
    
    /**
     * 类型名称
     */
    private String name;
    
    /**
     * 负者人
     */
    private String responsibleName;
    
    /**
     * 负者人工号
     */
    private String responsibleNo;
    
    /**
     * 备注
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
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    public String getResponsibleName() {
        return responsibleName;
    }
    
    public void setResponsibleName(String responsibleName) {
        this.responsibleName = responsibleName;
    }
    public String getResponsibleNo() {
        return responsibleNo;
    }
    
    public void setResponsibleNo(String responsibleNo) {
        this.responsibleNo = responsibleNo;
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
