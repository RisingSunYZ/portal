package com.dragon.portal.enm.metting;
/**
 * 
 * @Title:会议申请状态
 * @Description:
 * @Author:v-zhaohaishan
 * @Since:2017年4月19日 上午9:42:04
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public enum MeetingApplyStatusEnum {
	WAIT_APPROVE(0, "待审核"), APPROVE(1, "通过"), NO_APPROVE(2, "不通过"), EXPIRE(3, "过期未处理"),
	CANCEL(4, "已取消"), REVOKE(5, "撤回"), REJCET(6, "驳回"), END(7, "终止");
	
	private MeetingApplyStatusEnum(Integer code, String name){
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
	
	public static MeetingApplyStatusEnum getEnumByCode(Integer code) {
		for (MeetingApplyStatusEnum enm : MeetingApplyStatusEnum.values()) {
			if (enm.getCode().intValue() == code.intValue()) {
				return enm;
			}
		}
		return null;
	}
	
	
}
