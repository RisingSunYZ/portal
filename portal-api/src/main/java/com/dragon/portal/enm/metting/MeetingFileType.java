package com.dragon.portal.enm.metting;

public enum MeetingFileType {
    MEETING_CONTENT_FILE(1,"会议内容文件"),MEETING_SUMMARY_FILE(2,"会议纪要文件");
	
	private MeetingFileType(Integer code,String name){
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