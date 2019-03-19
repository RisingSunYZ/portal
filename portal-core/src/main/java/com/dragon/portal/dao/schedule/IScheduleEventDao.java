package com.dragon.portal.dao.schedule;

import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.portal.model.schedule.ScheduleEvent;

import java.util.List;

/**
 * @Title:日程事件Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-23 10:28:50
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IScheduleEventDao {

	/**
	 * 通过id得到日程事件ScheduleEvent
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public ScheduleEvent getScheduleEventById(String id) throws Exception;

	/**
	 * 得到所有日程事件ScheduleEvent
	 * @param scheduleEvent
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<ScheduleEvent> getAll(ScheduleEvent scheduleEvent) throws Exception;

	/**
	 * 分页查询日程事件ScheduleEvent
	 * @param scheduleEvent
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<ScheduleEvent> getPagerModelByQuery(ScheduleEvent scheduleEvent, Query query) throws Exception;

	/**
	 * 添加日程事件ScheduleEvent
	 * @param scheduleEvent
	 * @throws Exception
	 * @Description:
	 */
	public void insertScheduleEvent(ScheduleEvent scheduleEvent) throws Exception;
	
	/**
	 * 通过id删除日程事件ScheduleEvent
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delScheduleEventById(String id) throws Exception;
	
	/**
	 * 通过id批量删除日程事件ScheduleEvent
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delScheduleEventByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改日程事件ScheduleEvent
	 * @param scheduleEvent
	 * @throws Exception
	 * @Description:
	 */
	public void updateScheduleEvent(ScheduleEvent scheduleEvent) throws Exception;

	/**
	 * 通过ids批量修改日程事件ScheduleEvent
	 * @param ids 如："'1','2','3','4'..."
	 * @param scheduleEvent
	 * @throws Exception
	 * @Description:
	 */
	public void updateScheduleEventByIds(String ids, ScheduleEvent scheduleEvent) throws Exception;

	/**
	 * 根据条件查询日程
	 * @param scheduleEvent
	 * @throws Exception
	 */
	public List<ScheduleEvent> getScheduleEvenList(ScheduleEvent scheduleEvent, String personNos) throws Exception;
	
	/**
	 * 批量添加日程信息
	 * @param scheduleEvents
	 * @throws Exception
	 */
	public void insertScheduleEvents(List<ScheduleEvent> scheduleEvents) throws Exception;
	
	/**
	 * 根据会议id查询日程
	 * @param meetingId
	 * @throws Exception
	 */
	public List<ScheduleEvent> getScheduleEventByMeetingId(String meetingId) throws Exception;
	
	/**
	 * 根据时间查询日程  app接口
	 * @param scheduleEvent
	 * @throws Exception
	 */
	public List<ScheduleEvent> getAllEvent(ScheduleEvent scheduleEvent) throws Exception;
	
}
