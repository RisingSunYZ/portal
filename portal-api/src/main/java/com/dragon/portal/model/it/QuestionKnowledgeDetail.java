package com.dragon.portal.model.it;

import java.io.Serializable;
import java.util.List;

public class QuestionKnowledgeDetail implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private String id;
	//标题
	private String title;
	//关键字
	private String keyword;
	//发布状态
	private String statusName;
	//创建时间
	private String createTime;
	//最后更新时间
	private String lastUpdateTime;
	//分类名称
	private String categoryName;
	//内容
	private String content;
	//创建者真实姓名
	private String creator;
	//创建者用户名
	private String createUserName;
	//浏览记录
	private int browseRecord;
	//点赞数量
	private int clickLike;
	//标签名称
	private String labelNames;
	//服务目录名
	private String serviceDirectoryNames;
	
	//附件
	private List<QuestionFileVo> files;

	/**
	 * get,set方法
	 */
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public String getStatusName() {
		return statusName;
	}

	public void setStatusName(String statusName) {
		this.statusName = statusName;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getLastUpdateTime() {
		return lastUpdateTime;
	}

	public void setLastUpdateTime(String lastUpdateTime) {
		this.lastUpdateTime = lastUpdateTime;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getCreateUserName() {
		return createUserName;
	}

	public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}

	public int getBrowseRecord() {
		return browseRecord;
	}

	public void setBrowseRecord(int browseRecord) {
		this.browseRecord = browseRecord;
	}

	public int getClickLike() {
		return clickLike;
	}

	public void setClickLike(int clickLike) {
		this.clickLike = clickLike;
	}

	public String getLabelNames() {
		return labelNames;
	}

	public void setLabelNames(String labelNames) {
		this.labelNames = labelNames;
	}

	public String getServiceDirectoryNames() {
		return serviceDirectoryNames;
	}

	public void setServiceDirectoryNames(String serviceDirectoryNames) {
		this.serviceDirectoryNames = serviceDirectoryNames;
	}

	public List<QuestionFileVo> getFiles() {
		return files;
	}

	public void setFiles(List<QuestionFileVo> files) {
		this.files = files;
	}
	
}
