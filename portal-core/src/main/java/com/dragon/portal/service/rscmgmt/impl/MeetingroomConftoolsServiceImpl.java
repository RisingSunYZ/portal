package com.dragon.portal.service.rscmgmt.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.dragon.portal.dao.rscmgmt.IMeetingroomConftoolsDao;
import com.dragon.portal.model.rscmgmt.MeetingroomConftools;
import com.dragon.portal.service.rscmgmt.IMeetingroomConftoolsService;

/**
 * @Title:会议室-会议室配置用具项中间表Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:54:12
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingroomConftoolsServiceImpl implements IMeetingroomConftoolsService {

	@Resource
	private IMeetingroomConftoolsDao meetingroomConftoolsDao;

	@Override
	public MeetingroomConftools getMeetingroomConftoolsById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingroomConftoolsDao.getMeetingroomConftoolsById(id.trim()) : null;
	}

	@Override
	public List<MeetingroomConftools> getAll(MeetingroomConftools meetingroomConftools) throws Exception {
		return null != meetingroomConftools ? this.meetingroomConftoolsDao.getAll(meetingroomConftools) : null;
	}

	@Override
	public PagerModel<MeetingroomConftools> getPagerModelByQuery(MeetingroomConftools meetingroomConftools, Query query)
			throws Exception {
		return (null != meetingroomConftools && null != query) ? this.meetingroomConftoolsDao.getPagerModelByQuery(meetingroomConftools, query) : null;
	}

	@Override
	public void insertMeetingroomConftools(MeetingroomConftools meetingroomConftools) throws Exception {
		if (null != meetingroomConftools) {
			meetingroomConftools.setId(UUIDGenerator.generate());
			meetingroomConftools.setCreateTime(new Date());
			meetingroomConftools.setUpdateTime(new Date());
			this.meetingroomConftoolsDao.insertMeetingroomConftools(meetingroomConftools);
		}
	}
	
	@Override
	public void delMeetingroomConftoolsById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingroomConftoolsDao.delMeetingroomConftoolsById(id.trim());
		}
	}
	
	@Override
	public void delMeetingroomConftoolsByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingroomConftoolsDao.delMeetingroomConftoolsByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingroomConftools(MeetingroomConftools meetingroomConftools) throws Exception {
		if (null != meetingroomConftools) {
			meetingroomConftools.setUpdateTime(new Date());
			this.meetingroomConftoolsDao.updateMeetingroomConftools(meetingroomConftools);
		}
	}

	@Override
	public void updateMeetingroomConftoolsByIds(String ids,MeetingroomConftools meetingroomConftools) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingroomConftools) {
			meetingroomConftools.setUpdateTime(new Date());
			this.meetingroomConftoolsDao.updateMeetingroomConftoolsByIds(ids, meetingroomConftools);
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
	public MeetingroomConftools getMeetingroomConftoolsByMettingroomId(String mettingroomId) throws Exception {
		return null  != mettingroomId ? this.meetingroomConftoolsDao.getMeetingroomConftoolsByMettingroomId(mettingroomId) : null;
	}
}

