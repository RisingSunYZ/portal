package com.dragon.portal.model.news;

import java.io.Serializable;
import java.util.Date;

public class NewsNoticeVo implements Serializable{

	private static final long serialVersionUID = -260228868216905842L;

	/**
     * ID
     */
    private String id;
    /**
     * 公告标题
     */
    private String title;

    /**
     * 缩略图
     */
    private String thumbImg;

    /**
     * 简介
     */
    private String remark;

    /**
     * 发布时间
     */
    private Date publishTime;

    /**
     * 文章来源地址
     */
    private String sourceUrl;

    /**
     * 是否已经读取
     */
    private Integer alreadyRead;//1是已经读取

    /**
     * 发布人
     */
    private String creatorName;

	/**
	 * 发文主体
	 */
	private String ownerName;

    /**
     * 访问数量
     */
    private Integer visitCount;

    /**
     * 是否有附件
     */
    private Integer hasAttachment;

    /**
     * 返回结果是 banner 0无  1内链 2外链
     */
    private Integer bannerType = 0;

    /**
     * 返回结果是banner 同时是内连接时有值 是内链 详情页的id
     */
    private String bannerId;
    
    private String publicTimeStr;
    
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getThumbImg() {
		return thumbImg;
	}
	public void setThumbImg(String thumbImg) {
		this.thumbImg = thumbImg;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Date getPublishTime() {
		return publishTime;
	}
	public void setPublishTime(Date publishTime) {
		this.publishTime = publishTime;
	}
	public String getSourceUrl() {
		return sourceUrl;
	}
	public void setSourceUrl(String sourceUrl) {
		this.sourceUrl = sourceUrl;
	}
	public Integer getAlreadyRead() {
		return alreadyRead;
	}
	public void setAlreadyRead(Integer alreadyRead) {
		this.alreadyRead = alreadyRead;
	}
	public String getCreatorName() {
		return creatorName;
	}
	public void setCreatorName(String creatorName) {
		this.creatorName = creatorName;
	}
	public String getPublicTimeStr() {
		return publicTimeStr;
	}
	public void setPublicTimeStr(String publicTimeStr) {
		this.publicTimeStr = publicTimeStr;
	}
	public Integer getVisitCount() {
		return visitCount;
	}
	public void setVisitCount(Integer visitCount) {
		this.visitCount = visitCount;
	}
	public Integer getHasAttachment() {
		return hasAttachment;
	}
	public void setHasAttachment(Integer hasAttachment) {
		this.hasAttachment = hasAttachment;
	}
	public Integer getBannerType() {
		return bannerType;
	}
	public void setBannerType(Integer bannerType) {
		this.bannerType = bannerType;
	}
	public String getBannerId() {
		return bannerId;
	}
	public void setBannerId(String bannerId) {
		this.bannerId = bannerId;
	}

	public String getOwnerName() {
		return ownerName;
	}

	public void setOwnerName(String ownerName) {
		this.ownerName = ownerName;
	}
}
