package com.dragon.portal.service.news;

import com.dragon.portal.model.news.NewsComment;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;


/**
 * @Title:员工风采评论表Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-04 09:00:48
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface INewsCommentService {

	/**
	 * 通过id得到员工风采评论表NewsComment
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public NewsComment getNewsCommentById(String id) throws Exception;

	/**
	 * 得到所有员工风采评论表NewsComment
	 * @param newsComment
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<NewsComment> getAll(NewsComment newsComment) throws Exception;

	/**
	 * 分页查询员工风采评论表NewsComment
	 * @param newsComment
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<NewsComment> getPagerModelByQuery(NewsComment newsComment, Query query) throws Exception;

	/**
	 * 分页查询员工风采评论表NewsComment
	 * @param newsComment
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<NewsComment> getPagerModelByQueryOr(NewsComment newsComment, Query query) throws Exception;
	
	
	/**
	 * 添加员工风采评论表NewsComment
	 * @param newsComment
	 * @throws Exception
	 * @Description:
	 */
	public void insertNewsComment(NewsComment newsComment) throws Exception;
	
	/**
	 * 通过id删除员工风采评论表NewsComment
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsCommentById(String id) throws Exception;

	/**
	 * 通过id批量删除员工风采评论表NewsComment
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsCommentByIds(String ids) throws Exception;

	/**
	 * 通过id修改员工风采评论表NewsComment
	 * @param newsComment
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsComment(NewsComment newsComment) throws Exception;

	/**
	 * 通过ids批量修改员工风采评论表NewsComment
	 * @param ids 如："'1','2','3','4'..."
	 * @param newsComment
	 * @throws Exception
	 * @Description:
	 */
	public int updateNewsCommentByIds(String ids, NewsComment newsComment) throws Exception;
	
	
}
