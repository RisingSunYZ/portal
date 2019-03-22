package com.dragon.portal.model.fnc;


import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:财务服务-资料类型
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:13:17
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MaterialFileType extends BaseModel implements Serializable{
    
    
	/**
	 *
	 */
		
	private static final long serialVersionUID = -1072741933054714526L;

	/**
     * ID
     */
    private String id;
    
    /**
     * 类型名称
     */
    private String name;
    
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
    public Integer getSortNo() {
        return sortNo;
    }
    
    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }
}
