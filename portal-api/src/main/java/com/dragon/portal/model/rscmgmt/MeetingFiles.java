package com.dragon.portal.model.rscmgmt;

import com.dragon.tools.common.BaseModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiParam;

import java.io.Serializable;


/**
 * @Title:会议附件
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-31 16:26:15
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@ApiModel(value="meetingFiles 会议附件",description="会议附件MeetingFiles")
public class MeetingFiles extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = -1540078667507921331L;

	/**
     * ID
     */
    @ApiModelProperty(value="ID",name="ID")
    private String id;
    
    /**
     * 会议id
     */
    @ApiModelProperty(value="会议id",name="meetingId")
    private String meetingId;
    
    /**
     * 会议附件名称
     */
    @ApiModelProperty(value="会议附件名称",name="fileName")
    private String fileName;
    
    /**
     * 会议附件路劲
     */
    @ApiModelProperty(value="会议附件路劲",name="filePath")
    private String filePath;
    
    //文件用途
    @ApiModelProperty(value="文件用途",name="useType")
    private Integer useType;
    
    
    
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

	public Integer getUseType() {
		return useType;
	}

	public void setUseType(Integer useType) {
		this.useType = useType;
	}
    
}
