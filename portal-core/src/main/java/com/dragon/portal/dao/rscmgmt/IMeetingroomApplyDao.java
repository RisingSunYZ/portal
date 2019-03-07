package com.dragon.portal.dao.rscmgmt;

import com.dragon.portal.model.rscmgmt.MeetingroomApply;
import com.dragon.portal.vo.rscmgmt.MeetingroomApplyItemViewVo;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;

import java.util.List;


/**
 * @Title:会议室申请表Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-14 10:16:33
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingroomApplyDao {

	/**
	 * 通过id得到会议室申请表MeetingroomApply
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MeetingroomApply getMeetingroomApplyById(String id) throws Exception;

	/**
	 * 得到所有会议室申请表MeetingroomApply
	 * @param meetingroomApply
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MeetingroomApply> getAll(MeetingroomApply meetingroomApply) throws Exception;

	
	/**
	 * 
	 * @param applyDateStr
	 * @param meetingroomId
	 * @param proposerNo
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月22日 上午11:02:13
	 */
	public List<MeetingroomApplyItemViewVo> getAllByDateAndMeetingId(String applyDateStr,String meetingroomId,String proposerNo) throws Exception;

	/**
	 * 分页查询会议室申请表MeetingroomApply
	 * @param meetingroomApply
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MeetingroomApply> getPagerModelByQuery(MeetingroomApply meetingroomApply, Query query) throws Exception;

	/**
	 * 添加会议室申请表MeetingroomApply
	 * @param meetingroomApply
	 * @throws Exception
	 * @Description:
	 */
	public void insertMeetingroomApply(MeetingroomApply meetingroomApply) throws Exception;
	
	/**
	 * 通过id删除会议室申请表MeetingroomApply
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomApplyById(String id) throws Exception;
	
	/**
	 * 通过id批量删除会议室申请表MeetingroomApply
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMeetingroomApplyByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改会议室申请表MeetingroomApply
	 * @param meetingroomApply
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomApply(MeetingroomApply meetingroomApply) throws Exception;
	
	/**
	 * 通过申请单号修改会议室申请表MeetingroomApply
	 * @param meetingroomApply
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomApplyByApplyNo(MeetingroomApply meetingroomApply) throws Exception;
	
	

	/**
	 * 通过ids批量修改会议室申请表MeetingroomApply
	 * @param ids 如："'1','2','3','4'..."
	 * @param meetingroomApply
	 * @throws Exception
	 * @Description:
	 */
	public void updateMeetingroomApplyByIds(String ids,MeetingroomApply meetingroomApply) throws Exception;
	/**
	 * 查询在开始和结束时间内是否有记录
	 * @param startTime
	 * @param endTime
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月17日 上午10:31:00
	 */
	public int countMeetingroomApplyByTime(String meetingroomId,String appluNo,String startTime,String endTime) throws Exception;
	
	/**
	 *  
	 * @param list
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月17日 上午11:05:53
	 */
	public void insertMeetingroomApplyByList(List<MeetingroomApply> list) throws Exception;
	
	/**
	 * 
	 * @param meetingroomApply
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月20日 上午8:44:07
	 */
	public PagerModel<MeetingroomApply> getPagerModelByQueryOfMyApply(MeetingroomApply meetingroomApply, Query query) throws Exception;
	/**
	 * 获取
	 * @param meetingroomApply
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月20日 上午8:44:51
	 */
	
	public MeetingroomApply getMeetingroomApplyByApplyNo(String applyNo) throws Exception;
	
	
	/**
	 * 获取 是否有待审核的会议申请记录
	 * @param meetingroomId
	 * @param startTime
	 * @param endTime
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月21日 下午2:39:15
	 */
	public int countMeetingroomApplyByMeetingroomId(String meetingroomId) throws Exception;
}
