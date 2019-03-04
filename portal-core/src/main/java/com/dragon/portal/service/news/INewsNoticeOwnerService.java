package com.dragon.portal.service.news;

import com.dragon.portal.model.news.NewsNoticeOwner;
import com.dragon.portal.vo.news.NoticeComboTreeVo;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;

/**
 * @Title:发文数据管理-发文主体Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-12-29 11:46:41
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface INewsNoticeOwnerService {

	/**
	 * 通过id得到发文数据管理-发文主体NewsNoticeOwner
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public NewsNoticeOwner getNewsNoticeOwnerById(String id) throws Exception;

	/**
	 * 得到所有发文数据管理-发文主体NewsNoticeOwner
	 * @param newsNoticeOwner
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<NewsNoticeOwner> getAll(NewsNoticeOwner newsNoticeOwner) throws Exception;

	/**
	 * 分页查询发文数据管理-发文主体NewsNoticeOwner
	 * @param newsNoticeOwner
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<NewsNoticeOwner> getPagerModelByQuery(NewsNoticeOwner newsNoticeOwner, Query query) throws Exception;

	/**
	 * 添加发文数据管理-发文主体NewsNoticeOwner
	 * @param newsNoticeOwner
	 * @throws Exception
	 * @Description:
	 */
	public void insertNewsNoticeOwner(NewsNoticeOwner newsNoticeOwner) throws Exception;
	
	/**
	 * 通过id删除发文数据管理-发文主体NewsNoticeOwner
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsNoticeOwnerById(String id) throws Exception;

	/**
	 * 通过id批量删除发文数据管理-发文主体NewsNoticeOwner
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsNoticeOwnerByIds(String ids) throws Exception;

	/**
	 * 通过id修改发文数据管理-发文主体NewsNoticeOwner
	 * @param newsNoticeOwner
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsNoticeOwner(NewsNoticeOwner newsNoticeOwner) throws Exception;

	/**
	 * 通过ids批量修改发文数据管理-发文主体NewsNoticeOwner
	 * @param ids 如："'1','2','3','4'..."
	 * @param newsNoticeOwner
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsNoticeOwnerByIds(String ids, NewsNoticeOwner newsNoticeOwner) throws Exception;

	/**
	 * 获取主体 下拉数数据
	 * @return
	 * @throws Exception
	 */
	public List<NoticeComboTreeVo> getComboTree() throws Exception;

    List<NewsNoticeOwner> getAllPidIsNull();
}
