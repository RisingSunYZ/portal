package com.dragon.portal.service.rscmgmt.impl;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.mhome.tools.common.UUIDGenerator;
import com.dragon.portal.dao.rscmgmt.IMeetingroomConftoolsDao;
import com.dragon.portal.dao.rscmgmt.IMeetingroomDao;
import com.dragon.portal.model.rscmgmt.Meetingroom;
import com.dragon.portal.model.rscmgmt.MeetingroomApprover;
import com.dragon.portal.model.rscmgmt.MeetingroomConftools;
import com.dragon.portal.model.rscmgmt.MeetingroomTools;
import com.dragon.portal.service.rscmgmt.IMeetingroomConftoolsService;
import com.dragon.portal.service.rscmgmt.IMeetingroomService;
import com.dragon.portal.service.rscmgmt.IMeetingroomToolsService;
import com.dragon.portal.vo.rscmgmt.MeetingroomViewVo;

/**
 * @Title:会议室管理Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:28:10
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingroomServiceImpl implements IMeetingroomService {

	@Resource
	private IMeetingroomDao meetingroomDao;
	@Resource
	private IMeetingroomConftoolsService meetingroomConftoolsService;
	@Resource
	private IMeetingroomToolsService meetingroomToolsService;
	@Resource
	private IMeetingroomConftoolsDao meetingroomConftoolsDao;
	
	@Override
	public Meetingroom getMeetingroomById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingroomDao.getMeetingroomById(id.trim()) : null;
	}

	@Override
	public List<Meetingroom> getAll(Meetingroom meetingroom) throws Exception {
		return null != meetingroom ? this.meetingroomDao.getAll(meetingroom) : null;
	}

	@Override
	public PagerModel<Meetingroom> getPagerModelByQuery(Meetingroom meetingroom, Query query)
			throws Exception {
		return (null != meetingroom && null != query) ? this.meetingroomDao.getPagerModelByQuery(meetingroom, query) : null;
	}

	@Override
	public void insertMeetingroom(Meetingroom meetingroom) throws Exception {
		if (null != meetingroom) {
			meetingroom.setId(UUIDGenerator.generate());
			meetingroom.setCreateTime(new Date());
			meetingroom.setUpdateTime(new Date());
			this.meetingroomDao.insertMeetingroom(meetingroom);
		}
		List<String> toolIds =  meetingroom.getToolIds();
		//配置信息
		if(null != toolIds && toolIds.size()>0 ){
			for (int i = 0; i < toolIds.size(); i++) {
				//添加中间表数据
				MeetingroomConftools meetingroomConftools = new MeetingroomConftools();
				meetingroomConftools.setMettingroomId(meetingroom.getId());
				meetingroomConftools.setToolsId(toolIds.get(i).toString());
				this.meetingroomConftoolsService.insertMeetingroomConftools(meetingroomConftools);
			}
		}
		//其它配置信息
		if(null != meetingroom.getOtherTooIds() && StringUtils.isNotBlank(meetingroom.getOtherTooIds())){
			//添加中间表数据
			MeetingroomConftools meetingroomConftools = new MeetingroomConftools();
			meetingroomConftools.setMettingroomId(meetingroom.getId());
			meetingroomConftools.setOtherConfitem(meetingroom.getOtherTooIds());
			this.meetingroomConftoolsService.insertMeetingroomConftools(meetingroomConftools);
		}
		
	}
	
	@Override
	public void delMeetingroomById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.meetingroomDao.delMeetingroomById(id.trim());
		}
	}
	
	@Override
	public void delMeetingroomByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.meetingroomDao.delMeetingroomByIds(ids);
		}
	}
	
	@Override
	public void updateMeetingroom(Meetingroom meetingroom) throws Exception {
		if (null != meetingroom) {
			meetingroom.setUpdateTime(new Date());
			this.meetingroomDao.updateMeetingroom(meetingroom);
		}
		//先删除中间表的配置信息
		this.meetingroomConftoolsDao.delMeetingroomConftoolsByMettingRoomId(meetingroom.getId());
		List<String> toolIds =  meetingroom.getToolIds();
		//配置信息
		if(null != toolIds && toolIds.size()>0 ){
			for (int i = 0; i < toolIds.size(); i++) {
				//添加中间表数据
				MeetingroomConftools meetingroomConftools = new MeetingroomConftools();
				meetingroomConftools.setMettingroomId(meetingroom.getId());
				meetingroomConftools.setToolsId(toolIds.get(i).toString());
				this.meetingroomConftoolsService.insertMeetingroomConftools(meetingroomConftools);
			}
		}
		//其它配置信息
		if(null != meetingroom.getOtherTooIds() && StringUtils.isNotBlank(meetingroom.getOtherTooIds())){
			//添加中间表数据
			MeetingroomConftools meetingroomConftools = new MeetingroomConftools();
			meetingroomConftools.setMettingroomId(meetingroom.getId());
			meetingroomConftools.setOtherConfitem(meetingroom.getOtherTooIds());
			this.meetingroomConftoolsService.insertMeetingroomConftools(meetingroomConftools);
		}
	}

	@Override
	public void updateMeetingroomByIds(String ids,Meetingroom meetingroom) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meetingroom) {
			meetingroom.setUpdateTime(new Date());
			this.meetingroomDao.updateMeetingroomByIds(ids, meetingroom);
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
	public PagerModel<MeetingroomViewVo> getPagerModelByQuery(MeetingroomViewVo meetingroomViewVo, Query query)
			throws Exception {
		if(null != meetingroomViewVo && null != query){
			PagerModel<MeetingroomViewVo> pm = null;
			if(meetingroomViewVo.getIsAdmin()!=null){
				pm = this.meetingroomDao.getPagerModelVoByQueryOfAdmin(meetingroomViewVo, query);
			}
			pm = this.meetingroomDao.getPagerModelVoByQuery(meetingroomViewVo, query);
			for(MeetingroomViewVo temp : pm.getRows()){
				List<MeetingroomTools> mrToolsList = meetingroomToolsService.selectMeetingRoomTollsBymeetingRoomId(temp.getMeetingroomId());
				List<MeetingroomApprover> approverList = meetingroomToolsService.selectAppoverListBymeetingRoomId(temp.getMeetingroomId());
				temp.setTools(mrToolsList);
				temp.setApprover(approverList);
			}
			return pm;
		}
		return  null;
	}
}

