package com.dragon.portal.dao.rscmgmt;

import com.dragon.portal.model.rscmgmt.Meeting;
import com.dragon.portal.model.rscmgmt.MeetingFiles;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * @Title:会议附件Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-31 16:26:15
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Mapper
@Repository
public interface IMeetingFilesDao {

	/**
	 * 通过id得到会议附件MeetingFiles
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingFiles getMeetingFilesById(String id) throws Exception;

	/**
	 * 得到所有会议附件MeetingFiles
	 * @param meetingFiles
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingFiles> getAll(MeetingFiles meetingFiles) throws Exception;

	/**
	 * 分页查询会议附件MeetingFiles
	 * @param meetingFiles
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingFiles> getPagerModelByQuery(MeetingFiles meetingFiles, Query query) throws Exception;

	/**
	 * 添加会议附件MeetingFiles
	 * @param meetingFiles
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingFiles(MeetingFiles meetingFiles) throws Exception;
	
	/**
	 * 通过id删除会议附件MeetingFiles
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingFilesById(String id) throws Exception;
	
	/**
	 * 通过id批量删除会议附件MeetingFiles
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingFilesByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改会议附件MeetingFiles
	 * @param meetingFiles
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingFiles(MeetingFiles meetingFiles) throws Exception;

	/**
	 * 通过ids批量修改会议附件MeetingFiles
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingFiles
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingFilesByIds(String ids,MeetingFiles meetingFiles) throws Exception;
	
	/**
	 * 通过meeting_id得到会议附件MeetingFiles
	 * @param meeting_id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingFiles> getMeetingFilesByMeetingId(String meeting_id) throws Exception;
	
	/**
	 * 批量添加会议附件MeetingFiles
	 * @param personnels
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingFilesList(List<MeetingFiles> meetingFiles) throws Exception;
	
	/**
	 * 通过meeting_id删除会议附件MeetingFiles
	 * @param map
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingFilesByMeetingId(Map<String,Object> map) throws Exception;
	
	/**
	 * 会议管理页面初始化加载会议附件
	 * @param meetings
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingFiles> getMeetingFiles(List<Meeting> meetings);
}
