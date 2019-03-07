package com.dragon.portal.dao.rscmgmt;

import java.util.List;

import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.dragon.portal.model.rscmgmt.MeetingroomApprover;
import com.dragon.portal.model.rscmgmt.MeetingroomTools;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;


/**
 * @Title:会议室配置用具项Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:55:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Mapper
@Repository
public interface IMeetingroomToolsDao {

	/**
	 * 通过id得到会议室配置用具项MeetingroomTools
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingroomTools getMeetingroomToolsById(String id) throws Exception;

	/**
	 * 得到所有会议室配置用具项MeetingroomTools
	 * @param meetingroomTools
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingroomTools> getAll(MeetingroomTools meetingroomTools) throws Exception;

	/**
	 * 分页查询会议室配置用具项MeetingroomTools
	 * @param meetingroomTools
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingroomTools> getPagerModelByQuery(MeetingroomTools meetingroomTools, Query query) throws Exception;

	/**
	 * 添加会议室配置用具项MeetingroomTools
	 * @param meetingroomTools
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingroomTools(MeetingroomTools meetingroomTools) throws Exception;
	
	/**
	 * 通过id删除会议室配置用具项MeetingroomTools
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomToolsById(String id) throws Exception;
	
	/**
	 * 通过id批量删除会议室配置用具项MeetingroomTools
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomToolsByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改会议室配置用具项MeetingroomTools
	 * @param meetingroomTools
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomTools(MeetingroomTools meetingroomTools) throws Exception;

	/**
	 * 通过ids批量修改会议室配置用具项MeetingroomTools
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingroomTools
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomToolsByIds(String ids,MeetingroomTools meetingroomTools) throws Exception;
	
	/**
	 * 通过会议室id查询配置信息
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingroomTools
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingroomTools> selectMeetingRoomTollsBymeetingRoomId(String mettingroomId)throws Exception;
	/**
	 * 通过会议室id查询审批人信息
	 * @param 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingroomApprover> selectAppoverListBymeetingRoomId(String meetingroomId);
}
