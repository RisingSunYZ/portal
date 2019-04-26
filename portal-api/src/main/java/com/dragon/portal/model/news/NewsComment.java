package com.dragon.portal.model.news;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:员工风采评论表
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-04 09:00:48
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class NewsComment extends BaseModel implements Serializable{
    
    
	/**
	 *
	 */
		
	private static final long serialVersionUID = 751141105406245059L;

	/**
     * ID
     */
    private String id;
    /**
     * 类型 0普通评论 1点赞
     */
	private Integer type;
    
    /**
     * 引用文章ID
     */
    private String refId;
    
    /**
     * 访问用户工号
     */
    private String userNo;
    
    /**
     * 内容
     */
    private String content;
    
    /**
     * 访问者公司ID
     */
    private String companyId;
    
    /**
     * 访问者公司名称
     */
    private String companyName;
    
    /**
     * 访问者部门ID
     */
    private String deptId;
    
    /**
     * 访问者部门名称
     */
    private String deptName;
    
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getRefId() {
        return refId;
    }
    
    public void setRefId(String refId) {
        this.refId = refId;
    }
    public String getUserNo() {
        return userNo;
    }
    
    public void setUserNo(String userNo) {
        this.userNo = userNo;
    }
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }

	public String getCompanyId() {
		return companyId;
	}

	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}
    
}
