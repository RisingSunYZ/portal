package com.dragon.portal.model.fnc;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:财务服务-资料维护
 * @Description:
 * @Author:XTJ
 * @Since:@Since:重构于2019-03-11 10:45:28
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MaterialFile extends BaseModel implements Serializable{
    
    
	/**
	 *
	 */
		
	private static final long serialVersionUID = 4121542868865244903L;

	/**
     * ID
     */
    private String id;
    
    /**
     * 类型id
     */
    private String typeId;
    
    /**
     * 文件名
     */
    private String name;
    
    /**
     * 文件大小 (mb)
     */
    private Double size;
    
    /**
     * 文件描述
     */
    private String remark;
    
    /**
     * 状态（1：可用；0：不可用）
     */
    private Integer status;
    
    /**
     * 文件上传路径 
     */
    private String filePath;
    
    
    
    
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getTypeId() {
        return typeId;
    }
    
    public void setTypeId(String typeId) {
        this.typeId = typeId;
    }
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    public Double getSize() {
        return size;
    }
    
    public void setSize(Double size) {
        this.size = size;
    }
    public String getRemark() {
        return remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}


    
}
