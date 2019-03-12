package com.dragon.portal.rest.controller.it;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.model.hr.ContactUs;
import com.dragon.portal.model.hr.OpinionType;
import com.dragon.portal.model.it.Material;
import com.dragon.portal.model.it.MaterialType;
import com.dragon.portal.model.news.NewsNotice;
import com.dragon.portal.model.news.NewsType;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.hr.IOpinionTypeService;
import com.dragon.portal.service.it.IMaterialService;
import com.dragon.portal.service.it.IMaterialTypeService;
import com.dragon.portal.service.it.personwsdl.IContactUsService;
import com.dragon.portal.service.news.INewsNoticeService;
import com.dragon.portal.service.news.INewsTypeService;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.ORDERBY;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.model.user.Department;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.Api;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * IT服务Controller
 * @Title:
 * @Description: IT服务
 * @Author: cenwei
 * @Since: 2016年12月6日 下午8:21:21
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@RestController
@RequestMapping("/reset/itService")
@Api(value="IT服务", description = "IT服务", tags={"IT服务 /rest/itService"})
public class ItServiceController extends BaseController {
	private static Logger logger = Logger.getLogger(ItServiceController.class);

	@Autowired
	private IOrgApi orgApi ;
	@Autowired
	private RedisService redisService;
	@Autowired
	private IPersonnelApi personnelApi;
	@Autowired
	private IMaterialTypeService materialTypeService;
	@Autowired
	private IMaterialService materialService;
	@Autowired
	private IOpinionTypeService opinionTypeService;
	@Autowired
	private IContactUsService contactUsService;
	@Autowired
	private INewsTypeService newsTypeService;
	@Autowired
	private INewsNoticeService newsNoticeService;


	/**
	 * 查询联系人
	 * @return
	 * @Description:IT服务
	 */
	@GetMapping("/getContactUsList")
	@ApiOperation("查询联系人")
	@ApiImplicitParams({})
	public ReturnVo getContactUsList() {
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
		try {
			// 联系人
			List<ContactUs> contactUses = contactUsService.getItAvailable();
			returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", contactUses );
		} catch (Exception e) {
			e.printStackTrace();
			logger.error( "ItServiceController-getContactUsList:" + e );
		}
		return returnVo;
	}

	/**
	 * 查询常用下载列表
	 * @return
	 * @Description:IT服务
	 */
	@GetMapping("/getCommonDownloadList")
	@ApiOperation("查询常用下载列表")
	@ApiImplicitParams({})
	public ReturnVo getCommonDownloadList() {
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
		try {
			Map<String, Object> resultMap = new HashMap<>();

			List<MaterialType> typeList = materialTypeService.getAll(null);
			if(CollectionUtils.isNotEmpty(typeList)){
				for (MaterialType materialType : typeList) {
					Material material=new Material();
					material.setTypeId(materialType.getId());
					material.setStatus( PortalConstant.STATUS_ENABLED);
					material.setDelFlag(PortalConstant.NO_DELETE_FLAG);
					List<Material> materialList=materialService.getAll(material);
					materialType.setMaterialList(materialList);
				}
				resultMap.put("firstTypeId", typeList.get(0).getId());
				resultMap.put("typeList", typeList);
				returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", resultMap );
			}else {
				// 常用下载为空
				returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询常用下载为空！" );
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error( "ItServiceController-getCommonDownloadList:" + e );
		}
		return returnVo;
	}

	/**
	 * IT服务 --- IT行业资讯
	 * @param request
	 * @param response
	 * @return
	 * @Description:
	 * @author v-zhaohaishan 2017年7月14日 上午9:46:01
	 */
	@GetMapping("/getItrendNews")
	@ApiOperation("IT行业资讯")
	@ApiImplicitParams({})
	public ReturnVo getItrendNews(@ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response){
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
		try {
			UserSessionInfo userSessionInfo = getUserSessionInfo(request,response);
			List<NewsNotice> result = new ArrayList<NewsNotice>();
			if(userSessionInfo!=null){

				com.ys.tools.vo.ReturnVo<PersonnelApiVo> ReturnVo = personnelApi.getPersonnelApiVoByNo(userSessionInfo.getNo());
				PersonnelApiVo PersonnelApiVo = ReturnVo.getDatas().get(0);
				NewsNotice notice = new NewsNotice();
				notice.setRangeDeftId(getRangeDeftId(PersonnelApiVo.getDeptId()));
				Map<String, ORDERBY> sqlOrderBy = new LinkedMap();

				NewsType newsType = newsTypeService.queryNewsTypeBySn("itrend_news");
				notice.setTypeId(newsType.getId());
				notice.setUserNo(userSessionInfo.getNo());
				Query query = new Query();
				query.setPageIndex( 1 );
				query.setPageSize(2);
				//查询hot it资讯
				sqlOrderBy.put("visit_count", ORDERBY.DESC);
				query.setSqlOrderBy(sqlOrderBy);
				PagerModel<NewsNotice> hotPagerModel = newsNoticeService.getPagerModelByQueryOfRangeRedis(notice, query,userSessionInfo.getNo());
				if(hotPagerModel.getTotal()>0){
					result.add(hotPagerModel.getRows().get(0));
				}
				//查询new it资讯
				sqlOrderBy.clear();
				sqlOrderBy.put("publish_time", ORDERBY.DESC);
				query.setSqlOrderBy(sqlOrderBy);
				PagerModel<NewsNotice> newPagerModel = this.newsNoticeService.getPagerModelByQueryOfRangeRedis(notice, query,userSessionInfo.getNo());
				if(newPagerModel.getTotal()>0){
					if(result.get(0).getId().equals(newPagerModel.getRows().get(0).getId())){
						result.add(newPagerModel.getRows().get(1));
					}else{
						result.add(newPagerModel.getRows().get(0));
					}
				}
				//产寻普通 it资讯
				query = new Query();
				query.setPageIndex( 1 );
				query.setPageSize(10);
				PagerModel<NewsNotice> norPagerModel = this.newsNoticeService.getPagerModelByQueryOfRangeRedis(notice, query,userSessionInfo.getNo());
				if(norPagerModel.getTotal()>0){
					List<NewsNotice> nor = norPagerModel.getRows();
					for(NewsNotice temp : result){
						for(NewsNotice temp2 : nor){
							if(temp.getId().equals(temp2.getId())){
								nor.remove(temp2);
								break;
							}
						}
					}
					result.addAll(nor);
				}
				returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", result );
			}else {
				//用户未登录
				returnVo = new ReturnVo( ReturnCode.FAIL, "用户未登录！" );
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error( "ItServiceController-getItrendNews:" + e );
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

	