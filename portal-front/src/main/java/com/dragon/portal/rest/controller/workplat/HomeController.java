package com.dragon.portal.rest.controller.workplat;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.dragon.portal.model.cstm.SystemMenu;
import com.dragon.portal.model.workplat.ThirdSystem;
import com.dragon.portal.service.cstm.ISystemMenuService;
import com.dragon.portal.service.cstm.ISystemMenuUserService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.web.controller.BaseController;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * @Title:门户首页Contrller
 * @Description:
 * @Author:xietongjian
 * @Since:2017年4月11日 下午11:20:22
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@RestController
@RequestMapping("/rest/portal/workplat")
@Api(value="门户首页（工作台）-常有系统", description = "门户首页（工作台）-常有系统", tags={"门户首页（工作台）-常有系统 /rest/portal/workplat"})
public class HomeController extends BaseController {

	private static Logger logger = Logger.getLogger(HomeController.class);
	private static  List<String> limit_display = Arrays.asList("HRIT系统", "邮件系统", "YS-OA-NEWEIP");// 不显示的系统

	//FIXME
//	@Resource
//	private AuthUtils authUtils;
	@Resource
	private ISystemMenuService systemMenuService;
	@Resource
	private ISystemMenuUserService systemMenuUserService;


	@GetMapping("/getSysData")
	@ApiOperation("列表数据查询")
	@ApiImplicitParams({})
	public List<SystemMenu> getSysData(@ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
		// 常用系统查询
		List<SystemMenu> allByNo = null;
		List<ThirdSystem> thirdSystems = new ArrayList<ThirdSystem>();
		final List<SystemMenu> systemMenus = new ArrayList<SystemMenu>();
		final UserSessionInfo userSessionInfo = this.getPersonInfo(request, response);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("userName", userSessionInfo.getNo());
		String resultStr;
		try {
			//FIXME
			// IDM暂未弄，可以了下面注释部分不掉
			resultStr = "";
//			resultStr = authUtils.getResponseFromServer("/rest/user/get_ssoapp_byuser", params);
			JSONObject jsonObject = JSONObject.parseObject(resultStr);
			if (jsonObject!=null && jsonObject.getInteger("resultCode")!=null && jsonObject.getInteger("resultCode") == 1) {
				JSONArray wsSSOServices = jsonObject.getJSONArray("wsSSOServices");
				Iterator<Object> it = wsSSOServices.iterator();
				ThirdSystem thirdSystem = null;
				while (it.hasNext()) {
					JSONObject ob = (JSONObject) it.next();
					thirdSystem = new ThirdSystem();
					thirdSystem.setAppName(ob.getString("name"));
					thirdSystem.setAppUrl(ob.getString("serviceId"));
					thirdSystem.setIconImageSrc(ob.getString("serviceLogo"));
					//过滤
					if (!limit_display.contains(thirdSystem.getAppName())) {
						thirdSystems.add(thirdSystem);
						SystemMenu systemMenu = new SystemMenu();
						systemMenu.setSysName(thirdSystem.getAppName());
						systemMenu.setLinkUrl(thirdSystem.getAppUrl());
						systemMenu.setSysIcon(thirdSystem.getIconImageSrc());
						systemMenu.setSysSn(thirdSystem.getAppName());
						systemMenus.add(systemMenu);
					}
				}
			}
			// 保存Idm常用系统
			systemMenuService.compareMenu(userSessionInfo.getNo(), systemMenus);
			allByNo = systemMenuUserService.getAllByNo(userSessionInfo.getNo());
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("IDMSIAMSystemError" + e);
		}
		return allByNo;
	}
}
