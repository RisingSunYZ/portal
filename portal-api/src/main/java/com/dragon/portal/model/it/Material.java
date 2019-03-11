package com.dragon.portal.model.it;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * @Title:资料维护
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-07 15:00:38
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class Material extends BaseModel implements Serializable{
    
    /**
	 *
	 */
	private static final long serialVersionUID = -7224243250376446433L;

	/**
     * 主键
     */
    private String id;
    
    /**
     * 文件名
     */
    private String fileName;
    /**
     * 文件后缀
     */
    private String extension;
    
    /**
     * 文件类型id
     */
    private String typeId;
    
    /**
     * 文件大小
     */
    private String fileSize;
    
    /**
     * 目标文件路径
     */
    private String destPath;
    
    /**
     * 文件描述
     */
    private String fileRemark;
    
    /**
     * 状态 1启用 0不启用 
     */
    private Integer status;
    
    
    /**
     * 临时变量-s
     */
    private String typeName;
    
    private String uploadTime;
    /**
     * 临时变量-e
     */
    
    
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
    
    public String getExtension() {
		return extension;
	}

	public void setExtension(String extension) {
		this.extension = extension;
	}

	public String getTypeId() {
        return typeId;
    }
    
    public void setTypeId(String typeId) {
        this.typeId = typeId;
    }
    public String getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }
    public String getDestPath() {
        return destPath;
    }
    
    public void setDestPath(String destPath) {
        this.destPath = destPath;
    }
    public String getFileRemark() {
        return fileRemark;
    }
    
    public void setFileRemark(String fileRemark) {
        this.fileRemark = fileRemark;
    }
    public Integer getStatus() {
        return status;
    }
    
    public void setStatus(Integer status) {
        this.status = status;
    }

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public String getUploadTime() {
		return uploadTime;
	}

	public void setUploadTime(String uploadTime) {
		this.uploadTime = uploadTime;
	}
    
}
