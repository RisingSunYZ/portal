package com.dragon.portal.model.news;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:新闻公告发文-流程
 * @Description:
 * @Author:XTJ
 * @Since:2018-01-03 09:44:09
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class NewsNoticeProcess extends BaseModel implements Serializable{
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 新闻公告ID
     */
    private String newNoticeId;
    
    /**
     * 编号
     */
    private String code;
    
    /**
     * 单位ID
     */
    private String companyId;
    
    /**
     * 提交单位
     */
    private String company;
    
    /**
     * 部门ID
     */
    private String deptmentId;
    
    /**
     * 所在部门
     */
    private String deptment;
    
    /**
     * 上级部门ID
     */
    private String preDeptmentId;
    
    /**
     * 上级部门
     */
    private String preDeptment;
    
    /**
     * 提交人
     */
    private String username;
    
    /**
     * 工号
     */
    private String no;
    
    /**
     * 手机
     */
    private String mobile;
    
    /**
     * 固定电话
     */
    private String telephone;
    
    /**
     * 职务
     */
    private String job;
    
    /**
     * 流程实例ID
     */
    private String taskId;
    
    /**
     * 流程状态
     */
    private Integer status;
    
    
    
    
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getNewNoticeId() {
        return newNoticeId;
    }
    
    public void setNewNoticeId(String newNoticeId) {
        this.newNoticeId = newNoticeId;
    }
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    public String getCompanyId() {
        return companyId;
    }
    
    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }
    public String getCompany() {
        return company;
    }
    
    public void setCompany(String company) {
        this.company = company;
    }
    public String getDeptmentId() {
        return deptmentId;
    }
    
    public void setDeptmentId(String deptmentId) {
        this.deptmentId = deptmentId;
    }
    public String getDeptment() {
        return deptment;
    }
    
    public void setDeptment(String deptment) {
        this.deptment = deptment;
    }
    public String getPreDeptmentId() {
        return preDeptmentId;
    }
    
    public void setPreDeptmentId(String preDeptmentId) {
        this.preDeptmentId = preDeptmentId;
    }
    public String getPreDeptment() {
        return preDeptment;
    }
    
    public void setPreDeptment(String preDeptment) {
        this.preDeptment = preDeptment;
    }
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    public String getNo() {
        return no;
    }
    
    public void setNo(String no) {
        this.no = no;
    }
    public String getMobile() {
        return mobile;
    }
    
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
    public String getTelephone() {
        return telephone;
    }
    
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    public String getJob() {
        return job;
    }
    
    public void setJob(String job) {
        this.job = job;
    }
    public String getTaskId() {
        return taskId;
    }
    
    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }
}
