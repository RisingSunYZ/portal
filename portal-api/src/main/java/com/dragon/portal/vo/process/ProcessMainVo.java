package com.dragon.portal.vo.process;


import com.dragon.portal.enm.process.LaunchStyleEnum;

import java.io.Serializable;
import java.util.Date;

/**
 * 流程中心用于传输数据的VO
 * @Title:
 * @Description:
 * @Author:xietongjian
 * @Since:2017年8月21日 上午9:17:56
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public class ProcessMainVo extends BaseProcessVo implements Serializable{

	
	private static final long serialVersionUID = 1L;
	

	

	
	/**
	 * 流程发起方式：默认1、普通方式
	 * @see com.dragon.portal.enm.process.LaunchStyleEnum
	 * 2、宽屏模式
	 */
	private Integer launchType = LaunchStyleEnum.DEFAULT.getStyle();

	/**
	 * 任务类型
	 */
	private String taskType;


	/**
	 * 表单ID
	 */
	private String formId;

	/**
	 * 业务表单编码
	 */
	private String bizFormSn;

	/**
	 * 表单名称
	 */
	private String formName;

	/**
	 * 发起人工号
	 */
	private String senderNo;

	/**
	 * 当前登录用户工号
	 */
	private String currUserNo;

	/**
	 * 当前系统时间
	 */
	private Date currDateTime;

	private String taskName;

	/**
	 * 表单类型
	 */
	private String formType;

	/**
	*单据类别
	*
	* */
	private String businessType;

	/**
	 * 业务表单连接
	 */
	private String bizUrl;

	public ProcessMainVo() {
	}

	public String getBizUrl() {
		return bizUrl;
	}

	public void setBizUrl(String bizUrl) {
		this.bizUrl = bizUrl;
	}

	public String getBusinessType() {
		return businessType;
	}

	public void setBusinessType(String businessType) {
		this.businessType = businessType;
	}


	public String getFormId() {
		return formId;
	}

	public void setFormId(String formId) {
		this.formId = formId;
	}


	public String getSenderNo() {
		return senderNo;
	}

	public void setSenderNo(String senderNo) {
		this.senderNo = senderNo;
	}

	public String getCurrUserNo() {
		return currUserNo;
	}

	public void setCurrUserNo(String currUserNo) {
		this.currUserNo = currUserNo;
	}

	public Date getCurrDateTime() {
		return currDateTime;
	}

	public void setCurrDateTime(Date currDateTime) {
		if(null == currDateTime){
			currDateTime = new Date();
		}
		this.currDateTime = currDateTime;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public String getTaskType() {
		return taskType;
	}

	public void setTaskType(String taskType) {
		this.taskType = taskType;
	}

	public Integer getLaunchType() {
		return launchType;
	}

	public void setLaunchType(Integer launchType) {
		this.launchType = launchType;
	}

	public String getFormType() {
		return formType;
	}

	public void setFormType(String formType) {
		this.formType = formType;
	}

	public String getFormName() {
		return formName;
	}

	public void setFormName(String formName) {
		this.formName = formName;
	}

	public String getBizFormSn() {
		return bizFormSn;
	}

	public void setBizFormSn(String bizFormSn) {
		this.bizFormSn = bizFormSn;
	}



}
