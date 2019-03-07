package com.dragon.portal.model.it;

import java.io.Serializable;
import java.util.List;

public class QuestionKnowledge implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private String id;
	//标题
	private String title;
	//创建时间
	private String createTime;
	//创建人
	private String createUser;
	//分类名称
	private String categoryName;
	//关键字
	private String keyword;
	//状态
	private String status;
	//附件名称
	private String attachmenttitle;
	//浏览记录
	private int browseRecord;
	//服务目录
	private String serviceDirectoryName;
	
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
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getCreateUser() {
		return createUser;
	}
	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}
	public String getCategoryName() {
		return categoryName;
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	public String getKeyword() {
		return keyword;
	}
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getAttachmenttitle() {
		return attachmenttitle;
	}
	public void setAttachmenttitle(String attachmenttitle) {
		this.attachmenttitle = attachmenttitle;
	}
	public int getBrowseRecord() {
		return browseRecord;
	}
	public void setBrowseRecord(int browseRecord) {
		this.browseRecord = browseRecord;
	}
	public String getServiceDirectoryName() {
		return serviceDirectoryName;
	}
	public void setServiceDirectoryName(String serviceDirectoryName) {
		this.serviceDirectoryName = serviceDirectoryName;
	}
	public List<QuestionFileVo> getFiles() {
		return files;
	}
	public void setFiles(List<QuestionFileVo> files) {
		this.files = files;
	}
}
