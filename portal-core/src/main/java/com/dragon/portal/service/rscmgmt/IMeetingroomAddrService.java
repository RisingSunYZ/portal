package com.dragon.portal.service.rscmgmt;

import com.dragon.portal.model.rscmgmt.MeetingroomAddr;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;

import java.util.List;



/**
 * @Title:会议室管理地点管理Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 10:17:17
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingroomAddrService {

	/**
	 * 通过id得到会议室管理地点管理MeetingroomAddr
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingroomAddr getMeetingroomAddrById(String id) throws Exception;

	/**
	 * 得到所有会议室管理地点管理MeetingroomAddr
	 * @param meetingroomAddr
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingroomAddr> getAll(MeetingroomAddr meetingroomAddr) throws Exception;

	
	/**
	 * 根据管理员得到所有会议室管理地点管理MeetingroomAddr
	 * @param meetingroomAddr
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年5月27日 上午10:18:40
	 */
	public List<MeetingroomAddr> getAllByAdmin(MeetingroomAddr meetingroomAddr) throws Exception;
	/**
	 * 分页查询会议室管理地点管理MeetingroomAddr
	 * @param meetingroomAddr
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingroomAddr> getPagerModelByQuery(MeetingroomAddr meetingroomAddr, Query query) throws Exception;

	/**
	 * 添加会议室管理地点管理MeetingroomAddr
	 * @param meetingroomAddr
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingroomAddr(MeetingroomAddr meetingroomAddr) throws Exception;
	
	/**
	 * 通过id删除会议室管理地点管理MeetingroomAddr
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomAddrById(String id) throws Exception;

	/**
	 * 通过id批量删除会议室管理地点管理MeetingroomAddr
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomAddrByIds(String ids) throws Exception;

	/**
	 * 通过id修改会议室管理地点管理MeetingroomAddr
	 * @param meetingroomAddr
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomAddr(MeetingroomAddr meetingroomAddr) throws Exception;

	/**
	 * 通过ids批量修改会议室管理地点管理MeetingroomAddr
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingroomAddr
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomAddrByIds(String ids,MeetingroomAddr meetingroomAddr) throws Exception;
	
	
}
