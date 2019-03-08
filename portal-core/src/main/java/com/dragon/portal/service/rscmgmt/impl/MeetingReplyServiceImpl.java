package com.dragon.portal.service.rscmgmt.impl;

import com.dragon.portal.dao.rscmgmt.IMeetingReplyDao;
import com.dragon.portal.model.rscmgmt.MeetingReply;
import com.dragon.portal.service.rscmgmt.IMeetingReplyService;
import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * @Title:会议答复Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-12 11:55:16
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingReplyServiceImpl implements IMeetingReplyService {

	@Resource
	private IMeetingReplyDao meetingReplyDao;

	@Override
	public MeetingReply getMeetingReplyById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingReplyDao.getMeetingReplyById(id.trim()) : null;
	}

	@Override
	public List<MeetingReply> getAll(MeetingReply meetingReply) throws Exception {
		return null != meetingReply ? this.meetingReplyDao.getAll(meetingReply) : null;
	}

	@Override
	public PagerModel<MeetingReply> getPagerModelByQuery(MeetingReply meetingReply, Query query)
			throws Exception {
		return (null != meetingReply && null != query) ? this.meetingReplyDao.getPagerModelByQuery(meetingReply, query) : null;
	}

	@Override
	public void insertMeetingReply(MeetingReply meetingReply) throws Exception {
		if (null != meetingReply) {
			meetingReply.setId(UUIDGenerator.generate());
			meetingReply.setCreateTime(new Date());
			meetingReply.setUpdateTime(new Date());
			this.meetingReplyDao.insertMeetingReply(meetingReply);
		}
	}
	
	@Override
	public void delMeetingReplyById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingReplyDao.delMeetingReplyById(id.trim());
		}
	}
	
	@Override
	public void delMeetingReplyByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingReplyDao.delMeetingReplyByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingReply(MeetingReply meetingReply) throws Exception {
		if (null != meetingReply) {
			meetingReply.setUpdateTime(new Date());
			this.meetingReplyDao.updateMeetingReply(meetingReply);
		}
	}

	@Override
	public void updateMeetingReplyByIds(String ids,MeetingReply meetingReply) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingReply) {
			meetingReply.setUpdateTime(new Date());
			this.meetingReplyDao.updateMeetingReplyByIds(ids, meetingReply);
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
	public MeetingReply getMeetingReplyByMeetingIdAndPersonNo(String meetingId, String replyNo) {
		return (StringUtils.isNotBlank(meetingId) && StringUtils.isNotBlank(replyNo)) ? this.meetingReplyDao.getMeetingReplyByMeetingIdAndPersonNo(meetingId, replyNo) : null;
	}

	@Override
	public List<MeetingReply> getReplyByMeeting(List<MeetingReply> meetingReplys) {
		return (meetingReplys.size()>0 && meetingReplys != null)?this.meetingReplyDao.getReplyByMeeting(meetingReplys) : null;
	}

	@Override
	public List<MeetingReply> getReplyByMeetingId(String meeting_id) {
		return (StringUtils.isNotBlank(meeting_id))?this.meetingReplyDao.getReplyByMeetingId(meeting_id) : null;
	}
}

