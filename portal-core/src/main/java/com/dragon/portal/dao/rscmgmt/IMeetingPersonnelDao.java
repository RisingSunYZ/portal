package com.dragon.portal.dao.rscmgmt;

import com.dragon.portal.model.rscmgmt.Meeting;
import com.dragon.portal.model.rscmgmt.MeetingPersonnel;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * @Title:会议参与人员Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-31 16:27:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Mapper
@Repository
public interface IMeetingPersonnelDao {

	/**
	 * 通过id得到会议参与人员MeetingPersonnel
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingPersonnel getMeetingPersonnelById(String id) throws Exception;

	/**
	 * 得到所有会议参与人员MeetingPersonnel
	 * @param meetingPersonnel
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingPersonnel> getAll(MeetingPersonnel meetingPersonnel) throws Exception;

	/**
	 * 分页查询会议参与人员MeetingPersonnel
	 * @param meetingPersonnel
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingPersonnel> getPagerModelByQuery(MeetingPersonnel meetingPersonnel, Query query) throws Exception;

	/**
	 * 添加会议参与人员MeetingPersonnel
	 * @param meetingPersonnel
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingPersonnel(MeetingPersonnel meetingPersonnel) throws Exception;
	
	/**
	 * 通过id删除会议参与人员MeetingPersonnel
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingPersonnelById(String id) throws Exception;
	
	/**
	 * 通过id批量删除会议参与人员MeetingPersonnel
	 * @param params 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingPersonnelByIds(Map<String,Object> params) throws Exception;
	
	/**
	 * 通过id修改会议参与人员MeetingPersonnel
	 * @param meetingPersonnel
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingPersonnel(MeetingPersonnel meetingPersonnel) throws Exception;

	/**
	 * 通过ids批量修改会议参与人员MeetingPersonnel
	 * @param map
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingPersonnelByIds(Map<String,Object> map) throws Exception;
	
	/**
	 * 通过meeting_id得到参加会议人员MeetingPersonnel
	 * @param meeting_id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingPersonnel> getMeetingPersonnelByMeetingId(String meeting_id) throws Exception;
	
	/**
	 * 批量添加会议人员MeetingPersonnel
	 * @param MeetingPersonnels
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingPersonnels(List<MeetingPersonnel> MeetingPersonnels) throws Exception;
	
	/**
	 * 通过meeting_id删除会议参与人员MeetingPersonnel
	 * @param meetingPersonnel
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingPersonnelByMeetingId(MeetingPersonnel meetingPersonnel) throws Exception;
	
	/**
	 * 通过List<Meeting> meetings得到参加会议记录人员MeetingPersonnel
	 * @param meetings
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	List<MeetingPersonnel>getRecordPerson(List<Meeting> meetings);
}
