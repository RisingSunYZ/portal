package com.dragon.portal.dao.fnc;

import com.dragon.portal.model.fnc.OpinionType;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * @Title:财务服务-意见类型Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:14:28
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Mapper
@Repository
public interface IFncOpinionTypeDao {

	/**
	 * 通过id得到财务服务-意见类型OpinionType
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public OpinionType getOpinionTypeById(String id) throws Exception;

	/**
	 * 得到所有财务服务-意见类型OpinionType
	 * @param opinionType
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<OpinionType> getAll(OpinionType opinionType) throws Exception;

	/**
	 * 分页查询财务服务-意见类型OpinionType
	 * @param opinionType
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<OpinionType> getPagerModelByQuery(OpinionType opinionType, Query query) throws Exception;

	/**
	 * 添加财务服务-意见类型OpinionType
	 * @param opinionType
	 * @throws Exception
	 * @Description:
	 */
	public void insertOpinionType(OpinionType opinionType) throws Exception;
	
	/**
	 * 通过id删除财务服务-意见类型OpinionType
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delOpinionTypeById(String id) throws Exception;
	
	/**
	 * 通过id批量删除财务服务-意见类型OpinionType
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delOpinionTypeByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改财务服务-意见类型OpinionType
	 * @param opinionType
	 * @throws Exception
	 * @Description:
	 */
	public void updateOpinionType(OpinionType opinionType) throws Exception;

	/**
	 * 通过ids批量修改财务服务-意见类型OpinionType
	 * @param ids 如："'1','2','3','4'..."
	 * @param opinionType
	 * @throws Exception
	 * @Description:
	 */
	public void updateOpinionTypeByIds(String ids, OpinionType opinionType) throws Exception;
	/**
	 * 根据负责人no去重 查询数据
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author zhaohaishan 2017年9月4日 上午11:29:46
	 */
	public List<OpinionType> getOpinionTypeGroupByResponsible() throws Exception;
}
