package com.dragon.portal.service.rscmgmt;

import com.dragon.portal.model.rscmgmt.MeetingroomConftools;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;

import java.util.List;



/**
 * @Title:会议室-会议室配置用具项中间表Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 11:54:12
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingroomConftoolsService {

	/**
	 * 通过id得到会议室-会议室配置用具项中间表MeetingroomConftools
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingroomConftools getMeetingroomConftoolsById(String id) throws Exception;

	/**
	 * 得到所有会议室-会议室配置用具项中间表MeetingroomConftools
	 * @param meetingroomConftools
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingroomConftools> getAll(MeetingroomConftools meetingroomConftools) throws Exception;

	/**
	 * 分页查询会议室-会议室配置用具项中间表MeetingroomConftools
	 * @param meetingroomConftools
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingroomConftools> getPagerModelByQuery(MeetingroomConftools meetingroomConftools, Query query) throws Exception;

	/**
	 * 添加会议室-会议室配置用具项中间表MeetingroomConftools
	 * @param meetingroomConftools
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingroomConftools(MeetingroomConftools meetingroomConftools) throws Exception;
	
	/**
	 * 通过id删除会议室-会议室配置用具项中间表MeetingroomConftools
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomConftoolsById(String id) throws Exception;

	/**
	 * 通过id批量删除会议室-会议室配置用具项中间表MeetingroomConftools
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomConftoolsByIds(String ids) throws Exception;

	/**
	 * 通过id修改会议室-会议室配置用具项中间表MeetingroomConftools
	 * @param meetingroomConftools
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomConftools(MeetingroomConftools meetingroomConftools) throws Exception;

	/**
	 * 通过ids批量修改会议室-会议室配置用具项中间表MeetingroomConftools
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingroomConftools
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomConftoolsByIds(String ids,MeetingroomConftools meetingroomConftools) throws Exception;
	
	/**
	 * 通过会议室Id得到该会议室配置用具项中间表MeetingroomConftools的其它配置信息
	 * @param mettingroomId
	 * @throws Exception
	 * @Description:
	 */
	public MeetingroomConftools getMeetingroomConftoolsByMettingroomId(String mettingroomId)throws Exception;
	
}
