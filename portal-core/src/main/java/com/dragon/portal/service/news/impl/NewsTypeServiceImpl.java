package com.dragon.portal.service.news.impl;

import com.dragon.portal.dao.news.INewsTypeDao;
import com.dragon.portal.model.news.NewsPublishRange;
import com.dragon.portal.model.news.NewsType;
import com.dragon.portal.service.news.INewsTypeService;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.ys.tools.common.StringTools;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title:新闻类型Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 13:53:29
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 *
 */
@Service
public class NewsTypeServiceImpl implements INewsTypeService {

	@Resource
	private INewsTypeDao newsTypeDao;

	@Override
	public NewsType getNewsTypeById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.newsTypeDao.getNewsTypeById(id.trim()) : null;
	}

	@Override
	public List<NewsType> getAll(NewsType newsType) throws Exception {
		return null != newsType ? this.newsTypeDao.getAll(newsType) : null;
	}

	@Override
	public PagerModel<NewsType> getPagerModelByQuery(NewsType newsType, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<NewsType> page = (null != newsType && null != query) ? this.newsTypeDao.getPagerModelByQuery(newsType) : null;
		return new PagerModel<NewsType>(page);
	}

	@Override
	public void insertNewsType(NewsType newsType) throws Exception {
		if (null != newsType) {
			newsType.setId( UUIDGenerator.generate());
			newsType.setCreateTime(new Date());
			newsType.setUpdateTime(new Date());
			this.newsTypeDao.insertNewsType(newsType);
		}
	}
	
	@Override
	public void delNewsTypeById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.newsTypeDao.delNewsTypeById(id.trim());
		}
	}
	
	@Override
	public void delNewsTypeByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.newsTypeDao.delNewsTypeByIds(ids);
		}
	}
	
	@Override
	public void updateNewsType(NewsType newsType) throws Exception {
		if (null != newsType) {
			newsType.setUpdateTime(new Date());
			this.newsTypeDao.updateNewsType(newsType);
		}
	}

	@Override
	public void updateNewsTypeByIds(String ids,NewsType newsType) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != newsType) {
			newsType.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("newsType", newsType);
			this.newsTypeDao.updateNewsTypeByIds(params);
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

	/**
	 * 根据类型标识sn得到新闻类型管理NewsType
	 * @param sn
	 * @throws Exception
	 * @auth luozongfang 2017-3-23 15:14:15
	 */
	@Override
	public NewsType queryNewsTypeBySn(String sn) throws Exception {
		return StringUtils.isNotBlank(sn) ? this.newsTypeDao.queryNewsTypeBySn(sn.trim()) : null;
	}
	
	//根据sn修改新闻类型
	@Override
	public void updateNewsTypeBySn(NewsType newsType) throws Exception {
		if (null != newsType) {
			newsType.setUpdateTime(new Date());
			this.newsTypeDao.updateNewsTypeBySn(newsType);
		}
	}

	@Override
	public List<NewsType> getAllNoticeType() throws Exception {
		return this.newsTypeDao.getAllNoticeType();
	}

	@Override
	public List<NewsType> getNewsTypeByIds(String ids) throws Exception {
		ids = StringTools.converString(ids);
		return StringUtils.isNotBlank(ids) ? this.newsTypeDao.getNewsTypeByIds(ids) : null;
	}
}

