package com.dragon.portal.dao.news;

import com.dragon.portal.model.news.NewsNoticeProcess;
import com.github.pagehelper.Page;

import java.util.List;
import java.util.Map;

/**
 * @Title:新闻公告发文-流程Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2018-01-03 09:44:09
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface INewsNoticeProcessDao {

	/**
	 * 通过id得到新闻公告发文-流程NewsNoticeProcess
	 * @param id
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public NewsNoticeProcess getNewsNoticeProcessById(String id) throws Exception;

	/**
	 * 得到所有新闻公告发文-流程NewsNoticeProcess
	 * @param newsNoticeProcess
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public List<NewsNoticeProcess> getAll(NewsNoticeProcess newsNoticeProcess) throws Exception;

	/**
	 * 分页查询新闻公告发文-流程NewsNoticeProcess
	 * @param newsNoticeProcess
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<NewsNoticeProcess> getPagerModelByQuery(NewsNoticeProcess newsNoticeProcess) throws Exception;

	/**
	 * 添加新闻公告发文-流程NewsNoticeProcess
	 * @param newsNoticeProcess
	 * @throws Exception
	 * @Description:
	 */
	public void insertNewsNoticeProcess(NewsNoticeProcess newsNoticeProcess) throws Exception;

	/**
	 * 通过id删除新闻公告发文-流程NewsNoticeProcess
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsNoticeProcessById(String id) throws Exception;

	/**
	 * 通过id批量删除新闻公告发文-流程NewsNoticeProcess
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsNoticeProcessByIds(String ids) throws Exception;

	/**
	 * 通过id修改新闻公告发文-流程NewsNoticeProcess
	 * @param newsNoticeProcess
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsNoticeProcess(NewsNoticeProcess newsNoticeProcess) throws Exception;

	/**
	 * 通过编码修改新闻公告发文-流程NewsNoticeProcess
	 * @param newsNoticeProcess
	 * @throws Exception
	 */
	public void updateNewsNoticeProcessByCode(NewsNoticeProcess newsNoticeProcess) throws Exception;

	/**
	 * 通过ids批量修改新闻公告发文-流程NewsNoticeProcess
	 * @param params
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsNoticeProcessByIds(Map<String,Object> params) throws Exception;

	/**
	 * 获取编号
	 * @return
	 * @throws Exception
	 */
	public String getNoticeCode()throws Exception;

}
