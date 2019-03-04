package com.dragon.portal.vo.process;

import java.io.Serializable;

public class RevokeVo extends BaseProcessVo implements Serializable {
    /**
     * 撤销人工号
     */
    private String userNo;
    /**
     * 驳回原因
     */
    private String message;
    /**
     * 节点id
     */
    private String activityId;
    /**
     * 节点名称
     */
    private String activityName;
    /**
     * 代办人名称
     */
    private String assigneeName;

    public String getUserNo() {
        return userNo;
    }

    public void setUserNo(String userNo) {
        this.userNo = userNo;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getActivityId() {
        return activityId;
    }

    public void setActivityId(String activityId) {
        this.activityId = activityId;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getAssigneeName() {
        return assigneeName;
    }

    public void setAssigneeName(String assigneeName) {
        this.assigneeName = assigneeName;
    }
}
