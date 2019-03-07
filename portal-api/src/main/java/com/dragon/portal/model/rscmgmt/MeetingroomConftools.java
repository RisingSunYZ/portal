package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议室-会议室配置用具项中间表
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:54:12
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingroomConftools extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 7492477665922730399L;

	/**
     * id
     */
    private String id;
    
    /**
     * 会议室ID
     */
    private String mettingroomId;
    
    /**
     * 配置项ID
     */
    private String toolsId;
    
    /**
     * 其他配置项内容
     */
    private String otherConfitem;
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
    public String getToolsId() {
        return toolsId;
    }
    
    public void setToolsId(String toolsId) {
        this.toolsId = toolsId;
    }
    public String getOtherConfitem() {
        return otherConfitem;
    }
    
    public void setOtherConfitem(String otherConfitem) {
        this.otherConfitem = otherConfitem;
    }
}
