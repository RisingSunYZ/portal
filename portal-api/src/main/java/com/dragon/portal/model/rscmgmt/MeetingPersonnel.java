package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import com.dragon.tools.common.BaseModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Title:会议参与人员
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-31 16:27:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@ApiModel(value="MeetingPersonnel 会议参与人员",description = "MeetingPersonnel 会议参与人员")
public class MeetingPersonnel extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 5195197961602401837L;

	/**
     * ID
     */
    private String id;
    
    /**
     * 会议id
     */
    @ApiModelProperty(value="会议id",name="meetingId")
    private String meetingId;
    
    /**
     * 参加会议人员工号
     */
    @ApiModelProperty(value="参加会议人员工号",name="personNo")
    private String personNo;
    
    /**
     * 参加会议人员姓名
     */
    @ApiModelProperty(value="参加会议人员姓名",name="personName")
    private String personName;
    
    /**
     * 人员分类（1：必选人员；2可选人员；3：记录人员）
     */
    @ApiModelProperty(value="人员分类（1：必选人员；2可选人员；3：记录人员）",name="personType")
    private Integer personType;

    @ApiModelProperty(value="编号",name="no")
    private String no;

    @ApiModelProperty(value="名称",name="name")
    private String name;
    
    
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
    public String getPersonNo() {
        return personNo;
    }
    
    public void setPersonNo(String personNo) {
        this.personNo = personNo;
    }
    public String getPersonName() {
        return personName;
    }
    
    public void setPersonName(String personName) {
        this.personName = personName;
    }
    public Integer getPersonType() {
        return personType;
    }
    
    public void setPersonType(Integer personType) {
        this.personType = personType;
    }

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
    
}
