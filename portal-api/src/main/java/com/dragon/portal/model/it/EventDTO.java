package com.dragon.portal.model.it;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Title:问题案例表
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-04 13:54:29
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@ApiModel(value="问题案例表 EventDTO",description="问题案例表 EventDTO")
public class EventDTO{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 6608794289532952153L;
	/**
	 * 操作人(当前登录人)
	 */
	@ApiModelProperty(value="操作人(当前登录人)",name="operatorUserId")
	private String operatorUserId;
	/**
	 * 发起人
	 */
	@ApiModelProperty(value="发起人",name="createUserid")
	private String createUserid;

	/**
	 * 公司,部门的code
	 */
	@ApiModelProperty(value="公司,部门的code",name="companyCode")
	private String companyCode;
	/**
	 * 标题
	 */
	@ApiModelProperty(value="标题",name="title")
	private String title;
	/**
	 * 最后一级分类编码
	 */
	@ApiModelProperty(value="最后一级分类编码",name="categoryCode")
	private String categoryCode;
	/**
	 * 最后一级分类名称
	 */
	@ApiModelProperty(value="最后一级分类名称",name="categoryName")
	private String categoryName;
	/**
	 * 联系人姓名
	 */
	@ApiModelProperty(value="用户名",name="creatorRealName")
	private String creatorRealName;
	/**
	 * 联系人手机号
	 */
	@ApiModelProperty(value="联系人手机号",name="creatorByMobilePhone")
	private String creatorByMobilePhone;
	/**
	 * 办公地点
	 */
	@ApiModelProperty(value="办公地点",name="businessAddress")
	private String businessAddress;
	/**
	 * 问题描述
	 */
	@ApiModelProperty(value="问题描述",name="description")
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
