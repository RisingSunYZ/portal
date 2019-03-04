package com.dragon.portal.model.cstm;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:常用系统菜单用户中间表
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-28 21:40:15
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class SystemMenuUser extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = -3374588385252295053L;

	/**
     * 主键
     */
    private String id;
    
    /**
     * 系统ID
     */
    private String sysId;
    
    /**
     * 所属分类
     */
    private String typeId;
    
    /**
     * 排序号
     */
    private Integer sortNo;
    
    /**
     * 状态（1：可用；0：不可用）
     */
    private Integer status;
    
    /**
     * 用户工号
     */
    private String userNo;
    
    
    
    
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getSysId() {
        return sysId;
    }
    
    public void setSysId(String sysId) {
        this.sysId = sysId;
    }
    public String getTypeId() {
        return typeId;
    }
    
    public void setTypeId(String typeId) {
        this.typeId = typeId;
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

	public String getUserNo() {
		return userNo;
	}

	public void setUserNo(String userNo) {
		this.userNo = userNo;
	}
    
}
