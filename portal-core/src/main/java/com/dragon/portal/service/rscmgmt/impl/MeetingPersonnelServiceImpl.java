package com.dragon.portal.service.rscmgmt.impl;

import com.dragon.portal.dao.rscmgmt.IMeetingPersonnelDao;
import com.dragon.portal.model.rscmgmt.Meeting;
import com.dragon.portal.model.rscmgmt.MeetingPersonnel;
import com.dragon.portal.service.rscmgmt.IMeetingPersonnelService;
import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * @Title:会议参与人员Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-31 16:27:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingPersonnelServiceImpl implements IMeetingPersonnelService {

	@Resource
	private IMeetingPersonnelDao meetingPersonnelDao;

	@Override
	public MeetingPersonnel getMeetingPersonnelById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingPersonnelDao.getMeetingPersonnelById(id.trim()) : null;
	}

	@Override
	public List<MeetingPersonnel> getAll(MeetingPersonnel meetingPersonnel) throws Exception {
		return null != meetingPersonnel ? this.meetingPersonnelDao.getAll(meetingPersonnel) : null;
	}

	@Override
	public PagerModel<MeetingPersonnel> getPagerModelByQuery(MeetingPersonnel meetingPersonnel, Query query)
			throws Exception {
		return (null != meetingPersonnel && null != query) ? this.meetingPersonnelDao.getPagerModelByQuery(meetingPersonnel, query) : null;
	}

	@Override
	public void insertMeetingPersonnel(MeetingPersonnel meetingPersonnel) throws Exception {
		if (null != meetingPersonnel) {
			meetingPersonnel.setId(UUIDGenerator.generate());
			meetingPersonnel.setCreateTime(new Date());
			meetingPersonnel.setUpdateTime(new Date());
			this.meetingPersonnelDao.insertMeetingPersonnel(meetingPersonnel);
		}
	}
	
	@Override
	public void delMeetingPersonnelById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingPersonnelDao.delMeetingPersonnelById(id.trim());
		}
	}
	
	@Override
	public void delMeetingPersonnelByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingPersonnelDao.delMeetingPersonnelByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingPersonnel(MeetingPersonnel meetingPersonnel) throws Exception {
		if (null != meetingPersonnel) {
			meetingPersonnel.setUpdateTime(new Date());
			this.meetingPersonnelDao.updateMeetingPersonnel(meetingPersonnel);
		}
	}

	@Override
	public void updateMeetingPersonnelByIds(String ids,MeetingPersonnel meetingPersonnel) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingPersonnel) {
			meetingPersonnel.setUpdateTime(new Date());
			this.meetingPersonnelDao.updateMeetingPersonnelByIds(ids, meetingPersonnel);
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
	public List<MeetingPersonnel> getMeetingPersonnelByMeetingId(String meeting_id) throws Exception {
		return StringUtils.isNotBlank(meeting_id) ? this.meetingPersonnelDao.getMeetingPersonnelByMeetingId(meeting_id) : null;
	}

	@Override
	public List<MeetingPersonnel> getRecordPerson(List<Meeting> meetings) {
		return (meetings.size()>0)?this.meetingPersonnelDao.getRecordPerson(meetings) : null;
	}

	@Override
	public void delMeetingPersonnelByMeetingId(MeetingPersonnel meetingPersonnel) throws Exception {
		if(meetingPersonnel!=null){
			this.meetingPersonnelDao.delMeetingPersonnelByMeetingId(meetingPersonnel);
		}
	}
}

