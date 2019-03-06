package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议纪要
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-12 11:56:24
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingSummary extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 2839654926281966379L;

	/**
     * id
     */
    private String id;
    
    /**
     * 会议ID
     */
    private String meetingId;
    
    /**
     * 纪要内容
     */
    private String content;
    
    //附件（文件名称）
    private String fileName;
    //附件（文件路劲）
    private String filePath;
    
    
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
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
    
}
