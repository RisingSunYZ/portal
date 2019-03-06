package com.dragon.portal.service.rscmgmt.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.dragon.portal.dao.rscmgmt.IMeetingroomApprovalLogDao;
import com.dragon.portal.model.rscmgmt.MeetingroomApprovalLog;
import com.dragon.portal.service.rscmgmt.IMeetingroomApprovalLogService;

/**
 * @Title:会议室审批表Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-14 10:20:59
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingroomApprovalLogServiceImpl implements IMeetingroomApprovalLogService {

	@Resource
	private IMeetingroomApprovalLogDao meetingroomApprovalLogDao;

	@Override
	public MeetingroomApprovalLog getMeetingroomApprovalLogById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingroomApprovalLogDao.getMeetingroomApprovalLogById(id.trim()) : null;
	}

	@Override
	public List<MeetingroomApprovalLog> getAll(MeetingroomApprovalLog meetingroomApprovalLog) throws Exception {
		return null != meetingroomApprovalLog ? this.meetingroomApprovalLogDao.getAll(meetingroomApprovalLog) : null;
	}

	@Override
	public PagerModel<MeetingroomApprovalLog> getPagerModelByQuery(MeetingroomApprovalLog meetingroomApprovalLog, Query query)
			throws Exception {
		return (null != meetingroomApprovalLog && null != query) ? this.meetingroomApprovalLogDao.getPagerModelByQuery(meetingroomApprovalLog, query) : null;
	}

	@Override
	public void insertMeetingroomApprovalLog(MeetingroomApprovalLog meetingroomApprovalLog) throws Exception {
		if (null != meetingroomApprovalLog) {
			meetingroomApprovalLog.setId(UUIDGenerator.generate());
			meetingroomApprovalLog.setCreateTime(new Date());
			meetingroomApprovalLog.setUpdateTime(new Date());
			this.meetingroomApprovalLogDao.insertMeetingroomApprovalLog(meetingroomApprovalLog);
		}
	}
	
	@Override
	public void delMeetingroomApprovalLogById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingroomApprovalLogDao.delMeetingroomApprovalLogById(id.trim());
		}
	}
	
	@Override
	public void delMeetingroomApprovalLogByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingroomApprovalLogDao.delMeetingroomApprovalLogByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingroomApprovalLog(MeetingroomApprovalLog meetingroomApprovalLog) throws Exception {
		if (null != meetingroomApprovalLog) {
			meetingroomApprovalLog.setUpdateTime(new Date());
			this.meetingroomApprovalLogDao.updateMeetingroomApprovalLog(meetingroomApprovalLog);
		}
	}

	@Override
	public void updateMeetingroomApprovalLogByIds(String ids,MeetingroomApprovalLog meetingroomApprovalLog) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingroomApprovalLog) {
			meetingroomApprovalLog.setUpdateTime(new Date());
			this.meetingroomApprovalLogDao.updateMeetingroomApprovalLogByIds(ids, meetingroomApprovalLog);
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

