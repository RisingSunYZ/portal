package com.dragon.portal.service.rscmgmt;

import com.dragon.portal.model.rscmgmt.MeetingroomApply;
import com.dragon.portal.vo.rscmgmt.MeetingroomApplyVo;
import com.dragon.portal.vo.rscmgmt.MeetingroomMyApplyVo;
import com.dragon.portal.vo.rscmgmt.MeetingroomViewVo;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.mhome.tools.vo.SimpleReturnVo;

import java.util.List;



/**
 * @Title:会议室申请表Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-14 10:16:33
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMeetingroomApplyService {

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
	 * 
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
	 * 通过会议室ID查询会议室基本信息及申请记录信息
	 * @param meetingroomViewVo
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 下午2:29:29
	 */
	public MeetingroomViewVo getMeetingroomViewVoByMeetroomId(MeetingroomViewVo meetingroomViewVo,String proposerNo) throws Exception;
	
	/**
	 * 根据条件分页查询会议室及会议室申请记录数据
	 * @param meetingroomViewVo
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 下午1:04:04
	 */
	public PagerModel<MeetingroomViewVo> getPagerModelByMeetingroomViewVo(MeetingroomViewVo meetingroomViewVo, Query query) throws Exception;
	
	/**
	 * 循环插入会议室申请记录
	 * @param meetingroomApplyVo
	 * @Description:
	 * @author v-zhaohaishan 2017年4月17日 上午9:17:43
	 */
	public SimpleReturnVo insertMeetingroomApplyByCycle(MeetingroomApplyVo meetingroomApplyVo) throws Exception;
	
	/**
	 * 查询我的会议申请记录
	 * @param meetingroomApply
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月18日 下午3:42:52
	 */
	public PagerModel<MeetingroomMyApplyVo> getPagerModelByMeetingroomMyApplyVo(MeetingroomApply meetingroomApply,Query query) throws Exception;

	
	/**
	 * 修改会议申请记录
	 * @param meetingroomApplyVo
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月19日 上午11:42:22
	 */
	public SimpleReturnVo updateMeetingroomApplyByCycle(MeetingroomApplyVo meetingroomApplyVo) throws Exception;
	
	/**
	 * 修改会议记录状态
	 * @param meetingroomApplyVo
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月19日 下午2:38:04
	 */
	public void updateMeetingroomApplyStatus(MeetingroomApplyVo meetingroomApplyVo) throws Exception;
	
	/**
	 * 获取会议申请记录
	 * @param applyNo
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月20日 上午8:43:08
	 */
	
	public MeetingroomApplyVo getMeetingroomApplyByApplyNo(String applyNo) throws Exception;
	
	/**
	 * 获取 是否有待审核的会议申请记录
	 * @param meetingroomId
	 * @return
	 * @Description:
	 * @author v-zhaohaishan 2017年4月21日 下午2:44:29
	 */
	public int countMeetingroomApplyByMeetingroomId(String meetingroomId) throws Exception;

}
