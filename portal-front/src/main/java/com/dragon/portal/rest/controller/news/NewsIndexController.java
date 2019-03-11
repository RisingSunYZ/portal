package com.dragon.portal.rest.controller.news;

import com.dragon.flow.vo.flowable.comment.FlowCommentVo;
import com.dragon.portal.model.news.*;
import com.dragon.portal.service.news.*;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.utils.CommUtils;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.ORDERBY;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * @Title: 新闻资讯(公司动态)
 * @Description:
 * @Author: xietongjian
 * @Since: 2017年4月11日 下午11:19:49
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@RestController
@RequestMapping("/rest/portal/news")
@Api(value="新闻资讯(公司动态)", description = "新闻资讯(公司动态)", tags={"新闻资讯(公司动态) /rest/portal/news"})
public class NewsIndexController extends BaseController {
	
	private static Logger logger = Logger.getLogger(NewsIndexController.class);

	@Autowired
	private IPersonnelApi personnelApi;
	@Autowired
	private IOrgApi orgApi ;
	@Autowired
	private INewsTypeService newsTypeService;
	@Autowired
	private INewsNoticeService newsNoticeService;
	@Autowired
	private RedisService redisService;
	@Autowired
	private INewsPublishRangeService newsPublishRangeService;
	@Autowired
	private INewsNoticeVisitLogService newsNoticeVisitLogService;
	@Autowired
	private INewsFileService newsFileService;
	@Autowired
	private INewsNoticeProcessService newsNoticeProcessService;
	@Autowired
	private INewsSignRecordService newsSignRecordService;

