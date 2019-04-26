package com.dragon.portal.service.news.impl;

import com.dragon.portal.dao.news.INewsPublishRangeDao;
import com.dragon.portal.model.news.NewsPublishRange;
import com.dragon.portal.service.news.INewsPublishRangeService;
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
 * @Title:公告-新闻动态发布范围中间表Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-06 14:06:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class NewsPublishRangeServiceImpl implements INewsPublishRangeService {

	@Resource
	private INewsPublishRangeDao newsPublishRangeDao;

	@Override
	public NewsPublishRange getNewsPublishRangeById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.newsPublishRangeDao.getNewsPublishRangeById(id.trim()) : null;
	}

	@Override
	public List<NewsPublishRange> getAll(NewsPublishRange newsPublishRange) throws Exception {
		return null != newsPublishRange ? this.newsPublishRangeDao.getAll(newsPublishRange) : null;
	}

	@Override
	public PagerModel<NewsPublishRange> getPagerModelByQuery(NewsPublishRange newsPublishRange, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<NewsPublishRange> page = (null != newsPublishRange && null != query) ? this.newsPublishRangeDao.getPagerModelByQuery(newsPublishRange) : null;
		return new PagerModel<NewsPublishRange>(page);
	}

	@Override
	public void insertNewsPublishRange(NewsPublishRange newsPublishRange) throws Exception {
		if (null != newsPublishRange) {
			newsPublishRange.setId( UUIDGenerator.generate());
			newsPublishRange.setCreateTime(new Date());
			newsPublishRange.setUpdateTime(new Date());
			this.newsPublishRangeDao.insertNewsPublishRange(newsPublishRange);
		}
	}
	
	@Override
	public void delNewsPublishRangeById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.newsPublishRangeDao.delNewsPublishRangeById(id.trim());
		}
	}
	
	@Override
	public void delNewsPublishRangeByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.newsPublishRangeDao.delNewsPublishRangeByIds(ids);
		}
	}
	
	@Override
	public void updateNewsPublishRange(NewsPublishRange newsPublishRange) throws Exception {
		if (null != newsPublishRange) {
			newsPublishRange.setUpdateTime(new Date());
			this.newsPublishRangeDao.updateNewsPublishRange(newsPublishRange);
		}
	}

	@Override
	public void updateNewsPublishRangeByIds(String ids,NewsPublishRange newsPublishRange) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != newsPublishRange) {
			newsPublishRange.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("newsPublishRange", newsPublishRange);
			this.newsPublishRangeDao.updateNewsPublishRangeByIds(params);
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

	@Override
	public void delNewsPublishRangeByNId(String id) throws Exception {
		if(StringUtils.isNotBlank(id)){
			this.newsPublishRangeDao.delNewsPublishRangeByNId(id);
		}
	}
}

