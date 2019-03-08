package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议室审批表
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-14 10:20:59
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingroomApprovalLog extends BaseModel implements Serializable{


	private static final long serialVersionUID = 8293912028505889103L;

	/**
     * id
     */
    private String id;
    
    /**
     * 会议申请单号
     */
    private String applyNo;
    
    /**
     * 审批人工号
     */
    private String approverNo;
    
    /**
     * 审批人姓名
     */
    private String approverName;
    
    /**
     * 反馈意见
     */
    private String approvalOpinion;
    
    
    
    
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getApplyNo() {
        return applyNo;
    }
    
    public void setApplyNo(String applyNo) {
        this.applyNo = applyNo;
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
    public String getApprovalOpinion() {
        return approvalOpinion;
    }
    
    public void setApprovalOpinion(String approvalOpinion) {
        this.approvalOpinion = approvalOpinion;
    }
}
