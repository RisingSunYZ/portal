package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.apache.commons.lang.StringUtils;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议答复
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-12 11:55:16
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@ApiModel(value="MeetingReply 会议答复",description = "MeetingReply 会议答复")
public class MeetingReply extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 249479118970507489L;

	/**
     * id
     */
    private String id;
    
    /**
     * 会议ID
     */
    @ApiModelProperty(value="会议id",name="meetingId")
    private String meetingId;
    
    /**
     * 答复状态（1：参加；2：不参考；3：待定）
     */
    @ApiModelProperty(value="答复状态（1：参加；2：不参考；3：待定）",name="replyStatus")
    private Integer replyStatus;
    
    /**
     * 答复内容
     */
    @ApiModelProperty(value="答复内容",name="content")
    private String content;
    
    //回执人名称
    @ApiModelProperty(value="回执人名称",name="replyName")
    private String replyName;
    
    //回执时间格式化
    @ApiModelProperty(value="回执时间格式化",name="updateTimeStr")
    private String updateTimeStr;
    
    //回复状态
    @ApiModelProperty(value="回复状态",name="replyStatusStr")
    private String replyStatusStr;
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getMeetingId() {
        return meetingId;
    }
    
    public void setMeetingId(String meetingId) {
        this.meetingId = meetingId;
    }
    public Integer getReplyStatus() {
        return replyStatus;
    }
    
    public void setReplyStatus(Integer replyStatus) {
        this.replyStatus = replyStatus;
    }
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }

	public String getUpdateTimeStr() {
		return updateTimeStr;
	}
	public void setUpdateTimeStr(String updateTimeStr) {
		this.updateTimeStr = updateTimeStr;
	}

	public String getReplyName() {
		return replyName;
	}

	public void setReplyName(String replyName) {
		this.replyName = replyName;
	}
	public String getReplyStatusStr() {
		String Str="";
		if(this.replyStatus == 1){
			Str = "参加";
		}else if(this.replyStatus == 2){
			Str = "不参加";
		}else if(this.replyStatus == 3){
			Str = "待定";
		}
		return Str;
	}
	public void setReplyStatusStr(String replyStatusStr) {
		this.replyStatusStr = replyStatusStr;
	}
}
