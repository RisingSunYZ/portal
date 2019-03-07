package com.dragon.portal.service.rscmgmt.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.dragon.portal.dao.rscmgmt.IMeetingroomAddrAdminDao;
import com.dragon.portal.model.rscmgmt.MeetingroomAddrAdmin;
import com.dragon.portal.service.rscmgmt.IMeetingroomAddrAdminService;

/**
 * @Title:会议室-地点管理员Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-14 10:11:42
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingroomAddrAdminServiceImpl implements IMeetingroomAddrAdminService {

	@Resource
	private IMeetingroomAddrAdminDao meetingroomAddrAdminDao;

	@Override
	public MeetingroomAddrAdmin getMeetingroomAddrAdminById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingroomAddrAdminDao.getMeetingroomAddrAdminById(id.trim()) : null;
	}

	@Override
	public List<MeetingroomAddrAdmin> getAll(MeetingroomAddrAdmin meetingroomAddrAdmin) throws Exception {
		return null != meetingroomAddrAdmin ? this.meetingroomAddrAdminDao.getAll(meetingroomAddrAdmin) : null;
	}

	@Override
	public PagerModel<MeetingroomAddrAdmin> getPagerModelByQuery(MeetingroomAddrAdmin meetingroomAddrAdmin, Query query)
			throws Exception {
		return (null != meetingroomAddrAdmin && null != query) ? this.meetingroomAddrAdminDao.getPagerModelByQuery(meetingroomAddrAdmin, query) : null;
	}

	@Override
	public void insertMeetingroomAddrAdmin(MeetingroomAddrAdmin meetingroomAddrAdmin) throws Exception {
		if (null != meetingroomAddrAdmin) {
			meetingroomAddrAdmin.setId(UUIDGenerator.generate());
			meetingroomAddrAdmin.setCreateTime(new Date());
			meetingroomAddrAdmin.setUpdateTime(new Date());
			this.meetingroomAddrAdminDao.insertMeetingroomAddrAdmin(meetingroomAddrAdmin);
		}
	}
	
	@Override
	public void delMeetingroomAddrAdminById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingroomAddrAdminDao.delMeetingroomAddrAdminById(id.trim());
		}
	}
	
	@Override
	public void delMeetingroomApproverByAddrId(String addrId) throws Exception {
		if (StringUtils.isNotBlank(addrId)) {
			this.meetingroomAddrAdminDao.delMeetingroomApproverByAddrId(addrId.trim());
		}
	}
	
	@Override
	public void delMeetingroomAddrAdminByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingroomAddrAdminDao.delMeetingroomAddrAdminByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingroomAddrAdmin(MeetingroomAddrAdmin meetingroomAddrAdmin) throws Exception {
		if (null != meetingroomAddrAdmin) {
			meetingroomAddrAdmin.setUpdateTime(new Date());
			this.meetingroomAddrAdminDao.updateMeetingroomAddrAdmin(meetingroomAddrAdmin);
		}
	}

	@Override
	public void updateMeetingroomAddrAdminByIds(String ids,MeetingroomAddrAdmin meetingroomAddrAdmin) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingroomAddrAdmin) {
			meetingroomAddrAdmin.setUpdateTime(new Date());
			this.meetingroomAddrAdminDao.updateMeetingroomAddrAdminByIds(ids, meetingroomAddrAdmin);
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

