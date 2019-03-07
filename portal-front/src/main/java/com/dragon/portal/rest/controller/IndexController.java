package com.dragon.portal.rest.controller;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.model.news.NewsNotice;
import com.dragon.portal.model.news.NewsNoticeVo;
import com.dragon.portal.model.news.NewsType;
import com.dragon.portal.service.news.INewsNoticeService;
import com.dragon.portal.service.news.INewsTypeService;
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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import com.seeyon.ctp.util.BeanUtils;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 首页
 * @Title:
 * @Description:
 * @Author:wentaoxiang
 * @Since:2016年1月14日 上午9:32:36
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@RestController
@RequestMapping("/rest")
@Api(value="首页", description = "首页", tags={"首页 /rest"})
public class IndexController extends BaseController {

	private static final Logger logger = LoggerFactory.getLogger(IndexController.class);

	@Autowired
	private INewsNoticeService newsNoticeService;
	@Autowired
	private INewsTypeService newsTypeService;

	/**
	 * 登录页轮播和公司动态
	 * @return
	 * @Description:
	 * @author v-zhaohaishan 2017年7月31日 上午11:06:48
	 */
	@SuppressWarnings("unchecked")
	@GetMapping("/loginNews")
	@ApiOperation("登录页轮播和公司动态")
	@ApiImplicitParams({})
	public ReturnVo loginNews(){
		ReturnVo<Map<String, Object>> returnVo = new ReturnVo<>( PortalConstant.ERROR, "获取信息失败！" );
		Map<String, Object> resultMap = new HashMap<>();

		Query query = new Query();
		Map<String, ORDERBY> sqlOrderBy = new LinkedMap();
		sqlOrderBy.put("publish_time", ORDERBY.DESC);
		query.setSqlOrderBy(sqlOrderBy);
		NewsNotice notice = new NewsNotice();
		//首页banner
		try {
			NewsType newsType1 = newsTypeService.queryNewsTypeBySn("home_banner");
			notice.setTypeId(newsType1.getId());
			query.setPageSize(4);
			PagerModel<NewsNotice> pmBanner = newsNoticeService.getPagerModelByQueryOfRange(notice, query,"");
			//公司动态
			NewsType newsType2 = newsTypeService.queryNewsTypeBySn("company_news");
			notice.setTypeId(newsType2.getId());
			query.setPageSize(12);
			PagerModel<NewsNotice> pmCompany = newsNoticeService.getPagerModelByQueryOfRange(notice, query,"");
			
			List<NewsNoticeVo> bannerList = (List<NewsNoticeVo>) BeanUtils.converts(NewsNoticeVo.class, pmBanner.getData());
			List<NewsNoticeVo> companyList = (List<NewsNoticeVo>) BeanUtils.converts(NewsNoticeVo.class, pmCompany.getData());

			resultMap.put("bannerList",bannerList);
			resultMap.put("companyList",companyList);
			returnVo = new ReturnVo<>( PortalConstant.SUCCESS, "获取信息成功！" , resultMap);
		} catch (Exception e) {
			logger.error( "IndexController-loginNews:" + e );
		}
		
		return returnVo;
	}
	

	
}
