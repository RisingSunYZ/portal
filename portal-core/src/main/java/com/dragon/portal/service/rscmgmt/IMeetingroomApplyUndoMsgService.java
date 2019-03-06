package com.dragon.portal.service.rscmgmt;

import com.dragon.portal.model.rscmgmt.MeetingroomApplyUndoMsg;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;

import java.util.List;



/**
 * @Title:会议室取消申请备注表Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-20 08:49:12
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingroomApplyUndoMsgService {

	/**
	 * 通过id得到会议室取消申请备注表MeetingroomApplyUndoMsg
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingroomApplyUndoMsg getMeetingroomApplyUndoMsgById(String id) throws Exception;

	/**
	 * 得到所有会议室取消申请备注表MeetingroomApplyUndoMsg
	 * @param meetingroomApplyUndoMsg
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingroomApplyUndoMsg> getAll(MeetingroomApplyUndoMsg meetingroomApplyUndoMsg) throws Exception;

	/**
	 * 分页查询会议室取消申请备注表MeetingroomApplyUndoMsg
	 * @param meetingroomApplyUndoMsg
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingroomApplyUndoMsg> getPagerModelByQuery(MeetingroomApplyUndoMsg meetingroomApplyUndoMsg, Query query) throws Exception;

	/**
	 * 添加会议室取消申请备注表MeetingroomApplyUndoMsg
	 * @param meetingroomApplyUndoMsg
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingroomApplyUndoMsg(MeetingroomApplyUndoMsg meetingroomApplyUndoMsg) throws Exception;
	
	/**
	 * 通过id删除会议室取消申请备注表MeetingroomApplyUndoMsg
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomApplyUndoMsgById(String id) throws Exception;

	/**
	 * 通过id批量删除会议室取消申请备注表MeetingroomApplyUndoMsg
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomApplyUndoMsgByIds(String ids) throws Exception;

	/**
	 * 通过id修改会议室取消申请备注表MeetingroomApplyUndoMsg
	 * @param meetingroomApplyUndoMsg
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomApplyUndoMsg(MeetingroomApplyUndoMsg meetingroomApplyUndoMsg) throws Exception;

	/**
	 * 通过ids批量修改会议室取消申请备注表MeetingroomApplyUndoMsg
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingroomApplyUndoMsg
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomApplyUndoMsgByIds(String ids,MeetingroomApplyUndoMsg meetingroomApplyUndoMsg) throws Exception;
	
	
}
