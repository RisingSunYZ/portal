package com.dragon.portal.enm.metting;

/**
 * 
 * 会议状态
 * @Description:
 * @Author:骆宗访
 * @Since:2017年4月1日 下午2:16:32
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public enum MeetingStatusEnum {
	MY_DRAFT(1,"草稿"),PENDIND(2,"待召开"),ALREADY_HELD(3,"已召开"),CANCEL(4,"已取消");
	
	private MeetingStatusEnum(Integer code,String name){
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
