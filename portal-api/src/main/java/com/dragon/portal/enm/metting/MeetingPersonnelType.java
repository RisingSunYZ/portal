package com.dragon.portal.enm.metting;

/**
 * 
 * 会议人员类型
 * @Description:
 * @Author:骆宗访
 * @Since:2017年4月10日 上午9:36:32
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public enum MeetingPersonnelType {
	MANDATORY(1,"必选人员"),OPTIONAL(2,"可选人员"),RECORD(3,"记录人员");
	
	private MeetingPersonnelType(Integer code,String name){
		this.name=name;
		this.code= code;
	}
	private Integer code;
	private String name;
	public Integer getCode() {
		return code;
	}
	public void setCode(Integer code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
