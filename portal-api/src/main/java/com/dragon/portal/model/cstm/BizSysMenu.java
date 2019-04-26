package com.dragon.portal.model.cstm;

import com.ys.tools.common.BaseModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;

/**
 * @Title:业务系统菜单
 * @Description:
 * @Author:cenwei
 * @Since:2018-02-06 15:52:18
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@ApiModel(value="业务系统菜单 BizSysMenu",description="业务系统菜单 BizSysMenu")
public class BizSysMenu extends BaseModel implements Serializable{
    
    /**
     * ID
     */
    @ApiModelProperty(value="id",name="id")
    private String id;

    /**
     * 菜单类型
     */
    @ApiModelProperty(value="1111",name="operatorUserId")
    private Integer type;

    /**
     * 菜单类型名称
     */
    @ApiModelProperty(value="菜单类型名称",name="typeName")
    private String typeName;


    /**
     * 名称
     */
    @ApiModelProperty(value="名称",name="name")
    private String name;
    
    /**
     * 标识
     */
    @ApiModelProperty(value="标识",name="sn")
    private String sn;
    
    /**
     * 链接
     */
    @ApiModelProperty(value="链接",name="url")
    private String url;
    
    /**
     * 系统图标
     */
    @ApiModelProperty(value="系统图标",name="icon")
    private String icon;
    
    /**
     * 父级节点ID（根节点代表系统）
     */
    @ApiModelProperty(value="父级节点ID（根节点代表系统）",name="pid")
    private String pid;
    
    /**
     * 排序编号
     */
    @ApiModelProperty(value="排序编号",name="sortNo")
    private Integer sortNo;
    
    /**
     * 是否启用（1：启用；0：未启用）
     */
    @ApiModelProperty(value="是否启用（1：启用；0：未启用）",name="status")
    private Integer status;
    
    
    /**
     * 树形目录是否有子树的标识 --children = [] 表示有子树 
     */
    @ApiModelProperty(value="树形目录是否有子树的标识 --children = [] 表示有子树 ",name="children")
	private String[] children;
	/**
	 * 树形目录--state = "closed"表示折叠树
	 */
    @ApiModelProperty(value="树形目录状态--state = \"closed\"表示折叠树",name="state")
	private String state;

    @ApiModelProperty(value="childrenNumber",name="childrenNumber")
	private Integer childrenNumber;
    
	
	
    public Integer getChildrenNumber() {
		return childrenNumber;
	}

	public void setChildrenNumber(Integer childrenNumber) {
		this.childrenNumber = childrenNumber;
	}

	public String[] getChildren() {
		return children;
	}

	public void setChildren(String[] children) {
		this.children = children;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

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
    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    public String getIcon() {
        return icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
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

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }
}
