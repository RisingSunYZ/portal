package com.dragon.portal.model.news;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:报名记录
 * @Description:
 * @Author:XTJ
 * @Since:2017-07-13 13:27:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class NewsSignRecord extends BaseModel implements Serializable{
    
    /**
     * id
     */
    private String id;
    
    /**
     * 引用ID
     */
    private String newsId;
    
    /**
     * 工号
     */
    private String userNo;
    
    /**
     * 姓名
     */
    private String userName;
    
    /**
     * 公司ID
     */
    private String companyId;
    
    /**
     * 公司名称
     */
    private String companyName;
    
    /**
     * 部门ID
     */
    private String deptId;
    
    /**
     * 部门名称
     */
    private String deptName;
    
    /**
     * 联系方式
     */
    private String contactPhone;
    
    
    
    
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getNewsId() {
        return newsId;
    }
    
    public void setNewsId(String newsId) {
        this.newsId = newsId;
    }
    public String getUserNo() {
        return userNo;
    }
    
    public void setUserNo(String userNo) {
        this.userNo = userNo;
    }
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
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
    public String getContactPhone() {
        return contactPhone;
    }
    
    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }
}
