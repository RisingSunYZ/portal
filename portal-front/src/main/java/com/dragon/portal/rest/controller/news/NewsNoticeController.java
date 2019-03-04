package com.dragon.portal.rest.controller.news;

import com.dragon.portal.model.news.NewsNotice;
import com.dragon.portal.model.news.NewsType;
import com.dragon.portal.service.news.INewsNoticeService;
import com.dragon.portal.service.news.INewsTypeService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.web.controller.BaseController;
import com.dragon.tools.pager.ORDERBY;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.mhome.tools.common.JsonUtils;
import com.ys.tools.vo.ReturnVo;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.model.user.Department;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections.map.LinkedMap;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @Title:新闻资讯Controller
 * @Description:
 * @Author:xietongjian
 * @Since:2017年4月11日 下午11:19:49
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@RestController
@RequestMapping("/rest/portal/newsNotice")
@Api(value="门户首页（工作台）-通知公告", description = "门户首页（工作台）-通知公告", tags={"门户首页（工作台）-通知公告 /rest/portal/newsNotice"})
public class NewsNoticeController extends BaseController {
	
	private static Logger logger = Logger.getLogger(NewsNoticeController.class);

	@Resource
	private IPersonnelApi personnelApi;
	@Resource
	private INewsTypeService newsTypeService;
	@Resource
	private IOrgApi orgApi ;
	@Resource
	private INewsNoticeService newsNoticeService;

	/**
	 * 工作台 >>通知公告 >>更多--列表数据查询
	 * @param notice
	 * @param query
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@GetMapping("/ajaxHomeNoticeList")
	@ApiOperation("工作台 >>通知公告 >>更多--列表数据查询")
	@ApiImplicitParams({})
	public PagerModel<NewsNotice> ajaxNoticeList(String typeSn, NewsNotice notice, Query query,
												 @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
		UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
		String no = userSessionInfo.getNo();
		com.ys.tools.vo.ReturnVo<PersonnelApiVo> ReturnVo = personnelApi.getPersonnelApiVoByNo(no);
		PersonnelApiVo PersonnelApiVo = ReturnVo.getDatas().get(0);
		notice.setRangeDeftId(getRangeDeftId(PersonnelApiVo.getDeptId()));
		notice.setUserNo(no);
		PagerModel<NewsNotice> pm = new PagerModel<NewsNotice>();
		Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
		sqlOrderBy.put("publish_time", ORDERBY.DESC);
		query.setSqlOrderBy(sqlOrderBy);
		try {
			NewsType newsType = newsTypeService.queryNewsTypeBySn(typeSn);
			if(null != newsType){
				notice.setTypeId(newsType.getId());
				pm = this.newsNoticeService.getPagerModelByQueryOfRange(notice, query,no);
			}
		} catch (Exception e) {
			logger.error("NewsNoticeController-ajaxNoticeList:"+e);
			e.printStackTrace();
		}
		return pm;
	}

    /**
     * 工作台 >>公司动态>>更多--列表数据查询
     * @param notice
     * @param query
     * @param request
     * @param response
     * @return
     */
    @GetMapping("/ajaxCompanyNewsList")
    @ApiOperation("工作台 >>公司动态>>更多--列表数据查询")
    @ApiImplicitParams({})
    public PagerModel<NewsNotice> ajaxCompanyNewsList(String source,String typeSn, NewsNotice notice, Query query,
                                                      @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
        PagerModel<NewsNotice> pm = new PagerModel<NewsNotice>();
        Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
        sqlOrderBy.put("publish_time", ORDERBY.DESC);
        query.setSqlOrderBy(sqlOrderBy);
        if (StringUtils.isBlank(source) || !source.equals("loginPage")) {
            UserSessionInfo userSessionInfo = getUserSessionInfo(request, response);
            String no = userSessionInfo.getNo();
            ReturnVo<PersonnelApiVo> ReturnVo = personnelApi.getPersonnelApiVoByNo(no);
            PersonnelApiVo PersonnelApiVo = ReturnVo.getDatas().get(0);
            notice.setRangeDeftId(getRangeDeftId(PersonnelApiVo.getDeptId()));
        }
        try {
            NewsType newsType = newsTypeService.queryNewsTypeBySn(typeSn);
            if (null == newsType){
				notice.setTypeId(newsType.getId());
				pm = this.newsNoticeService.getPagerModelByQueryOfRange(notice, query,"");
			}
        } catch (Exception e) {
            logger.error("NewsNoticeController-ajaxCompanyNewsList:" + e);
            e.printStackTrace();
        }

        return pm;
    }


	/**
	 *
	 * @param deptId
	 * @return
	 */
	private List<String> getRangeDeftId(String deptId) {
		if (StringUtils.isNotBlank(deptId)) {
			List<String> rangeDeftId = new ArrayList<String>();
			ReturnVo<com.ys.ucenter.model.user.Department> Departments = orgApi.getAllParentsDeptById(deptId);
			for(Department temp : Departments.getDatas()){
				rangeDeftId.add(temp.getId());
			}
			return rangeDeftId;
		}else{
			return null;
		}
	}
}
