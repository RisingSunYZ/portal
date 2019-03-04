package com.dragon.portal.dao.rscmgmt;

import com.dragon.portal.model.rscmgmt.Meeting;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * @Title:会议管理Dao接口
 * @Description:
 * @Author:rzg
 * @Since:2017-03-31 16:24:28
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingDao {

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
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<Meeting>  getPagerModelByQuery(Meeting meeting) throws Exception;
	/**
	 * 分页查询会议管理Meeting
	 * @param meeting
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<Meeting> getMyDraftPagerModelByQuery(Meeting meeting) throws Exception;


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
	 * @param params key:ids 如："'1','2','3','4'..." ,key:meeting
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingByIds(Map<String,Object> params) throws Exception;
	
	/**
	 * 分页查询会议管理-我的邀请
	 * @param meeting
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<Meeting> getMyMeetingPagerModelByQuery(Meeting meeting) throws Exception;
}
