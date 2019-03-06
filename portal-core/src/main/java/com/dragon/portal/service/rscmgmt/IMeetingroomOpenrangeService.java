package com.dragon.portal.service.rscmgmt;

import com.dragon.portal.model.rscmgmt.MeetingroomOpenrange;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;

import java.util.List;



/**
 * @Title:会议室-开放范围Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:54:56
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingroomOpenrangeService {

	/**
	 * 通过id得到会议室-开放范围MeetingroomOpenrange
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingroomOpenrange getMeetingroomOpenrangeById(String id) throws Exception;

	/**
	 * 得到所有会议室-开放范围MeetingroomOpenrange
	 * @param meetingroomOpenrange
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingroomOpenrange> getAll(MeetingroomOpenrange meetingroomOpenrange) throws Exception;

	/**
	 * 分页查询会议室-开放范围MeetingroomOpenrange
	 * @param meetingroomOpenrange
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingroomOpenrange> getPagerModelByQuery(MeetingroomOpenrange meetingroomOpenrange, Query query) throws Exception;

	/**
	 * 添加会议室-开放范围MeetingroomOpenrange
	 * @param meetingroomOpenrange
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingroomOpenrange(MeetingroomOpenrange meetingroomOpenrange) throws Exception;
	
	/**
	 * 通过id删除会议室-开放范围MeetingroomOpenrange
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomOpenrangeById(String id) throws Exception;

	/**
	 * 通过id批量删除会议室-开放范围MeetingroomOpenrange
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomOpenrangeByIds(String ids) throws Exception;

	/**
	 * 
	 * @param ids
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月14日 下午1:54:25
	 */
	public void delMeetingroomOpenrangeByMeetingRoomId(String ids) throws Exception;
	
	/**
	 * 通过id修改会议室-开放范围MeetingroomOpenrange
	 * @param meetingroomOpenrange
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomOpenrange(MeetingroomOpenrange meetingroomOpenrange) throws Exception;

	/**
	 * 通过ids批量修改会议室-开放范围MeetingroomOpenrange
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingroomOpenrange
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomOpenrangeByIds(String ids,MeetingroomOpenrange meetingroomOpenrange) throws Exception;
	
	
}
