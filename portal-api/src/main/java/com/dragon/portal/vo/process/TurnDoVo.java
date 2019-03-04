package com.dragon.portal.vo.process;

/**
 * 转办对象
 */
public class TurnDoVo extends BaseProcessVo{
    /**
     * 被转办人员工号
     */
    private String userId;
    /**
     * 被转办人员姓名
     */
    private String userName;
    /**
     * 转办说明
     */
    private String message;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
