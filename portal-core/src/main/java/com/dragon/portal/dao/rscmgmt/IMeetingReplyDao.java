package com.dragon.portal.dao.rscmgmt;

import java.util.List;

import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.dragon.portal.model.rscmgmt.Meeting;
import com.dragon.portal.model.rscmgmt.MeetingReply;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;


/**
 * @Title:会议答复Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-12 11:55:16
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Mapper
@Repository
public interface IMeetingReplyDao {

	/**
	 * 通过id得到会议答复MeetingReply
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingReply getMeetingReplyById(String id) throws Exception;

	/**
	 * 得到所有会议答复MeetingReply
	 * @param meetingReply
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingReply> getAll(MeetingReply meetingReply) throws Exception;

	/**
	 * 分页查询会议答复MeetingReply
	 * @param meetingReply
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingReply> getPagerModelByQuery(MeetingReply meetingReply, Query query) throws Exception;

	/**
	 * 添加会议答复MeetingReply
	 * @param meetingReply
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingReply(MeetingReply meetingReply) throws Exception;
	
	/**
	 * 通过id删除会议答复MeetingReply
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingReplyById(String id) throws Exception;
	
	/**
	 * 通过id批量删除会议答复MeetingReply
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingReplyByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改会议答复MeetingReply
	 * @param meetingReply
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingReply(MeetingReply meetingReply) throws Exception;

	/**
	 * 通过ids批量修改会议答复MeetingReply
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingReply
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingReplyByIds(String ids,MeetingReply meetingReply) throws Exception;
	
	/**
	 * 通过会议id和答复人工号会议答复MeetingReply
	 * @param replyNo
	 * @throws Exception
	 * @Description:
	 */
	public MeetingReply getMeetingReplyByMeetingIdAndPersonNo(String meetingId,String replyNo);
	
	/**
	 * 会议详情页面加载会议答复内容
	 * @param meetingReplys
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingReply> getReplyByMeeting(List<MeetingReply> meetingReplys);
	
	/**
	 * 会议编辑页面加载会议答复内容
	 * @param meeting_id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingReply> getReplyByMeetingId(String meeting_id);
}
