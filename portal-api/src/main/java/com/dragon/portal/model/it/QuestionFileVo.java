package com.dragon.portal.model.it;

import java.io.Serializable;

/**
 * 问题列表中附件
 * @author v-luozongfang
 *
 */
public class QuestionFileVo implements Serializable{
	private static final long serialVersionUID = 1L;
	
	private String fileId;
	private String fileName;
	private String filePath;
	public String getFileId() {
		return fileId;
	}
	public void setFileId(String fileId) {
		this.fileId = fileId;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	
}
