package com.dragon.portal.service.news.impl;

import com.dragon.portal.dao.news.INewsFileDao;
import com.dragon.portal.model.news.NewsFile;
import com.dragon.portal.service.news.INewsFileService;
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
 * @Title:新闻公告附件管理Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-22 16:15:55
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@Service
public class NewsFileServiceImpl implements INewsFileService {

	@Resource
	private INewsFileDao newsFileDao;

	@Override
	public NewsFile getNewsFileById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.newsFileDao.getNewsFileById(id.trim()) : null;
	}

	@Override
	public List<NewsFile> getAll(NewsFile newsFile) throws Exception {
		return null != newsFile ? this.newsFileDao.getAll(newsFile) : null;
	}

	@Override
	public PagerModel<NewsFile> getPagerModelByQuery(NewsFile newsFile, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<NewsFile> page = (null != newsFile && null != query) ? this.newsFileDao.getPagerModelByQuery(newsFile) : null;
		return new PagerModel<NewsFile>(page);
	}

	@Override
	public void insertNewsFile(NewsFile newsFile) throws Exception {
		if (null != newsFile) {
			newsFile.setId( UUIDGenerator.generate());
			newsFile.setCreateTime(new Date());
			newsFile.setUpdateTime(new Date());
			if(null==newsFile.getSortNo()){
				NewsFile temp = newsFileDao.getMaxNewsFileByRefId(newsFile.getRefId());
				if(temp!=null){
					newsFile.setSortNo(temp.getSortNo()+100);	
				}else{
					newsFile.setSortNo(1000);
				}
			}
			this.newsFileDao.insertNewsFile(newsFile);
		}
	}
	
	@Override
	public void delNewsFileById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.newsFileDao.delNewsFileById(id.trim());
		}
	}
	
	@Override
	public void delNewsFileByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.newsFileDao.delNewsFileByIds(ids);
		}
	}
	
	@Override
	public void updateNewsFile(NewsFile newsFile) throws Exception {
		if (null != newsFile) {
			newsFile.setUpdateTime(new Date());
			this.newsFileDao.updateNewsFile(newsFile);
		}
	}
	
	@Override
	public void updateNewsFileByRefId(NewsFile newsFile) throws Exception {
		if (null != newsFile) {
			newsFile.setUpdateTime(new Date());
			this.newsFileDao.updateNewsFileByRefId(newsFile);
		}
	}

	@Override
	public void updateNewsFileByIds(String ids,NewsFile newsFile) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != newsFile) {
			newsFile.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("newsFile", newsFile);
			this.newsFileDao.updateNewsFileByIds( params );
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
	public void updateSortNoById(String id, Integer num) throws Exception {
		if (StringUtils.isNotBlank(id) && null != num){
			Map<String,Object> params = new HashMap<String, Object>();
			params.put("id", id);
			params.put("num",num);
			this.newsFileDao.updateSortNoById(params );
		}
	}
}

