package com.dragon.portal.model.it;

/**
 * @Title:问题案例表
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-04 13:54:29
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class EventDTO{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 6608794289532952153L;
	/**
	 * 操作人(当前登录人)
	 */
	private String operatorUserId;
	/**
	 * 发起人
	 */
	private String createUserid;

	/**
	 * 公司,部门的code
	 */
	private String companyCode;
	/**
	 * 标题
	 */
	private String title;
	/**
	 * 最后一级分类编码
	 */
	private String categoryCode;
	/**
	 * 最后一级分类名称
	 */
	private String categoryName;
	/**
	 * 联系人姓名
	 */
	private String creatorRealName;
	/**
	 * 联系人手机号
	 */
	private String creatorByMobilePhone;
	/**
	 * 办公地点
	 */
	private String businessAddress;
	/**
	 * 问题描述
	 */
	private String description;
	
	/**
	 * get,set
	 */
	
	public String getCompanyCode() {
		return companyCode;
	}
	public String getOperatorUserId() {
		return operatorUserId;
	}
	public void setOperatorUserId(String operatorUserId) {
		this.operatorUserId = operatorUserId;
	}
	public String getCreateUserid() {
		return createUserid;
	}
	public void setCreateUserid(String createUserid) {
		this.createUserid = createUserid;
	}
	public void setCompanyCode(String companyCode) {
		this.companyCode = companyCode;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getCategoryCode() {
		return categoryCode;
	}
	public void setCategoryCode(String categoryCode) {
		this.categoryCode = categoryCode;
	}
	public String getCreatorRealName() {
		return creatorRealName;
	}
	public void setCreatorRealName(String creatorRealName) {
		this.creatorRealName = creatorRealName;
	}
	public String getCreatorByMobilePhone() {
		return creatorByMobilePhone;
	}
	public void setCreatorByMobilePhone(String creatorByMobilePhone) {
		this.creatorByMobilePhone = creatorByMobilePhone;
	}
	public String getBusinessAddress() {
		return businessAddress;
	}
	public void setBusinessAddress(String businessAddress) {
		this.businessAddress = businessAddress;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getCategoryName() {
		return categoryName;
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
}
