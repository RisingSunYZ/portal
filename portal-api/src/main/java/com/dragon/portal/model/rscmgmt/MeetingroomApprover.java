package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import com.dragon.tools.common.BaseModel;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @Title:会议室-审批人
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:53:23
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@ApiModel(value="会议室-审批人",description="会议室-审批人")
public class MeetingroomApprover extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = -4327498474837181736L;

	/**
     * id
     */
    @ApiModelProperty(value="id",name="id")
    private String id;
    
    /**
     * 会议室ID
     */
    @ApiModelProperty(value="会议室ID",name="mettingroomId")
    private String mettingroomId;
    
    /**
     * 审批人工号
     */
    @ApiModelProperty(value="审批人工号",name="approverNo")
    private String approverNo;

    @ApiModelProperty(value="审批人",name="approverName")
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
