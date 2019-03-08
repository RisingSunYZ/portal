package com.dragon.portal.service.rscmgmt;

import com.dragon.portal.model.rscmgmt.MeetingroomApprovalLog;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;

import java.util.List;



/**
 * @Title:会议室审批表Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-14 10:20:59
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingroomApprovalLogService {

	/**
	 * 通过id得到会议室审批表MeetingroomApprovalLog
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingroomApprovalLog getMeetingroomApprovalLogById(String id) throws Exception;

	/**
	 * 得到所有会议室审批表MeetingroomApprovalLog
	 * @param meetingroomApprovalLog
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingroomApprovalLog> getAll(MeetingroomApprovalLog meetingroomApprovalLog) throws Exception;

	/**
	 * 分页查询会议室审批表MeetingroomApprovalLog
	 * @param meetingroomApprovalLog
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingroomApprovalLog> getPagerModelByQuery(MeetingroomApprovalLog meetingroomApprovalLog, Query query) throws Exception;

	/**
	 * 添加会议室审批表MeetingroomApprovalLog
	 * @param meetingroomApprovalLog
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingroomApprovalLog(MeetingroomApprovalLog meetingroomApprovalLog) throws Exception;
	
	/**
	 * 通过id删除会议室审批表MeetingroomApprovalLog
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomApprovalLogById(String id) throws Exception;

	/**
	 * 通过id批量删除会议室审批表MeetingroomApprovalLog
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomApprovalLogByIds(String ids) throws Exception;

	/**
	 * 通过id修改会议室审批表MeetingroomApprovalLog
	 * @param meetingroomApprovalLog
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomApprovalLog(MeetingroomApprovalLog meetingroomApprovalLog) throws Exception;

	/**
	 * 通过ids批量修改会议室审批表MeetingroomApprovalLog
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingroomApprovalLog
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomApprovalLogByIds(String ids,MeetingroomApprovalLog meetingroomApprovalLog) throws Exception;
	
	
}
