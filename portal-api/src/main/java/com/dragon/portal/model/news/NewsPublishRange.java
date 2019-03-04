package com.dragon.portal.model.news;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:公告-新闻动态发布范围中间表
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-06 14:06:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class NewsPublishRange extends BaseModel implements Serializable{

	private static final long serialVersionUID = 3436551645673142089L;

	/**
     * id
     */
    private String id;
    
    /**
     * 公告或动态ID
     */
    private String newsNoticeId;
    
    /**
     * 公司、部门ID
     */
    private String orgId;
    
    /**
     * 公司、部门名称
     */
    private String orgName;
    
    /**
     * 公司简称
     */
    private String orgShortName;
    
    /**
     * 类型（1：发布单位只有公司；2：发布范围有公司有部门）
     */
    private Integer type;
    
    /**
     * 数据类型（1：公司；2：部门）
     */
    private Integer dataType;
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getNewsNoticeId() {
        return newsNoticeId;
    }
    
    public void setNewsNoticeId(String newsNoticeId) {
        this.newsNoticeId = newsNoticeId;
    }
    public String getOrgId() {
        return orgId;
    }
    
    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }
    public String getOrgName() {
        return orgName;
    }
    
    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }
    public String getOrgShortName() {
        return orgShortName;
    }
    
    public void setOrgShortName(String orgShortName) {
        this.orgShortName = orgShortName;
    }
    public Integer getType() {
        return type;
    }
    
    public void setType(Integer type) {
        this.type = type;
    }
    public Integer getDataType() {
        return dataType;
    }
    
    public void setDataType(Integer dataType) {
        this.dataType = dataType;
    }
}
