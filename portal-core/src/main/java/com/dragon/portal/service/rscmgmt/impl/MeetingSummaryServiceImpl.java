package com.dragon.portal.service.rscmgmt.impl;

import com.dragon.portal.dao.rscmgmt.IMeetingFilesDao;
import com.dragon.portal.dao.rscmgmt.IMeetingSummaryDao;
import com.dragon.portal.enm.metting.MeetingFileType;
import com.dragon.portal.model.rscmgmt.Meeting;
import com.dragon.portal.model.rscmgmt.MeetingFiles;
import com.dragon.portal.model.rscmgmt.MeetingSummary;
import com.dragon.portal.service.rscmgmt.IMeetingSummaryService;
import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

/**
 * @Title:会议纪要Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-12 11:56:24
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingSummaryServiceImpl implements IMeetingSummaryService {

	@Resource
	private IMeetingSummaryDao meetingSummaryDao;

	@Resource
	private IMeetingFilesDao meetingFilesDao;
	@Override
	public MeetingSummary getMeetingSummaryById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingSummaryDao.getMeetingSummaryById(id.trim()) : null;
	}

	@Override
	public List<MeetingSummary> getAll(MeetingSummary meetingSummary) throws Exception {
		return null != meetingSummary ? this.meetingSummaryDao.getAll(meetingSummary) : null;
	}

	@Override
	public PagerModel<MeetingSummary> getPagerModelByQuery(MeetingSummary meetingSummary, Query query)
			throws Exception {
		return (null != meetingSummary && null != query) ? this.meetingSummaryDao.getPagerModelByQuery(meetingSummary, query) : null;
	}

	@Override
	public void insertMeetingSummary(MeetingSummary meetingSummary) throws Exception {
		if (null != meetingSummary) {
			meetingSummary.setId(UUIDGenerator.generate());
			meetingSummary.setCreateTime(new Date());
			meetingSummary.setUpdateTime(new Date());
			List<MeetingFiles> files = getMeetingSummaryFiles(meetingSummary);
			if(files.size()>0){
            	this.meetingFilesDao.insertMeetingFilesList(files);
			}
			this.meetingSummaryDao.insertMeetingSummary(meetingSummary);
		}
	}
	
	@Override
	public void delMeetingSummaryById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingSummaryDao.delMeetingSummaryById(id.trim());
		}
	}
	
	@Override
	public void delMeetingSummaryByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingSummaryDao.delMeetingSummaryByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingSummary(MeetingSummary meetingSummary) throws Exception {
		if (null != meetingSummary) {
			meetingSummary.setUpdateTime(new Date());
			List<MeetingFiles> files = getMeetingSummaryFiles(meetingSummary);
			Map<String,Object> params = new HashMap<>();
			params.put("meeting_id", meetingSummary.getMeetingId());
			params.put("use_type", MeetingFileType.MEETING_SUMMARY_FILE.getCode());
			this.meetingFilesDao.delMeetingFilesByMeetingId(params);
			if(files.size()>0){
            	this.meetingFilesDao.insertMeetingFilesList(files);
			}
			this.meetingSummaryDao.updateMeetingSummary(meetingSummary);
		}
	}

	@Override
	public void updateMeetingSummaryByIds(String ids,MeetingSummary meetingSummary) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingSummary) {
			meetingSummary.setUpdateTime(new Date());
			this.meetingSummaryDao.updateMeetingSummaryByIds(ids, meetingSummary);
		}
	}
	
	/**
	 * 将"1,2,3,4,5..."这种形式的字符串转成"'1','2','3','4'..."这种形式
	 * @param strs
	 * @return
	 */
	private String converString(String strs) {
		if (StringUtils.isNotBlank(strs)) {
			String[] idStrs = strs.trim().split(",");
			if (null != idStrs && idStrs.length > 0) {
				StringBuffer sbf = new StringBuffer("");
				for (String str : idStrs) {
					if (StringUtils.isNotBlank(str)) {
						sbf.append("'").append(str.trim()).append("'").append(",");
					}
				}
				if (sbf.length() > 0) {
					sbf = sbf.deleteCharAt(sbf.length() - 1);
					return sbf.toString();
				}
			}
		}
		return "";
	}

	//获取会纪要文件
	private List<MeetingFiles> getMeetingSummaryFiles(MeetingSummary meetingSummary){
		List<MeetingFiles> files = new ArrayList<MeetingFiles>();
		if(meetingSummary != null){
			//会议纪要附件（名称，路劲）
			String[] fileNames = meetingSummary.getFileName().trim().split(",");
			String[] filePaths = meetingSummary.getFilePath().trim().split(",");
			if(fileNames.length > 0 && filePaths.length > 0){
				for(int i=0;i<fileNames.length;i++){
					if(StringUtils.isNotBlank(fileNames[i])){
						MeetingFiles file = new MeetingFiles();
						file.setId(UUIDGenerator.generate());
						file.setMeetingId(meetingSummary.getMeetingId());
						file.setFileName(fileNames[i]);
						file.setFilePath(filePaths[i]);
						file.setDelFlag(1);
						file.setUseType(MeetingFileType.MEETING_SUMMARY_FILE.getCode());
						file.setCreateTime(new Date());
						file.setCreator(meetingSummary.getCreator());
						file.setUpdateTime(new Date());
						file.setUpdator(meetingSummary.getUpdator());
						files.add(file);
					}
				}
			}
		}
		return files;
	}
		
	@Override
	public MeetingSummary getMeetingSummaryByMeetingId(String meeting_id) throws Exception {
		return StringUtils.isNotBlank(meeting_id) ? this.meetingSummaryDao.getMeetingSummaryByMeetingId(meeting_id.trim()) : null;
	}

	@Override
	public List<MeetingSummary> getSummaryByMeetingId(List<Meeting> meetings) {
		return (meetings.size()>0)?this.meetingSummaryDao.getSummaryByMeetingId(meetings) : null;
	}
}

