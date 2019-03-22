package com.dragon.portal.service.schedule.impl;

import com.dragon.portal.component.IScheduleComponent;
import com.dragon.portal.dao.schedule.IScheduleEventDao;
import com.dragon.portal.model.rscmgmt.AppointmentVO;
import com.dragon.portal.model.schedule.ScheduleEvent;
import com.dragon.portal.service.schedule.IScheduleEventService;
import com.dragon.portal.util.DateUtils;
import com.dragon.tools.common.DateUtil;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import com.mhome.tools.common.UUIDGenerator;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title:日程事件Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-23 10:28:50
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class ScheduleEventServiceImpl implements IScheduleEventService {
	public final int ERROR = 0;
	public final int SUCCESS = 1;

	@Resource
	private IScheduleEventDao scheduleEventDao;
	@Resource
	private IScheduleComponent scheduleComponent;
	@Resource
	private IPersonnelApi personnelApi;

	@Override
	public ScheduleEvent getScheduleEventById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.scheduleEventDao.getScheduleEventById(id.trim()) : null;
	}

	@Override
	public List<ScheduleEvent> getAll(ScheduleEvent scheduleEvent) throws Exception {
		return null != scheduleEvent ? this.scheduleEventDao.getAll(scheduleEvent) : null;
	}

	@Override
	public PagerModel<ScheduleEvent> getPagerModelByQuery(ScheduleEvent scheduleEvent, Query query)
			throws Exception {
		return (null != scheduleEvent && null != query) ? this.scheduleEventDao.getPagerModelByQuery(scheduleEvent, query) : null;
	}

	@Override
	public void insertScheduleEvent(ScheduleEvent scheduleEvent) throws Exception {
		if (null != scheduleEvent) {
			
			scheduleEvent.setId(UUIDGenerator.generate());
			scheduleEvent.setCreateTime(new Date());
			scheduleEvent.setUpdateTime(new Date());
			this.scheduleEventDao.insertScheduleEvent(scheduleEvent);
		}
	}
	
	@Override
	public void delScheduleEventById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.scheduleEventDao.delScheduleEventById(id.trim());
		}
	}
	
	@Override
	public void delScheduleEventByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.scheduleEventDao.delScheduleEventByIds(ids);
		}
	}
	
	@Override
	public void updateScheduleEvent(ScheduleEvent scheduleEvent) throws Exception {
		if (null != scheduleEvent) {
			scheduleEvent.setUpdateTime(new Date());
			this.scheduleEventDao.updateScheduleEvent(scheduleEvent);
		}
	}

	@Override
	public void updateScheduleEventByIds(String ids,ScheduleEvent scheduleEvent) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != scheduleEvent) {
			scheduleEvent.setUpdateTime(new Date());
			this.scheduleEventDao.updateScheduleEventByIds(ids, scheduleEvent);
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
	public List<ScheduleEvent> getScheduleEvenList(ScheduleEvent scheduleEvent,String personNos) throws Exception {
		personNos = this.converString(personNos);
		Map<String,Object> params = new HashMap<String, Object>();
		params.put("personNos", personNos);
		params.put("scheduleEvent", scheduleEvent);
		return null != scheduleEvent ? this.scheduleEventDao.getScheduleEvenList(params) : null;
	}

	@Override
	public void insertScheduleEvents(List<ScheduleEvent> scheduleEvents) throws Exception {
		if (null != scheduleEvents) {
			this.scheduleEventDao.insertScheduleEvents(scheduleEvents);
		}
		
	}

	@Override
	public List<ScheduleEvent> getScheduleEventByMeetingId(String meetingId) throws Exception {
		return StringUtils.isNotBlank(meetingId) ? this.scheduleEventDao.getScheduleEventByMeetingId(meetingId) : null;
		 
	}
	
	/**
	 * 删除日程及同步exchange
	 */
	@Override
	public ReturnVo<String> delScheduleEvent(ScheduleEvent scheduleEvent) throws Exception {
		ReturnVo<String> resultVO = new ReturnVo<String>();
		if (StringUtils.isNotBlank(scheduleEvent.getId())) {
			ScheduleEvent sh = this.scheduleEventDao.getScheduleEventById(scheduleEvent.getId());
			if(sh != null){
				//查询日程接收人邮箱
				com.ys.tools.vo.ReturnVo<PersonnelApiVo> person = personnelApi.getPersonnelApiVoByNo(sh.getReceiveNo());
				PersonnelApiVo personnelApiVo = person.getData();
				
				scheduleEvent.setEmail(personnelApiVo.getEmail());
				scheduleEvent.setChangeId(sh.getChangeId());
				scheduleEvent.setChangeKey(sh.getChangeKey());
				scheduleEvent.setOldStart(sh.getStartTime());
				scheduleEvent.setOldEnd(sh.getEndTime());
				//删除exchange日程信息
				AppointmentVO appointmentVO = scheduleEventToAppointment(scheduleEvent);
				ReturnVo<AppointmentVO> result = scheduleComponent.deleteScheduleEvent(appointmentVO);
				if(result.getCode() == ReturnCode.SUCCESS){
					//删除本地日程
					this.scheduleEventDao.delScheduleEventById(scheduleEvent.getId().trim());
					resultVO.setCode(ReturnCode.SUCCESS);
					resultVO.setMsg("日程删除成功！！！");
				}else{
					resultVO.setCode(ReturnCode.FAIL);
					resultVO.setMsg("删除exchange日程失败！！！");
				}
			}else{
				resultVO.setCode(ReturnCode.FAIL);
				resultVO.setMsg("日程已经删除！！！");
			}
		}else{
			resultVO.setCode(ReturnCode.FAIL);
			resultVO.setMsg("日程已经删除，请刷新页面！");
		}
		return resultVO;
	}

	/**
	 * 保存（添加或修改）日程
	 */
	@Override
	public ReturnVo<String> addOrUpdateScheduleEvent(ScheduleEvent scheduleEvent) throws Exception {
		ReturnVo<String> returnResult = new ReturnVo<String>();
		com.ys.tools.vo.ReturnVo<PersonnelApiVo> person = null;
		PersonnelApiVo personnelApiVo = null;
		
		if(StringUtils.isNotBlank(scheduleEvent.getStart())){
			scheduleEvent.setStartTime(DateUtils.StringToDate(scheduleEvent.getStart(), "yyyy-MM-dd HH:mm:ss"));
		}
		if(StringUtils.isNotBlank(scheduleEvent.getEnd())){
			scheduleEvent.setEndTime(DateUtils.StringToDate(scheduleEvent.getEnd(), "yyyy-MM-dd HH:mm:ss"));
		}
		if(StringUtils.isBlank(scheduleEvent.getId())){
			//添加日程操作
			scheduleEvent.setId(UUIDGenerator.generate());
			scheduleEvent.setCreateTime(new Date());
			scheduleEvent.setUpdateTime(new Date());
			scheduleEvent.setCreator(scheduleEvent.getUserNo());
			scheduleEvent.setUpdator(scheduleEvent.getUserNo());
			if(StringUtils.isBlank(scheduleEvent.getReceiveNo())){
				scheduleEvent.setReceiveNo(scheduleEvent.getUserNo());
			}
			scheduleEvent.setDelFlag(1);
			//person = personnelApi.getPersonnelApiVoByNo(scheduleEvent.getUserNo());
			person = personnelApi.getPersonnelApiVoByNo(scheduleEvent.getReceiveNo());
			if(person.getCode() == SUCCESS){
				personnelApiVo = person.getData();
				scheduleEvent.setEmail(personnelApiVo.getEmail());
				//exchange插入日程
				AppointmentVO appointmentVO = scheduleEventToAppointment(scheduleEvent);
				ReturnVo<AppointmentVO> result = scheduleComponent.insertScheduleEvent(appointmentVO);
				if(result.getCode() == ReturnCode.SUCCESS){
					AppointmentVO vo = result.getData();
					scheduleEvent.setChangeId(vo.getChangeId());
					scheduleEvent.setChangeKey(vo.getChangeKey());
					this.scheduleEventDao.insertScheduleEvent(scheduleEvent);
					returnResult.setCode(ReturnCode.SUCCESS);
					returnResult.setMsg("添加日程信息成功！");
				}else{
					returnResult.setCode(ReturnCode.FAIL);
					returnResult.setMsg("exchange插入日程失败");
				}
			}else{
				returnResult.setCode(ReturnCode.FAIL);
				returnResult.setMsg("查询人员信息为空");
			}
		}else{
			//修改日程操作
			scheduleEvent.setUpdator(scheduleEvent.getUserNo());
			ScheduleEvent sh = this.scheduleEventDao.getScheduleEventById(scheduleEvent.getId());
			if(sh !=null){//数据不为空
				//修改exchange日程信息
				person = personnelApi.getPersonnelApiVoByNo(sh.getReceiveNo());
				if(person.getCode() == SUCCESS){
					personnelApiVo = person.getData();
					scheduleEvent.setEmail(personnelApiVo.getEmail());
					scheduleEvent.setOldStart(sh.getStartTime());
					scheduleEvent.setOldEnd(sh.getEndTime());
					scheduleEvent.setChangeId(sh.getChangeId());
					scheduleEvent.setChangeKey(sh.getChangeKey());
					AppointmentVO appointmentVO = scheduleEventToAppointment(scheduleEvent);
					ReturnVo<AppointmentVO> result = scheduleComponent.updateScheduleEvent(appointmentVO);
					if(result.getCode() == ReturnCode.SUCCESS){
						scheduleEvent.setUpdateTime(new Date());
						this.scheduleEventDao.updateScheduleEvent(scheduleEvent);
						returnResult.setCode(ReturnCode.SUCCESS);
						returnResult.setMsg("修改日程信息成功！");
					}else{
						returnResult.setCode(ReturnCode.FAIL);
						returnResult.setMsg("exchange更新日程失败");
					}
				}else{
					returnResult.setCode(ReturnCode.FAIL);
					returnResult.setMsg("查询人员信息为空");
				}
			}else{
				returnResult.setCode(ReturnCode.FAIL);
				returnResult.setMsg("id不正确，查询日程信息为空");
			}
		}
		return returnResult;
	}
	/**
	 * ScheduleEvent转换为AppointmentVO
	 * @param scheduleEvent
	 * @return
	 */
	private AppointmentVO scheduleEventToAppointment(ScheduleEvent scheduleEvent){
		AppointmentVO appointmentVO = new AppointmentVO();
		appointmentVO.setEmail(scheduleEvent.getEmail());
		appointmentVO.setAddress(scheduleEvent.getAddress());
		appointmentVO.setContent(scheduleEvent.getContent());
		appointmentVO.setTitle(scheduleEvent.getTitle());
		if(scheduleEvent.getIsAllDay() == null){
			appointmentVO.setAllDay(false);
		}else{
			if(scheduleEvent.getIsAllDay()==1){
				appointmentVO.setAllDay(true);
			}else if(scheduleEvent.getIsAllDay()==0){
				appointmentVO.setAllDay(false);
			}
		}
		appointmentVO.setStart(DateUtil.format(scheduleEvent.getStartTime(),"yyyy-MM-dd HH:mm:ss"));
		appointmentVO.setEnd(DateUtil.format(scheduleEvent.getEndTime(),"yyyy-MM-dd HH:mm:ss"));
		if(StringUtils.isNotBlank(scheduleEvent.getId())){
			appointmentVO.setChangeId(scheduleEvent.getChangeId());
			appointmentVO.setChangeKey(scheduleEvent.getChangeKey());
			appointmentVO.setOldStart(DateUtil.format(scheduleEvent.getOldStart(),"yyyy-MM-dd HH:mm:ss"));
			appointmentVO.setOldEnd(DateUtil.format(scheduleEvent.getOldEnd(),"yyyy-MM-dd HH:mm:ss"));
		}
		return appointmentVO;
	}

	@Override
	public List<ScheduleEvent> getAllEvent(ScheduleEvent scheduleEvent) throws Exception {
		return null != scheduleEvent ? this.scheduleEventDao.getAllEvent(scheduleEvent) : null;
	}
	
}

