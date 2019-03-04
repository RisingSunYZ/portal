package com.dragon.portal.service.rscmgmt;

import com.dragon.portal.model.rscmgmt.Meetingroom;
import com.dragon.portal.vo.rscmgmt.MeetingroomViewVo;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;

import java.util.List;



/**
 * @Title:会议室管理Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:28:10
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingroomService {

	/**
	 * 通过id得到会议室管理Meetingroom
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public Meetingroom getMeetingroomById(String id) throws Exception;

	/**
	 * 得到所有会议室管理Meetingroom
	 * @param meetingroom
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<Meetingroom> getAll(Meetingroom meetingroom) throws Exception;

	/**
	 * 分页查询会议室管理Meetingroom
	 * @param meetingroom
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<Meetingroom> getPagerModelByQuery(Meetingroom meetingroom, Query query) throws Exception;

	/**
	 * 添加会议室管理Meetingroom
	 * @param meetingroom
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingroom(Meetingroom meetingroom) throws Exception;
	
	/**
	 * 通过id删除会议室管理Meetingroom
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomById(String id) throws Exception;

	/**
	 * 通过id批量删除会议室管理Meetingroom
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomByIds(String ids) throws Exception;

	/**
	 * 通过id修改会议室管理Meetingroom
	 * @param meetingroom
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroom(Meetingroom meetingroom) throws Exception;

	/**
	 * 通过ids批量修改会议室管理Meetingroom
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingroom
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomByIds(String ids,Meetingroom meetingroom) throws Exception;

	/**
	 * 查询根据条件会议室
	 * @param meetingroomViewVo
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 下午1:15:55
	 */
	public PagerModel<MeetingroomViewVo> getPagerModelByQuery(MeetingroomViewVo meetingroomViewVo, Query query) throws Exception;
	
	
}
