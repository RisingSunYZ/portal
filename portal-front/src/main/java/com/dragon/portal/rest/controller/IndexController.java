package com.dragon.portal.rest.controller;

import com.dragon.portal.model.news.NewsNotice;
import com.dragon.portal.model.news.NewsNoticeVo;
import com.dragon.portal.model.news.NewsType;
import com.dragon.portal.service.news.INewsNoticeService;
import com.dragon.portal.service.news.INewsTypeService;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.ORDERBY;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections.map.LinkedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import com.seeyon.ctp.util.BeanUtils;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 登录首页
 * @Title:
 * @Description:
 * @Author:
 * @Since:
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@RestController
@RequestMapping("/rest/index")
@Api(value="登录首页", description = "登录首页", tags={"登录首页 /rest/index"})
public class IndexController extends BaseController {

	private static final Logger logger = LoggerFactory.getLogger(IndexController.class);

	@Autowired
	private INewsNoticeService newsNoticeService;
	@Autowired
	private INewsTypeService newsTypeService;

	/**
	 * 查询登录页公司动态
	 */
	@GetMapping("/ajaxCompanyNews")
	@ApiOperation("查询公司动态")
	@ApiImplicitParams({})
	public ReturnVo ajaxCompanyNews(){
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询公司动态失败！" );

		try {
			Query query = new Query();
			Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
			sqlOrderBy.put("publish_time", ORDERBY.DESC);
			query.setSqlOrderBy(sqlOrderBy);
			NewsNotice notice = new NewsNotice();

			//公司动态
			NewsType newsType = newsTypeService.queryNewsTypeBySn("company_news");
			notice.setTypeId(newsType.getId());
			query.setPageSize(12);
			PagerModel<NewsNotice> pmCompany = newsNoticeService.getPagerModelByQueryOfRange(notice, query,"");
			List<NewsNoticeVo> companyList = (List<NewsNoticeVo>) BeanUtils.converts(NewsNoticeVo.class, pmCompany.getData());

			returnVo = new ReturnVo<>( ReturnCode.SUCCESS, "查询公司动态成功！" , companyList);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error( "IndexController-loginNews:" + e );
		}
		
		return returnVo;
	}

	/**
	 * 查询登录页新闻轮播banner
	 */
	@GetMapping("/loginNews")
	@ApiOperation("查询登录页新闻轮播banner")
	@ApiImplicitParams({})
	public ReturnVo loginNews(){
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询登录页新闻轮播失败！" );
		try {
			Query query = new Query();
			Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
			sqlOrderBy.put("publish_time", ORDERBY.DESC);
			query.setSqlOrderBy(sqlOrderBy);
			NewsNotice notice = new NewsNotice();

			//登录页新闻轮播banner
			NewsType newsType = newsTypeService.queryNewsTypeBySn("home_banner");
			notice.setTypeId(newsType.getId());
			query.setPageSize(4);
			PagerModel<NewsNotice> pmBanner = newsNoticeService.getPagerModelByQueryOfRange(notice, query,"");
			List<NewsNoticeVo> bannerList = (List<NewsNoticeVo>) BeanUtils.converts(NewsNoticeVo.class, pmBanner.getData());

			returnVo = new ReturnVo<>( ReturnCode.SUCCESS, "查询登录页新闻轮播成功！" , bannerList);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error( "IndexController-loginNews:" + e );
		}

		return returnVo;
	}
	

	
}
