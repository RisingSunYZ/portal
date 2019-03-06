package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;
import java.util.List;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议室管理
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:28:10
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class Meetingroom extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 1490902280726233347L;

	/**
     * id
     */
    private String id;
    
    /**
     * 会议室地点
     */
    private String addrId;
    
    /**
     * 会议室名称
     */
    private String name;
    
    /**
     * 楼层
     */
    private String floorNum;
    
    /**
     * 可容纳人数
     */
    private Integer personNum;
    
    /**
     * 会议室场景图
     */
    private String roomImg;
    
    /**
     * 允许时期性申请
     */
    private Integer isCyclicity;
    
    /**
     * 是否需要审批 (1:需要审批 0不需要审批)
     */
    private Integer needApproval;
    
    /**
     * 排序号
     */
    private Integer sortNo;
    
    /**
     * 会议室状态（1：启用；0：停用）
     */
    private Integer status;
    
    //临时变量
    private List<String> toolIds;
    
    //其它配置信息
    private String  otherTooIds;
    
    /**
     * 发布范围
     */
    private String openrange;
    /**
     * 审批人
     */
    private String approver;
    /**
     * 管理员工号
     */
    private String adminNo;
    
    public String getOtherTooIds() {
		return otherTooIds;
	}

	public void setOtherTooIds(String otherTooIds) {
		this.otherTooIds = otherTooIds;
	}

	public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getAddrId() {
        return addrId;
    }
    
    public void setAddrId(String addrId) {
        this.addrId = addrId;
    }
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    public String getFloorNum() {
        return floorNum;
    }
    
    public void setFloorNum(String floorNum) {
        this.floorNum = floorNum;
    }
    public Integer getPersonNum() {
        return personNum;
    }
    
    public void setPersonNum(Integer personNum) {
        this.personNum = personNum;
    }
    public String getRoomImg() {
        return roomImg;
    }
    
    public void setRoomImg(String roomImg) {
        this.roomImg = roomImg;
    }
    public Integer getIsCyclicity() {
        return isCyclicity;
    }
    
    public void setIsCyclicity(Integer isCyclicity) {
        this.isCyclicity = isCyclicity;
    }
    public Integer getNeedApproval() {
        return needApproval;
    }
    
    public void setNeedApproval(Integer needApproval) {
        this.needApproval = needApproval;
    }
    public Integer getSortNo() {
        return sortNo;
    }
    
    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public List<String> getToolIds() {
		return toolIds;
	}

	public void setToolIds(List<String> toolIds) {
		this.toolIds = toolIds;
	}

	public String getOpenrange() {
		return openrange;
	}

	public void setOpenrange(String openrange) {
		this.openrange = openrange;
	}

	public String getApprover() {
		return approver;
	}

	public void setApprover(String approver) {
		this.approver = approver;
	}

	public String getAdminNo() {
		return adminNo;
	}

	public void setAdminNo(String adminNo) {
		this.adminNo = adminNo;
	}
    
}
