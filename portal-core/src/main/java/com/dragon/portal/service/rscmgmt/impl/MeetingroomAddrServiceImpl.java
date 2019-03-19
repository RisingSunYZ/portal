package com.dragon.portal.service.rscmgmt.impl;

import com.dragon.portal.dao.rscmgmt.IMeetingroomAddrDao;
import com.dragon.portal.model.rscmgmt.MeetingroomAddr;
import com.dragon.portal.service.rscmgmt.IMeetingroomAddrService;
import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * @Title:会议室管理地点管理Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 10:17:17
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingroomAddrServiceImpl implements IMeetingroomAddrService {

	@Resource
	private IMeetingroomAddrDao meetingroomAddrDao;

	@Override
	public MeetingroomAddr getMeetingroomAddrById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingroomAddrDao.getMeetingroomAddrById(id.trim()) : null;
	}

	@Override
	public List<MeetingroomAddr> getAll(MeetingroomAddr meetingroomAddr) throws Exception {
		return null != meetingroomAddr ? this.meetingroomAddrDao.getAll(meetingroomAddr) : null;
	}
	@Override
	public List<MeetingroomAddr> getAllByAdmin(MeetingroomAddr meetingroomAddr) throws Exception {
		return null != meetingroomAddr ? this.meetingroomAddrDao.getAllByAdmin(meetingroomAddr) : null;
	}
	@Override
	public PagerModel<MeetingroomAddr> getPagerModelByQuery(MeetingroomAddr meetingroomAddr, Query query)
			throws Exception {
		return (null != meetingroomAddr && null != query) ? this.meetingroomAddrDao.getPagerModelByQuery(meetingroomAddr, query) : null;
	}

	@Override
	public void insertMeetingroomAddr(MeetingroomAddr meetingroomAddr) throws Exception {
		if (null != meetingroomAddr) {
			meetingroomAddr.setId(UUIDGenerator.generate());
			meetingroomAddr.setCreateTime(new Date());
			meetingroomAddr.setUpdateTime(new Date());
			this.meetingroomAddrDao.insertMeetingroomAddr(meetingroomAddr);
		}
	}
	
	@Override
	public void delMeetingroomAddrById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingroomAddrDao.delMeetingroomAddrById(id.trim());
		}
	}
	
	@Override
	public void delMeetingroomAddrByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingroomAddrDao.delMeetingroomAddrByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingroomAddr(MeetingroomAddr meetingroomAddr) throws Exception {
		if (null != meetingroomAddr) {
			meetingroomAddr.setUpdateTime(new Date());
			this.meetingroomAddrDao.updateMeetingroomAddr(meetingroomAddr);
		}
	}

	@Override
	public void updateMeetingroomAddrByIds(String ids,MeetingroomAddr meetingroomAddr) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingroomAddr) {
			meetingroomAddr.setUpdateTime(new Date());
			this.meetingroomAddrDao.updateMeetingroomAddrByIds(ids, meetingroomAddr);
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

