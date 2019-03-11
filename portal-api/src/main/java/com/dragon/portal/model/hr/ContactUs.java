package com.dragon.portal.model.hr;

import com.dragon.tools.common.BaseModel;
import java.io.Serializable;

/**
 * @Title:联系人信息配置
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-07 10:07:00
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class ContactUs extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 7384125028549909908L;

	/**
     * ID
     */
    private String id;
    
    /**
     * 部门名称
     */
    private String deptName;
    
    /**
     * 联系人
     */
    private String userName;
    
    /**
     * 联系人电话
     */
    private String tel;
    
    /**
     * 联系人邮箱
     */
    private String email;
    
    /**
     * 联系地址
     */
    private String address;
    
    /**
     * 所属分类（1：IT服务；2：HR服务）
     */
    private Integer type;
    
    /**
     * 备注
     */
    private String remark;
    
    /**
     * 状态（1：可用；0：不可用）
     */
    private Integer status;
    
    /**
     * 排序
     */
    private Integer sortNo;
    
    
    /**
     * 类型ID
     */
    private String typeId;
    
    
    public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDeptName() {
        return deptName;
    }
    
    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getTel() {
        return tel;
    }
    
    public void setTel(String tel) {
        this.tel = tel;
    }
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    public Integer getType() {
        return type;
    }
    
    public void setType(Integer type) {
        this.type = type;
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
    public Integer getSortNo() {
        return sortNo;
    }
    
    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }

	public String getTypeId() {
		return typeId;
	}

	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}
    
}
