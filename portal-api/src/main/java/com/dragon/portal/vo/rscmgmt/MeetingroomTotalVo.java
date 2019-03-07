package com.dragon.portal.vo.rscmgmt;

import java.io.Serializable;

/**
 * 会议申请统计统计 vo
 * @Title:
 * @Description:
 * @Author:xietongjian
 * @Since:2017年4月17日 上午8:52:32
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingroomTotalVo implements Serializable{
		
	private static final long serialVersionUID = 8740701630331547308L;
	
	private String id;
	/**
	 * 申请类型 0单词 1周期性
	 */
    private Integer applyType;
    /**
     * 申请时间
     */
    private String applyDay;
    /**
     * 申请时段
     */
    private String applyTime;
    /**
     * 状态
     */
    private String status; 
    /**
     * 申请人
     */
    private String applyUser;
    /**
     * 申请部门
     */ 
    private String applyDept;
    /**
     * 发起时间
     */
	private String createTime;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Integer getApplyType() {
		return applyType;
	}
	public void setApplyType(Integer applyType) {
		this.applyType = applyType;
	}
	public String getApplyDay() {
		return applyDay;
	}
	public void setApplyDay(String applyDay) {
		this.applyDay = applyDay;
	}
	public String getApplyTime() {
		return applyTime;
	}
	public void setApplyTime(String applyTime) {
		this.applyTime = applyTime;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getApplyUser() {
		return applyUser;
	}
	public void setApplyUser(String applyUser) {
		this.applyUser = applyUser;
	}
	public String getApplyDept() {
		return applyDept;
	}
	public void setApplyDept(String applyDept) {
		this.applyDept = applyDept;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	
}
