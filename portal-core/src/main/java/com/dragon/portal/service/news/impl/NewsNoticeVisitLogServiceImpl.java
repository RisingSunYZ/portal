package com.dragon.portal.service.news.impl;

import com.dragon.portal.dao.news.INewsNoticeDao;
import com.dragon.portal.dao.news.INewsNoticeVisitLogDao;
import com.dragon.portal.model.news.NewsNotice;
import com.dragon.portal.model.news.NewsNoticeVisitLog;
import com.dragon.portal.service.news.INewsNoticeVisitLogService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.ys.yahu.enm.NewsNoticeEnum;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title:公告或新闻动态访问量日志Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 14:00:09
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class NewsNoticeVisitLogServiceImpl implements INewsNoticeVisitLogService {

	@Resource
	private INewsNoticeVisitLogDao newsNoticeVisitLogDao;

	@Resource
	private INewsNoticeDao noticeDao;
	
	@Override
	public NewsNoticeVisitLog getNewsNoticeVisitLogById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.newsNoticeVisitLogDao.getNewsNoticeVisitLogById(id.trim()) : null;
	}

	@Override
	public List<NewsNoticeVisitLog> getAll(NewsNoticeVisitLog newsNoticeVisitLog) throws Exception {
		return null != newsNoticeVisitLog ? this.newsNoticeVisitLogDao.getAll(newsNoticeVisitLog) : null;
	}

	@Override
	public PagerModel<NewsNoticeVisitLog> getPagerModelByQuery(NewsNoticeVisitLog newsNoticeVisitLog, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<NewsNoticeVisitLog> page = (null != newsNoticeVisitLog && null != query) ?
				this.newsNoticeVisitLogDao.getPagerModelByQuery(newsNoticeVisitLog) : null;
		return new PagerModel<NewsNoticeVisitLog>(page);
	}
	
	@Override
	public PagerModel<NewsNoticeVisitLog> getPagerModelByQueryOr(NewsNoticeVisitLog newsNoticeVisitLog, Query query)
			throws Exception {
		if(StringUtils.isNotBlank(newsNoticeVisitLog.getVisitor())){
			newsNoticeVisitLog.setVisitorName(newsNoticeVisitLog.getVisitor());
			newsNoticeVisitLog.setVisitIp(newsNoticeVisitLog.getVisitor());
		}

		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<NewsNoticeVisitLog> page = (null != newsNoticeVisitLog && null != query) ?
				this.newsNoticeVisitLogDao.getPagerModelByQueryOr(newsNoticeVisitLog) : null;
		return new PagerModel<NewsNoticeVisitLog>(page);
	}

	@Override
	public void insertNewsNoticeVisitLog(NewsNoticeVisitLog newsNoticeVisitLog) throws Exception {
		if (null != newsNoticeVisitLog) {
			newsNoticeVisitLog.setId( UUIDGenerator.generate());
			newsNoticeVisitLog.setCreateTime(new Date());
			newsNoticeVisitLog.setCreator("admin");
			newsNoticeVisitLog.setUpdator("admin");
			newsNoticeVisitLog.setUpdateTime(new Date());
			NewsNoticeVisitLog NVLWhere = new NewsNoticeVisitLog();
			//判断该用户是否访问过 如果没有访问+1 
			NVLWhere.setRefId(newsNoticeVisitLog.getRefId());
			NVLWhere.setVisitor(newsNoticeVisitLog.getVisitor());
			List<NewsNoticeVisitLog> listNewsNVL = newsNoticeVisitLogDao.getAll(NVLWhere);
			this.newsNoticeVisitLogDao.insertNewsNoticeVisitLog(newsNoticeVisitLog);
			if(CollectionUtils.isEmpty(listNewsNVL)){
				NewsNotice newsNotice = new NewsNotice();
				newsNotice.setId(newsNoticeVisitLog.getRefId());
				noticeDao.incrementNoticeVisitCount(newsNotice);
			}			
		}
	}

	@Override
	public void insertNewsNoticeVisitLog(UserSessionInfo userSessionInfo, String ip, String newsNoticeId, NewsNoticeEnum type) throws Exception {
		//1 判断记录是否已经添加  
		NewsNoticeVisitLog newsNVL = new NewsNoticeVisitLog();
		newsNVL.setVisitor(userSessionInfo.getNo());
		newsNVL.setVisitorName(userSessionInfo.getName());
		newsNVL.setRefId(newsNoticeId);
		newsNVL.setCompanyId(userSessionInfo.getCompanyId());
		newsNVL.setCompanyName(userSessionInfo.getCompanyName());
		newsNVL.setDeptId(userSessionInfo.getDepId());
		newsNVL.setDeptName(userSessionInfo.getDepName());
		newsNVL.setVisitIp(ip);
		
		//1.1如果未添加过则插入一条日志设置访问量为1，同时累加新闻或公告的访问量
//		if(CollectionUtils.isEmpty(listNewsNVL)){
			this.insertNewsNoticeVisitLog(newsNVL);
//			//1.2如果已经添加则累加访问日志的访问量同时累加新闻或公告的访问量
//			//判断type类型  若存在，则update；若不存在，不处理。
//			if(NewsNoticeEnum.NEWS.equals(type)){
//				News news  = newsDao.getNewsById(newsNoticeId);
//				if(null!=news){
//					if(null!=news.getVisitCount()){
//						Integer count = news.getVisitCount()+1;  //访问量加1
//						news.setVisitCount(count);
//						newsDao.updateNews(news);
//					}
//				}
//			}
//			if(NewsNoticeEnum.NOTICE.equals(type)){
//				NewsNotice notice  = noticeDao.getNoticeById(newsNoticeId);
//				if(null!=notice){
//					if(null!=notice.getVisitCount()){
//						Integer count = notice.getVisitCount()+ 1;  //访问量加1
//						notice.setVisitCount(count);
//						noticeDao.updateNotice(notice);
//					}
//				}
//			}
//		}
		//如果已添加过则访问量+1，同时累加新闻或公告的访问量
//		else{
//			//创建一个新对象接收getAll方法返回的List[0]，对其进行更新处理
//			NewsNoticeVisitLog newsNoticeVisitLog = listNewsNVL.get(0);
//			this.updateNewsNoticeVisitLog(newsNoticeVisitLog);
//			//判断type类型  若存在，则update；若不存在，不处理。
//			if(NewsNoticeEnum.NEWS.equals(type)){
//				News news  = newsDao.getNewsById(newsNoticeId);
//				if(null!=news){
//					if(null!=news.getVisitCount()){
//						Integer count = news.getVisitCount()+1;  //访问量加1
//						news.setVisitCount(count);
//						newsDao.updateNews(news);
//					}
//				}
//			}
//			if(NewsNoticeEnum.NOTICE.equals(type)){
//				NewsNotice notice  = noticeDao.getNoticeById(newsNoticeId);
//				if(null!=notice){
//					if(null!=notice.getVisitCount()){
//						Integer count = notice.getVisitCount()+ 1;  //访问量加1
//						notice.setVisitCount(count);
//						noticeDao.updateNotice(notice);
//					}
//				}
//			}
//		}
		
	}
	
	@Override
	public void delNewsNoticeVisitLogById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.newsNoticeVisitLogDao.delNewsNoticeVisitLogById(id.trim());
		}
	}
	
	@Override
	public void delNewsNoticeVisitLogByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.newsNoticeVisitLogDao.delNewsNoticeVisitLogByIds(ids);
		}
	}
	
	@Override
	public void updateNewsNoticeVisitLog(NewsNoticeVisitLog newsNoticeVisitLog) throws Exception {
		if (null != newsNoticeVisitLog) {
			newsNoticeVisitLog.setUpdateTime(new Date());
			this.newsNoticeVisitLogDao.updateNewsNoticeVisitLog(newsNoticeVisitLog);
		}
	}

	@Override
	public void updateNewsNoticeVisitLogByIds(String ids,NewsNoticeVisitLog newsNoticeVisitLog) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != newsNoticeVisitLog) {
			newsNoticeVisitLog.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("newsNoticeVisitLog", newsNoticeVisitLog);
			this.newsNoticeVisitLogDao.updateNewsNoticeVisitLogByIds( params );
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

