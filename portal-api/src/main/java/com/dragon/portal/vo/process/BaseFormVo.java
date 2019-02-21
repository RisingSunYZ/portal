package com.dragon.portal.vo.process;

import com.dragon.portal.vo.user.UserSessionInfo;
import com.ys.tools.common.BaseModel;
import com.ys.tools.common.DateUtil;

import java.io.Serializable;
import java.util.Date;

/**
 * 业务表单基本信息
 * @Title:
 * @Description:
 * @Author:xietongjian
 * @Since:2017年8月25日 下午11:10:56
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public class BaseFormVo extends BaseModel implements Serializable{

	private static final long serialVersionUID = -4389537519351306039L;

	public BaseFormVo() {
		super();
	}

	/**
	 * 组装登录用户的数据数据
	 * @param userSessionInfo
	 */
	public BaseFormVo(UserSessionInfo userSessionInfo) {
		this.applyerNo = userSessionInfo.getNo();
		this.applyerName = userSessionInfo.getName();
		this.applyDate = new Date();
		this.applyDateStr = DateUtil.getDate(this.applyDate, "yyyy-MM-dd");
		this.applyCompany = userSessionInfo.getCompanyName();
		this.applyCompanyId = userSessionInfo.getCompanyId();
		this.applyDept = userSessionInfo.getDepName();
		this.applyDeptId = userSessionInfo.getDepId();
		this.parentDept = userSessionInfo.getParentDepName();
		this.parentDeptId = userSessionInfo.getParentDepId();
		this.jobStation = userSessionInfo.getUserPost();
		this.mobile = userSessionInfo.getMobile();
		this.phone = userSessionInfo.getPhone();
	}

	/**
     * 申请单号
     */
    private String applyNo;
    
    /**
     * 表单名称
     */
    private String formName;
    
    /**
     * 表单链接
     */
    private String formUrl;
    
    /**
     * 发起时间
     */
    private Date applyDate;
    
    /**
     * 发起时间 字符串
     */
    private String applyDateStr;
    
    /**
     * 单据状态
     */
    private String applyStatus;
    
    /**
     * 发起人工号
     */
    private String applyerNo;
    
    /**
     * 发起人姓名
     */
    private String applyerName;
    
    /**
     * 发起部门Id
     */
    private String applyDeptId;
    
    /**
     * 发起部门
     */
    private String applyDept;
    
    /**
     * 上级部门Id
     */
    private String parentDeptId;
    
    /**
     * 上级部门
     */
    private String parentDept;
    
    /**
     * 发起单位id
     */
    private String applyCompanyId;
    
    /**
     * 发起单位
     */
    private String applyCompany;
    
    /**
     * 职务
     */
    private String jobStation;
    
    /**
     * 联系电话
     */
    private String phone;
    
    /**
     * 移动电话
     */
    private String mobile;
    
	/**
	 * 附言数据
	 */
	private String attachMsg;

	/**
	 * 保存表单数据
	 */
	private String formData;
	
	public String getApplyNo() {
		return applyNo;
	}

	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}

	public Date getApplyDate() {
		return applyDate;
	}

	public void setApplyDate(Date applyDate) {
		this.applyDate = applyDate;
	}

	public String getApplyStatus() {
		return applyStatus;
	}

	public void setApplyStatus(String applyStatus) {
		this.applyStatus = applyStatus;
	}

	public String getApplyerNo() {
		return applyerNo;
	}

	public void setApplyerNo(String applyerNo) {
		this.applyerNo = applyerNo;
	}

	public String getApplyerName() {
		return applyerName;
	}

	public void setApplyerName(String applyerName) {
		this.applyerName = applyerName;
	}

	public String getApplyDeptId() {
		return applyDeptId;
	}

	public void setApplyDeptId(String applyDeptId) {
		this.applyDeptId = applyDeptId;
	}

	public String getApplyDept() {
		return applyDept;
	}

	public void setApplyDept(String applyDept) {
		this.applyDept = applyDept;
	}

	public String getParentDeptId() {
		return parentDeptId;
	}

	public void setParentDeptId(String parentDeptId) {
		this.parentDeptId = parentDeptId;
	}

	public String getParentDept() {
		return parentDept;
	}

	public void setParentDept(String parentDept) {
		this.parentDept = parentDept;
	}

	public String getApplyCompanyId() {
		return applyCompanyId;
	}

	public void setApplyCompanyId(String applyCompanyId) {
		this.applyCompanyId = applyCompanyId;
	}

	public String getApplyCompany() {
		return applyCompany;
	}

	public void setApplyCompany(String applyCompany) {
		this.applyCompany = applyCompany;
	}

	public String getJobStation() {
		return jobStation;
	}

	public void setJobStation(String jobStation) {
		this.jobStation = jobStation;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getAttachMsg() {
		return attachMsg;
	}

	public void setAttachMsg(String attachMsg) {
		this.attachMsg = attachMsg;
	}

	public String getFormName() {
		return formName;
	}

	public void setFormName(String formName) {
		this.formName = formName;
	}

	public String getFormUrl() {
		return formUrl;
	}

	public void setFormUrl(String formUrl) {
		this.formUrl = formUrl;
	}

	public String getFormData() {
		return formData;
	}

	public void setFormData(String formData) {
		this.formData = formData;
	}

	public String getApplyDateStr() {
		return applyDateStr;
	}

	public void setApplyDateStr(String applyDateStr) {
		this.applyDateStr = applyDateStr;
	}

	@Override
	public String toString() {
		return "BaseForm [applyNo=" + applyNo + ", applyDate=" + applyDate + ", applyStatus=" + applyStatus
				+ ", applyerNo=" + applyerNo + ", applyerName=" + applyerName + ", applyDeptId=" + applyDeptId
				+ ", applyDept=" + applyDept + ", parentDeptId=" + parentDeptId + ", parentDept=" + parentDept
				+ ", applyCompanyId=" + applyCompanyId + ", applyCompany=" + applyCompany + ", jobStation=" + jobStation
				+ ", phone=" + phone + ", mobile=" + mobile + ", attachMsg=" + attachMsg + "]";
	}
}
