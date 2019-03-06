package com.dragon.portal.model.rscmgmt;

import java.io.Serializable;

import com.dragon.tools.common.BaseModel;

/**
 * @Title:会议室配置用具项
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:55:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class MeetingroomTools extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 8421478195231478773L;

	/**
     * id
     */
    private String id;
    
    /**
     * 名称
     */
    private String name;
    
    /**
     * 描述
     */
    private String remark;
    
    /**
     * 排序号
     */
    private Integer sortNo;
    
    
    /**
     * 临时变量判断
     * 0-表示不在这个会议室中
     * 1-表示在这个会议室中
     */
    private Integer temporaryJudge;
    
    /**
     * 其他配置项内容
     */
    private String otherConfitem;
    

	public String getOtherConfitem() {
		return otherConfitem;
	}

	public void setOtherConfitem(String otherConfitem) {
		this.otherConfitem = otherConfitem;
	}

	public Integer getTemporaryJudge() {
		return temporaryJudge;
	}

	public void setTemporaryJudge(Integer temporaryJudge) {
		this.temporaryJudge = temporaryJudge;
	}

	public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    public String getRemark() {
        return remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }
    public Integer getSortNo() {
        return sortNo;
    }
    
    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }
}
