package com.dragon.portal.dao.rscmgmt;

import java.util.List;

import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.dragon.portal.model.rscmgmt.MeetingroomApprover;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;


/**
 * @Title:会议室-审批人Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:53:23
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Mapper
@Repository
public interface IMeetingroomApproverDao {

	/**
	 * 通过id得到会议室-审批人MeetingroomApprover
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingroomApprover getMeetingroomApproverById(String id) throws Exception;

	/**
	 * 得到所有会议室-审批人MeetingroomApprover
	 * @param meetingroomApprover
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingroomApprover> getAll(MeetingroomApprover meetingroomApprover) throws Exception;

	/**
	 * 分页查询会议室-审批人MeetingroomApprover
	 * @param meetingroomApprover
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingroomApprover> getPagerModelByQuery(MeetingroomApprover meetingroomApprover, Query query) throws Exception;

	/**
	 * 添加会议室-审批人MeetingroomApprover
	 * @param meetingroomApprover
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingroomApprover(MeetingroomApprover meetingroomApprover) throws Exception;
	
	/**
	 * 通过id删除会议室-审批人MeetingroomApprover
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomApproverById(String id) throws Exception;
	/**
	 * 
	 * @param id
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月14日 下午3:21:41
	 */
	public void delMeetingroomApproverByMeetingRoomId(String id) throws Exception;
	
	
	/**
	 * 通过id批量删除会议室-审批人MeetingroomApprover
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomApproverByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改会议室-审批人MeetingroomApprover
	 * @param meetingroomApprover
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomApprover(MeetingroomApprover meetingroomApprover) throws Exception;

	/**
	 * 通过ids批量修改会议室-审批人MeetingroomApprover
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingroomApprover
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomApproverByIds(String ids,MeetingroomApprover meetingroomApprover) throws Exception;
	
	
}
