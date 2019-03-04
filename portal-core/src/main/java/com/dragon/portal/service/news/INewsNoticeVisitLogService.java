package com.dragon.portal.service.news;


import com.dragon.portal.model.news.NewsNoticeVisitLog;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.ys.yahu.enm.NewsNoticeEnum;

import java.util.List;

/**
 * @Title:公告或新闻动态访问量日志Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 14:00:09
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface INewsNoticeVisitLogService {

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
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<NewsNoticeVisitLog> getPagerModelByQuery(NewsNoticeVisitLog newsNoticeVisitLog, Query query) throws Exception;

	/**
	 * 分页查询公告或新闻动态访问量日志NewsNoticeVisitLog
	 * @param newsNoticeVisitLog
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<NewsNoticeVisitLog> getPagerModelByQueryOr(NewsNoticeVisitLog newsNoticeVisitLog, Query query) throws Exception;
	/**
	 * 添加公告或新闻动态访问量日志NewsNoticeVisitLog
	 * @param newsNoticeVisitLog
	 * @throws Exception
	 * @Description:
	 */
	public void insertNewsNoticeVisitLog(NewsNoticeVisitLog newsNoticeVisitLog) throws Exception;
	
	/**
	 * 添加访问日志
	 * @param no 员工工号
	 * @param newsNoticeId 新闻或公告ID
	 * @param type	@see NewsNoticeEnum 新闻或公告
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 下午3:10:32
	 */
	public void insertNewsNoticeVisitLog(UserSessionInfo userSessionInfo, String ip, String newsNoticeId, NewsNoticeEnum type) throws Exception;

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
	 * @param ids 如："'1','2','3','4'..."
	 * @param newsNoticeVisitLog
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsNoticeVisitLogByIds(String ids, NewsNoticeVisitLog newsNoticeVisitLog) throws Exception;
	
	
}
