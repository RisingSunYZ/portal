package com.dragon.portal.rest.controller.news;

import com.dragon.flow.vo.flowable.comment.FlowCommentVo;
import com.dragon.portal.model.news.*;
import com.dragon.portal.service.news.*;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.utils.CommUtils;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.web.controller.BaseController;
import com.dragon.tools.pager.ORDERBY;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.ys.tools.vo.ReturnVo;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.model.company.Company;
import com.ys.ucenter.model.user.Department;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import com.ys.yahu.enm.NewsNoticeEnum;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.map.LinkedMap;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * @Title:新闻资讯Controller
 * @Description:
 * @Author:xietongjian
 * @Since:2017年4月11日 下午11:19:49
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@RestController
@RequestMapping("/rest/portal/news")
@Api(value="门户首页（工作台）-通知公告", description = "门户首页（工作台）-通知公告", tags={"门户首页（工作台）-通知公告 /rest/portal/news"})
public class NewsIndexController extends BaseController {
	
	private static Logger logger = Logger.getLogger(NewsIndexController.class);

	@Resource
	private IPersonnelApi personnelApi;
	@Resource
	private IOrgApi orgApi ;
	@Resource
	private INewsTypeService newsTypeService;
	@Resource
	private INewsNoticeService newsNoticeService;
	@Resource
	private RedisService redisService;
	@Resource
	private INewsPublishRangeService newsPublishRangeService;
	@Resource
	private INewsNoticeVisitLogService newsNoticeVisitLogService;
	@Resource
	private INewsFileService newsFileService;
	@Resource
	private INewsNoticeProcessService newsNoticeProcessService;
	@Resource
	private INewsSignRecordService newsSignRecordService;

	/**
	 * 通用获取新闻资讯信息
	 * @param notice
	 * @param query
	 * @param typeSn
	 * @param request
	 * @param response
	 * @return
	 * @Cacheable新闻增加缓存 默认key为登录人No+typeSn 缓存时间五分钟
	 * @Description:
	 * @author v-zhaohaishan 2017年7月14日 上午9:47:22
	 */
//	@Cacheable(value = "get_news_notices_list",key = "'newsNotice'+#userNo.concat(#typeSn)")
	@GetMapping("/ajaxListVo")
	@ApiOperation("通用获取新闻资讯信息")
	@ApiImplicitParams({
//			@ApiImplicitParam(name="typeSn", value = "typeSn", dataType = "String", paramType = "query"),
	})
	public Object ajaxListVo( String userNo, String typeSn, NewsNotice notice, @ApiIgnore Query query,
							 @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
		UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
		notice.setRangeDeftId(getRangeDeftId(userSessionInfo.getDepId()));
		PagerModel<NewsNotice> pagerModelByQueryOfRange = null;
		PagerModel<NewsNoticeVo> pm = new PagerModel<NewsNoticeVo>();
		Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
		sqlOrderBy.put("publish_time", ORDERBY.DESC);
		query.setSqlOrderBy(sqlOrderBy);
		try {
			NewsType newsType = newsTypeService.queryNewsTypeBySn(typeSn);
			if (null != newsType){
				notice.setTypeId(newsType.getId());
				notice.setUserNo(userSessionInfo.getNo());
				if(CollectionUtils.isEmpty(notice.getRangeDeftId())){
					return pm;
				}

				pagerModelByQueryOfRange = newsNoticeService.getPagerModelByQueryOfRangeRedis(notice, query,userSessionInfo.getNo());
	//			List<NewsNoticeVo> converts = (List<NewsNoticeVo>) BeanUtils.converts(NewsNoticeVo.class, pagerModelByQueryOfRange.getRows());
	//			pm.setTotal(pagerModelByQueryOfRange.getTotal());
	//			pm.setRows(converts);
			}
		} catch (Exception e) {
			logger.error("NewsIndexController-" + ":" + e);
			e.printStackTrace();
		}
		return pagerModelByQueryOfRange;
	}

