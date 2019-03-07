package com.dragon.portal.dao.schedule;

import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.portal.model.schedule.ScheduleEventGrant;

import java.util.List;

/**
 * @Title:日程事件授权Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-23 10:51:11
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IScheduleEventGrantDao {

	/**
	 * 通过id得到日程事件授权ScheduleEventGrant
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public ScheduleEventGrant getScheduleEventGrantById(String id) throws Exception;

	/**
	 * 得到所有日程事件授权ScheduleEventGrant
	 * @param scheduleEventGrant
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<ScheduleEventGrant> getAll(ScheduleEventGrant scheduleEventGrant) throws Exception;

	/**
	 * 分页查询日程事件授权ScheduleEventGrant
	 * @param scheduleEventGrant
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<ScheduleEventGrant> getPagerModelByQuery(ScheduleEventGrant scheduleEventGrant, Query query) throws Exception;

	/**
	 * 添加日程事件授权ScheduleEventGrant
	 * @param scheduleEventGrant
	 * @throws Exception
	 * @Description:
	 */
	public void insertScheduleEventGrant(ScheduleEventGrant scheduleEventGrant) throws Exception;
	
	/**
	 * 通过id删除日程事件授权ScheduleEventGrant
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delScheduleEventGrantById(String id) throws Exception;
	
	/**
	 * 通过id批量删除日程事件授权ScheduleEventGrant
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delScheduleEventGrantByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改日程事件授权ScheduleEventGrant
	 * @param scheduleEventGrant
	 * @throws Exception
	 * @Description:
	 */
	public void updateScheduleEventGrant(ScheduleEventGrant scheduleEventGrant) throws Exception;

	/**
	 * 通过ids批量修改日程事件授权ScheduleEventGrant
	 * @param ids 如："'1','2','3','4'..."
	 * @param scheduleEventGrant
	 * @throws Exception
	 * @Description:
	 */
	public void updateScheduleEventGrantByIds(String ids, ScheduleEventGrant scheduleEventGrant) throws Exception;
	
	/**
	 * 根据授权工号查询授权信息 
	 * @param grantedPersonNo
	 * @return
	 * @throws Exception
	 */
	public List<ScheduleEventGrant> getScheduleEventGrantByGrantPersonNo(String grantPersonNo) throws Exception;
	
	/**
	 * 根据被授权工号查询授权信息 
	 * @param grantedPersonNo
	 * @return
	 * @throws Exception
	 */
	public List<ScheduleEventGrant> getScheduleEventGrantByGrantedPersonNo(String grantedPersonNo) throws Exception;
	
	/**
	 * 批量添加授权信息
	 * @param scheduleEventGrants
	 * @throws Exception
	 */
	public void insertScheduleEventGrants(List<ScheduleEventGrant> scheduleEventGrants) throws Exception;
	
	/**
	 * 批量修改授权信息
	 * @param scheduleEventGrants
	 * @throws Exception
	 */
	public void updateScheduleEventGrants(List<ScheduleEventGrant> scheduleEventGrants) throws Exception;
}
