package com.dragon.portal.model.news;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @Title:公告管理
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-21 13:49:25
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public class NewsNotice extends BaseModel implements Serializable {

    private static final long serialVersionUID = 1616707746953555832L;

    /**
     * ID
     */
    private String id;

    /**
     * 公告标题
     */
    private String title;

    /**
     * 公告类型
     */
    private String typeId;

    /**
     * 公告类型 Array 使用"," 拼接
     */
    private String typeIdArray;
    /**
     * 主体ID
     */
    private String ownerId;
    /**
     * 主体name
     */
    private String ownerName;
    /**
     * 类别ID
     */
    private String categoryId;
    /**
     * 类别名字
     */
    private String categoryName;
    /**
     * 签发人
     */
    private String signatory;
    /**
     * 签发人工号
     */
    private String signatoryNo;
    /**
     * 公告内容
     */
    private String content;

    /**
     * 发布状态
     */
    private Integer publishStatus;

    /**
     * 发布时间
     */
    private Date publishTime;
    /**
     * 时间字符串
     */
    private String publicTimeStr;
    /**
     * 流程提交时间
     */
    private Date writingTime;

    /**
     * 提交开始时间
     */
    private String beginWritingTime;
    /**
     * 提交结束时间
     */
    private String endWritingTime;
    /**
     * 缩略图
     */
    private String thumbImg;

    /**
     * 排序编号
     */
    private Integer sortNo;

    /**
     * 状态（1：可用；0：不可用）
     */
    private Integer status;

    /**
     * 简介
     */
    private String remark;

    /**
     * 访问量
     */
    private Integer visitCount;
    /**
     * 点赞
     */
    private Integer thumbsUp;
    /**
     * 评论数
     */
    private Integer commentCount;

    /**
     * 报名量
     */
    private Integer signCount;
    /**
     * 发文编号
     */
    private String articleNo;
    /**
     * 关键字
     */
    private String keyword;
    /**
     * 强制阅读 1强制 0非强制
     */
    private Integer mustRead;
    /**
     * 文章来源标题
     */
    private String sourceTitle;
    /**
     * 文章来源地址
     */
    private String sourceUrl;
    /**
     * 报名开始时间结 - 生效开始时间
     */
    private Date startTime;
    /**
     * 报名结束时间 - 生效结束时间
     */
    private Date endTime;
    /**
     * 是否报名
     */
    private Integer isSign;
    /**
     * 相册
     */
    private String photo;
    /**
     * 发布范围
     */
    private String rangeName;

    /**
     * 发布人
     */
    private String creatorName;
    /**
     * 发布人公司id
     */
    private String createCompanyId;
    /**
     * 发布人公司名字
     */
    private String createCompanyName;
    /**
     * 发布人部门ID
     */
    private String createDeptmentId;
    /**
     * 帆布人部门
     */
    private String createDeptmentName;
    /**
     * 发布范围 部门id
     */
    private List<String> rangeDeftId;

    //新闻类型id集合
    private List<String> typeIds;

    //时间段查询条件
    private Date start;
    private Date end;

    //已经读取功能 添加的字段
    private String userNo;
    private Integer alreadyRead;//1是已经读取
    private String approveRemark;//发文审批信息
    private String typeIdArrayRemark;//发布板块描述
    private String newsNoticeType;//类型 新闻或公告

    /**
     * 是否有附件 1是有附件 0没有 只用于显示 不能当成条件查询
     */
    private Integer hasAttachment;

    /**
     * 提交人
     */
    private String username;

    /**
     * 工号
     */
    private String no;

    /**
     * 编号
     */
    private String code;
    /**
     * 流程实例id
     */
    private String taskId;

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

    public Integer getPublishStatus() {
        return publishStatus;
    }

    public void setPublishStatus(Integer publishStatus) {
        this.publishStatus = publishStatus;
    }

    public Date getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(Date publishTime) {
        this.publishTime = publishTime;
    }

    public String getThumbImg() {
        return thumbImg;
    }

    public void setThumbImg(String thumbImg) {
        this.thumbImg = thumbImg;
    }

    public Integer getSortNo() {
        return sortNo;
    }

    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
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

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getArticleNo() {
        return articleNo;
    }

    public void setArticleNo(String articleNo) {
        this.articleNo = articleNo;
    }

    public Integer getMustRead() {
        return mustRead;
    }

    public void setMustRead(Integer mustRead) {
        this.mustRead = mustRead;
    }

    public String getSourceTitle() {
        return sourceTitle;
    }

    public void setSourceTitle(String sourceTitle) {
        this.sourceTitle = sourceTitle;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Integer getIsSign() {
        return isSign;
    }

    public void setIsSign(Integer isSign) {
        this.isSign = isSign;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getRangeName() {
        return rangeName;
    }

    public void setRangeName(String rangeName) {
        this.rangeName = rangeName;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public List<String> getRangeDeftId() {
        return rangeDeftId;
    }

    public void setRangeDeftId(List<String> rangeDeftId) {
        this.rangeDeftId = rangeDeftId;
    }

    public String getCreateCompanyId() {
        return createCompanyId;
    }

    public void setCreateCompanyId(String createCompanyId) {
        this.createCompanyId = createCompanyId;
    }

    public String getCreateCompanyName() {
        return createCompanyName;
    }

    public void setCreateCompanyName(String createCompanyName) {
        this.createCompanyName = createCompanyName;
    }

    public List<String> getTypeIds() {
        return typeIds;
    }

    public void setTypeIds(List<String> typeIds) {
        this.typeIds = typeIds;
    }

    public Date getStart() {
        return start;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getEnd() {
        return end;
    }

    public void setEnd(Date end) {
        this.end = end;
    }

    public Integer getSignCount() {
        return signCount;
    }

    public void setSignCount(Integer signCount) {
        this.signCount = signCount;
    }

    public String getUserNo() {
        return userNo;
    }

    public void setUserNo(String userNo) {
        this.userNo = userNo;
    }

    public Integer getAlreadyRead() {
        return alreadyRead;
    }

    public void setAlreadyRead(Integer alreadyRead) {
        this.alreadyRead = alreadyRead;
    }

    public Integer getThumbsUp() {
        return thumbsUp;
    }

    public void setThumbsUp(Integer thumbsUp) {
        this.thumbsUp = thumbsUp;
    }

    public Integer getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }

    public Integer getHasAttachment() {
        return hasAttachment;
    }

    public void setHasAttachment(Integer hasAttachment) {
        this.hasAttachment = hasAttachment;
    }

    public String getTypeIdArray() {
        return typeIdArray;
    }

    public void setTypeIdArray(String typeIdArray) {
        this.typeIdArray = typeIdArray;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getSignatory() {return signatory;}

    public void setSignatory(String signatory) {this.signatory = signatory;}

    public Date getWritingTime() {
        return writingTime;
    }

    public void setWritingTime(Date writingTime) {
        this.writingTime = writingTime;
    }

    public String getCreateDeptmentId() {
        return createDeptmentId;
    }

    public void setCreateDeptmentId(String createDeptmentId) {
        this.createDeptmentId = createDeptmentId;
    }

    public String getCreateDeptmentName() {
        return createDeptmentName;
    }

    public void setCreateDeptmentName(String createDeptmentName) {
        this.createDeptmentName = createDeptmentName;
    }

    public String getSignatoryNo() {
        return signatoryNo;
    }

    public void setSignatoryNo(String signatoryNo) {
        this.signatoryNo = signatoryNo;
    }

    public String getApproveRemark() {
        return approveRemark;
    }

    public void setApproveRemark(String approveRemark) {
        this.approveRemark = approveRemark;
    }

    public String getTypeIdArrayRemark() {
        return typeIdArrayRemark;
    }

    public void setTypeIdArrayRemark(String typeIdArrayRemark) {
        this.typeIdArrayRemark = typeIdArrayRemark;
    }

    public String getNo() {
        return no;
    }

    public String getUsername() {
        return username;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getBeginWritingTime() {
        return beginWritingTime;
    }

    public void setBeginWritingTime(String beginWritingTime) {
        this.beginWritingTime = beginWritingTime;
    }

    public String getEndWritingTime() {
        return endWritingTime;
    }

    public void setEndWritingTime(String endWritingTime) {
        this.endWritingTime = endWritingTime;
    }


    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public String getNewsNoticeType() {
        return newsNoticeType;
    }

    public void setNewsNoticeType(String newsNoticeType) {
        this.newsNoticeType = newsNoticeType;
    }
}
