package com.dragon.portal.rest.controller.news;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.dragon.portal.model.news.*;
import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.service.news.*;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.utils.CommUtil;
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
import com.ys.ucenter.model.user.Department;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import com.ys.yahu.enm.NewsNoticeEnum;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import net.sf.json.JsonConfig;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.map.LinkedMap;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;
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
	private INewsNoticeVisitLogService newsNoticeVisitLogService;
	@Autowired
	private INewsFileService newsFileService;
	@Autowired
	private INewsSignRecordService newsSignRecordService;
	@Autowired
    private INewsCommentService newsCommentService;

	/**
	 * 获取新闻资讯列表
	 */
	@GetMapping("/ajaxListVo")
	@ApiOperation("获取通知公告、banner、公司动态、行业动态列表")
	@ApiImplicitParams({})
	public Object ajaxListVo( String typeSn, NewsNotice notice, Query query, @ApiIgnore HttpServletRequest request,
							  @ApiIgnore HttpServletResponse response) {
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "获取失败!");
		try {
			UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
            Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
            sqlOrderBy.put("publish_time", ORDERBY.DESC);
            query.setSqlOrderBy(sqlOrderBy);
            NewsType newsType = newsTypeService.queryNewsTypeBySn(typeSn);
            PagerModel<NewsNotice> newsNoticePage = new PagerModel<>();
            // newsType不为空时
            if (null != newsType){
                notice.setTypeId(newsType.getId());
            }

            // 用户登录
			if (null != userSessionInfo){
                notice.setRangeDeftId(getRangeDeftId(userSessionInfo.getDepId()));
                PagerModel<NewsNoticeVo> pm = new PagerModel<NewsNoticeVo>();

                notice.setUserNo(userSessionInfo.getNo());
                if (CollectionUtils.isNotEmpty(notice.getRangeDeftId())){
                    newsNoticePage = newsNoticeService.getPagerModelByQueryOfRangeRedis(notice, query, userSessionInfo.getNo());
                    returnVo = new ReturnVo<>( ReturnCode.SUCCESS, "查询成功！" , newsNoticePage);
                }
            } else {
			    //用户未登录
                returnVo = new ReturnVo<>( ReturnCode.FAIL, "未登录用户！" );
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
            query.setSortField("publish_time");
            query.setSortOrder("desc");
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
     * 通用获取员工风采 、集团视频
     */
    @GetMapping("/ajaxListMedia")
    @ApiOperation("通用获取员工风采 、集团视频")
    @ApiImplicitParams({})
    public ReturnVo ajaxListMedia(String typeSn, NewsNotice notice, Query query) {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
        try {
            Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
            PagerModel<NewsNotice> pm = null;
            query.setSortField("publish_time");
            query.setSortOrder("desc");
            NewsType newsType = newsTypeService.queryNewsTypeBySn(typeSn);

            if (null != newsType){
                notice.setTypeId(newsType.getId());
                notice.setPublishStatus(1);
                pm = this.newsNoticeService.getPagerModelByQueryOfImage(notice, query);
            }
            returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功!",pm);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("NewsIndexController-ajaxListMedia:"+e);
        }
        return returnVo;
    }

    /**
     * 添加员工风采评论
     */
    @GetMapping("/addNewscomment")
    @ApiOperation("添加员工风采评论")
    @ApiImplicitParams({})
    public ReturnVo addNewscomment (String id, String content, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response){
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "添加失败!");
        if(StringUtils.isNotBlank(id)&&StringUtils.isNotBlank(content)){
            UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
            NewsComment newsComment = new NewsComment();
            newsComment.setRefId(id);
            newsComment.setContent(content);
            newsComment.setType(0);
            newsComment.setUserNo(userSessionInfo.getNo());
            newsComment.setCreator(userSessionInfo.getName());
            newsComment.setCreateTime(new Date());
            newsComment.setCompanyId(userSessionInfo.getCompanyId());
            newsComment.setCompanyName(userSessionInfo.getCompanyName());
            newsComment.setDeptId(userSessionInfo.getDepId());
            newsComment.setDeptName(userSessionInfo.getDepName());
            try {
                newsCommentService.insertNewsComment(newsComment);
                returnVo = new ReturnVo( ReturnCode.SUCCESS, "添加成功!",newsComment);
            } catch (Exception e) {
                logger.error("NewsIndexController-addNewscomment:评论"+e);
                e.printStackTrace();
            }
        }
        return returnVo;
    }

    /**
     * 新闻资讯-员工风采-我要秀  添加员工风采记录
     */
    @PostMapping("/addNewsStaffPresence")
    @ApiOperation("新闻资讯-员工风采-我要秀  添加员工风采记录")
    @ApiImplicitParams({})
    public ReturnVo addNewsStaffPresence(@RequestBody String paramJson, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response){
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "员工风采保存失败!");
        try {

            UserSessionInfo userSessionInfo = getUserSessionInfo( request, response );
            if (userSessionInfo == null) {
                returnVo.setMsg( "用户未登录" );
                throw new Exception( "用户未登录" );
            }

            JSONObject jsonObject = JSON.parseObject(paramJson);

            NewsType newsType = newsTypeService.queryNewsTypeBySn("staff_presence");
            NewsNotice notice = new NewsNotice();
            notice.setTitle( jsonObject.getString( "title" ) );
            notice.setRemark( jsonObject.getString( "remark" ) );
            notice.setTypeId(newsType.getId());
            newsNoticeService.insertNotice(notice);

            // 插入图片
            String noticeId = notice.getId();
            String filesJson = jsonObject.getString( "files" );
            List<NewsFile> newsFileList = JSON.parseArray(filesJson, NewsFile.class);

            newsFileList.forEach( (newsFile)  -> {
                newsFile.setCreator( userSessionInfo.getNo() );
                newsFile.setFileType( 5 );
                newsFile.setRefId( noticeId );
                try {
                    this.newsFileService.insertNewsFile( newsFile );
                } catch (Exception e) {
                    logger.error("NewsIndexController-addNewsStaffPresence:插入图片失败，" + e);
                    e.printStackTrace();
                }
            });
            returnVo = new ReturnVo( ReturnCode.SUCCESS, "员工风采保存成功!");
        } catch (Exception e) {
            logger.error("NewsIndexController-addNewsStaffPresence:" + e);
            e.printStackTrace();
        }
        return returnVo;
    }

    /**
     * 专题活动报名
     */
    @ResponseBody
    @PostMapping("newsSign")
    @ApiOperation("专题活动报名")
    public ReturnVo newsSign(HttpServletRequest request, HttpServletResponse response,String id,@RequestBody NewsSignRecord newsSignRecord){
        UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "很遗憾,报名失败!");
        try {
            if (userSessionInfo != null) {
                NewsNotice fullById = newsNoticeService.getFullById(id,userSessionInfo.getNo(),userSessionInfo.getDepId());
                if (fullById != null) {
                    if (fullById.getStartTime().getTime() > new Date().getTime()) {
                        returnVo.setMsg("报名失败,活动尚未开始");
                    } else if (fullById.getEndTime().getTime() < new Date().getTime()) {
                        returnVo.setMsg("报名失败,活动已经结束");
                    }else{
                        newsSignRecord.setNewsId(id);
                        newsSignRecord.setUserNo(userSessionInfo.getNo());
                        newsSignRecord.setUserName(userSessionInfo.getName());
                        newsSignRecord.setCompanyId(userSessionInfo.getCompanyId());
                        newsSignRecord.setCompanyName(userSessionInfo.getCompanyName());
                        newsSignRecord.setDeptId(userSessionInfo.getDepId());
                        newsSignRecord.setDeptName(userSessionInfo.getDepName());
                        List<NewsSignRecord> all = newsSignRecordService.getAll(newsSignRecord);
                        if (CollectionUtils.isEmpty(all)) {
                            newsSignRecordService.insertNewsSignRecord(newsSignRecord);
                            returnVo.setCode(ReturnCode.SUCCESS);
                            returnVo.setMsg("恭喜您，活动报名成功");
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return returnVo;
    }

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
		        resultMap.put("currentUser", userSessionInfo);
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

    /**
     * 行业动态详情
     */
	@GetMapping("/industryDetail")
    @ApiOperation("行业动态详情")
    @ApiImplicitParams({})
	public ReturnVo industryDetail(String id, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response){
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
//                    Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
//                    sqlOrderBy.put("visit_count", ORDERBY.DESC);
//                    query.setSqlOrderBy(sqlOrderBy);
                    query.setSortField("visit_count");
                    query.setSortOrder("desc");
                    NewsNotice notice = new NewsNotice();
                    notice.setTypeId(news.getTypeId());
                    notice.setRangeDeftId(rangeDeftId);
                    PagerModel<NewsNotice> pagerModelByQueryOfRange = newsNoticeService.getPagerModelByQueryOfRange(notice, query,no);
                    //------------ 结束 ---------
                    resultMap.put("news", news);
                    resultMap.put("hotter", pagerModelByQueryOfRange.getData());
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
     * 新闻资讯-员工风采 图片详情
     *
     */
    @GetMapping("/getStaffData")
    @ApiOperation("新闻资讯-员工风采 图片详情")
    @ApiImplicitParams({})
    public ReturnVo getStaffData(String id, @ApiIgnore  HttpServletRequest request, @ApiIgnore  HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!" );
        if (StringUtils.isBlank( id )) {
            returnVo.setMsg( "参数为空！" );
            return returnVo;
        }
        try {
            UserSessionInfo userSessionInfo = getUserSessionInfo( request, response );
            if (null == userSessionInfo) {
                returnVo.setMsg( "用户未登录！" );
                throw new Exception( "用户未登录" );
            }

            HashMap map = new HashMap();
            NewsType newsType = newsTypeService.queryNewsTypeBySn( "staff_presence" );
            if(null != newsType){
                NewsNotice temp = newsNoticeService.getFullById(id);
                //添加日志
                try {
                    newsNoticeVisitLogService.insertNewsNoticeVisitLog( userSessionInfo, CommUtil.getRealRemoteIP( request ), id, NewsNoticeEnum.NEWS );
                } catch (Exception e) {
                    throw new Exception( "添加日志失败 " );
                }
                map.put("title", temp.getTitle());
                map.put("publisher", tranRealName(temp.getCreator()));
                map.put("publishTime", temp.getPublishTime());
                map.put("visitCount",temp.getVisitCount());
                map.put("remark", temp.getRemark());
                map.put("thumbsUp", temp.getThumbsUp());
                NewsFile newsFile = new NewsFile();
                newsFile.setFileType( 5 );
                Query queryfile = new Query( 100 );
                Map<String, ORDERBY> sqlOrderByFile = new LinkedMap();
                sqlOrderByFile.put( "sort_no", ORDERBY.ASC );
                queryfile.setSqlOrderBy( sqlOrderByFile );


                newsFile.setRefId( id );
                PagerModel<NewsFile> pm = newsFileService.getPagerModelByQuery( newsFile, queryfile );
                map.put( "list", pm.getData() );

                //评论
                NewsComment newsComment = new NewsComment();
                newsComment.setRefId( id );
                newsComment.setType( 0 );
                List<NewsComment> comments = newsCommentService.getAll( newsComment );
                map.put( "comments", comments );
                //点赞
                newsComment.setType( 1 );
                newsComment.setUserNo( userSessionInfo.getNo() );
                List<NewsComment> hasThumbsUp = newsCommentService.getAll( newsComment );

                if (CollectionUtils.isNotEmpty( hasThumbsUp )) {
                    map.put( "hasThumbsUp", 1 );
                } else {
                    map.put( "hasThumbsUp", 0 );
                }
                returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", map );
            }
        } catch (Exception e) {
            logger.error( "NewsIndexController-getStaffData: " + e );
            e.printStackTrace();
        }

        return returnVo;
    }

    @ResponseBody
    @RequestMapping("/makeThumbsUp")
    public ReturnVo makeThumbsUp (HttpServletRequest request, HttpServletResponse response,String id,Integer opt){
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "改变点赞状态失败!" );
        if(StringUtils.isNotBlank(id)&&opt!=null){
            UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
            NewsComment newsComment = new NewsComment();
            newsComment.setRefId(id);
            newsComment.setType(1);
            newsComment.setUserNo(userSessionInfo.getNo());
            NewsNotice notice = new NewsNotice();
            notice.setId(id);
            try {
                List<NewsComment> all = newsCommentService.getAll(newsComment);
                if(opt==1){
                    //点赞
                    if(CollectionUtils.isEmpty(all)){
                        newsComment.setCreator(userSessionInfo.getName());
                        newsComment.setCreateTime(new Date());
                        newsComment.setCompanyId(userSessionInfo.getCompanyId());
                        newsComment.setCompanyName(userSessionInfo.getCompanyName());
                        newsComment.setDeptId(userSessionInfo.getDepId());
                        newsComment.setDeptName(userSessionInfo.getDepName());
                        newsCommentService.insertNewsComment(newsComment);
                        newsNoticeService.addNoticeTumbsUp(notice);
                        returnVo = new ReturnVo( ReturnCode.SUCCESS, "点赞成功!", opt );
                    }
                }else if(opt==0){
                    //取消点赞
                    if(CollectionUtils.isNotEmpty(all)){
                        for(NewsComment temp :all){
                            temp.setDelFlag(PortalConstant.DEL_FLAG);
                            newsCommentService.updateNewsComment(temp);
                            newsNoticeService.subNoticeTumbsUp(notice);
                            returnVo = new ReturnVo( ReturnCode.SUCCESS, "取消点赞成功!", opt );
                        }
                    }
                }
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return returnVo;
    }


    /**
     * 将工号转变为名字
     * @param no 工号
     * @return
     */
    private String tranRealName(String no) {
        String regx = "^\\d+$";
        if (StringUtils.isNotBlank( no ) && no.matches( regx )) {
            com.ys.tools.vo.ReturnVo<PersonnelApiVo> personnelApiVoByNo = personnelApi.getPersonnelApiVoByNo( no );
            return (personnelApiVoByNo.getCode() == 1) ? personnelApiVoByNo.getData().getName() : no;
        }
        return no;
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
					net.sf.json.JSONObject value = net.sf.json.JSONObject.fromObject( redisService.get(deptId) );
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
