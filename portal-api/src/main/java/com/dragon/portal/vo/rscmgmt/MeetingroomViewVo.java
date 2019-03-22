package com.dragon.portal.vo.rscmgmt;

import com.dragon.portal.model.rscmgmt.MeetingroomApprover;
import com.dragon.portal.model.rscmgmt.MeetingroomTools;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.util.List;

/**
 * @Author YangZhao
 * @Description 会议室前台展示列表
 * @Date 14:32 2019/3/20
 * @Param
 * @return
 **/
@ApiModel(value="会议室前台展示列表",description="会议室前台展示列表")
public class MeetingroomViewVo implements Serializable{
	
	/**
	 *
	 */
	private static final long serialVersionUID = -6889601769917827766L;

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
     * 会议室图片
     */
	@ApiModelProperty(value="会议室图片",name="roomImg")
    private String roomImg;
    
    /**
     * 允许时期性申请
     */
	@ApiModelProperty(value="允许时期性申请",name="isCyclicity")
    private Integer isCyclicity;
    
    /**
     * 是否需要审批
     */
	@ApiModelProperty(value="是否需要审批",name="needApproval")
    private Integer needApproval;
    
    /**
     * 排序号
     */
	@ApiModelProperty(value="排序号",name="sortNo")
    private Integer sortNo;
    
    /**
     * 会议室状态（1：启用；0：停用）
     */
	@ApiModelProperty(value="会议室状态（1：启用；0：停用）",name="status")
    private Integer status;
    
    /**
     * 会议室地点ID
     */
	@ApiModelProperty(value="会议室地点ID",name="meetingroomAddrId")
    private String meetingroomAddrId;
    
    /**
     * 会议室地点名称
     */
	@ApiModelProperty(value="会议室地点名称",name="meetingroomAddrName")
    private String meetingroomAddrName;
    
    /**
     * 楼层
     */
	@ApiModelProperty(value="楼层",name="floorNum")
    private String floorNum;
    
    /**
     * 可容纳人数
     */
	@ApiModelProperty(value="可容纳人数",name="personNum")
    private Integer personNum;
    
    /**
     * 配置选项
     */
	@ApiModelProperty(value="配置选项",name="tools")
    private List<MeetingroomTools> tools;
    
    /**
     * 会议室申请记录
     */
	@ApiModelProperty(value="会议室申请记录",name="applyVos")
    private List<MeetingroomApplyViewVo> applyVos;
    
    /**
     * 可容纳人数最小值
     */
	@ApiModelProperty(value="可容纳人数最小值",name="personNumMin")
    private Integer personNumMin;
    
    /**
     * 可容纳人数最大值
     */
	@ApiModelProperty(value="可容纳人数最大值",name="personNumMax")
    private Integer personNumMax;

    /**
     * 会议室配置选项
     */
	@ApiModelProperty(value="会议室配置选项",name="confTools")
    private List<String> confTools;
    
    /**
     * 以逗号分隔的会议室配置项ID字符串
     */
	@ApiModelProperty(value="以逗号分隔的会议室配置项ID字符串",name="confToolsStr")
    private String confToolsStr;
        
    /**
     * 开始日期
     */
	@ApiModelProperty(value="开始日期",name="startDateStr")
    private String startDateStr;
    /**
     * 结束日期
     */
	@ApiModelProperty(value="结束日期",name="endDateStr")
    private String endDateStr;

