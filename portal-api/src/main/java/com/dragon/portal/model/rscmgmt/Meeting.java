package com.dragon.portal.model.rscmgmt;

import com.dragon.tools.common.BaseModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.util.Date;
import java.util.List;


/**
 * @Author YangZhao
 * @Description 会议管理
 * @Date 14:32 2019/3/20
 * @Param
 * @return
 **/
@ApiModel(value="meeting 会议管理",description="会议管理对象Meeting")
public class Meeting extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 2300276164297735972L;

	/**
     * ID
     */
	@ApiModelProperty(value="id",name="id")
    private String id;
    
    /**
     * 会议主题
     */
	@ApiModelProperty(value="会议主题",name="theme")
    private String theme;
    
    /**
     * 会议室ID
     */
	@ApiModelProperty(value="会议室ID",name="meetingroomId")
    private String meetingroomId;
    
    /**
     * 会议室名称
     */
	@ApiModelProperty(value="会议室名称",name="meetingroomName")
    private String meetingroomName;
    
    /**
     * 会议开始时间
     */
	@ApiModelProperty(value="会议开始时间",name="startTime")
    private Date startTime;
    
    /**
     * 会议结束时间
     */
	@ApiModelProperty(value="会议结束时间",name="endTime")
    private Date endTime;
    
    /**
     * 会议内容
     */
	@ApiModelProperty(value="会议内容",name="content")
    private String content;
    
    /**
     * 会议状态（1：待发起(草稿)；2：待召开；3：已召开；4：已取消）
     */
	@ApiModelProperty(value="会议状态",name="status")
    private Integer status;
    
    /**
     * 新建会议页面需要的参数
     */
    //必选人员工号
	@ApiModelProperty(value="新建会议页面需要的参数",name="mandatoryPersonNo")
    private String mandatoryPersonNo;
    //必选人员
	@ApiModelProperty(value="必选人员",name="mandatoryPersonName")
    private String mandatoryPersonName;
    //可选人员工号
	@ApiModelProperty(value="可选人员工号",name="optionalPersonNo")
    private String optionalPersonNo;
    //可选人员
	@ApiModelProperty(value="可选人员",name="optionalPersonName")
    private String optionalPersonName;
    //记录人员工号
	@ApiModelProperty(value="记录人员工号",name="recordPersonNo")
    private String recordPersonNo;
    //记录人员
	@ApiModelProperty(value="记录人员",name="recordPersonName")
    private String recordPersonName;
    //会议时间（只有年月日）
	@ApiModelProperty(value="会议时间(年月日）",name="meetingTime")
    private String meetingTime;
    //会议开始时间（只有时分）
	@ApiModelProperty(value="会议开始时间（只有时分）",name="start")
    private String start;
    //会议结束时间（只有时分）
	@ApiModelProperty(value="会议结束时间（只有时分）",name="end")
    private String end;
    //附件（文件名称）
	@ApiModelProperty(value="附件（文件名称）",name="fileName")
    private String fileName;
    //附件（文件路劲）
	@ApiModelProperty(value="附件（文件路劲）",name="filePath")
    private String filePath;
    //创建人所属部门
	@ApiModelProperty(value="创建人所属部门",name="creatorDept")
    private String creatorDept;
    //创建人名称
	@ApiModelProperty(value="创建人名称",name="creatorName")
    private String creatorName;
    
    //查看下的会议主题附件
	@ApiModelProperty(value="查看下的会议主题附件",name="meetingFiles")
    private List<MeetingFiles> meetingFiles;
    
    //查看下的会议纪要附件
	@ApiModelProperty(value="查看下的会议纪要附件",name="meetingSummaryFiles")
    private List<MeetingFiles> meetingSummaryFiles;
    
    //会议纪要内容
	@ApiModelProperty(value="会议纪要内容",name="summaryContent")
    private String summaryContent;

	@ApiModelProperty(value="参加会议人员工号",name="personNo")
    private String personNo;
    
    //查看下的参加会议人员
	@ApiModelProperty(value="查看下的参加会议人员",name="personList")
    private String personList;
    
    //查询条件字段
	@ApiModelProperty(value="查询条件字段",name="search")
    private String search;
    
    //页面显示的距离开会时间
	@ApiModelProperty(value="页面显示的距离开会时间",name="time_difference")
    private String time_difference;
    
    //当前登录用户工号（用于页面判断是否需要答复）
	@ApiModelProperty(value="当前登录用户工号",name="userNo")
    private String userNo;
    
    //答复条数
	@ApiModelProperty(value="答复条数",name="count")
    private long count;
    //答复数据
	@ApiModelProperty(value="答复数据",name="replyList")
    private List<com.dragon.portal.model.rscmgmt.MeetingReply> replyList ;
    //必选人员列表
	@ApiModelProperty(value="必选人员列表",name="mandatoryPersonList")
    private List<com.dragon.portal.model.rscmgmt.MeetingPersonnel> mandatoryPersonList;
    //可选人员列表
	@ApiModelProperty(value="可选人员列表",name="optionalPersonList")
    private List<com.dragon.portal.model.rscmgmt.MeetingPersonnel> optionalPersonList;
    
    /**
     * exchange会议发送参数
     */
	@ApiModelProperty(value="exchange会议发送参数",name="changeKey")
    private String changeKey;
	@ApiModelProperty(value="exchange会议发送id",name="changeId")
    private String changeId;
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getTheme() {
        return theme;
    }
    
    public void setTheme(String theme) {
        this.theme = theme;
    }
    public String getMeetingroomId() {
        return meetingroomId;
    }
    
    public void setMeetingroomId(String meetingroomId) {
        this.meetingroomId = meetingroomId;
    }
    public String getMeetingroomName() {
        return meetingroomName;
    }
    
    public void setMeetingroomName(String meetingroomName) {
        this.meetingroomName = meetingroomName;
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
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }

	public String getMandatoryPersonNo() {
		return mandatoryPersonNo;
	}

	public void setMandatoryPersonNo(String mandatoryPersonNo) {
		this.mandatoryPersonNo = mandatoryPersonNo;
	}

	public String getMandatoryPersonName() {
		return mandatoryPersonName;
	}

	public void setMandatoryPersonName(String mandatoryPersonName) {
		this.mandatoryPersonName = mandatoryPersonName;
	}

	public String getOptionalPersonNo() {
		return optionalPersonNo;
	}

	public void setOptionalPersonNo(String optionalPersonNo) {
		this.optionalPersonNo = optionalPersonNo;
	}

	public String getOptionalPersonName() {
		return optionalPersonName;
	}

	public void setOptionalPersonName(String optionalPersonName) {
		this.optionalPersonName = optionalPersonName;
	}

	public String getRecordPersonNo() {
		return recordPersonNo;
	}

	public void setRecordPersonNo(String recordPersonNo) {
		this.recordPersonNo = recordPersonNo;
	}

	public String getRecordPersonName() {
		return recordPersonName;
	}

	public void setRecordPersonName(String recordPersonName) {
		this.recordPersonName = recordPersonName;
	}

	public String getMeetingTime() {
		return meetingTime;
	}

	public void setMeetingTime(String meetingTime) {
		this.meetingTime = meetingTime;
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

	public String getCreatorDept() {
		return creatorDept;
	}

	public void setCreatorDept(String creatorDept) {
		this.creatorDept = creatorDept;
	}

	public String getCreatorName() {
		return creatorName;
	}

	public void setCreatorName(String creatorName) {
		this.creatorName = creatorName;
	}

	public List<com.dragon.portal.model.rscmgmt.MeetingFiles> getMeetingFiles() {
		return meetingFiles;
	}

	public void setMeetingFiles(List<com.dragon.portal.model.rscmgmt.MeetingFiles> meetingFiles) {
		this.meetingFiles = meetingFiles;
	}

	public String getPersonNo() {
		return personNo;
	}

	public void setPersonNo(String personNo) {
		this.personNo = personNo;
	}

	public String getPersonList() {
		return personList;
	}

	public void setPersonList(String personList) {
		this.personList = personList;
	}

	public String getSearch() {
		return search;
	}

	public void setSearch(String search) {
		this.search = search;
	}

	public String getTime_difference() {
		return time_difference;
	}

	public void setTime_difference(String time_difference) {
		this.time_difference = time_difference;
	}

	public String getUserNo() {
		return userNo;
	}

	public void setUserNo(String userNo) {
		this.userNo = userNo;
	}

	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}

	public List<com.dragon.portal.model.rscmgmt.MeetingReply> getReplyList() {
		return replyList;
	}

	public void setReplyList(List<com.dragon.portal.model.rscmgmt.MeetingReply> replyList) {
		this.replyList = replyList;
	}

	public List<com.dragon.portal.model.rscmgmt.MeetingFiles> getMeetingSummaryFiles() {
		return meetingSummaryFiles;
	}

	public void setMeetingSummaryFiles(List<com.dragon.portal.model.rscmgmt.MeetingFiles> meetingSummaryFiles) {
		this.meetingSummaryFiles = meetingSummaryFiles;
	}

	public List<com.dragon.portal.model.rscmgmt.MeetingPersonnel> getMandatoryPersonList() {
		return mandatoryPersonList;
	}

	public void setMandatoryPersonList(List<com.dragon.portal.model.rscmgmt.MeetingPersonnel> mandatoryPersonList) {
		this.mandatoryPersonList = mandatoryPersonList;
	}

	public List<com.dragon.portal.model.rscmgmt.MeetingPersonnel> getOptionalPersonList() {
		return optionalPersonList;
	}

	public void setOptionalPersonList(List<com.dragon.portal.model.rscmgmt.MeetingPersonnel> optionalPersonList) {
		this.optionalPersonList = optionalPersonList;
	}

	public String getSummaryContent() {
		return summaryContent;
	}

	public void setSummaryContent(String summaryContent) {
		this.summaryContent = summaryContent;
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
	
}
