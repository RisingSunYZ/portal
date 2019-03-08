package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;
import java.util.Date;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议室申请表
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-14 10:16:33
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingroomApply extends BaseModel implements Serializable{
    
	private static final long serialVersionUID = 4625830052544924394L;

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
     * 
     */
    private Date startTime;
    
    /**
     * 
     */
    private Date endTime;
    
    /**
     * 周期开始时间字符串
     */
    private String startDay;
    /**
     * 周期结束时间字符串
     */
    private String endDay;
    
    /**
     * 周几（1，2，3，4，5，6，7）
     */
    private Integer weekDay;
    
    /**
     * 
     */
    private String remark;
    
    /**
     * 周期批次号（用于关联周期性会议）
     */
    private String periodNo;
    
    /**
     * 审批状态（1：通过；2：不通过；3：过期未处理 ;4:已经取消） 枚举类型 MeetingApplyStatusEnum
     */
    private Integer status;
    
    /**
     * 日期 周几 (1,2)表示 周一 周二
     */
    private String weekDays;
    
    
    private String taskId;
    
    private String oldId;
    
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
    public Date getStartTime() {
        return startTime;
    }
    
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }
    public Date getEndTime() {
        return endTime;
    }
    
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }
    public Integer getWeekDay() {
        return weekDay;
    }
    
    public void setWeekDay(Integer weekDay) {
        this.weekDay = weekDay;
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

	public String getWeekDays() {
		return weekDays;
	}

	public void setWeekDays(String weekDays) {
		this.weekDays = weekDays;
	}

	public String getStartDay() {
		return startDay;
	}

	public void setStartDay(String startDay) {
		this.startDay = startDay;
	}

	public String getEndDay() {
		return endDay;
	}

	public void setEndDay(String endDay) {
		this.endDay = endDay;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getOldId() {
		return oldId;
	}

	public void setOldId(String oldId) {
		this.oldId = oldId;
	}

	
}
