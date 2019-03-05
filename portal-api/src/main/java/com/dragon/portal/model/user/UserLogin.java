package com.dragon.portal.model.user;

import com.dragon.tools.common.BaseModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.util.Date;

/**
 * 用户登录
 * @Description:
 * @author: xietongjian
 * @Since: 2019/2/21 09:12
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 亚厦股份有限公司 2018 ~ 2020 版权所有
 */
@ApiModel(value="用户登录 UserLogin",description="用户登录UserLogin")
public class UserLogin extends BaseModel implements Serializable{

    private String id;
    @ApiModelProperty(value="用户名",name="userName")
    private String userName;
    @ApiModelProperty(value="真实姓名",name="realName")
    private String realName;
    @ApiModelProperty(value="工号",name="userNo")
    private String userNo;
    @ApiModelProperty(value="邮箱",name="email")
    private String email;
    @ApiModelProperty(value="手机号",name="mobile")
    private String mobile;
    @ApiModelProperty(value="密码",name="password")
    private String password;
    @ApiModelProperty(value="上次登录时间",name="lastLoginTime")
    private Date lastLoginTime;
    @ApiModelProperty(value="状态",name="status")
    private Integer status;

    @ApiModelProperty(value="原登录密码",name="oldPassword")
    private String oldPassword;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getUserNo() {
        return userNo;
    }

    public void setUserNo(String userNo) {
        this.userNo = userNo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(Date lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }
}
