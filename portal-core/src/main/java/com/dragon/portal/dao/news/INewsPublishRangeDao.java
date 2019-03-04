package com.dragon.portal.dao.news;


import com.dragon.portal.model.news.NewsPublishRange;
import com.github.pagehelper.Page;

import java.util.List;
import java.util.Map;

/**
 * @Title:公告-新闻动态发布范围中间表Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-06 14:06:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface INewsPublishRangeDao {

	/**
	 * 通过id得到公告-新闻动态发布范围中间表NewsPublishRange
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public NewsPublishRange getNewsPublishRangeById(String id) throws Exception;

	/**
	 * 得到所有公告-新闻动态发布范围中间表NewsPublishRange
	 * @param newsPublishRange
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<NewsPublishRange> getAll(NewsPublishRange newsPublishRange) throws Exception;

	/**
	 * 分页查询公告-新闻动态发布范围中间表NewsPublishRange
	 * @param newsPublishRange
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<NewsPublishRange> getPagerModelByQuery(NewsPublishRange newsPublishRange) throws Exception;

	/**
	 * 添加公告-新闻动态发布范围中间表NewsPublishRange
	 * @param newsPublishRange
	 * @throws Exception
	 * @Description:
	 */
	public void insertNewsPublishRange(NewsPublishRange newsPublishRange) throws Exception;
	
	/**
	 * 通过id删除公告-新闻动态发布范围中间表NewsPublishRange
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsPublishRangeById(String id) throws Exception;
	
	/**
	 * 通过id批量删除公告-新闻动态发布范围中间表NewsPublishRange
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsPublishRangeByIds(String ids) throws Exception;
	
	/**
	 * 删除 NoticeId 
	 * @param id
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月7日 上午8:53:13
	 */
	public void delNewsPublishRangeByNId(String id) throws Exception;

	/**
	 * 通过id修改公告-新闻动态发布范围中间表NewsPublishRange
	 * @param newsPublishRange
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsPublishRange(NewsPublishRange newsPublishRange) throws Exception;

	/**
	 * 通过ids批量修改公告-新闻动态发布范围中间表NewsPublishRange
	 * @param params
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsPublishRangeByIds(Map<String,Object> params) throws Exception;
	
	
}
