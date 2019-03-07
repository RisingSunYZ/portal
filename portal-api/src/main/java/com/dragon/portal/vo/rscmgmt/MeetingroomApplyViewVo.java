package com.dragon.portal.vo.rscmgmt;

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
public class MeetingroomApplyViewVo implements Serializable{
	
	/**
	 *
	 */
	private static final long serialVersionUID = -457052124385934419L;

	/**
	 * 申请日期
	 */
	private String applyDateStr;
	
	/**
	 * 申请星期几
	 */
	private String weekDay;
	
	/**
	 * 申请项
	 */
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
