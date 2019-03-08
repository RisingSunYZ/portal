package com.dragon.portal.rest.controller.common;

import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.enm.commom.BizSysMenuTypeEnum;
import com.dragon.portal.model.cstm.BizSysMenu;
import com.dragon.portal.service.cstm.IBizSysMenuService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.JsonUtils;
import com.dragon.tools.common.ReadProperty;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 业务系统通用框架
 * 
 * @Description:
 * @author xietongjian
 * @Since:2018年2月2日 下午5:15:07
 * @Version:1.1.0
 * @Copyright:Copyright (c) 亚厦股份有限公司 2015 ~ 2018 版权所有
 */
@RestController
@RequestMapping("/portal/biz-sys")
@Api(value="业务系统通用框架", description = "业务系统通用框架", tags={"业务系统通用框架 /portal/biz-sys"})
public class BizSysController extends BaseController {
	private static Logger logger = Logger.getLogger(BizSysController.class);

	@Resource
	private IBizSysMenuService bizSysMenuService;


	/**
	 * 业务系统菜单
	 * 
	 * @Description:
	 * @author xietongjian
	 * @Since:2018年2月2日 下午5:18:20
	 * @Version:1.1.0
	 * @Copyright:Copyright (c) 亚厦股份有限公司 2015 ~ 2018 版权所有
	 * @param sys 业务系统Sn
	 * @param request
	 * @param response
	 * @return
	 */
	@GetMapping("/getMenuTree")
	@ApiOperation("业务系统菜单")
	public ReturnVo getMenuTree(String sys,  HttpServletRequest request, HttpServletResponse response) {
		ReturnVo<BizSysMenu> returnVo = new ReturnVo<BizSysMenu>(ReturnCode.FAIL, "查询数据失败!");
		UserSessionInfo loginUser = this.getPersonInfo(request, response);
		try {
			if (StringUtils.isBlank(sys)) {
				returnVo.setMsg("业务系统Sn不能为空！");
			} else {
				String id = bizSysMenuService.getIdBySn(sys);
				if (StringUtils.isNotBlank(id)) {
					List<BizSysMenu> menuTree = bizSysMenuService.getMenuTree(id);
					//根据职位决定是否开放或过滤部分权限
					List<BizSysMenu> menuTreeTemp = menuTree.stream().filter(menu -> CollectionUtils.isNotEmpty(loginUser.getLeaderDeptList())||!BizSysMenuTypeEnum.DEPARTMENT_AUTHORITY.getCode().equals(menu.getType())).collect(Collectors.toList());
					returnVo.setDatas(menuTreeTemp);
					returnVo.setCode(ReturnCode.SUCCESS);
					returnVo.setMsg("查询数据成功");
//					if (CollectionUtils.isNotEmpty(loginUser.getLeaderDeptList())) {
//						returnVo.setDatas(menuTree);
//						returnVo.setCode(ReturnCode.SUCCESS);
//						returnVo.setMsg("查询数据成功");
//					} else{
//						List<BizSysMenu> mTree = new ArrayList<>();
//						for (BizSysMenu bizsysmenu : menuTree) {
//							if (bizsysmenu.getType() == BizSysMenuTypeEnum.COMMONAUTHORITY.getCode()) {
//								mTree.add(bizsysmenu);
//							}
//						}
//						returnVo.setDatas(menuTreeTemp);
//						returnVo.setCode(ReturnCode.SUCCESS);
//						returnVo.setMsg("查询数据成功");
//					}

				} else {
					returnVo.setMsg("SN没有相应的数据");
				}
			}
		} catch (Exception e) {
			logger.error("查询业务系统菜单异常！:" + e);
			returnVo.setMsg("查询业务系统菜单异常！");
		}
		return returnVo;
	}
}
