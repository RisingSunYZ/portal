package com.dragon.portal.enm.process;

/**
 * 常量
 * @Title:
 * @Description:
 * @Since:2016年12月7日 上午10:59:39
 * @Version:1.1.0
 */
public enum LaunchStyleEnum {

	/** 流程发起方式 */
	DEFAULT(1, "默认普通模式")
	,BIZ(2, "宽屏模式")
	,BIZ_CUST(3, "宽屏模式-自定义形式")
	;

	private Integer style;
	private String name;


	LaunchStyleEnum(Integer style, String name){
		this.style = style;
		this.name = name;
	}
	
	public String getName() {
		return name;
	}
	public Integer getStyle() {
		return style;
	}


}



	