package com.dragon.portal.vo.rscmgmt;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.util.List;

/**
 * 会议室申请Vo
 * @Title:
 * @Description:
 * @Author:xietongjian
 * @Since:2017年4月17日 上午8:52:32
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@ApiModel(value="会议室申请Vo",description="会议室申请Vo")
public class MeetingroomApplyViewVo implements Serializable{
	
	/**
	 *
	 */
	private static final long serialVersionUID = -457052124385934419L;

	/**
	 * 申请日期
	 */
	@ApiModelProperty(value="申请日期",name="applyDateStr")
	private String applyDateStr;
	
	/**
	 * 申请星期几
	 */
	@ApiModelProperty(value="申请星期几",name="weekDay")
	private String weekDay;
	
	/**
	 * 申请项
	 */
	@ApiModelProperty(value="申请项",name="applyItemVo")
	private List<MeetingroomApplyItemViewVo> applyItemVo;

	public String getApplyDateStr() {
		return applyDateStr;
	}

	public void setApplyDateStr(String applyDateStr) {
		this.applyDateStr = applyDateStr;
	}

	public String getWeekDay() {
		return weekDay;
	}

	public void setWeekDay(String weekDay) {
		this.weekDay = weekDay;
	}

	public List<MeetingroomApplyItemViewVo> getApplyItemVo() {
		return applyItemVo;
	}

	public void setApplyItemVo(List<MeetingroomApplyItemViewVo> applyItemVo) {
		this.applyItemVo = applyItemVo;
	}
    
	
}
