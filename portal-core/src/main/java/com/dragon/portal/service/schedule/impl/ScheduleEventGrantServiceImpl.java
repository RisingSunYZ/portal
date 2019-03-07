package com.dragon.portal.service.schedule.impl;

import com.mhome.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.portal.dao.schedule.IScheduleEventGrantDao;
import com.dragon.portal.model.schedule.ScheduleEventGrant;
import com.dragon.portal.service.schedule.IScheduleEventGrantService;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

/**
 * @Title:日程事件授权Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-23 10:51:11
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class ScheduleEventGrantServiceImpl implements IScheduleEventGrantService {

	@Resource
	private IScheduleEventGrantDao scheduleEventGrantDao;

	@Override
	public ScheduleEventGrant getScheduleEventGrantById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.scheduleEventGrantDao.getScheduleEventGrantById(id.trim()) : null;
	}

	@Override
	public List<ScheduleEventGrant> getAll(ScheduleEventGrant scheduleEventGrant) throws Exception {
		return null != scheduleEventGrant ? this.scheduleEventGrantDao.getAll(scheduleEventGrant) : null;
	}

	@Override
	public PagerModel<ScheduleEventGrant> getPagerModelByQuery(ScheduleEventGrant scheduleEventGrant, Query query)
			throws Exception {
		return (null != scheduleEventGrant && null != query) ? this.scheduleEventGrantDao.getPagerModelByQuery(scheduleEventGrant, query) : null;
	}

	@Override
	public void insertScheduleEventGrant(ScheduleEventGrant scheduleEventGrant) throws Exception {
		if (null != scheduleEventGrant) {
			scheduleEventGrant.setId(UUIDGenerator.generate());
			scheduleEventGrant.setCreateTime(new Date());
			scheduleEventGrant.setUpdateTime(new Date());
			this.scheduleEventGrantDao.insertScheduleEventGrant(scheduleEventGrant);
		}
	}
	
	@Override
	public void delScheduleEventGrantById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.scheduleEventGrantDao.delScheduleEventGrantById(id.trim());
		}
	}
	
	@Override
	public void delScheduleEventGrantByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.scheduleEventGrantDao.delScheduleEventGrantByIds(ids);
		}
	}
	
	@Override
	public void updateScheduleEventGrant(ScheduleEventGrant scheduleEventGrant) throws Exception {
		if (null != scheduleEventGrant) {
			scheduleEventGrant.setUpdateTime(new Date());
			this.scheduleEventGrantDao.updateScheduleEventGrant(scheduleEventGrant);
		}
	}

	@Override
	public void updateScheduleEventGrantByIds(String ids,ScheduleEventGrant scheduleEventGrant) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != scheduleEventGrant) {
			scheduleEventGrant.setUpdateTime(new Date());
			this.scheduleEventGrantDao.updateScheduleEventGrantByIds(ids, scheduleEventGrant);
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
	public List<ScheduleEventGrant> getScheduleEventGrantByGrantPersonNo(String grantPersonNo) throws Exception {
		return StringUtils.isNotBlank(grantPersonNo) ? this.scheduleEventGrantDao.getScheduleEventGrantByGrantPersonNo(grantPersonNo) : null;
	}
	
	@Override
	public List<ScheduleEventGrant> getScheduleEventGrantByGrantedPersonNo(String grantedPersonNo) throws Exception {
		return StringUtils.isNotBlank(grantedPersonNo) ? this.scheduleEventGrantDao.getScheduleEventGrantByGrantedPersonNo(grantedPersonNo) : null;
	}

	@Override
	public void insertScheduleEventGrants(List<ScheduleEventGrant> scheduleEventGrants) throws Exception {
		if (null != scheduleEventGrants) {
			this.scheduleEventGrantDao.insertScheduleEventGrants(scheduleEventGrants);
		}
		
	}

	@Override
	public void updateScheduleEventGrants(List<ScheduleEventGrant> scheduleEventGrants) throws Exception {
		if (null != scheduleEventGrants) {
			this.scheduleEventGrantDao.updateScheduleEventGrants(scheduleEventGrants);
		}
		
	}

	/**
	 * 添加或修改日程授权
	 */
	@Override
	public void addOrUpdateScheduleEventGrant(List<ScheduleEventGrant> scheduleEventGrantsNew,List<ScheduleEventGrant> scheduleEventGrantsEdit) throws Exception {
		if(scheduleEventGrantsNew.size() > 0){
            List<ScheduleEventGrant> oldScheduleEventGrantList = this.scheduleEventGrantDao.getScheduleEventGrantByGrantPersonNo(scheduleEventGrantsNew.get(0).getGrantPersonNo());
            List<ScheduleEventGrant> newList = new ArrayList<ScheduleEventGrant>();
			if(oldScheduleEventGrantList != null){
				if(oldScheduleEventGrantList.size() > 0){
					//根据授权人查询的被授权人不为空
					Map news = new HashMap();
					for(ScheduleEventGrant g : oldScheduleEventGrantList){
						news.put(g.getGrantedPersonNo(), g);
					}
					//验证用户是否已经授权
					for(ScheduleEventGrant s : scheduleEventGrantsNew){
						ScheduleEventGrant grant = (ScheduleEventGrant)news.get(s.getGrantedPersonNo());
						if(grant == null){
							s.setId(UUIDGenerator.generate());
							newList.add(s);
						}else{
							int grantType = grant.getGrantType();
							if(grantType != s.getGrantType()){
								s.setId(grant.getId());
								scheduleEventGrantsEdit.add(s);
							}
						}
					}
				}else{//根据授权人查询的被授权人为空
					newList = scheduleEventGrantsNew;
					for(ScheduleEventGrant s : newList){
						s.setId(UUIDGenerator.generate());
					}
				}
			}
			if(newList.size() > 0){
				this.scheduleEventGrantDao.insertScheduleEventGrants(newList);
			}
            scheduleEventGrantsNew.addAll(scheduleEventGrantsEdit);
            for(ScheduleEventGrant l : oldScheduleEventGrantList){
                if(!scheduleEventGrantsNew.contains(l)){
                    this.scheduleEventGrantDao.delScheduleEventGrantById(l.getId());
                }
            }
		}
		if(scheduleEventGrantsEdit.size() > 0){
			this.scheduleEventGrantDao.updateScheduleEventGrants(scheduleEventGrantsEdit);
		}

	}
}

