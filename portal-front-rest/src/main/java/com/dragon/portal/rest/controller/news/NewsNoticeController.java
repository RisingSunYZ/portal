package com.dragon.portal.rest.controller.news;

import com.dragon.flow.vo.flowable.comment.FlowCommentVo;
import com.dragon.portal.model.news.*;
import com.dragon.portal.service.news.*;
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
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections.map.LinkedMap;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title: 通知公告
 * @Description:
 * @Author: xietongjian
 * @Since: 2017年4月11日 下午11:19:49
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@RestController
@RequestMapping("/rest/portal/notice")
@Api(value="通知公告", description = "通知公告", tags={"通知公告 /rest/portal/notice"})
public class NewsNoticeController extends BaseController {
	
	private static Logger logger = Logger.getLogger(NewsNoticeController.class);

	@Autowired
	private IPersonnelApi personnelApi;
	@Autowired
	private INewsTypeService newsTypeService;
	@Autowired
	private IOrgApi orgApi ;
	@Autowired
	private INewsNoticeService newsNoticeService;
    @Autowired
    private INewsFileService newsFileService;
    @Autowired
    private INewsNoticeVisitLogService newsNoticeVisitLogService;
    @Autowired
    private INewsPublishRangeService newsPublishRangeService;
    @Autowired
    private INewsNoticeProcessService newsNoticeProcessService;

	/**
	 * 工作台 >>通知公告 >>更多--列表数据查询
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
     * 查询通知详情信息
     */
    @GetMapping("/noticeDetail/{id}")
    @ApiOperation("查询通知详情信息(通知公告-》数据详情页面数据)")
    @ApiImplicitParams({})
    public ReturnVo noticeDetail(@PathVariable(name = "id") String id, String typeSn,
                                                     @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询通知详情信息失败!");
        try {
            Map<String, Object> resultMap = new HashMap<>( );
            UserSessionInfo userSessionInfo = getUserSessionInfo(request, response);
            NewsNotice notice = newsNoticeService.getFullById(id, userSessionInfo.getNo(), userSessionInfo.getDepId());
            if (notice != null) {
                //查询发布范围---详情页面显示 显示出（公司-部门）
                NewsPublishRange newsPublishRange = new NewsPublishRange();
                newsPublishRange.setNewsNoticeId(notice.getId());
                List<NewsPublishRange> publishRangeServiceAll = newsPublishRangeService.getAll(newsPublishRange);
                if (publishRangeServiceAll != null && publishRangeServiceAll.size() > 0) {
                    StringBuilder sb = new StringBuilder();
                    for (NewsPublishRange publishRange : publishRangeServiceAll) {
                        if (publishRange.getDataType() == 2) {
                            try {
                                com.ys.tools.vo.ReturnVo<Department> departmentReturnVo = orgApi.getDepartmentByids(publishRange.getOrgId());
                                Department department = departmentReturnVo.getDatas().get(0);
                                if (StringUtils.isNotBlank(department.getPreDeptId())) {
                                    Company companyWhere = new Company();
                                    companyWhere.setId(department.getCompanyId());
                                    com.ys.tools.vo.ReturnVo<List<Company>> companyReturn = orgApi.getCompany(companyWhere);
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
            returnVo = new com.dragon.tools.vo.ReturnVo( ReturnCode.SUCCESS, "查询通知详情列表成功!", resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("NewsNoticeController-noticeDetail:" + e);
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
            com.ys.tools.vo.ReturnVo<com.ys.ucenter.model.user.Department> Departments = orgApi.getAllParentsDeptById(deptId);
			for(Department temp : Departments.getDatas()){
				rangeDeftId.add(temp.getId());
			}
			return rangeDeftId;
		}else{
			return null;
		}
	}
}