	/**
	 * 获取新闻资讯列表
	 */
	@GetMapping("/ajaxListVo")
	@ApiOperation("获取新闻资讯列表")
	@ApiImplicitParams({})
	public Object ajaxListVo( String typeSn, NewsNotice notice, Query query, @ApiIgnore HttpServletRequest request,
							  @ApiIgnore HttpServletResponse response) {
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "获取新闻资讯列表失败!");
		try {
			UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
			if (null != userSessionInfo){
                notice.setRangeDeftId(getRangeDeftId(userSessionInfo.getDepId()));
                PagerModel<NewsNoticeVo> pm = new PagerModel<NewsNoticeVo>();
                Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
                sqlOrderBy.put("publish_time", ORDERBY.DESC);
                query.setSqlOrderBy(sqlOrderBy);

                NewsType newsType = newsTypeService.queryNewsTypeBySn(typeSn);
                if (null != newsType){
                    notice.setTypeId(newsType.getId());
                    notice.setUserNo(userSessionInfo.getNo());
                    if(CollectionUtils.isEmpty(notice.getRangeDeftId())){
                        returnVo = new ReturnVo( ReturnCode.SUCCESS, "获取新闻资讯列表成功!",pm);
                    }else{
                        PagerModel<NewsNotice> pagerModelByQueryOfRange = newsNoticeService.getPagerModelByQueryOfRangeRedis(notice, query,userSessionInfo.getNo());
                        returnVo = new ReturnVo( ReturnCode.SUCCESS, "获取新闻资讯列表成功!",pagerModelByQueryOfRange);
                    }
                }
            } else {
                //用户未登录
                returnVo = new ReturnVo( ReturnCode.FAIL, "用户未登录！" );
            }

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("NewsIndexController-ajaxListVo:" + e);
		}
		return returnVo;
	}

    /**
     * 工作台 >>新闻资讯（公司动态）>>更多--列表数据查询
     * @param notice
     * @param query
     * @param request
     * @param response
     * @return
     */
    @GetMapping("/ajaxCompanyNewsList")
    @ApiOperation("公司动态 -》更多")
    @ApiImplicitParams({})
    public ReturnVo ajaxCompanyNewsList(String source,String typeSn, NewsNotice notice, Query query,
                                                      @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
        try {
            PagerModel<NewsNotice> pm = new PagerModel<NewsNotice>();
            Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
            sqlOrderBy.put("publish_time", ORDERBY.DESC);
            query.setSqlOrderBy(sqlOrderBy);
            if (StringUtils.isBlank(source) || !source.equals("loginPage")) {
                UserSessionInfo userSessionInfo = getUserSessionInfo(request, response);
                String no = userSessionInfo.getNo();
                com.ys.tools.vo.ReturnVo<PersonnelApiVo> ReturnVo = personnelApi.getPersonnelApiVoByNo(no);
                PersonnelApiVo PersonnelApiVo = ReturnVo.getDatas().get(0);
                notice.setRangeDeftId(getRangeDeftId(PersonnelApiVo.getDeptId()));
            }
            NewsType newsType = newsTypeService.queryNewsTypeBySn(typeSn);
            if (null != newsType){
                notice.setTypeId(newsType.getId());
                pm = this.newsNoticeService.getPagerModelByQueryOfRange(notice, query,"");
            }
            returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功!",pm);
        } catch (Exception e) {
            logger.error("NewsIndexController-ajaxCompanyNewsList:" + e);
            e.printStackTrace();
        }
        return returnVo;
    }

    /**
     * 	新闻资讯详情
     */
    @GetMapping("/newsDetail")
    @ApiOperation("新闻资讯详情（IT行业资讯详情数据）")
    @ApiImplicitParams({})
    public ReturnVo newsDetail(String id, String source, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response){
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
        Map<String, Object> resultMap = new HashMap<>(  );
        try {
            UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
            if(StringUtils.isNotBlank(source) && source.equals("loginPage") || userSessionInfo == null){
                NewsNotice news = newsNoticeService.getFullById(id);
                resultMap.put("news", news);
                resultMap.put("flag", 0);//0 来自不需要登录请求的标示
            }else{
                String no = userSessionInfo.getNo();
                com.ys.tools.vo.ReturnVo<PersonnelApiVo> ReturnVo = personnelApi.getPersonnelApiVoByNo(no);
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
            returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功!",resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error( "NewsIndexController-newsDetail:" + e );
        }
        return returnVo;
    }


    /**
	 * 获取详情页面数据
	 */
//	@GetMapping("/getNewsNoticePage")
//	@ApiOperation("通用获取详情页面数据")
//	@ApiImplicitParams({
//			@ApiImplicitParam(name="id", value = "id", dataType = "String", paramType = "query"),
//	})
//	public ReturnVo getNewsNoticePage(String id, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response){
//		NewsNotice noticeById;
//		try {
//			noticeById = newsNoticeService.getNoticeById(id);
//			String typeId = StringUtils.isNotBlank(noticeById.getTypeId())?noticeById.getTypeId():noticeById.getTypeIdArray().split(",")[0];
//			NewsType newsTypeById = newsTypeService.getNewsTypeById(typeId);
//			String sn = newsTypeById.getSn();
//			if(sn.indexOf("notice") > 0){
//				return noticeDetail(id, null, request, response);
//			}else if(sn.equals("company_news")||sn.equals("itrend_news")
//					||sn.equals("finance_info")||sn.equals("finance_pro")
//					||sn.equals("finance_expense")||sn.equals("rszd")){
//				return newsDetail(id,null, request, response);
//			}else if(sn.equals("special_events")){
//				return activityDetail(id, request, response);
//			}else if(sn.equals("industry_news")){
//				return industryDetail(id, request, response);
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//			logger.error( "NewsIndexController-getNewsNoticePage:" + e );
//		}
//		return null;
//	}

	/**
	 * 专题活动详情
	 */
	@GetMapping("/activityDetail")
	@ApiOperation("专题活动详情")
	@ApiImplicitParams({})
	public ReturnVo activityDetail(String id, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response){
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
	    Map<String, Object> resultMap = new HashMap<>();
		UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
		try {
		    if (null != userSessionInfo){
                NewsNotice news = newsNoticeService.getFullById(id,userSessionInfo.getNo(),userSessionInfo.getDepId());
                newsNoticeVisitLogService.insertNewsNoticeVisitLog(userSessionInfo, CommUtils.getRealRemoteIP(request),id, NewsNoticeEnum.NEWS);
                NewsSignRecord newsSignRecord = new NewsSignRecord();
                newsSignRecord.setNewsId(id);
                newsSignRecord.setUserNo(userSessionInfo.getNo());
                List<NewsSignRecord> all = newsSignRecordService.getAll(newsSignRecord);
                if(CollectionUtils.isNotEmpty(all)){
                    resultMap.put("already", 1);
                }
                if (news != null && (news.getStartTime()==null||news.getEndTime()==null||news.getStartTime().getTime() > new Date().getTime()
                        || news.getEndTime().getTime() < new Date().getTime())) {
                    resultMap.put("available", 0);
                }else{
                    resultMap.put("available", 1);
                }
                resultMap.put("news", news);
                returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", resultMap );
            }else {
                //用户未登录
                returnVo = new ReturnVo( ReturnCode.FAIL, "用户未登录！" );
            }

		} catch (Exception e) {
			e.printStackTrace();
			logger.error( "NewsIndexController-activityDetail:" + e );
		}
		return returnVo;
	}

	@GetMapping("/industryDetail")
	public ReturnVo industryDetail(String id,HttpServletRequest request, HttpServletResponse response){
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
	    Map<String, Object> resultMap = new HashMap<>();
		try {
            UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
            if (null != userSessionInfo){
                String no = userSessionInfo.getNo();
                com.ys.tools.vo.ReturnVo<PersonnelApiVo> ReturnVo = personnelApi.getPersonnelApiVoByNo(no);
                PersonnelApiVo PersonnelApiVo = ReturnVo.getDatas().get(0);
                List<String> rangeDeftId = getRangeDeftId(PersonnelApiVo.getDeptId());
                NewsNotice news = newsNoticeService.getFullById(id,userSessionInfo.getNo(),userSessionInfo.getDepId());
                if(news != null){
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
                    //------------ 结束 ---------
                    resultMap.put("news", news);
                    resultMap.put("hotter", pagerModelByQueryOfRange.getRows());
                }
                returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", resultMap );
            }else {
                //用户未登录
                returnVo = new ReturnVo( ReturnCode.FAIL, "用户未登录！" );
            }
		} catch (Exception e) {
			e.printStackTrace();
			logger.error( "NewsIndexController-industryDetail:" + e );
		}
		return returnVo;
	}


	/**
	 *
	 * @param deptId
	 * @return
	 */
	private List<String> getRangeDeftId(String deptId) {
		if (StringUtils.isNotBlank(deptId)) {
			List<String> rangeDeftId = new ArrayList<String>();
			com.ys.tools.vo.ReturnVo<Department> Departments = null;
			try{
				if(redisService.exists(deptId)){
					net.sf.json.JSONObject value = JSONObject.fromObject( redisService.get(deptId) );
					List<Department> departmentsList = (List<Department>)net.sf.json.JSONArray.toList(value.getJSONArray("datas"), new Department(), new JsonConfig());
					Departments = new com.ys.tools.vo.ReturnVo<Department>();
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
