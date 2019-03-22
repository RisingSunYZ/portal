package com.dragon.portal.model.fnc;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;


/**
 * @Title:财务服务-意见管理
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:13:54
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class Opinion extends BaseModel implements Serializable{
    
    
	/**
	 *
	 */
		
	private static final long serialVersionUID = 8815386914295316660L;

	/**
     * ID
     */
    private String id;
    
    /**
     * 类型ID
     */
    private String typeId;
    /**
     * 类型名称 用户显示 数据库中没有此字段
     */
    private String typeName;
    
    /**
     * 意见内容
     */
    private String content;
    /**
     * 创建者工号
     */
    private String creatorNo;
    /**
     * 创建者联系方式
     */
    private String creatorTel;
    
    /**
     * 处理负者人
     */
    private String responsiblePerson;
    /**
     * 处理负者人工号
     */
    private String responsibleNo;
    /**
     * 备注
     */
    private String remark;
    
    /**
     * 回复
     */
    private String replyInfo;
    
    /**
     * 状态（1：已回复；0：待回复）
     */
    private Integer status;
    
    /**
     * 排序
     */
    private Integer sortNo;
    /**
     * 是否已经读取 1是已经读取 0是未读
     */
    private Integer isRead;
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getTypeId() {
        return typeId;
    }
    
    public void setTypeId(String typeId) {
        this.typeId = typeId;
    }
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    public String getCreatorTel() {
        return creatorTel;
    }
    
    public void setCreatorTel(String creatorTel) {
        this.creatorTel = creatorTel;
    }
    public String getResponsiblePerson() {
        return responsiblePerson;
    }
    
    public void setResponsiblePerson(String responsiblePerson) {
        this.responsiblePerson = responsiblePerson;
    }
    public String getRemark() {
        return remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }
    public String getReplyInfo() {
        return replyInfo;
    }
    
    public void setReplyInfo(String replyInfo) {
        this.replyInfo = replyInfo;
    }
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }
    public Integer getSortNo() {
        return sortNo;
    }
    
    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }

	public String getResponsibleNo() {
		return responsibleNo;
	}

	public void setResponsibleNo(String responsibleNo) {
		this.responsibleNo = responsibleNo;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public Integer getIsRead() {
		return isRead;
	}

	public void setIsRead(Integer isRead) {
		this.isRead = isRead;
	}

	public String getCreatorNo() {
		return creatorNo;
	}

	public void setCreatorNo(String creatorNo) {
		this.creatorNo = creatorNo;
	}
    
}
