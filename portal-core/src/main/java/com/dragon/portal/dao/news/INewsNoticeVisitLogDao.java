package com.dragon.portal.dao.news;


import com.dragon.portal.model.news.NewsNoticeVisitLog;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * @Title:公告或新闻动态访问量日志Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 14:00:09
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Mapper
@Repository
public interface INewsNoticeVisitLogDao {

	/**
	 * 通过id得到公告或新闻动态访问量日志NewsNoticeVisitLog
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public NewsNoticeVisitLog getNewsNoticeVisitLogById(String id) throws Exception;

	/**
	 * 得到所有公告或新闻动态访问量日志NewsNoticeVisitLog
	 * @param newsNoticeVisitLog
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<NewsNoticeVisitLog> getAll(NewsNoticeVisitLog newsNoticeVisitLog) throws Exception;

	/**
	 * 分页查询公告或新闻动态访问量日志NewsNoticeVisitLog
	 * @param newsNoticeVisitLog
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<NewsNoticeVisitLog> getPagerModelByQuery(NewsNoticeVisitLog newsNoticeVisitLog) throws Exception;

	/**
	 * 分页查询公告或新闻动态访问量日志NewsNoticeVisitLog 
	 * @param newsNoticeVisitLog
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年5月25日 下午2:12:00
	 */
	public Page<NewsNoticeVisitLog> getPagerModelByQueryOr(NewsNoticeVisitLog newsNoticeVisitLog) throws Exception;
	/**
	 * 添加公告或新闻动态访问量日志NewsNoticeVisitLog
	 * @param newsNoticeVisitLog
	 * @throws Exception
	 * @Description:
	 */
	public void insertNewsNoticeVisitLog(NewsNoticeVisitLog newsNoticeVisitLog) throws Exception;
	
	/**
	 * 通过id删除公告或新闻动态访问量日志NewsNoticeVisitLog
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsNoticeVisitLogById(String id) throws Exception;
	
	/**
	 * 通过id批量删除公告或新闻动态访问量日志NewsNoticeVisitLog
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsNoticeVisitLogByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改公告或新闻动态访问量日志NewsNoticeVisitLog
	 * @param newsNoticeVisitLog
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsNoticeVisitLog(NewsNoticeVisitLog newsNoticeVisitLog) throws Exception;

	/**
	 * 通过ids批量修改公告或新闻动态访问量日志NewsNoticeVisitLog
	 * @param params
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsNoticeVisitLogByIds(Map<String,Object> params) throws Exception;
	
	
}
