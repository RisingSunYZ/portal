package com.dragon.portal.model.rscmgmt;

import java.util.List;

/**
 * Created by v-wangliqiang on 2016/11/18.
 */
public class AppointmentVO {
    private String id;
    private Integer type;
    private String title;
    private String start;
    private String end;
    private boolean allDay;
    private String address;
    private String content;
    private String changeKey;
    private String changeId;
    private String email;
    private String oldStart;
    private String oldEnd;
    //必选人员email
    private List<String> mandatoryEmail;
    //可选人员email
    private List<String> optionalEmail;
    //记录人员email
    private List<String> recordEmail;
    
    public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getChangeKey() {
		return changeKey;
	}

	public void setChangeKey(String changeKey) {
		this.changeKey = changeKey;
	}

	public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public boolean isAllDay() {
        return allDay;
    }

    public void setAllDay(boolean allDay) {
        this.allDay = allDay;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

	public List<String> getMandatoryEmail() {
		return mandatoryEmail;
	}

	public void setMandatoryEmail(List<String> mandatoryEmail) {
		this.mandatoryEmail = mandatoryEmail;
	}

	public List<String> getOptionalEmail() {
		return optionalEmail;
	}

	public void setOptionalEmail(List<String> optionalEmail) {
		this.optionalEmail = optionalEmail;
	}

	public List<String> getRecordEmail() {
		return recordEmail;
	}

	public void setRecordEmail(List<String> recordEmail) {
		this.recordEmail = recordEmail;
	}

	public String getChangeId() {
		return changeId;
	}

	public void setChangeId(String changeId) {
		this.changeId = changeId;
	}

	public String getOldStart() {
		return oldStart;
	}

	public void setOldStart(String oldStart) {
		this.oldStart = oldStart;
	}

	public String getOldEnd() {
		return oldEnd;
	}

	public void setOldEnd(String oldEnd) {
		this.oldEnd = oldEnd;
	}
    
}