	/**
	 * 通知详情列表
	 * @param request
	 * @param response
	 * @param id
	 * @return
	 * @Description:
	 * @author v-zhaohaishan 2017年7月13日 上午8:59:39
	 */
	@GetMapping("/noticeDetail")
	@ApiOperation("通知详情列表")
	@ApiImplicitParams({
//			@ApiImplicitParam(name="typeSn", value = "typeSn", dataType = "String", paramType = "query"),
	})
	public Map<String, Object> noticeDetail(String id, String typeSn,
											@ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
		Map<String, Object> resultMap = new HashMap<>( );
		UserSessionInfo userSessionInfo = getUserSessionInfo(request, response);
		try {
			NewsNotice notice = newsNoticeService.getFullById(id, userSessionInfo.getNo(), userSessionInfo.getDepId());
			if (notice != null) {
				//查询发布范围---详情页面显示 显示出 （公司-部门）
				NewsPublishRange newsPublishRange = new NewsPublishRange();
				newsPublishRange.setNewsNoticeId(notice.getId());
				List<NewsPublishRange> publishRangeServiceAll = newsPublishRangeService.getAll(newsPublishRange);
				if (publishRangeServiceAll != null && publishRangeServiceAll.size() > 0) {
					StringBuilder sb = new StringBuilder();
					for (NewsPublishRange publishRange : publishRangeServiceAll) {
						if (publishRange.getDataType() == 2) {
							try {
								ReturnVo<Department> departmentReturnVo = orgApi.getDepartmentByids(publishRange.getOrgId());
								Department department = departmentReturnVo.getDatas().get(0);
								if (StringUtils.isNotBlank(department.getPreDeptId())) {
									Company companyWhere = new Company();
									companyWhere.setId(department.getCompanyId());
									ReturnVo<List<Company>> companyReturn = orgApi.getCompany(companyWhere);
									Company company = companyReturn.getData().get(0);
									sb.append(company.getName() + "->" + department.getName() + ",");
								} else {
									sb.append(publishRange.getOrgName() + ",");
								}
							} catch (Exception e) {
								sb.append(publishRange.getOrgName() + ",");
							}
						} else {
							sb.append(publishRange.getOrgName() + ",");
						}
					}
					notice.setRangeName(sb.deleteCharAt(sb.length()-1).toString());
				}
				newsNoticeVisitLogService.insertNewsNoticeVisitLog(userSessionInfo, CommUtils.getRealRemoteIP(request), id, NewsNoticeEnum.NOTICE);
				NewsFile newsFile = new NewsFile();
				newsFile.setRefId(id);
				List<NewsFile> files = newsFileService.getAll(newsFile);
				NewsType newsType = null;
				if (StringUtils.isNotBlank(typeSn)) {
					NewsType where = new NewsType();
					where.setSn(typeSn);
					where.setStatus(1);
					newsType = newsTypeService.getAll(where).get(0);
				} else {
					newsType = newsTypeService.getNewsTypeById(notice.getTypeId());
				}
				resultMap.put("files", files);//附件
				resultMap.put("notice", notice);
				resultMap.put("newsType", newsType);

				List<FlowCommentVo> approveRecords = new ArrayList<FlowCommentVo>();
				try {
					NewsNoticeProcess newsNoticeProcess = new NewsNoticeProcess();
					newsNoticeProcess.setNewNoticeId(notice.getId());
					List<NewsNoticeProcess> all = newsNoticeProcessService.getAll(newsNoticeProcess);
					if (all != null && !all.isEmpty()) {
						approveRecords=newsNoticeProcessService.getNewsNoticeComments(all.get(0).getTaskId());
					}
				} catch (Exception e) {
					logger.error("调用查询审批记录的接口异常！");
					e.printStackTrace();
				}

				resultMap.put("approveRecords", approveRecords);
				if(null != userSessionInfo){
					resultMap.put("watermarkTxt", userSessionInfo.getName()+"_"+userSessionInfo.getNo());
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultMap;
	}

	/**
	 * 通用获取详情页面数据
	 * @param request
	 * @param response
	 * @param id
	 * @return
	 * @Description:
	 * @author v-zhaohaishan 2017年7月14日 上午10:23:19
	 */
	@GetMapping("/getNewsNoticePage")
	@ApiOperation("通用获取详情页面数据")
	@ApiImplicitParams({
			@ApiImplicitParam(name="id", value = "id", dataType = "String", paramType = "query"),
	})
	public Map<String, Object> getNewsNoticePage(String id, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response){

		NewsNotice noticeById;
		try {
			noticeById = newsNoticeService.getNoticeById(id);
			String typeId = StringUtils.isNotBlank(noticeById.getTypeId())?noticeById.getTypeId():noticeById.getTypeIdArray().split(",")[0];
			NewsType newsTypeById = newsTypeService.getNewsTypeById(typeId);
			String sn = newsTypeById.getSn();
			if(sn.indexOf("notice") > 0){
				return this.noticeDetail(id, null, request, response);
			}else if(sn.equals("company_news")||sn.equals("itrend_news")
					||sn.equals("finance_info")||sn.equals("finance_pro")
					||sn.equals("finance_expense")||sn.equals("rszd")){
				return this.newsDetail(id,null, request, response);
			}else if(sn.equals("special_events")){
				return this.activityDetail(id, request, response);
			}else if(sn.equals("industry_news")){
				return this.industryDetail(id, request, response);
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error( "NewsIndexController-getNewsNoticePage:" + e );
		}
		return null;
	}

	/**
	 * 专题活动详情
	 * @param id
	 * @param request
	 * @param response
	 * @return
	 * @Description:
	 * @author v-zhaohaishan 2017年7月14日 上午9:45:15
	 */
	@GetMapping("/activityDetail")
	@ApiOperation("专题活动详情")
	@ApiImplicitParams({})
	public Map<String, Object> activityDetail(String id, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response){
		Map<String, Object> resultMap = new HashMap<>();
		UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
		try {
			NewsNotice news = newsNoticeService.getFullById(id,userSessionInfo.getNo(),userSessionInfo.getDepId());
			newsNoticeVisitLogService.insertNewsNoticeVisitLog(userSessionInfo, CommUtils.getRealRemoteIP(request),id, NewsNoticeEnum.NEWS);
			NewsSignRecord newsSignRecord = new NewsSignRecord();
			newsSignRecord.setNewsId(id);
			newsSignRecord.setUserNo(userSessionInfo.getNo());
			List<NewsSignRecord> all = newsSignRecordService.getAll(newsSignRecord);
			if(CollectionUtils.isNotEmpty(all)){
				resultMap.put("already", 1);
			}
			if (news.getStartTime()==null||news.getEndTime()==null||news.getStartTime().getTime() > new Date().getTime()
					|| news.getEndTime().getTime() < new Date().getTime()) {
				resultMap.put("available", 0);
			}else{
				resultMap.put("available", 1);
			}
			resultMap.put("news", news);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error( "NewsIndexController-activityDetail:" + e );
		}
		return resultMap;
	}


	/**
	 * 	动态详情
	 * @param id
	 * @param request
	 * @param response
	 * @return
	 * @Description:
	 * @author v-zhaohaishan 2017年7月13日 上午8:59:53
	 */
	@GetMapping("newsDetail")
	@ApiOperation("动态详情")
	@ApiImplicitParams({})
	public Map<String, Object> newsDetail(String id, String source, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response){
		Map<String, Object> resultMap = new HashMap<>(  );
		try {
			UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
			if(StringUtils.isNotBlank(source)&&source.equals("loginPage")||userSessionInfo==null){
				NewsNotice news = newsNoticeService.getFullById(id);
				resultMap.put("news", news);
				resultMap.put("flag", 0);//0 来自不需要登录请求的标示
			}else{
				String no = userSessionInfo.getNo();
				ReturnVo<PersonnelApiVo> ReturnVo = personnelApi.getPersonnelApiVoByNo(no);
				PersonnelApiVo PersonnelApiVo = ReturnVo.getDatas().get(0);
				List<String> rangeDeftId = getRangeDeftId(PersonnelApiVo.getDeptId());
				NewsNotice news = newsNoticeService.getFullById(id,userSessionInfo.getNo(),userSessionInfo.getDepId());
				if(news!=null){
					newsNoticeVisitLogService.insertNewsNoticeVisitLog(userSessionInfo, CommUtils.getRealRemoteIP(request),id, NewsNoticeEnum.NEWS);
					List<NewsNotice> newsByKeyword = newsNoticeService.getNewsByKeyword(news.getTypeId(),news.getKeyword(),rangeDeftId,id);
					NewsType newsType = newsTypeService.getNewsTypeById(news.getTypeId());
					resultMap.put("news", news);
					resultMap.put("newsByKeyword", newsByKeyword);
					resultMap.put("newsType",newsType);
					resultMap.put("flag", 1);//1需要登录请求的标示
				}
			}
			NewsFile newsFile = new NewsFile();
			newsFile.setRefId(id);
			List<NewsFile> files = newsFileService.getAll(newsFile);
			resultMap.put("files", files);//附件
		} catch (Exception e) {
			e.printStackTrace();
			logger.error( "NewsIndexController-newsDetail:" + e );
		}
		return resultMap;
	}

	@GetMapping("/industryDetail")
	public Map<String, Object> industryDetail(String id,HttpServletRequest request, HttpServletResponse response){
		Map<String, Object> resultMap = new HashMap<>();
		UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
		String no = userSessionInfo.getNo();
		ReturnVo<PersonnelApiVo> ReturnVo = personnelApi.getPersonnelApiVoByNo(no);
		PersonnelApiVo PersonnelApiVo = ReturnVo.getDatas().get(0);
		List<String> rangeDeftId = getRangeDeftId(PersonnelApiVo.getDeptId());
		try {
			NewsNotice news = newsNoticeService.getFullById(id,userSessionInfo.getNo(),userSessionInfo.getDepId());
			if(news!=null){
				newsNoticeVisitLogService.insertNewsNoticeVisitLog(userSessionInfo, CommUtils.getRealRemoteIP(request),id, NewsNoticeEnum.NEWS);
				//热门文章------开始
				Query query = new Query(5);
				Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
				sqlOrderBy.put("visit_count", ORDERBY.DESC);
				query.setSqlOrderBy(sqlOrderBy);
				NewsNotice notice = new NewsNotice();
				notice.setTypeId(news.getTypeId());
				notice.setRangeDeftId(rangeDeftId);
				PagerModel<NewsNotice> pagerModelByQueryOfRange = newsNoticeService.getPagerModelByQueryOfRange(notice, query,no);
				//------------结束
				resultMap.put("news", news);
				resultMap.put("hotter", pagerModelByQueryOfRange.getRows());
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error( "NewsIndexController-industryDetail:" + e );
		}
		return resultMap;
	}

	/**
	 *
	 * @param deptId
	 * @return
	 */
	private List<String> getRangeDeftId(String deptId) {
		if (StringUtils.isNotBlank(deptId)) {
			List<String> rangeDeftId = new ArrayList<String>();
			ReturnVo<Department> Departments = null;
			try{
				if(redisService.exists(deptId)){
					net.sf.json.JSONObject value = JSONObject.fromObject( redisService.get(deptId) );
					List<Department> departmentsList = (List<Department>)net.sf.json.JSONArray.toList(value.getJSONArray("datas"), new Department(), new JsonConfig());
					Departments = new ReturnVo<Department>();
					Departments.setDatas(departmentsList);
				}else{
					Departments = orgApi.getAllParentsDeptById(deptId);
					String val = com.ys.tools.common.JsonUtils.toJson(Departments);
					redisService.set(deptId, val, 300L );
				}
				for(Department temp : Departments.getDatas()){
					rangeDeftId.add(temp.getId());
				}
			}catch(Exception e){
				e.printStackTrace();
			}
			return rangeDeftId;
		}else{
			return null;
		}
	}
}
