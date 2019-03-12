package com.dragon.portal.service.news.impl;

import com.dragon.portal.dao.news.INewsCommentDao;
import com.dragon.portal.dao.news.INewsNoticeDao;
import com.dragon.portal.model.news.NewsComment;
import com.dragon.portal.model.news.NewsNotice;
import com.dragon.portal.service.news.INewsCommentService;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title:员工风采评论表Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-04 09:00:48
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class NewsCommentServiceImpl implements INewsCommentService {

	@Resource
	private INewsCommentDao newsCommentDao;
	@Resource
	private INewsNoticeDao newsNoticeDao;
	
	@Override
	public NewsComment getNewsCommentById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.newsCommentDao.getNewsCommentById(id.trim()) : null;
	}

	@Override
	public List<NewsComment> getAll(NewsComment newsComment) throws Exception {
		return null != newsComment ? this.newsCommentDao.getAll(newsComment) : null;
	}

	@Override
	public PagerModel<NewsComment> getPagerModelByQuery(NewsComment newsComment, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<NewsComment> page = (null != newsComment && null != query) ? this.newsCommentDao.getPagerModelByQuery(newsComment) : null;
		return new PagerModel<NewsComment>(page);
	}
	@Override
	public PagerModel<NewsComment> getPagerModelByQueryOr(NewsComment newsComment, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<NewsComment> page = (null != newsComment && null != query) ? this.newsCommentDao.getPagerModelByQueryOr(newsComment) : null;
		return new PagerModel<NewsComment>(page);
	}

	@Override
	public void insertNewsComment(NewsComment newsComment) throws Exception {
		if (null != newsComment) {
			newsComment.setId( UUIDGenerator.generate());
			newsComment.setCreateTime(new Date());
			newsComment.setUpdateTime(new Date());
			this.newsCommentDao.insertNewsComment(newsComment);
			if(newsComment.getType()==0){
				NewsNotice notice = new NewsNotice();
				notice.setId(newsComment.getRefId());
				newsNoticeDao.incrementNoticeCommentCount(notice);
			}
		}
	}
	
	@Override
	public void delNewsCommentById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.newsCommentDao.delNewsCommentById(id.trim());
		}
	}
	
	@Override
	public void delNewsCommentByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.newsCommentDao.delNewsCommentByIds(ids);
		}
	}
	
	@Override
	public void updateNewsComment(NewsComment newsComment) throws Exception {
		if (null != newsComment) {
			newsComment.setUpdateTime(new Date());
			this.newsCommentDao.updateNewsComment(newsComment);
		}
	}

	@Override
	public int updateNewsCommentByIds(String ids,NewsComment newsComment) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != newsComment) {
			newsComment.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("newsComment", newsComment);
			return this.newsCommentDao.updateNewsCommentByIds(params);
		}else{
			return 0;
		}
	}
	
	/**
	 * 将"1,2,3,4,5..."这种形式的字符串转成"'1','2','3','4'..."这种形式
	 * @param strs
	 * @return
	 */
	private String converString(String strs) {
		if (StringUtils.isNotBlank(strs)) {
			String[] idStrs = strs.trim().split(",");
			if (null != idStrs && idStrs.length > 0) {
				StringBuffer sbf = new StringBuffer("");
				for (String str : idStrs) {
					if (StringUtils.isNotBlank(str)) {
						sbf.append("'").append(str.trim()).append("'").append(",");
					}
				}
				if (sbf.length() > 0) {
					sbf = sbf.deleteCharAt(sbf.length() - 1);
					return sbf.toString();
				}
			}
		}
		return "";
	}
}

