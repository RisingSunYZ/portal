package com.dragon.portal.vo.rscmgmt;

import java.util.Date;

/**
 * 我的申请vo
 * @Title:
 * @Description:
 * @Author:v-zhaohaishan
 * @Since:2017年4月18日 下午3:30:34
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public class MeetingroomMyApplyVo {
	
	
    /**
     * 申请单号
     */
    private String applyNo;
	/**
	 * 会议室ID
	 */
	private String meetingroomId;
	/**
	 * 会议室名字
     */
	private String meetingroomName;
	
    /**
     * 其他功能 查看枚举类型  MeetingApplyStatusEnum
     * 在我的申请功能中 状态更多  (0:待审批 ；1待使用 ;2使用中 ;3已使用;4过期未审批;5已取消;6不通过)
     */
    private Integer status;
    
    /**
     * 申请类型（0：单次；1：周期性）
     */
    private Integer applyType;
    /**
     * 使用日期
     */
    private String useDate;
    /**
     * 使用时间
     */
    private String useTime;
	/**
	 * 申请时间
	 */
	private Date applyTime;
	/**
	 *  实例id
	 */
	private String taskId;
	
	
	private String applyUser;
	
	private String applyDept;
	
	
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
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Integer getApplyType() {
		return applyType;
	}
	public void setApplyType(Integer applyType) {
		this.applyType = applyType;
	}
	public String getUseDate() {
		return useDate;
	}
	public void setUseDate(String useDate) {
		this.useDate = useDate;
	}
	public String getUseTime() {
		return useTime;
	}
	public void setUseTime(String useTime) {
		this.useTime = useTime;
	}
	public Date getApplyTime() {
		return applyTime;
	}
	public void setApplyTime(Date applyTime) {
		this.applyTime = applyTime;
	}
	public String getApplyNo() {
		return applyNo;
	}
	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}
	public String getTaskId() {
		return taskId;
	}
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}
	public String getApplyUser() {
		return applyUser;
	}
	public void setApplyUser(String applyUser) {
		this.applyUser = applyUser;
	}
	public String getApplyDept() {
		return applyDept;
	}
	public void setApplyDept(String applyDept) {
		this.applyDept = applyDept;
	}

	
	
	

}
