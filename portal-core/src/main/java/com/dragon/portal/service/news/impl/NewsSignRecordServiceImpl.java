package com.dragon.portal.service.news.impl;

import com.dragon.portal.dao.news.INewsSignRecordDao;
import com.dragon.portal.model.news.NewsSignRecord;
import com.dragon.portal.service.news.INewsSignRecordService;
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
 * @Title:报名记录Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-07-13 13:27:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class NewsSignRecordServiceImpl implements INewsSignRecordService {

	@Resource
	private INewsSignRecordDao newsSignRecordDao;

	@Override
	public NewsSignRecord getNewsSignRecordById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.newsSignRecordDao.getNewsSignRecordById(id.trim()) : null;
	}

	@Override
	public List<NewsSignRecord> getAll(NewsSignRecord newsSignRecord) throws Exception {
		return null != newsSignRecord ? this.newsSignRecordDao.getAll(newsSignRecord) : null;
	}

	@Override
	public PagerModel<NewsSignRecord> getPagerModelByQuery(NewsSignRecord newsSignRecord, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<NewsSignRecord> page = (null != newsSignRecord && null != query) ? this.newsSignRecordDao.getPagerModelByQuery(newsSignRecord) : null;
		return new PagerModel<NewsSignRecord>(page);
	}

	@Override
	public void insertNewsSignRecord(NewsSignRecord newsSignRecord) throws Exception {
		if (null != newsSignRecord) {
			newsSignRecord.setId( UUIDGenerator.generate());
			newsSignRecord.setCreateTime(new Date());
			newsSignRecord.setUpdateTime(new Date());
			this.newsSignRecordDao.insertNewsSignRecord(newsSignRecord);
		}
	}
	
	@Override
	public void delNewsSignRecordById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.newsSignRecordDao.delNewsSignRecordById(id.trim());
		}
	}
	
	@Override
	public void delNewsSignRecordByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.newsSignRecordDao.delNewsSignRecordByIds(ids);
		}
	}
	
	@Override
	public void updateNewsSignRecord(NewsSignRecord newsSignRecord) throws Exception {
		if (null != newsSignRecord) {
			newsSignRecord.setUpdateTime(new Date());
			this.newsSignRecordDao.updateNewsSignRecord(newsSignRecord);
		}
	}

	@Override
	public void updateNewsSignRecordByIds(String ids,NewsSignRecord newsSignRecord) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != newsSignRecord) {
			newsSignRecord.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("newsSignRecord", newsSignRecord);
			this.newsSignRecordDao.updateNewsSignRecordByIds(params);
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

