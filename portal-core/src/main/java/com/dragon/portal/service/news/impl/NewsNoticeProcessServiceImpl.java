package com.dragon.portal.service.news.impl;

import com.dragon.flow.api.IFlowApi;
import com.dragon.flow.enm.flowable.run.CommentTypeEnum;
import com.dragon.flow.vo.flowable.comment.FlowCommentVo;
import com.dragon.portal.dao.news.INewsNoticeProcessDao;
import com.dragon.portal.model.news.NewsNoticeProcess;
import com.dragon.portal.service.news.INewsNoticeProcessService;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.ys.tools.vo.ReturnVo;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @Title:新闻公告发文-流程Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2018-01-03 09:44:09
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@Service
public class NewsNoticeProcessServiceImpl implements INewsNoticeProcessService {

	@Resource
	private INewsNoticeProcessDao newsNoticeProcessDao;
	@Resource
	IPersonnelApi personnelApi;
	@Resource
	IFlowApi flowApi;

	@Override
	public NewsNoticeProcess getNewsNoticeProcessById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.newsNoticeProcessDao.getNewsNoticeProcessById(id.trim()) : null;
	}

	@Override
	public List<NewsNoticeProcess> getAll(NewsNoticeProcess newsNoticeProcess) throws Exception {
		return null != newsNoticeProcess ? this.newsNoticeProcessDao.getAll(newsNoticeProcess) : null;
	}

	@Override
	public List<FlowCommentVo> getNewsNoticeComments(String processInstId) throws Exception {
		List<FlowCommentVo> approveRecords = new ArrayList<FlowCommentVo>();
		List<FlowCommentVo> comments = flowApi.getCommentsByProcessInstanceId(processInstId);
		List<String> userNos = new ArrayList<String>();
		for (FlowCommentVo commentVo : comments) {
			if (StringUtils.isNotBlank(commentVo.getUserId())) {
				userNos.add(commentVo.getUserId());
			}
		}
		Map<String, PersonnelApiVo> pMap = getPersonnelVoMapByNos(userNos);
		Iterator<FlowCommentVo> it = null;
		FlowCommentVo comVo = null;
		for (FlowCommentVo commentVo : comments) {
			if (StringUtils.isNotBlank(commentVo.getUserId())) {
				PersonnelApiVo pVo = pMap.get(commentVo.getUserId());
				if (null != pVo) {
					commentVo.setUserUrl(pVo.getHeadImg());
					commentVo.setUserName(pVo.getName());
				}
			}
			if (CommentTypeEnum.ZY.name().equals(commentVo.getType()) || CommentTypeEnum.YY.name().equals(commentVo.getType())) {
			} else {
				if (!approveRecords.isEmpty() && approveRecords.get(approveRecords.size() - 1).getUserId().equals(commentVo.getUserId())) {
					continue;
				}
				if (CommentTypeEnum.TJ.name().equals(commentVo.getType()) || CommentTypeEnum.SP.name().equals(commentVo.getType())
						||CommentTypeEnum.ZB.name().equals(commentVo.getType()) || CommentTypeEnum.SPBJQ.name().equals(commentVo.getType())) {
					if (approveRecords.size() > 0) {
						it = approveRecords.iterator();
						while (it.hasNext()) {
							comVo = it.next();
							if (comVo.getTypeName().equals(commentVo.getTypeName()) && comVo.getUserName().equals(commentVo.getUserName())) {
								it.remove();
								break;
							}
						}
						if(CommentTypeEnum.ZB.name().equals(commentVo.getType())){
						    if(commentVo.getMessage().indexOf("移动")>-1){
                                String assignUser=commentVo.getMessage().split("转办")[1];
                                assignUser=assignUser.split("]")[0];
                                commentVo.setTypeName(commentVo.getTypeName()+"（"+assignUser+"）");
                            }else{
                                String assignUser=commentVo.getMessage().split("转办给")[1];
                                assignUser=assignUser.split("】")[0];
                                commentVo.setTypeName(commentVo.getTypeName()+"（"+assignUser+"）");
                            }
						}
                        if(CommentTypeEnum.SPBJQ.name().equals(commentVo.getType())){
                            if(commentVo.getMessage().indexOf("移动")>-1){
                                String assignUser=commentVo.getMessage().split("加签")[1];
                                assignUser=assignUser.split("]")[0];
                                commentVo.setTypeName(commentVo.getTypeName()+"（"+assignUser+"）");
                            }else{
                                String assignUser=commentVo.getMessage().split("审批并加签给")[1];
                                assignUser=assignUser.split("】")[0];
                                commentVo.setTypeName(commentVo.getTypeName()+"（"+assignUser+"）");
                            }
						}
						approveRecords.add(commentVo);
					} else {
						approveRecords.add(commentVo);
					}
				}
			}
		}
		return approveRecords;
	}
	private Map<String, PersonnelApiVo> getPersonnelVoMapByNos(List<String> nos) {
		Map<String, PersonnelApiVo> pMap = new HashMap<String, PersonnelApiVo>();

		ReturnVo<PersonnelApiVo> pvo = personnelApi.getPersonnelApiVoByNos(nos);
		if (pvo.getCode() == UcenterConstant.SUCCESS && CollectionUtils.isNotEmpty(pvo.getDatas())) {
			for (PersonnelApiVo vo : pvo.getDatas()) {
				pMap.put(vo.getNo(), vo);
			}
		}
		return pMap;
	}
	@Override
	public PagerModel<NewsNoticeProcess> getPagerModelByQuery(NewsNoticeProcess newsNoticeProcess, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<NewsNoticeProcess> page = (null != newsNoticeProcess && null != query) ? this.newsNoticeProcessDao.getPagerModelByQuery(newsNoticeProcess) : null;
		return new PagerModel<NewsNoticeProcess>(page);
	}

	@Override
	public void insertNewsNoticeProcess(NewsNoticeProcess newsNoticeProcess) throws Exception {
		if (null != newsNoticeProcess) {
			newsNoticeProcess.setId( UUIDGenerator.generate());
			newsNoticeProcess.setCreateTime(new Date());
			newsNoticeProcess.setUpdateTime(new Date());
			this.newsNoticeProcessDao.insertNewsNoticeProcess(newsNoticeProcess);
		}
	}
	
	@Override
	public void delNewsNoticeProcessById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.newsNoticeProcessDao.delNewsNoticeProcessById(id.trim());
		}
	}
	
	@Override
	public void delNewsNoticeProcessByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.newsNoticeProcessDao.delNewsNoticeProcessByIds(ids);
		}
	}
	
	@Override
	public void updateNewsNoticeProcess(NewsNoticeProcess newsNoticeProcess) throws Exception {
		if (null != newsNoticeProcess) {
			newsNoticeProcess.setUpdateTime(new Date());
			if(newsNoticeProcess.getTaskId().equals("")){
				newsNoticeProcess.setTaskId(null);
			}
			this.newsNoticeProcessDao.updateNewsNoticeProcess(newsNoticeProcess);
		}
	}




	@Override
	public void updateNewsNoticeProcessByCode(NewsNoticeProcess newsNoticeProcess) throws Exception {
		if (null != newsNoticeProcess) {
			newsNoticeProcess.setUpdateTime(new Date());
			this.newsNoticeProcessDao.updateNewsNoticeProcessByCode(newsNoticeProcess);
		}
	}

	@Override
	public void updateNewsNoticeProcessByIds(String ids,NewsNoticeProcess newsNoticeProcess) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != newsNoticeProcess) {
			newsNoticeProcess.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("newsNoticeProcess", newsNoticeProcess);
			this.newsNoticeProcessDao.updateNewsNoticeProcessByIds(params);
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
	public String getNoticeCode() throws Exception {
		String noticeCode = newsNoticeProcessDao.getNoticeCode();
		if(!StringUtils.isNotEmpty(noticeCode)){
			Date d = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			String dateNowStr = sdf.format(d);
			noticeCode = "XWGG"+dateNowStr+"0001";
		}
		return noticeCode;
	}
}

