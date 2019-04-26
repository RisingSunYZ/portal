package com.dragon.portal.enm.question;

/**
 * 用户评价状态
 * @author v-luozongfang
 *
 */
public enum VisitRecordEnum {
	CANNOT_EVALUATE(0,"不能评价"),EVALUATED(1,"已评价"),PENDING_EVALUATE(2,"待评价");
	private VisitRecordEnum(Integer code, String name){
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
