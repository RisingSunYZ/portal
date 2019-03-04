package com.dragon.portal.model.news;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:新闻类型
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 13:53:29
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class NewsType extends BaseModel implements Serializable{
    
    /**
     * ID
     */
    private String id;
    
    /**
     * 类型名称
     */
    private String name;
    
    /**
     * 类型标识
     */
    private String sn;
    
    /**
     * 排序编号
     */
    private Integer sortNo;
    
    /**
     * 备注
     */
    private String remark;
    
    /**
     * 状态（1：可用；0：不可用）
     */
    private Integer status;
    
    /**
     * 栏目模板
     */
    private String newsTemp;
    
    
    private int tempNum; 
    
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
    public String getSn() {
        return sn;
    }
    
    public void setSn(String sn) {
        this.sn = sn;
    }
    public Integer getSortNo() {
        return sortNo;
    }
    
    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }
    public String getRemark() {
        return remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }

	public String getNewsTemp() {
		return newsTemp;
	}
	public void setNewsTemp(String newsTemp) {
		this.newsTemp = newsTemp;
	}

	public int getTempNum() {
		return tempNum;
	}

	public void setTempNum(int tempNum) {
		this.tempNum = tempNum;
	}
	
}
