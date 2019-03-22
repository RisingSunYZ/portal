package com.dragon.portal.model.schedule;


import com.dragon.tools.common.BaseModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

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
@ApiModel(value="日程事件 ScheduleEvent",description="日程事件 ScheduleEvent")
public class ScheduleEvent extends BaseModel implements Serializable{
    
    /**
     * 主键
     */
    private String id;
    
    /**
     * 标题
     */
    @ApiModelProperty(value="标题",name="title")
    private String title;
    
    /**
     * 地址
     */
    @ApiModelProperty(value="地址",name="address")
    private String address;
    
    /**
     * 内容
     */
    @ApiModelProperty(value="内容",name="content")
    private String content;
    
    /**
     * 类型（1：事件；2：会议）
     */
    @ApiModelProperty(value="类型（1：事件；2：会议）",name="type")
    private Integer type;
    
    /**
     * 是否为全天事项（1：是全天；0：不是全天）
     */
    @ApiModelProperty(value="是否为全天事项（1：是全天；0：不是全天）",name="isAllDay")
    private Integer isAllDay;
    
    /**
     * 开始时间
     */
    @ApiModelProperty(value="开始时间",name="startTime")
    private Date startTime;
    
    /**
     * 结束时间
     */
    @ApiModelProperty(value="结束时间",name="endTime")
    private Date endTime;
    
    /**
     * exchangeKey
     */
    @ApiModelProperty(value="exchangeKey",name="changeKey")
    private String changeKey;
    
    /**
     * exchangeId
     */
    @ApiModelProperty(value="exchangeId",name="changeId")
    private String changeId;
    
    /**
     * 日程接收人工号
     */
    @ApiModelProperty(value="日程接收人工号",name="receiveNo")
    private String receiveNo;
    
    /**
     * 会议id
     */
    @ApiModelProperty(value="会议id",name="meetingId")
    private String meetingId;
    
    //本地查询日程的时间
    @ApiModelProperty(value="本地查询日程的时间",name="start")
    private String start;
    @ApiModelProperty(value="本地查询日程的时间",name="end")
    private String end;
    
    //exchange查询日程的时间
    @ApiModelProperty(value="exchange查询日程的时间",name="oldStart")
    private Date oldStart;
    @ApiModelProperty(value="exchange查询日程的时间",name="oldEnd")
    private Date oldEnd;

    @ApiModelProperty(value="邮件",name="email")
    private String email;

    @ApiModelProperty(value="用户编号",name="userNo")
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
