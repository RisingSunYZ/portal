package com.dragon.portal.model.user;

import com.dragon.tools.common.BaseModel;

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
public class UserLogin extends BaseModel implements Serializable{

    private String id;

    private String userName;

    private String realName;

    private String userNo;

    private String email;

    private String mobile;

    private String password;

    private Date lastLoginTime;

    private Integer status;

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
}
