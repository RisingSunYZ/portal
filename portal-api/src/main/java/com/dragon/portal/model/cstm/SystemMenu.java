package com.dragon.portal.model.cstm;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:系统菜单列表
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-02 08:42:38
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class SystemMenu extends BaseModel implements Serializable{

	private static final long serialVersionUID = -5314368367437985784L;

	/**
     * 主键
     */
    private String id;
    
    /**
     * 系统名称
     */
    private String sysName;
    
    /**
     * 系统标识
     */
    private String sysSn;
    
    /**
     * 系统图标
     */
    private String sysIcon;
    
    /**
     * 链接地址
     */
    private String linkUrl;
    
    /**
     * 所属分类	(三级分类id)
     */
    private String sysType;
    
    /**
     * 排序号
     */
    private Integer sortNo;
    
    /**
     * 状态（1：可用；0：不可用）
     */
    private Integer status;
    
    /**
     * 是否为通用系统（1：是；0：否）
     */
    private Integer isCommon;
    
    /**
     * 是否为IDM授权系统
     */
    private Integer isIdmSys;
    
    
    /**
     * 新加字段
     */
    private String sysTypeName; 	//三级分类名称
    
    private String sysScdId;		//二级分类id
    
    private String sysScdName;		//二级分类名称
    
    private String sysFirstId;		//一级分类id
    
    private String sysFirstName;	//一级分类名称
    
    private String remark;
    
    
    
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getSysName() {
        return sysName;
    }
    
    public void setSysName(String sysName) {
        this.sysName = sysName;
    }
    public String getSysSn() {
        return sysSn;
    }
    
    public void setSysSn(String sysSn) {
        this.sysSn = sysSn;
    }
    public String getSysIcon() {
        return sysIcon;
    }
    
    public void setSysIcon(String sysIcon) {
        this.sysIcon = sysIcon;
    }
    public String getLinkUrl() {
        return linkUrl;
    }
    
    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }
    public String getSysType() {
        return sysType;
    }
    
    public void setSysType(String sysType) {
        this.sysType = sysType;
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
    public Integer getIsCommon() {
        return isCommon;
    }
    
    public void setIsCommon(Integer isCommon) {
        this.isCommon = isCommon;
    }
    public Integer getIsIdmSys() {
        return isIdmSys;
    }
    
    public void setIsIdmSys(Integer isIdmSys) {
        this.isIdmSys = isIdmSys;
    }

	public String getSysTypeName() {
		return sysTypeName;
	}

	public void setSysTypeName(String sysTypeName) {
		this.sysTypeName = sysTypeName;
	}

	public String getSysScdId() {
		return sysScdId;
	}

	public void setSysScdId(String sysScdId) {
		this.sysScdId = sysScdId;
	}

	public String getSysScdName() {
		return sysScdName;
	}

	public void setSysScdName(String sysScdName) {
		this.sysScdName = sysScdName;
	}

	public String getSysFirstId() {
		return sysFirstId;
	}

	public void setSysFirstId(String sysFirstId) {
		this.sysFirstId = sysFirstId;
	}

	public String getSysFirstName() {
		return sysFirstName;
	}

	public void setSysFirstName(String sysFirstName) {
		this.sysFirstName = sysFirstName;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}
