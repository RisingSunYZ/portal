package com.dragon.portal.service.news;

import com.dragon.portal.model.news.NewsFile;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;


/**
 * @Title:新闻公告附件管理Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-22 16:15:55
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface INewsFileService {

	/**
	 * 通过id得到新闻公告附件管理NewsFile
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public NewsFile getNewsFileById(String id) throws Exception;

	/**
	 * 得到所有新闻公告附件管理NewsFile
	 * @param newsFile
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<NewsFile> getAll(NewsFile newsFile) throws Exception;

	/**
	 * 分页查询新闻公告附件管理NewsFile
	 * @param newsFile
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<NewsFile> getPagerModelByQuery(NewsFile newsFile, Query query) throws Exception;

	/**
	 * 添加新闻公告附件管理NewsFile
	 * @param newsFile
	 * @throws Exception
	 * @Description:
	 */
	public void insertNewsFile(NewsFile newsFile) throws Exception;
	
	/**
	 * 通过id删除新闻公告附件管理NewsFile
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsFileById(String id) throws Exception;

	/**
	 * 通过id批量删除新闻公告附件管理NewsFile
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsFileByIds(String ids) throws Exception;

	/**
	 * 通过id修改新闻公告附件管理NewsFile
	 * @param newsFile
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsFile(NewsFile newsFile) throws Exception;
	/**
	 * 
	 * @param newsFile
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月11日 下午1:22:57
	 */
	public void updateNewsFileByRefId(NewsFile newsFile) throws Exception;
	/**
	 * 通过ids批量修改新闻公告附件管理NewsFile
	 * @param ids 如："'1','2','3','4'..."
	 * @param newsFile
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsFileByIds(String ids, NewsFile newsFile) throws Exception;

	/**
	 * 根据 id 更新 附件管理newsFile的排序编号sortNo + num
	 * @param id
	 * @param num
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年3月29日 下午3:35:49
	 */
	public void updateSortNoById(String id, Integer num) throws Exception;
	
	
	
	
}
