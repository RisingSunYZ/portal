package com.dragon.portal.vo.process;

/**
 * 转阅对象
 */
public class TurnReadVo extends BaseProcessVo{
    /**
     * 被转阅人员工号
     */
    private String userCodes;
    /**
     * 被转阅人员姓名
     */
    private String userNames;
    /**
     * 转阅说明
     */
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserCodes() {
        return userCodes;
    }

    public void setUserCodes(String userCodes) {
        this.userCodes = userCodes;
    }

    public String getUserNames() {
        return userNames;
    }

    public void setUserNames(String userNames) {
        this.userNames = userNames;
    }
}
