package com.dragon.portal.model.cstm;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;
import java.util.List;

/**
 * @Title:常用系统菜单分类
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-28 21:39:24
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class SystemMenuType extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = -2368279383118597880L;

	/**
     * 主键
     */
    private String id;
    
    /**
     * 分类名称
     */
    private String name;
    
    /**
     * 分类标识
     */
    private String typeSn;
    
    /**
     * 类别图标
     */
    private String typeIcon;
    
    /**
     * 父级分类
     */
    private String pid;
    
    /**
     * 排序号
     */
    private Integer sortNo;
    
    /**
     * 状态（1：可用；0：不可用）
     */
    private Integer status;
    
    /**
     * 等级
     */
    private Integer level; 
    
    
    private List<SystemMenuType> systemMenuType;
    
    private List<SystemMenu> systemMenu;
    
    
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
    public String getTypeSn() {
        return typeSn;
    }
    
    public void setTypeSn(String typeSn) {
        this.typeSn = typeSn;
    }
    public String getTypeIcon() {
        return typeIcon;
    }
    
    public void setTypeIcon(String typeIcon) {
        this.typeIcon = typeIcon;
    }
    public String getPid() {
        return pid;
    }
    
    public void setPid(String pid) {
        this.pid = pid;
    }
    public Integer getSortNo() {
        return sortNo;
    }
    
    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }

	public Integer getLevel() {
		return level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}

	public List<SystemMenuType> getSystemMenuType() {
		return systemMenuType;
	}

	public void setSystemMenuType(List<SystemMenuType> systemMenuType) {
		this.systemMenuType = systemMenuType;
	}

	public List<SystemMenu> getSystemMenu() {
		return systemMenu;
	}

	public void setSystemMenu(List<SystemMenu> systemMenu) {
		this.systemMenu = systemMenu;
	}
	
}
