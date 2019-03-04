package com.dragon.portal.service.rscmgmt.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.dragon.portal.dao.rscmgmt.IMeetingroomToolsDao;
import com.dragon.portal.model.rscmgmt.MeetingroomApprover;
import com.dragon.portal.model.rscmgmt.MeetingroomTools;
import com.dragon.portal.service.rscmgmt.IMeetingroomToolsService;

/**
 * @Title:会议室配置用具项Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:55:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingroomToolsServiceImpl implements IMeetingroomToolsService {

	@Resource
	private IMeetingroomToolsDao meetingroomToolsDao;

	@Override
	public MeetingroomTools getMeetingroomToolsById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingroomToolsDao.getMeetingroomToolsById(id.trim()) : null;
	}

	@Override
	public List<MeetingroomTools> getAll(MeetingroomTools meetingroomTools) throws Exception {
		return null != meetingroomTools ? this.meetingroomToolsDao.getAll(meetingroomTools) : null;
	}

	@Override
	public PagerModel<MeetingroomTools> getPagerModelByQuery(MeetingroomTools meetingroomTools, Query query)
			throws Exception {
		return (null != meetingroomTools && null != query) ? this.meetingroomToolsDao.getPagerModelByQuery(meetingroomTools, query) : null;
	}

	@Override
	public void insertMeetingroomTools(MeetingroomTools meetingroomTools) throws Exception {
		if (null != meetingroomTools) {
			meetingroomTools.setId(UUIDGenerator.generate());
			meetingroomTools.setCreateTime(new Date());
			meetingroomTools.setUpdateTime(new Date());
			this.meetingroomToolsDao.insertMeetingroomTools(meetingroomTools);
		}
	}
	
	@Override
	public void delMeetingroomToolsById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingroomToolsDao.delMeetingroomToolsById(id.trim());
		}
	}
	
	@Override
	public void delMeetingroomToolsByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingroomToolsDao.delMeetingroomToolsByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingroomTools(MeetingroomTools meetingroomTools) throws Exception {
		if (null != meetingroomTools) {
			meetingroomTools.setUpdateTime(new Date());
			this.meetingroomToolsDao.updateMeetingroomTools(meetingroomTools);
		}
	}

	@Override
	public void updateMeetingroomToolsByIds(String ids,MeetingroomTools meetingroomTools) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingroomTools) {
			meetingroomTools.setUpdateTime(new Date());
			this.meetingroomToolsDao.updateMeetingroomToolsByIds(ids, meetingroomTools);
		}
	}
	
	@Override
	public List<MeetingroomTools> selectMeetingRoomTollsBymeetingRoomId(String mettingroomId) throws Exception {
		return null != mettingroomId ? this.meetingroomToolsDao.selectMeetingRoomTollsBymeetingRoomId(mettingroomId) : null;
	}
	@Override
	public List<MeetingroomApprover> selectAppoverListBymeetingRoomId(String meetingroomId) {
		
		return null != meetingroomId ? this.meetingroomToolsDao.selectAppoverListBymeetingRoomId(meetingroomId) : null;
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

