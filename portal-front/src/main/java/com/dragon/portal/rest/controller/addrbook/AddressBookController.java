package com.dragon.portal.rest.controller.addrbook;


import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.customLabel.ApiJsonObject;
import com.dragon.portal.customLabel.ApiJsonProperty;
import com.dragon.portal.model.addrbook.TopContacts;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.addrbook.ITopContactsService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.company.Company;
import com.ys.ucenter.model.vo.OrgTreeApiVo;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * @Description: 通讯录
 * @Author: yangzhao
 * @Since:2019/3/7 17:52
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
@RestController
@RequestMapping("/rest/addrbook/addressBook")
@Api(value="通讯录", description = "通讯录", tags={"通讯录 /rest/addrbook/addressBook"})
public class AddressBookController extends BaseController {

	private static Logger logger = Logger.getLogger(AddressBookController.class);

	@Resource
	private IOrgApi orgApi;

	@Resource
	private IPersonnelApi personnelApi;
	@Resource
	private ITopContactsService topContactsService;

	/*
	*
	 * @Author yangzhao
	 * @Description //TODO 加入到常用联系人
	 * @Date 13:48 2019/3/8
	 * @Param [nos, request, response]
	 * @return com.dragon.tools.vo.ReturnVo<java.lang.String>
	 **/
	@PostMapping("/addTopContacts")
	@ApiOperation("常用联系人添加")
	public ReturnVo<String> addTopContacts(@ApiParam(value = "人员编号") @RequestBody String nos, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "添加到常用联系人失败！");
		// 获取登录用户
		UserSessionInfo loginUser = getUserSessionInfo(request, response);
		if (loginUser != null && StringUtils.isNotBlank(loginUser.getNo())) {
			try {
				if (StringUtils.isNotBlank(nos)) {
					String ownerNo = loginUser.getNo();
					List<String> nosArr = new ArrayList<String>();//
					for (String no : nos.split(PortalConstant.SEPARATOR)) {
						if (StringUtils.isNotBlank(no)) {
							TopContacts topContacts = new TopContacts();
							topContacts.setDelFlag(PortalConstant.NO_DELETE_FLAG);
							topContacts.setOwnerNo(ownerNo);
							topContacts.setContactNo(no);
							List<TopContacts> result = this.topContactsService.getAll(topContacts);
							// 判断是否已经加入到通讯录
							if (CollectionUtils.isEmpty(result)) {
								nosArr.add(no);
							}
						}
					}
					if (CollectionUtils.isNotEmpty(nosArr)) {
						this.topContactsService.insertAddTopContacts(ownerNo, nosArr);
						returnVo.setMsg("添加到常用联系人成功！");
						returnVo.setCode(ReturnCode.SUCCESS);
					} else {
						returnVo.setCode(ReturnCode.SUCCESS);
						returnVo.setMsg("已加入到常用联系人！");
					}
				}
			} catch (Exception e) {
				logger.error("添加到常用联系人时出现异常 ！" + e);
				e.printStackTrace();
				returnVo.setMsg("网络异常，请稍后重试！");
			}
		} else {
			returnVo.setMsg("获取登录用户失败，请重新登录！");
		}
		return returnVo;
	}

	/*
	*
	 * @Author yangzhao
	 * @Description //TODO 移除到常用联系人
	 * @Date 13:49 2019/3/8
	 * @Param [nos, request, response]
	 * @return com.dragon.tools.vo.ReturnVo<java.lang.String>
	 **/
	@PostMapping("/delTopContacts")
	@ApiOperation("常用联系人移除")
	public ReturnVo<String> delTopContacts(@ApiParam(value = "人员编号")  @RequestBody String nos, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "添加到常用联系人失败！");
		// 获取登录用户
		UserSessionInfo loginUser = getUserSessionInfo(request, response);
		if (loginUser != null && StringUtils.isNotBlank(loginUser.getNo())) {
			try {
				if (StringUtils.isNotBlank(nos)) {
					String ownerNo = loginUser.getNo();
					List<String> nosArr = new ArrayList<String>();//
					for (String no : nos.split(PortalConstant.SEPARATOR)) {
						if (StringUtils.isNotBlank(no)) {
							// 判断是否已经加入到通讯录
							nosArr.add(no);
						}
					}
					if (CollectionUtils.isNotEmpty(nosArr)) {
						this.topContactsService.deleteAddTopContacts(ownerNo, nosArr);
						returnVo.setMsg("移除常用联系人成功！");
						returnVo.setCode(ReturnCode.SUCCESS);
					}
				}
			} catch (Exception e) {
				logger.error("移除常用联系人时出现异常 ！" + e);
				e.printStackTrace();
				returnVo.setMsg("网络异常，请稍后重试！");
			}
		} else {
			returnVo.setMsg("获取登录用户失败，请重新登录！");
		}
		return returnVo;
	}

	/*
	*
	 * @Author yangzhao
	 * @Description //TODO 加载组织机构树形结构
	 * @Date 13:49 2019/3/8
	 * @Param []
	 * @return java.util.LinkedList<com.ys.ucenter.model.vo.OrgTreeApiVo>
	 **/
	@GetMapping("/getOrgTreeData")
	@ApiOperation("加载组织机构树形结构")
	public LinkedList<OrgTreeApiVo> getOrgTreeData() {
		LinkedList<OrgTreeApiVo> orgTree = new LinkedList<OrgTreeApiVo>();// new
		com.ys.tools.vo.ReturnVo<OrgTreeApiVo> returnVo = orgApi.getOrgTree();
		if (UcenterConstant.SUCCESS == returnVo.getCode()) {
			orgTree = new LinkedList<OrgTreeApiVo>(returnVo.getDatas());
			// 添加一个根节点：常用联系人
			OrgTreeApiVo root = new OrgTreeApiVo();
			root.setId("TOP-CONTACTS");
			root.setpId("0");
			root.setCompanyId("");
			root.setText("常用联系人");
			orgTree.addFirst(root);
		} else {
			logger.error(returnVo.getMsg());
		}
		return orgTree;
	}

	/*
	*
	 * @Author yangzhao
	 * @Description //TODO 查询人员数据
	 * @Date 13:49 2019/3/8
	 * @Param [personnelApiVo, query]
	 * @return com.ys.tools.pager.PagerModel<com.ys.ucenter.model.vo.PersonnelApiVo>
	 **/
	@GetMapping("/getPersonnelData")
	@ApiOperation("查询人员数据")
	@ApiImplicitParams({
			@ApiImplicitParam(value="公司Id",name="companyId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="部门Id",name="deptId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="当前页",name="pageIndex",dataType = "int",paramType = "query"),
			@ApiImplicitParam(value="每页记录数",name="pageSize",dataType = "int",paramType = "query"),
	})
	public PagerModel<PersonnelApiVo> getPersonnelData(PersonnelApiVo personnelApiVo,Query query) {
        com.ys.tools.pager.Query ysQuery = new com.ys.tools.pager.Query();
        PagerModel<PersonnelApiVo> pm = new PagerModel<>();
        com.ys.tools.pager.PagerModel<PersonnelApiVo> ysPm = null;
        ysQuery.setPageSize(query.getPageSize());
        ysQuery.setPageIndex(query.getInitPageIndex());
		personnelApiVo.setShowDept(UcenterConstant.YES);
        com.ys.tools.vo.ReturnVo<com.ys.tools.pager.PagerModel<PersonnelApiVo>> returnVo = personnelApi.getPersonnel(personnelApiVo, ysQuery);
		ysPm = returnVo.getData();
        pm.setRows(ysPm.getRows());
        pm.setTotal(ysPm.getTotal());
		Company company = new Company();
		com.ys.tools.vo.ReturnVo<List<Company>> companyReturnVo = orgApi.getCompany(company);

		Map<String, Company> companyMap = new HashMap<String, Company>();
		if (CollectionUtils.isNotEmpty(companyReturnVo.getData())) {
			for (Company c : companyReturnVo.getData()) {
				companyMap.put(c.getId(), c);
			}
		}
		return pm;
	}

	/*
	*
	 * @Author yangzhao
	 * @Description //TODO 加载常用联系人数据
	 * @Date 10:00 2019/3/8
	 * @Param [request, response, query]
	 * @return com.ys.tools.pager.PagerModel<com.ys.ucenter.model.vo.PersonnelApiVo>
	 **/
	@GetMapping("/getTopContactsData")
	@ApiOperation("加载常用联系人数据")
	@ApiImplicitParams({
			@ApiImplicitParam(value="当前页",name="pageIndex",dataType = "int",paramType = "query"),
			@ApiImplicitParam(value="每页记录数",name="pageSize",dataType = "int",paramType = "query"),
	})
	public PagerModel<PersonnelApiVo> getTopContactsData(@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response,Query query) {
		PagerModel<PersonnelApiVo> pm = new PagerModel<PersonnelApiVo>();
		try {
			// 获取登录用户
			UserSessionInfo loginUser = getUserSessionInfo(request, response);
			if (loginUser != null && StringUtils.isNotBlank(loginUser.getNo())) {
				TopContacts topContacts = new TopContacts();
				topContacts.setDelFlag(PortalConstant.NO_DELETE_FLAG);
				topContacts.setOwnerNo(loginUser.getNo());
				PagerModel<TopContacts> pmTopcontacts = topContactsService
						.getPagerModelByQuery(topContacts, query);
				if (null != pmTopcontacts) {
					List<TopContacts> datas = pmTopcontacts.getData();
					List<String> nos = new ArrayList<String>();
					// 组装工号数据
					if (CollectionUtils.isNotEmpty(datas)) {
						for (TopContacts row : datas) {
							nos.add(row.getContactNo());
						}
						// 通过工号数据查询人员
						com.ys.tools.vo.ReturnVo<PersonnelApiVo> returnVo = personnelApi.getPersonnelApiVoByNos(nos);
						if (UcenterConstant.SUCCESS == returnVo.getCode()) {
							List<PersonnelApiVo> list = returnVo.getDatas();
							pm.setRows(list);
							pm.setTotal(pmTopcontacts.getTotal());
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("查询常用联系人数据出现异常！" + e);
		}
		return pm;
	}


	/*
	*
	 * @Author yangzhao
	 * @Description //TODO 加载组织机构树形结构
	 * @Date 13:49 2019/3/8
	 * @Param [request, response]
	 * @return java.util.LinkedList<com.ys.ucenter.model.vo.OrgTreeApiVo>
	 **/
	@GetMapping("/getOrgTreeDataforBook")
	@ApiOperation("加载通讯录组织机构树形结构")
	public LinkedList<OrgTreeApiVo> getOrgTreeDataforBook(@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
		LinkedList<OrgTreeApiVo> orgTree = new LinkedList<OrgTreeApiVo>();// new
		UserSessionInfo loginUser = getUserSessionInfo(request, response);
		if(null!=loginUser){
			com.ys.tools.vo.ReturnVo<OrgTreeApiVo> returnVo = orgApi.getOrgTreeForBook(loginUser.getNo());
			if (UcenterConstant.SUCCESS == returnVo.getCode()) {
				orgTree = new LinkedList<OrgTreeApiVo>(returnVo.getDatas());
				// 添加一个根节点：常用联系人
				OrgTreeApiVo root = new OrgTreeApiVo();

				root.setId("TOP-CONTACTS");
				root.setpId("0");
				root.setCompanyId("");
				root.setText("常用联系人");
				orgTree.addFirst(root);
			} else {
				logger.error(returnVo.getMsg());
			}
		}
		return orgTree;
	}

	/*
	*
	 * @Author yangzhao
	 * @Description //TODO 查询人员数据
	 * @Date 13:49 2019/3/8
	 * @Param [request, response, personnelApiVo, query]
	 * @return com.ys.tools.pager.PagerModel<com.ys.ucenter.model.vo.PersonnelApiVo>
	 **/
	@GetMapping("/getPersonnelDataForBook")
	@ApiOperation("查询通讯录人员数据")
	@ApiImplicitParams({
			@ApiImplicitParam(value="公司Id",name="companyId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="部门Id",name="deptId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="当前页",name="pageIndex",dataType = "int",paramType = "query"),
			@ApiImplicitParam(value="每页记录数",name="pageSize",dataType = "int",paramType = "query"),
	})
	public PagerModel<PersonnelApiVo> getPersonnelDataForBook(@ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response,
															  PersonnelApiVo personnelApiVo, Query query) {
		UserSessionInfo loginUser = getUserSessionInfo(request, response);
		PagerModel<PersonnelApiVo> pm = new PagerModel<>();
		com.ys.tools.pager.PagerModel<PersonnelApiVo> ysPm = null;
		if(null!=loginUser){
			com.ys.tools.pager.Query ysQuery = new com.ys.tools.pager.Query();
			ysQuery.setPageSize(query.getPageSize());
			ysQuery.setPageIndex(query.getInitPageIndex());
			personnelApiVo.setShowDept(UcenterConstant.YES);
			com.ys.tools.vo.ReturnVo<com.ys.tools.pager.PagerModel<PersonnelApiVo>> returnVo = personnelApi.getPersonnelForBook(personnelApiVo, ysQuery,loginUser.getNo());
			ysPm = returnVo.getData();
			pm.setRows(ysPm.getRows());
			pm.setTotal(ysPm.getTotal());
			Company company = new Company();
			com.ys.tools.vo.ReturnVo<List<Company>> companyReturnVo = orgApi.getCompanyForBook(company);

			Map<String, Company> companyMap = new HashMap<String, Company>();
			if (CollectionUtils.isNotEmpty(companyReturnVo.getData())) {
				for (Company c : companyReturnVo.getData()) {
					companyMap.put(c.getId(), c);
				}
			}
		}
		return pm;
	}
}
