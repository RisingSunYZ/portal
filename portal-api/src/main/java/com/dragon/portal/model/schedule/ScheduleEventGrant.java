package com.dragon.portal.model.schedule;

import com.dragon.tools.common.BaseModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.io.Serializable;
import java.util.List;

/**
 * @Title:日程事件授权
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-23 10:51:11
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@ApiModel(value="日程事件授权 ScheduleEventGrant",description="日程事件授权 ScheduleEventGrant")
public class ScheduleEventGrant extends BaseModel implements Serializable{
    
    /**
     * 主键
     */
	@ApiModelProperty(value="id",name="id")
    private String id;
    
    /**
     * 授权用户工号
     */
	@ApiModelProperty(value="授权用户工号",name="grantPersonNo")
    private String grantPersonNo;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;

		if (!(o instanceof ScheduleEventGrant)) return false;

		ScheduleEventGrant that = (ScheduleEventGrant) o;

		return new EqualsBuilder()
				.append(getId(), that.getId())
				.isEquals();
	}

	@Override
	public int hashCode() {
		return new HashCodeBuilder(17, 37)
				.append(getId())
				.toHashCode();
	}

	/**
     * 授权用户名称
     */
	@ApiModelProperty(value="授权用户名称",name="grantPersonName")
    private String grantPersonName;
    
    /**
     * 被授权用户工号
     */
	@ApiModelProperty(value="被授权用户工号",name="grantedPersonNo")
    private String grantedPersonNo;
   
    
    /**
     * 被授权用户名称
     */
	@ApiModelProperty(value="被授权用户名称",name="grantedPersonName")
    private String grantedPersonName;
    
    /**
     * 授权类型（0：只读；1：编辑）
     */
	@ApiModelProperty(value="授权类型（0：只读；1：编辑）",name="grantType")
    private Integer grantType;
    
    //页面传递过来的对应授权类型
	@ApiModelProperty(value="页面传递过来的对应授权类型",name="autoType")
    private String autoType;
    
    //页面授权类型显示
	@ApiModelProperty(value="页面授权类型显示",name="grantTypeStr")
    private String grantTypeStr;
    
    //当前用户工号和名称
	@ApiModelProperty(value="当前用户工号",name="no")
    private String no;
	@ApiModelProperty(value="当前用户名称",name="name")
    private String name;
    
    //需要添加的日程授权权限
	@ApiModelProperty(value="需要添加的日程授权权限",name="scheduleEventGrantsNew")
    private List<ScheduleEventGrant> scheduleEventGrantsNew;
    //需要修改的日程授权权限
	@ApiModelProperty(value="需要修改的日程授权权限",name="scheduleEventGrantsEdit")
    private List<ScheduleEventGrant> scheduleEventGrantsEdit;
    

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getGrantPersonNo() {
		return grantPersonNo;
	}

	public void setGrantPersonNo(String grantPersonNo) {
		this.grantPersonNo = grantPersonNo;
	}

	public String getGrantPersonName() {
		return grantPersonName;
	}

	public void setGrantPersonName(String grantPersonName) {
		this.grantPersonName = grantPersonName;
	}

	public String getGrantedPersonNo() {
		return grantedPersonNo;
	}

	public void setGrantedPersonNo(String grantedPersonNo) {
		this.grantedPersonNo = grantedPersonNo;
	}

	public String getGrantedPersonName() {
		return grantedPersonName;
	}

	public void setGrantedPersonName(String grantedPersonName) {
		this.grantedPersonName = grantedPersonName;
	}

	public Integer getGrantType() {
		return grantType;
	}

	public void setGrantType(Integer grantType) {
		this.grantType = grantType;
	}

	public String getAutoType() {
		return autoType;
	}

	public void setAutoType(String autoType) {
		this.autoType = autoType;
	}

	public String getGrantTypeStr() {
		return grantTypeStr;
	}

	public void setGrantTypeStr(String grantTypeStr) {
		this.grantTypeStr = grantTypeStr;
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

	public List<ScheduleEventGrant> getScheduleEventGrantsNew() {
		return scheduleEventGrantsNew;
	}

	public void setScheduleEventGrantsNew(List<ScheduleEventGrant> scheduleEventGrantsNew) {
		this.scheduleEventGrantsNew = scheduleEventGrantsNew;
	}

	public List<ScheduleEventGrant> getScheduleEventGrantsEdit() {
		return scheduleEventGrantsEdit;
	}

	public void setScheduleEventGrantsEdit(List<ScheduleEventGrant> scheduleEventGrantsEdit) {
		this.scheduleEventGrantsEdit = scheduleEventGrantsEdit;
	}
    
}
