package com.dragon.portal.model.it;

import java.io.Serializable;
import java.util.List;

/**
 * 问题反馈数据
 * @author v-luozongfang
 *
 */
public class QuestionVo implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private String id;
	private String eventNo;
	
	private String createTime;
	private String startTime;
	private String endTime;
	
	//附件名称（多个之间用逗号连接）
	private String attachmentNames;
	//附件id（多个之间用逗号连接）
	private String attachmentIds;
	//对应的消息TaskId
	private String messageIds;
	
	private String title;
	//一级分类（所属业务）
	private String fristCategory;
	//二级分类（问题系统）
	private String secondCategory;
	//三级分类（问题分类）
	private String thirdCategory;
	//问题状态编码
	private int statusCode;
	//问题状态名称
	private String statusName;
	//处理反馈
	private String solution;
	//问题描述
	private String questionDesc;
	//用户评价状态
	private int visitRecord;
	
	//处理人名称
	private String realName;
	//处理人办公电话
	private String officePhone;
	
	private List<QuestionFileVo> files;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getEventNo() {
		return eventNo;
	}
	public void setEventNo(String eventNo) {
		this.eventNo = eventNo;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getAttachmentNames() {
		return attachmentNames;
	}
	public void setAttachmentNames(String attachmentNames) {
		this.attachmentNames = attachmentNames;
	}
	public String getAttachmentIds() {
		return attachmentIds;
	}
	public void setAttachmentIds(String attachmentIds) {
		this.attachmentIds = attachmentIds;
	}
	public String getMessageIds() {
		return messageIds;
	}
	public void setMessageIds(String messageIds) {
		this.messageIds = messageIds;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getFristCategory() {
		return fristCategory;
	}
	public void setFristCategory(String fristCategory) {
		this.fristCategory = fristCategory;
	}
	public String getSecondCategory() {
		return secondCategory;
	}
	public void setSecondCategory(String secondCategory) {
		this.secondCategory = secondCategory;
	}
	public String getThirdCategory() {
		return thirdCategory;
	}
	public void setThirdCategory(String thirdCategory) {
		this.thirdCategory = thirdCategory;
	}
	public int getStatusCode() {
		return statusCode;
	}
	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}
	public String getStatusName() {
		return statusName;
	}
	public void setStatusName(String statusName) {
		this.statusName = statusName;
	}
	public String getSolution() {
		return solution;
	}
	public void setSolution(String solution) {
		this.solution = solution;
	}
	public String getQuestionDesc() {
		return questionDesc;
	}
	public void setQuestionDesc(String questionDesc) {
		this.questionDesc = questionDesc;
	}
	public int getVisitRecord() {
		return visitRecord;
	}
	public void setVisitRecord(int visitRecord) {
		this.visitRecord = visitRecord;
	}
	public String getRealName() {
		return realName;
	}
	public void setRealName(String realName) {
		this.realName = realName;
	}
	public String getOfficePhone() {
		return officePhone;
	}
	public void setOfficePhone(String officePhone) {
		this.officePhone = officePhone;
	}
	public List<QuestionFileVo> getFiles() {
		return files;
	}
	public void setFiles(List<QuestionFileVo> files) {
		this.files = files;
	}
	
}
