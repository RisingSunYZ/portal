package com.dragon.portal.service.rscmgmt;

import com.dragon.portal.model.rscmgmt.MeetingroomAddrAdmin;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;

import java.util.List;



/**
 * @Title:会议室-地点管理员Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-14 10:11:42
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingroomAddrAdminService {

	/**
	 * 通过id得到会议室-地点管理员MeetingroomAddrAdmin
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingroomAddrAdmin getMeetingroomAddrAdminById(String id) throws Exception;

	/**
	 * 得到所有会议室-地点管理员MeetingroomAddrAdmin
	 * @param meetingroomAddrAdmin
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingroomAddrAdmin> getAll(MeetingroomAddrAdmin meetingroomAddrAdmin) throws Exception;

	/**
	 * 分页查询会议室-地点管理员MeetingroomAddrAdmin
	 * @param meetingroomAddrAdmin
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingroomAddrAdmin> getPagerModelByQuery(MeetingroomAddrAdmin meetingroomAddrAdmin, Query query) throws Exception;

	/**
	 * 添加会议室-地点管理员MeetingroomAddrAdmin
	 * @param meetingroomAddrAdmin
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingroomAddrAdmin(MeetingroomAddrAdmin meetingroomAddrAdmin) throws Exception;
	
	/**
	 * 通过id删除会议室-地点管理员MeetingroomAddrAdmin
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomAddrAdminById(String id) throws Exception;
	/**
	 * 
	 * @param id
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月14日 下午5:20:05
	 */
	public void delMeetingroomApproverByAddrId(String addrId) throws Exception;
	
	
	/**
	 * 通过id批量删除会议室-地点管理员MeetingroomAddrAdmin
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomAddrAdminByIds(String ids) throws Exception;

	/**
	 * 通过id修改会议室-地点管理员MeetingroomAddrAdmin
	 * @param meetingroomAddrAdmin
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomAddrAdmin(MeetingroomAddrAdmin meetingroomAddrAdmin) throws Exception;

	/**
	 * 通过ids批量修改会议室-地点管理员MeetingroomAddrAdmin
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingroomAddrAdmin
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomAddrAdminByIds(String ids,MeetingroomAddrAdmin meetingroomAddrAdmin) throws Exception;
	
	
}
