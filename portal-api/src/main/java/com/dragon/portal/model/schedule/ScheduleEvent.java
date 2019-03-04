package com.dragon.portal.model.schedule;


import com.dragon.tools.common.BaseModel;

import java.io.Serializable;
import java.util.Date;

/**
 * @Title:日程事件
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-23 10:28:50
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class ScheduleEvent extends BaseModel implements Serializable{
    
    /**
     * 主键
     */
    private String id;
    
    /**
     * 标题
     */
    private String title;
    
    /**
     * 地址
     */
    private String address;
    
    /**
     * 内容
     */
    private String content;
    
    /**
     * 类型（1：事件；2：会议）
     */
    private Integer type;
    
    /**
     * 是否为全天事项（1：是全天；0：不是全天）
     */
    private Integer isAllDay;
    
    /**
     * 开始时间
     */
    private Date startTime;
    
    /**
     * 结束时间
     */
    private Date endTime;
    
    /**
     * exchangeKey
     */
    private String changeKey;
    
    /**
     * exchangeId
     */
    private String changeId;
    
    /**
     * 日程接收人工号
     */
    private String receiveNo;
    
    /**
     * 会议id
     */
    private String meetingId;
    
    //本地查询日程的时间
    private String start;
    private String end;
    
    //exchange查询日程的时间
    private Date oldStart;
    private Date oldEnd;
    
    private String email;
    
    private String userNo;
    
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
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    public Integer getType() {
        return type;
    }
    
    public void setType(Integer type) {
        this.type = type;
    }
    public Integer getIsAllDay() {
        return isAllDay;
    }
    
    public void setIsAllDay(Integer isAllDay) {
        this.isAllDay = isAllDay;
    }
    public Date getStartTime() {
        return startTime;
    }
    
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }
    public Date getEndTime() {
        return endTime;
    }
    
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }
    public String getChangeKey() {
        return changeKey;
    }
    
    public void setChangeKey(String changeKey) {
        this.changeKey = changeKey;
    }
    public String getChangeId() {
        return changeId;
    }
    
    public void setChangeId(String changeId) {
        this.changeId = changeId;
    }
    public String getReceiveNo() {
        return receiveNo;
    }
    
    public void setReceiveNo(String receiveNo) {
        this.receiveNo = receiveNo;
    }

	public Date getOldStart() {
		return oldStart;
	}

	public void setOldStart(Date oldStart) {
		this.oldStart = oldStart;
	}

	public Date getOldEnd() {
		return oldEnd;
	}

	public void setOldEnd(Date oldEnd) {
		this.oldEnd = oldEnd;
	}

	public String getStart() {
		return start;
	}

	public void setStart(String start) {
		this.start = start;
	}

	public String getEnd() {
		return end;
	}

	public void setEnd(String end) {
		this.end = end;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMeetingId() {
		return meetingId;
	}

	public void setMeetingId(String meetingId) {
		this.meetingId = meetingId;
	}

	public String getUserNo() {
		return userNo;
	}
	public void setUserNo(String userNo) {
		this.userNo = userNo;
	}
}
