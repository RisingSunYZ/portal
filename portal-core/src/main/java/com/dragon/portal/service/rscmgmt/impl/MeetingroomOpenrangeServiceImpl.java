package com.dragon.portal.service.rscmgmt.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.dragon.portal.dao.rscmgmt.IMeetingroomOpenrangeDao;
import com.dragon.portal.model.rscmgmt.MeetingroomOpenrange;
import com.dragon.portal.service.rscmgmt.IMeetingroomOpenrangeService;

/**
 * @Title:会议室-开放范围Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:54:56
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingroomOpenrangeServiceImpl implements IMeetingroomOpenrangeService {

	@Resource
	private IMeetingroomOpenrangeDao meetingroomOpenrangeDao;

	@Override
	public MeetingroomOpenrange getMeetingroomOpenrangeById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingroomOpenrangeDao.getMeetingroomOpenrangeById(id.trim()) : null;
	}

	@Override
	public List<MeetingroomOpenrange> getAll(MeetingroomOpenrange meetingroomOpenrange) throws Exception {
		return null != meetingroomOpenrange ? this.meetingroomOpenrangeDao.getAll(meetingroomOpenrange) : null;
	}

	@Override
	public PagerModel<MeetingroomOpenrange> getPagerModelByQuery(MeetingroomOpenrange meetingroomOpenrange, Query query)
			throws Exception {
		return (null != meetingroomOpenrange && null != query) ? this.meetingroomOpenrangeDao.getPagerModelByQuery(meetingroomOpenrange, query) : null;
	}

	@Override
	public void insertMeetingroomOpenrange(MeetingroomOpenrange meetingroomOpenrange) throws Exception {
		if (null != meetingroomOpenrange) {
			meetingroomOpenrange.setId(UUIDGenerator.generate());
			meetingroomOpenrange.setCreateTime(new Date());
			meetingroomOpenrange.setUpdateTime(new Date());
			this.meetingroomOpenrangeDao.insertMeetingroomOpenrange(meetingroomOpenrange);
		}
	}
	
	@Override
	public void delMeetingroomOpenrangeById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingroomOpenrangeDao.delMeetingroomOpenrangeById(id.trim());
		}
	}
	
	@Override
	public void delMeetingroomOpenrangeByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingroomOpenrangeDao.delMeetingroomOpenrangeByIds(ids);
		}
	}
	
	@Override
	public void delMeetingroomOpenrangeByMeetingRoomId(String meetingRoomId) throws Exception {
		if (StringUtils.isNotBlank(meetingRoomId)) {
			this.meetingroomOpenrangeDao.delMeetingroomOpenrangeByMeetingRoomId(meetingRoomId.trim());
		}
	}
	
	@Override
	public void updateMeetingroomOpenrange(MeetingroomOpenrange meetingroomOpenrange) throws Exception {
		if (null != meetingroomOpenrange) {
			meetingroomOpenrange.setUpdateTime(new Date());
			this.meetingroomOpenrangeDao.updateMeetingroomOpenrange(meetingroomOpenrange);
		}
	}

	@Override
	public void updateMeetingroomOpenrangeByIds(String ids,MeetingroomOpenrange meetingroomOpenrange) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingroomOpenrange) {
			meetingroomOpenrange.setUpdateTime(new Date());
			this.meetingroomOpenrangeDao.updateMeetingroomOpenrangeByIds(ids, meetingroomOpenrange);
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

