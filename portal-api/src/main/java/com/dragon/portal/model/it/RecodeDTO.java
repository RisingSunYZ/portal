package com.dragon.portal.model.it;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Title:问题案例表
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-04 13:54:29
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@ApiModel(value="评价信息 RecodeDTO",description="评价信息 RecodeDTO")
public class RecodeDTO{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 6608794289532952153L;
	/**
	 * 事件id
	 */
	@ApiModelProperty(value="事件id",name="eventId")
	private String eventId;
	/**
	 * 回访意见
	 */
	@ApiModelProperty(value="回访意见",name="remark")
	private String remark;
	/**
	 * 响应速度
	 */
	@ApiModelProperty(value="响应速度",name="respondSpeed")
	private Integer respondSpeed;

	/**
	 * 服务速度
	 */
	@ApiModelProperty(value="服务速度",name="solveSpeed")
	private Integer solveSpeed;
	/**
	 * 服务态度
	 */
	@ApiModelProperty(value="服务态度",name="serviceAttitude")
	private Integer serviceAttitude;
	
	/**
	 * get,set
	 */
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Integer getRespondSpeed() {
		return respondSpeed;
	}
	public void setRespondSpeed(Integer respondSpeed) {
		this.respondSpeed = respondSpeed;
	}
	public Integer getSolveSpeed() {
		return solveSpeed;
	}
	public void setSolveSpeed(Integer solveSpeed) {
		this.solveSpeed = solveSpeed;
	}
	public Integer getServiceAttitude() {
		return serviceAttitude;
	}
	public void setServiceAttitude(Integer serviceAttitude) {
		this.serviceAttitude = serviceAttitude;
	}
	public String getEventId() {
		return eventId;
	}
	public void setEventId(String eventId) {
		this.eventId = eventId;
	}
}