    /**
     * 1有部门范围限制  0无部门范围限制
     */
	@ApiModelProperty(value="1有部门范围限制  0无部门范围限制",name="isOpenRange")
    private Integer isOpenRange;
    /**
     * 员工 部门id 集合
     */
	@ApiModelProperty(value="员工 部门id 集合",name="rangeDeftId")
    private List<String> rangeDeftId;
    /**
     * 是否是超级管理员
     */
	@ApiModelProperty(value="是否是超级管理员",name="isAdmin")
    private Integer isAdmin;
    /**
     * 管理员No
     */
	@ApiModelProperty(value="管理员No",name="adminNo")
    private String adminNo;
    /**
     * 审批人
     */
	@ApiModelProperty(value="审批人",name="approver")
    private List<MeetingroomApprover> approver;
    
	
	public List<MeetingroomApprover> getApprover() {
		return approver;
	}
	public void setApprover(List<MeetingroomApprover> approver) {
		this.approver = approver;
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
	public String getMeetingroomAddrId() {
		return meetingroomAddrId;
	}
	public void setMeetingroomAddrId(String meetingroomAddrId) {
		this.meetingroomAddrId = meetingroomAddrId;
	}
	public String getMeetingroomAddrName() {
		return meetingroomAddrName;
	}
	public void setMeetingroomAddrName(String meetingroomAddrName) {
		this.meetingroomAddrName = meetingroomAddrName;
	}
	public String getFloorNum() {
		return floorNum;
	}
	public void setFloorNum(String floorNum) {
		this.floorNum = floorNum;
	}
	public Integer getPersonNum() {
		return personNum;
	}
	public void setPersonNum(Integer personNum) {
		this.personNum = personNum;
	}
	public List<MeetingroomTools> getTools() {
		return tools;
	}
	public void setTools(List<MeetingroomTools> tools) {
		this.tools = tools;
	}
	public List<MeetingroomApplyViewVo> getApplyVos() {
		return applyVos;
	}
	public void setApplyVos(List<MeetingroomApplyViewVo> applyVos) {
		this.applyVos = applyVos;
	}
	public Integer getPersonNumMin() {
		return personNumMin;
	}
	public void setPersonNumMin(Integer personNumMin) {
		this.personNumMin = personNumMin;
	}
	public Integer getPersonNumMax() {
		return personNumMax;
	}
	public void setPersonNumMax(Integer personNumMax) {
		this.personNumMax = personNumMax;
	}
	public List<String> getConfTools() {
		return confTools;
	}
	public void setConfTools(List<String> confTools) {
		this.confTools = confTools;
	}
	public String getStartDateStr() {
		return startDateStr;
	}
	public void setStartDateStr(String startDateStr) {
		this.startDateStr = startDateStr;
	}
	public String getEndDateStr() {
		return endDateStr;
	}
	public void setEndDateStr(String endDateStr) {
		this.endDateStr = endDateStr;
	}
	public String getRoomImg() {
		return roomImg;
	}
	public void setRoomImg(String roomImg) {
		this.roomImg = roomImg;
	}
	public Integer getIsCyclicity() {
		return isCyclicity;
	}
	public void setIsCyclicity(Integer isCyclicity) {
		this.isCyclicity = isCyclicity;
	}
	public Integer getNeedApproval() {
		return needApproval;
	}
	public void setNeedApproval(Integer needApproval) {
		this.needApproval = needApproval;
	}
	public Integer getSortNo() {
		return sortNo;
	}
	public void setSortNo(Integer sortNo) {
		this.sortNo = sortNo;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Integer getIsOpenRange() {
		return isOpenRange;
	}
	public void setIsOpenRange(Integer isOpenRange) {
		this.isOpenRange = isOpenRange;
	}
	public List<String> getRangeDeftId() {
		return rangeDeftId;
	}
	public void setRangeDeftId(List<String> rangeDeftId) {
		this.rangeDeftId = rangeDeftId;
	}
	public Integer getIsAdmin() {
		return isAdmin;
	}
	public void setIsAdmin(Integer isAdmin) {
		this.isAdmin = isAdmin;
	}
	public String getAdminNo() {
		return adminNo;
	}
	public void setAdminNo(String adminNo) {
		this.adminNo = adminNo;
	}
	public String getConfToolsStr() {
		return confToolsStr;
	}
	public void setConfToolsStr(String confToolsStr) {
		this.confToolsStr = confToolsStr;
	}
	
	
	
}
