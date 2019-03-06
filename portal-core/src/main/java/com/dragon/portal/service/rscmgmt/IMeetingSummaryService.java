package com.dragon.portal.service.rscmgmt;

import com.dragon.portal.model.rscmgmt.Meeting;
import com.dragon.portal.model.rscmgmt.MeetingSummary;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;

import java.util.List;



/**
 * @Title:会议纪要Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-12 11:56:24
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingSummaryService {

	/**
	 * 通过id得到会议纪要MeetingSummary
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingSummary getMeetingSummaryById(String id) throws Exception;

	/**
	 * 得到所有会议纪要MeetingSummary
	 * @param meetingSummary
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingSummary> getAll(MeetingSummary meetingSummary) throws Exception;

	/**
	 * 分页查询会议纪要MeetingSummary
	 * @param meetingSummary
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingSummary> getPagerModelByQuery(MeetingSummary meetingSummary, Query query) throws Exception;

	/**
	 * 添加会议纪要MeetingSummary
	 * @param meetingSummary
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingSummary(MeetingSummary meetingSummary) throws Exception;
	
	/**
	 * 通过id删除会议纪要MeetingSummary
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingSummaryById(String id) throws Exception;

	/**
	 * 通过id批量删除会议纪要MeetingSummary
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingSummaryByIds(String ids) throws Exception;

	/**
	 * 通过id修改会议纪要MeetingSummary
	 * @param meetingSummary
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingSummary(MeetingSummary meetingSummary) throws Exception;

	/**
	 * 通过ids批量修改会议纪要MeetingSummary
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingSummary
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingSummaryByIds(String ids,MeetingSummary meetingSummary) throws Exception;
	
	/**
	 * 通过meeting_id得到会议纪要MeetingSummary
	 * @param meeting_id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingSummary getMeetingSummaryByMeetingId(String meeting_id) throws Exception;
	
	/**
	 * 会议管理页面初始化加载会议纪要
	 * @param meetings
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingSummary> getSummaryByMeetingId(List<Meeting> meetings);
}
