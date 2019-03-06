package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议室-审批人
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:53:23
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingroomApprover extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = -4327498474837181736L;

	/**
     * id
     */
    private String id;
    
    /**
     * 会议室ID
     */
    private String mettingroomId;
    
    /**
     * 审批人工号
     */
    private String approverNo;
    
    
    private String approverName;
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getMettingroomId() {
        return mettingroomId;
    }
    
    public void setMettingroomId(String mettingroomId) {
        this.mettingroomId = mettingroomId;
    }
    public String getApproverNo() {
        return approverNo;
    }
    
    public void setApproverNo(String approverNo) {
        this.approverNo = approverNo;
    }

	public String getApproverName() {
		return approverName;
	}

	public void setApproverName(String approverName) {
		this.approverName = approverName;
	}
    
}
