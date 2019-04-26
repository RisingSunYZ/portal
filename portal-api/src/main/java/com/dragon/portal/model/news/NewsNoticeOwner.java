package com.dragon.portal.model.news;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:发文数据管理-发文主体
 * @Description:
 * @Author:XTJ
 * @Since:2017-12-29 11:46:41
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public class NewsNoticeOwner extends BaseModel implements Serializable {

    /**
     * ID
     */
    private String id;

    /**
     * 父级ID
     */
    private String pid;

    /**
     * 编码
     */
    
    private String sn;
    /**
     * 类型或栏目名称
     */
    private String name;

    /**
     * 简称
     */
    private String shortName;

    /**
     * 排序编号
     */
    private Integer sortNo;

    /**
     * 是否有签发人
     */
    private Integer haveSign;

    /**
     * 签发人
     */
    private String signatory;

    /**
     * 签发人工号
     */
    private String signatoryNo;
    
    /**
     * 状态（1：可用；0：不可用）
     */
    private Integer status;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public Integer getSortNo() {
        return sortNo;
    }

    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }

    public Integer getHaveSign() {
        return haveSign;
    }

    public void setHaveSign(Integer haveSign) {
        this.haveSign = haveSign;
    }

    public String getSignatory() {
        return signatory;
    }

    public void setSignatory(String signatory) {
        this.signatory = signatory;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

	public String getSn() {
		return sn;
	}

	public void setSn(String sn) {
		this.sn = sn;
	}

	public String getSignatoryNo() {
		return signatoryNo;
	}

	public void setSignatoryNo(String signatoryNo) {
		this.signatoryNo = signatoryNo;
	}
    
}
