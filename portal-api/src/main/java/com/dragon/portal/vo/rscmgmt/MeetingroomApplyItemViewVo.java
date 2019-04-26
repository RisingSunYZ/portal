package com.dragon.portal.vo.rscmgmt;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;

/**
 * 会议室申请Vo
 * @Title:
 * @Description:
 * @Author:xietongjian
 * @Since:2017年4月17日 上午8:52:32
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@ApiModel(value="会议室申请Vo",description="会议室申请Vo")
public class MeetingroomApplyItemViewVo implements Serializable{
	
	/**
	 *
	 */
	private static final long serialVersionUID = -8393355629661217451L;

	/**
	 * 申请状态
	 */
	@ApiModelProperty(value="申请状态",name="status")
	private Integer status;
	
	/**
	 * 申请单号
	 */
	@ApiModelProperty(value="申请单号",name="applyNo")
	private String applyNo;
	
	/**
	 * 申请日期
	 */
	@ApiModelProperty(value="申请日期",name="applyDateStr")
	private String applyDateStr;
	
	/**
	 * 开始时间
	 */
	@ApiModelProperty(value="开始时间",name="startTimeStr")
	private String startTimeStr;
	
	/**
	 * 结束时间
	 */
	@ApiModelProperty(value="结束时间",name="endTimeStr")
	private String endTimeStr;
	
	/**
	 * 申请人 工号
	 */
	@ApiModelProperty(value="申请人 工号",name="applyPersonNo")
	private String applyPersonNo;
	
	/**
	 * 申请人 姓名
	 */
	@ApiModelProperty(value="申请人 姓名",name="applyPersonName")
	private String applyPersonName;

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getApplyNo() {
		return applyNo;
	}

	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}

	public String getApplyDateStr() {
		return applyDateStr;
	}

	public void setApplyDateStr(String applyDateStr) {
		this.applyDateStr = applyDateStr;
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

	public String getApplyPersonNo() {
		return applyPersonNo;
	}

	public void setApplyPersonNo(String applyPersonNo) {
		this.applyPersonNo = applyPersonNo;
	}

	public String getApplyPersonName() {
		return applyPersonName;
	}

	public void setApplyPersonName(String applyPersonName) {
		this.applyPersonName = applyPersonName;
	}
}
