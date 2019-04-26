package com.dragon.portal.service.hr;

import com.dragon.portal.model.hr.OpinionType;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;


/**
 * @Title:意见分类Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-08 10:15:25
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IOpinionTypeService {

	/**
	 * 通过id得到意见分类OpinionType
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public OpinionType getOpinionTypeById(String id) throws Exception;

	/**
	 * 得到所有意见分类OpinionType
	 * @param opinionType
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<OpinionType> getAll(OpinionType opinionType) throws Exception;
	
	/**
	 * 得到可用的
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<OpinionType> getAvailable() throws Exception;

	/**
	 * 分页查询意见分类OpinionType
	 * @param opinionType
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<OpinionType> getPagerModelByQuery(OpinionType opinionType, Query query) throws Exception;

	/**
	 * 添加意见分类OpinionType
	 * @param opinionType
	 * @throws Exception
	 * @Description:
	 */
	public void insertOpinionType(OpinionType opinionType) throws Exception;
	
	/**
	 * 通过id删除意见分类OpinionType
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delOpinionTypeById(String id) throws Exception;

	/**
	 * 通过id批量删除意见分类OpinionType
	 * @param ids 如："1,2,3,4..."
	 * @throws Exception
	 * @Description:
	 */
	public void delOpinionTypeByIds(String ids) throws Exception;

	/**
	 * 通过id修改意见分类OpinionType
	 * @param opinionType
	 * @throws Exception
	 * @Description:
	 */
	public void updateOpinionType(OpinionType opinionType) throws Exception;

	/**
	 * 通过ids批量修改意见分类OpinionType
	 * @param ids 如："1,2,3,4..."
	 * @param opinionType
	 * @throws Exception
	 * @Description:
	 */
	public void updateOpinionTypeByIds(String ids, OpinionType opinionType) throws Exception;
	
	
}
