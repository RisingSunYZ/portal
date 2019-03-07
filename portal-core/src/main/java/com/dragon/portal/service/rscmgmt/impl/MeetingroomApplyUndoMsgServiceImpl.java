package com.dragon.portal.service.rscmgmt.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.dragon.portal.dao.rscmgmt.IMeetingroomApplyUndoMsgDao;
import com.dragon.portal.model.rscmgmt.MeetingroomApplyUndoMsg;
import com.dragon.portal.service.rscmgmt.IMeetingroomApplyUndoMsgService;

/**
 * @Title:会议室取消申请备注表Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-20 08:49:12
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingroomApplyUndoMsgServiceImpl implements IMeetingroomApplyUndoMsgService {

	@Resource
	private IMeetingroomApplyUndoMsgDao meetingroomApplyUndoMsgDao;

	@Override
	public MeetingroomApplyUndoMsg getMeetingroomApplyUndoMsgById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingroomApplyUndoMsgDao.getMeetingroomApplyUndoMsgById(id.trim()) : null;
	}

	@Override
	public List<MeetingroomApplyUndoMsg> getAll(MeetingroomApplyUndoMsg meetingroomApplyUndoMsg) throws Exception {
		return null != meetingroomApplyUndoMsg ? this.meetingroomApplyUndoMsgDao.getAll(meetingroomApplyUndoMsg) : null;
	}

	@Override
	public PagerModel<MeetingroomApplyUndoMsg> getPagerModelByQuery(MeetingroomApplyUndoMsg meetingroomApplyUndoMsg, Query query)
			throws Exception {
		return (null != meetingroomApplyUndoMsg && null != query) ? this.meetingroomApplyUndoMsgDao.getPagerModelByQuery(meetingroomApplyUndoMsg, query) : null;
	}

	@Override
	public void insertMeetingroomApplyUndoMsg(MeetingroomApplyUndoMsg meetingroomApplyUndoMsg) throws Exception {
		if (null != meetingroomApplyUndoMsg) {
			meetingroomApplyUndoMsg.setId(UUIDGenerator.generate());
			meetingroomApplyUndoMsg.setCreateTime(new Date());
			meetingroomApplyUndoMsg.setUpdateTime(new Date());
			this.meetingroomApplyUndoMsgDao.insertMeetingroomApplyUndoMsg(meetingroomApplyUndoMsg);
		}
	}
	
	@Override
	public void delMeetingroomApplyUndoMsgById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingroomApplyUndoMsgDao.delMeetingroomApplyUndoMsgById(id.trim());
		}
	}
	
	@Override
	public void delMeetingroomApplyUndoMsgByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingroomApplyUndoMsgDao.delMeetingroomApplyUndoMsgByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingroomApplyUndoMsg(MeetingroomApplyUndoMsg meetingroomApplyUndoMsg) throws Exception {
		if (null != meetingroomApplyUndoMsg) {
			meetingroomApplyUndoMsg.setUpdateTime(new Date());
			this.meetingroomApplyUndoMsgDao.updateMeetingroomApplyUndoMsg(meetingroomApplyUndoMsg);
		}
	}

	@Override
	public void updateMeetingroomApplyUndoMsgByIds(String ids,MeetingroomApplyUndoMsg meetingroomApplyUndoMsg) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingroomApplyUndoMsg) {
			meetingroomApplyUndoMsg.setUpdateTime(new Date());
			this.meetingroomApplyUndoMsgDao.updateMeetingroomApplyUndoMsgByIds(ids, meetingroomApplyUndoMsg);
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

