package com.dragon.portal.service.rscmgmt;

import com.dragon.portal.model.rscmgmt.AppointmentVO;
import com.dragon.portal.model.rscmgmt.Meeting;
import com.dragon.portal.model.schedule.ScheduleEvent;
import com.dragon.tools.vo.ReturnVo;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;



/**
 * @Title:会议管理Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-31 16:24:28
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingService {

	/**
	 * 通过id得到会议管理Meeting
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public Meeting getMeetingById(String id) throws Exception;

	/**
	 * 得到所有会议管理Meeting
	 * @param meeting
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<Meeting> getAll(Meeting meeting) throws Exception;

	/**
	 * 分页查询会议管理Meeting
	 * @param meeting
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<Meeting> getPagerModelByQuery(Meeting meeting, Query query) throws Exception;

	/**
	 * 添加会议管理Meeting
	 * @param meeting
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeeting(Meeting meeting) throws Exception;
	
	/**
	 * 通过id删除会议管理Meeting
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingById(String id) throws Exception;

	/**
	 * 通过id批量删除会议管理Meeting
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingByIds(String ids) throws Exception;

	/**
	 * 通过id修改会议管理Meeting
	 * @param meeting
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeeting(Meeting meeting) throws Exception;

	/**
	 * 通过ids批量修改会议管理Meeting
	 * @param ids 如："'1','2','3','4'..."
	 * @param meeting
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingByIds(String ids,Meeting meeting) throws Exception;
	
	/**
	 * 分页查询会议管理-我的邀请
	 * @param meeting
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<Meeting> getMyMeetingPagerModelByQuery(Meeting meeting, Query query) throws Exception;
	
	/**
	 * 添加活修改会议管理Meeting
	 * @param meeting
	 * @throws Exception
	 * @Description:
	 */
	public ReturnVo<String> addOrUpdateMeeting(Meeting meeting) throws Exception;

	/**
	 * 初始化加载页面数据
	 * @param meetings
	 * @param userNo
	 * @return
	 */
	public List<Meeting> getInitList(List<Meeting> meetings,String userNo);

	/**
	 * 设置必选人员email
	 * @param appointmentVO
	 * @param meeting
	 */
	public void setMandatoryEmail(List<ScheduleEvent>scheduleEventList, List<String>newNos, AppointmentVO appointmentVO, Meeting meeting, String userNo);

	/**
	 * 设置日程事件信息
	 * @param scheduleEventList,vo,meeting,start,end,userNo
	 */
	public void setScheduleEventList(List<ScheduleEvent>scheduleEventList,AppointmentVO vo ,Meeting meeting,String start,String end,String userNo);

	/**
	 * 设置日程事件信息
	 * @param scheduleEventList,meeting,start,end,userNo
	 */
	public void setScheduleEventList(List<ScheduleEvent>scheduleEventList ,Meeting meeting,String start,String end,String userNo);


}
