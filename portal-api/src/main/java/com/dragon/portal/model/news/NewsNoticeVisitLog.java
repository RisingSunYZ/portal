package com.dragon.portal.model.news;


import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:公告或新闻动态访问量日志
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-23 11:13:08
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class NewsNoticeVisitLog extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 7869144256725077277L;

	/**
     * ID
     */
    private String id;
    
    /**
     * 访问用户工号
     */
    private String visitor;
    
    /**
     * 访问用户姓名
     */
    private String visitorName;
    
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
    
    /**
     * 引用文章ID
     */
    private String refId;
    
    /**
     * 引用文章数据来源类型 NewsNoticeVisitLogRefTypeEnum
     */
    private Integer refSourceType;
    
    /**
     * 访问IP
     */
    private String visitIp;
    
    
    
    
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getVisitor() {
        return visitor;
    }
    
    public void setVisitor(String visitor) {
        this.visitor = visitor;
    }
    public String getVisitorName() {
        return visitorName;
    }
    
    public void setVisitorName(String visitorName) {
        this.visitorName = visitorName;
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
    public String getRefId() {
        return refId;
    }
    
    public void setRefId(String refId) {
        this.refId = refId;
    }
    public Integer getRefSourceType() {
        return refSourceType;
    }
    
    public void setRefSourceType(Integer refSourceType) {
        this.refSourceType = refSourceType;
    }
    public String getVisitIp() {
        return visitIp;
    }
    
    public void setVisitIp(String visitIp) {
        this.visitIp = visitIp;
    }
}
