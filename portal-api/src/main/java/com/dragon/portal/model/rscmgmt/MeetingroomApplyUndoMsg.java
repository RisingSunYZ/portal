package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议室取消申请备注表
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-20 08:49:12
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingroomApplyUndoMsg extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = -5745634665474865150L;

	/**
     * id
     */
    private String id;
    
    /**
     * 会议申请单号
     */
    private String applyNo;
    
    /**
     * 取消申请说明
     */
    private String undoRemark;
    
    
    
    
    
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
    public String getUndoRemark() {
        return undoRemark;
    }
    
    public void setUndoRemark(String undoRemark) {
        this.undoRemark = undoRemark;
    }
}
