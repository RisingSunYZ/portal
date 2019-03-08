package com.dragon.portal.enm.question;

/**
 * 问题反馈状态
 * @author v-luozongfang
 *
 */
public enum QuestionStatusEnum {
    TORECEIVE(0,"待接收"),HANDEL(1,"处理中"),REVOKE(2,"已撤销"),COMPLETED(3,"已完成");
	private QuestionStatusEnum(Integer code,String name){
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
