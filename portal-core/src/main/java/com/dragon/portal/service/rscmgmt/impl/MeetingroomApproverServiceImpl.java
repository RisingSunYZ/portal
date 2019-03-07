package com.dragon.portal.service.rscmgmt.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.dragon.portal.dao.rscmgmt.IMeetingroomApproverDao;
import com.dragon.portal.model.rscmgmt.MeetingroomApprover;
import com.dragon.portal.service.rscmgmt.IMeetingroomApproverService;

/**
 * @Title:会议室-审批人Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:53:23
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingroomApproverServiceImpl implements IMeetingroomApproverService {

	@Resource
	private IMeetingroomApproverDao meetingroomApproverDao;

	@Override
	public MeetingroomApprover getMeetingroomApproverById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingroomApproverDao.getMeetingroomApproverById(id.trim()) : null;
	}

	@Override
	public List<MeetingroomApprover> getAll(MeetingroomApprover meetingroomApprover) throws Exception {
		return null != meetingroomApprover ? this.meetingroomApproverDao.getAll(meetingroomApprover) : null;
	}

	@Override
	public PagerModel<MeetingroomApprover> getPagerModelByQuery(MeetingroomApprover meetingroomApprover, Query query)
			throws Exception {
		return (null != meetingroomApprover && null != query) ? this.meetingroomApproverDao.getPagerModelByQuery(meetingroomApprover, query) : null;
	}

	@Override
	public void insertMeetingroomApprover(MeetingroomApprover meetingroomApprover) throws Exception {
		if (null != meetingroomApprover) {
			meetingroomApprover.setId(UUIDGenerator.generate());
			meetingroomApprover.setCreateTime(new Date());
			meetingroomApprover.setUpdateTime(new Date());
			this.meetingroomApproverDao.insertMeetingroomApprover(meetingroomApprover);
		}
	}
	
	@Override
	public void delMeetingroomApproverById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingroomApproverDao.delMeetingroomApproverById(id.trim());
		}
	}
	
	@Override
	public void delMeetingroomApproverByMeetingRoomId(String meetingRoomId) throws Exception {
		if (StringUtils.isNotBlank(meetingRoomId)) {
			this.meetingroomApproverDao.delMeetingroomApproverByMeetingRoomId(meetingRoomId.trim());
		}
	}
	
	@Override
	public void delMeetingroomApproverByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingroomApproverDao.delMeetingroomApproverByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingroomApprover(MeetingroomApprover meetingroomApprover) throws Exception {
		if (null != meetingroomApprover) {
			meetingroomApprover.setUpdateTime(new Date());
			this.meetingroomApproverDao.updateMeetingroomApprover(meetingroomApprover);
		}
	}

	@Override
	public void updateMeetingroomApproverByIds(String ids,MeetingroomApprover meetingroomApprover) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingroomApprover) {
			meetingroomApprover.setUpdateTime(new Date());
			this.meetingroomApproverDao.updateMeetingroomApproverByIds(ids, meetingroomApprover);
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
}

