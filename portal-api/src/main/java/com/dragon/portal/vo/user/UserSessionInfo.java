package com.dragon.portal.vo.user;

import com.ys.ucenter.model.vo.LeaderDepartmentVo;

import java.io.Serializable;
import java.util.List;

/** 
 * 用户会话信息
 * @Title:
 * @Description:
 * @Author:wentaoxiang
 * @Since:2016年1月19日 下午7:34:14
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public class UserSessionInfo implements Serializable {

	private static final long serialVersionUID = -3913065798686434153L;
	
	/**
	 * token
	 */
	private String token;

	/**
	 * 员工ID
	 */
	private String id;
	
	/**
	 * 员工工号
	 */
	private String no;
	
	/**
	 * 名称
	 */
	private String name ;
	
	/**
	 * 部门ID
	 */
	private String depId;
	/**
	 * 部门编码
	 */
	private String depCode;
	
	/**
	 * 部门名称
	 */
	private String depName;
	
	/**
	 * 父级部门ID
	 */
	private String parentDepId;
	/**
	 * 父级部门编码
	 */
	private String parentDepCode;
	
	/**
	 * 父级部门名称
	 */
	private String parentDepName;
	
	/**
	 * 用户手机号
	 */
	private String mobile;
	
	/**
	 * 用户固定电话
	 */
	private String phone;
	
	/**
	 * 公司ID
	 */
	private String companyId;
	/**
	 * 公司编码
	 */
	private String companyCode;
	
	/**
	 * 公司名称
	 */
	private String companyName;
	
	/**
	 * 查询薪资密码
	 */
	private String checkPassword;
	
	/**
	 * 用户头像URL
	 */
	private String userImgUrl;
	
	/**
	 * 用户职位
	 */
	private String userPost;
	
	/**
	 * 领导管理部门
	 */
	private List<LeaderDepartmentVo> leaderDeptList;

	public String getDepId() {
		return depId;
	}

	public void setDepId(String depId) {
		this.depId = depId;
	}

	public String getCompanyId() {
		return companyId;
	}

	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDepCode() {
		return depCode;
	}

	public void setDepCode(String depCode) {
		this.depCode = depCode;
	}

	public String getDepName() {
		return depName;
	}

	public void setDepName(String depName) {
		this.depName = depName;
	}

	public String getCompanyCode() {
		return companyCode;
	}

	public void setCompanyCode(String companyCode) {
		this.companyCode = companyCode;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCheckPassword() {
		return checkPassword;
	}

	public void setCheckPassword(String checkPassword) {
		this.checkPassword = checkPassword;
	}

	public String getUserImgUrl() {
		return userImgUrl;
	}

	public void setUserImgUrl(String userImgUrl) {
		this.userImgUrl = userImgUrl;
	}

	public String getUserPost() {
		return userPost;
	}

	public void setUserPost(String userPost) {
		this.userPost = userPost;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public List<LeaderDepartmentVo> getLeaderDeptList() {
		return leaderDeptList;
	}

	public void setLeaderDeptList(List<LeaderDepartmentVo> leaderDeptList) {
		this.leaderDeptList = leaderDeptList;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getParentDepId() {
		return parentDepId;
	}

	public void setParentDepId(String parentDepId) {
		this.parentDepId = parentDepId;
	}

	public String getParentDepCode() {
		return parentDepCode;
	}

	public void setParentDepCode(String parentDepCode) {
		this.parentDepCode = parentDepCode;
	}

	public String getParentDepName() {
		return parentDepName;
	}

	public void setParentDepName(String parentDepName) {
		this.parentDepName = parentDepName;
	}
	
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Override
	public String toString() {
		return "UserSessionInfo [token=" + token + ", no=" + no + ", name=" + name + ", depId=" + depId + ", depCode="
				+ depCode + ", depName=" + depName + ", mobile=" + mobile + ", companyId=" + companyId
				+ ", companyCode=" + companyCode + ", companyName=" + companyName + ", checkPassword=" + checkPassword
				+ ", userImgUrl=" + userImgUrl + ", userPost=" + userPost + ", leaderDeptList=" + leaderDeptList + "]";
	}
}
