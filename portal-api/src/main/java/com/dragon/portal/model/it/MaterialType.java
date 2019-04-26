package com.dragon.portal.model.it;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;
import java.util.List;

/**
 * @Title:资料类型
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-07 15:01:10
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MaterialType extends BaseModel implements Serializable{
    
    
	/**
	 *
	 */
		
	private static final long serialVersionUID = 1L;

	/**
     * 主键
     */
    private String id;
    
    /**
     * 类型名称
     */
    private String typeName;
    /**
     * 类型名称
     */
    private String columnName;
    
    
    /**
     * 临时变量-s
     */
    /**
     * 资料列表
     */
    private List<Material> materialList;
    /**
     * 临时变量-e
     */
    
    
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

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public List<Material> getMaterialList() {
		return materialList;
	}

	public void setMaterialList(List<Material> materialList) {
		this.materialList = materialList;
	}
    
}
