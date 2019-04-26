package com.dragon.portal.enm.process;

/**
 * 
 * @Title:
 * @Description:审批意见类型
 * @Author:cenwei
 * @Since:2017年4月12日 下午4:26:55
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public enum OptionEnum {

	TY("TY","同意"),
	BTY("BTY","不同意"),
	ZC("ZC","暂存");
	
	private OptionEnum(String code, String name){
		this.name=name;
		this.code = code;
	}
	private String name;
	private String code;

	public String getName() {
		return name;
	}
	public String getCode() {
		return code;
	}
	
	public static OptionEnum getEnumByCode(Integer code) {
		for (OptionEnum enm : OptionEnum.values()) {
			if (enm.getCode().equals(code)) {
				return enm;
			}
		}
		return null;
	}
}
