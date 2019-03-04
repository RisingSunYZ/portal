package com.dragon.portal.model.news;

import com.ys.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:新闻公告附件管理
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-22 16:15:55
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class NewsFile extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = 1629709025180783416L;

	/**
     * ID
     */
    private String id;
    
    /**
     * 文件名
     */
    private String fileName;
    
    /**
     * 文件类型见枚举 NewsFileTypeEnum
     */
    private Integer fileType;
    
    /**
     * 存放路径
     */
    private String filePath;
    
    /**
     * 备注
     */
    private String viewPath;
    
    /**
     * 文件大小（KB）
     */
    private Integer fileSize;
    
    /**
     * 是否允许下载（1：是；0：否）
     */
    private Integer canDown;
    
    /**
     * 引用ID
     */
    private String refId;
    
    /**
     * 排序字段 默认初始 1000 递增100 升序
     */
    private Integer sortNo;
    
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    public Integer getFileType() {
        return fileType;
    }
    
    public void setFileType(Integer fileType) {
        this.fileType = fileType;
    }
    public String getFilePath() {
        return filePath;
    }
    
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    public String getViewPath() {
        return viewPath;
    }
    
    public void setViewPath(String viewPath) {
        this.viewPath = viewPath;
    }
    public Integer getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Integer fileSize) {
        this.fileSize = fileSize;
    }
    public Integer getCanDown() {
        return canDown;
    }
    
    public void setCanDown(Integer canDown) {
        this.canDown = canDown;
    }
    public String getRefId() {
        return refId;
    }
    
    public void setRefId(String refId) {
        this.refId = refId;
    }

	public Integer getSortNo() {
		return sortNo;
	}

	public void setSortNo(Integer sortNo) {
		this.sortNo = sortNo;
	}

	@Override
	public String toString() {
		return "NewsFile [id=" + id + ", fileName=" + fileName + ", fileType=" + fileType + ", filePath=" + filePath
				+ ", viewPath=" + viewPath + ", fileSize=" + fileSize + ", canDown=" + canDown + ", refId=" + refId
				+ ", sortNo=" + sortNo + "]";
	}

    
    
}
