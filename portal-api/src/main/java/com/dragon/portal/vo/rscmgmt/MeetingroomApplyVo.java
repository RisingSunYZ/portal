package com.dragon.portal.vo.rscmgmt;

import java.io.Serializable;
import java.util.Date;

/**
 * 会议室申请Vo
 * @Title:
 * @Description:
 * @Author:xietongjian
 * @Since:2017年4月17日 上午8:52:32
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingroomApplyVo implements Serializable{
	/**
     * id
     */
    private String id;
    
    /**
     * 申请单号
     */
    private String applyNo;
    
    /**
     * 会议室地址ID
     */
    private String meetingroomId;
    
    /**
     * 管理员工号
     */
    private String meetingroomName;
    
    /**
     * 申请人工号
     */
    private String proposerNo;
    
    /**
     * 申请人姓名
     */
    private String proposerName;
    
    /**
     * 
     */
    private String mobile;
    
    /**
     * 
     */
    private String deptId;
    
    /**
     * 
     */
    private String deptName;
    
    /**
     * 
     */
    private String detailAddress;
    
    /**
     * 申请类型（0：单次；1：周期性）
     */
    private Integer applyType;
    
    /**
     * 开始日期
     */
    private String startDateStr;
    /**
     * 结束日期
     */
    private String endDateStr;
    
    /**
     * 
     */
    private String startTimeStr;
    
    /**
     * 
     */
    private String endTimeStr;
    

    /**
     * 周几（1，2，3，4，5，6，7）
     */
    private String weekDays;
    
    /**
     * 
     */
    private String remark;
    
    /**
     * 周期批次号（用于关联周期性会议）
     */
    private String periodNo;
    
    /**
     * 审批状态（1：通过；2：不通过；3：过期未处理）
     */
    private Integer status;
    /**
     * 岗位
     */
    private String jobStation;
	/**
	 * 上级部门名称
	 */
    private String preDeptName;
    /**
     * 发起单位
     */
    private String companyName;
    /**
     * 发起时间
     */
    private Date createTime;
    
    /**
     * 意见
     */
    private String message;
    
    /**
     * 审批人工号
     */
    private String approverNo;
    /**
     * 审批人名字
     */
    private String approverName;
    
    /**
     * 流程实例id
     */
    private String taskId;
    
    /**
     * 1 更新  0 添加
     */
    private Integer method;
    
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getApplyNo() {
		return applyNo;
	}

	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}

	public String getMeetingroomId() {
		return meetingroomId;
	}

	public void setMeetingroomId(String meetingroomId) {
		this.meetingroomId = meetingroomId;
	}

	public String getMeetingroomName() {
		return meetingroomName;
	}

	public void setMeetingroomName(String meetingroomName) {
		this.meetingroomName = meetingroomName;
	}

	public String getProposerNo() {
		return proposerNo;
	}

	public void setProposerNo(String proposerNo) {
		this.proposerNo = proposerNo;
	}

	public String getProposerName() {
		return proposerName;
	}

	public void setProposerName(String proposerName) {
		this.proposerName = proposerName;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
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

	public String getDetailAddress() {
		return detailAddress;
	}

	public void setDetailAddress(String detailAddress) {
		this.detailAddress = detailAddress;
	}

	public Integer getApplyType() {
		return applyType;
	}

	public void setApplyType(Integer applyType) {
		this.applyType = applyType;
	}

	public String getStartTimeStr() {
		return startTimeStr;
	}

	public void setStartTimeStr(String startTimeStr) {
		this.startTimeStr = startTimeStr;
	}

	public String getEndTimeStr() {
		return endTimeStr;
	}

	public void setEndTimeStr(String endTimeStr) {
		this.endTimeStr = endTimeStr;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getPeriodNo() {
		return periodNo;
	}

	public void setPeriodNo(String periodNo) {
		this.periodNo = periodNo;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getStartDateStr() {
		return startDateStr;
	}

	public void setStartDateStr(String startDateStr) {
		this.startDateStr = startDateStr;
	}

	public String getEndDateStr() {
		return endDateStr;
	}

	public void setEndDateStr(String endDateStr) {
		this.endDateStr = endDateStr;
	}

	public String getWeekDays() {
		return weekDays;
	}

	public void setWeekDays(String weekDays) {
		this.weekDays = weekDays;
	}

	public String getJobStation() {
		return jobStation;
	}

	public void setJobStation(String jobStation) {
		this.jobStation = jobStation;
	}

	public String getPreDeptName() {
		return preDeptName;
	}

	public void setPreDeptName(String preDeptName) {
		this.preDeptName = preDeptName;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getApproverNo() {
		return approverNo;
	}

	public void setApproverNo(String approverNo) {
		this.approverNo = approverNo;
	}

	public String getApproverName() {
		return approverName;
	}

	public void setApproverName(String approverName) {
		this.approverName = approverName;
	}

	public Integer getMethod() {
		return method;
	}

	public void setMethod(Integer method) {
		this.method = method;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	@Override
	public String toString() {
		return "MeetingroomApplyVo [id=" + id + ", applyNo=" + applyNo + ", meetingroomId=" + meetingroomId
				+ ", meetingroomName=" + meetingroomName + ", proposerNo=" + proposerNo + ", proposerName="
				+ proposerName + ", mobile=" + mobile + ", deptId=" + deptId + ", deptName=" + deptName
				+ ", detailAddress=" + detailAddress + ", applyType=" + applyType + ", startDateStr=" + startDateStr
				+ ", endDateStr=" + endDateStr + ", startTimeStr=" + startTimeStr + ", endTimeStr=" + endTimeStr
				+ ", weekDays=" + weekDays + ", remark=" + remark + ", periodNo=" + periodNo + ", status=" + status
				+ ", jobStation=" + jobStation + ", preDeptName=" + preDeptName + ", companyName=" + companyName
				+ ", createTime=" + createTime + ", message=" + message + ", approverNo=" + approverNo
				+ ", approverName=" + approverName + ", method=" + method + "]";
	}
    
}
