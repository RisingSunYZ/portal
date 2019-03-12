package com.dragon.portal.dao.fnc;

import com.dragon.portal.model.fnc.Opinion;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;

import java.util.List;


/**
 * @Title:财务服务-意见管理Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:13:54
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IFncOpinionDao {

	/**
	 * 通过id得到财务服务-意见管理Opinion
	 * @param id
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Opinion getOpinionById(String id) throws Exception;

	/**
	 * 得到所有财务服务-意见管理Opinion
	 * @param opinion
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public List<Opinion> getAll(Opinion opinion) throws Exception;

	/**
	 * 分页查询财务服务-意见管理Opinion
	 * @param opinion
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<Opinion> getPagerModelByQuery(Opinion opinion, Query query) throws Exception;

	/**
	 * 添加财务服务-意见管理Opinion
	 * @param opinion
	 * @throws Exception
	 * @Description:
	 */
	public void insertOpinion(Opinion opinion) throws Exception;

	/**
	 * 通过id删除财务服务-意见管理Opinion
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delOpinionById(String id) throws Exception;

	/**
	 * 通过id批量删除财务服务-意见管理Opinion
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delOpinionByIds(String ids) throws Exception;

	/**
	 * 通过id修改财务服务-意见管理Opinion
	 * @param opinion
	 * @throws Exception
	 * @Description:
	 */
	public void updateOpinion(Opinion opinion) throws Exception;

	/**
	 * 通过ids批量修改财务服务-意见管理Opinion
	 * @param ids 如："'1','2','3','4'..."
	 * @param opinion
	 * @throws Exception
	 * @Description:
	 */
	public void updateOpinionByIds(String ids, Opinion opinion) throws Exception;
	
	
}
