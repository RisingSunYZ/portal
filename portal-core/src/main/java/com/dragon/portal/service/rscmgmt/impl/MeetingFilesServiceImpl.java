package com.dragon.portal.service.rscmgmt.impl;

import com.dragon.portal.dao.rscmgmt.IMeetingFilesDao;
import com.dragon.portal.model.rscmgmt.Meeting;
import com.dragon.portal.model.rscmgmt.MeetingFiles;
import com.dragon.portal.service.rscmgmt.IMeetingFilesService;
import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * @Title:会议附件Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-31 16:26:15
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingFilesServiceImpl implements IMeetingFilesService {

	@Resource
	private IMeetingFilesDao meetingFilesDao;

	@Override
	public MeetingFiles getMeetingFilesById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingFilesDao.getMeetingFilesById(id.trim()) : null;
	}

	@Override
	public List<MeetingFiles> getAll(MeetingFiles meetingFiles) throws Exception {
		return null != meetingFiles ? this.meetingFilesDao.getAll(meetingFiles) : null;
	}

	@Override
	public PagerModel<MeetingFiles> getPagerModelByQuery(MeetingFiles meetingFiles, Query query)
			throws Exception {
		return (null != meetingFiles && null != query) ? this.meetingFilesDao.getPagerModelByQuery(meetingFiles, query) : null;
	}

	@Override
	public void insertMeetingFiles(MeetingFiles meetingFiles) throws Exception {
		if (null != meetingFiles) {
			meetingFiles.setId(UUIDGenerator.generate());
			meetingFiles.setCreateTime(new Date());
			meetingFiles.setUpdateTime(new Date());
			this.meetingFilesDao.insertMeetingFiles(meetingFiles);
		}
	}
	
	@Override
	public void delMeetingFilesById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingFilesDao.delMeetingFilesById(id.trim());
		}
	}
	
	@Override
	public void delMeetingFilesByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingFilesDao.delMeetingFilesByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingFiles(MeetingFiles meetingFiles) throws Exception {
		if (null != meetingFiles) {
			meetingFiles.setUpdateTime(new Date());
			this.meetingFilesDao.updateMeetingFiles(meetingFiles);
		}
	}

	@Override
	public void updateMeetingFilesByIds(String ids,MeetingFiles meetingFiles) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingFiles) {
			meetingFiles.setUpdateTime(new Date());
			this.meetingFilesDao.updateMeetingFilesByIds(ids, meetingFiles);
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

	@Override
	public List<MeetingFiles> getMeetingFilesByMeetingId(String meeting_id) throws Exception {
		return StringUtils.isNotBlank(meeting_id) ? this.meetingFilesDao.getMeetingFilesByMeetingId(meeting_id.trim()) : null;
	}

	@Override
	public List<MeetingFiles> getMeetingFiles(List<Meeting> meetings) {
		return (meetings.size()>0)?this.meetingFilesDao.getMeetingFiles(meetings) : null;
	}
}

