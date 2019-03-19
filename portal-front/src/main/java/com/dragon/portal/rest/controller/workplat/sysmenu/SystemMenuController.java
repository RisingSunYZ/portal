package com.dragon.portal.rest.controller.workplat.sysmenu;


import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.model.cstm.SystemMenu;
import com.dragon.portal.model.cstm.SystemMenuType;
import com.dragon.portal.model.cstm.SystemMenuUser;
import com.dragon.portal.model.workplat.ThirdSystem;
import com.dragon.portal.service.cstm.ISystemMenuTypeService;
import com.dragon.portal.service.cstm.ISystemMenuUserService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.google.gson.reflect.TypeToken;
import com.ys.tools.common.JsonUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * 常用系统Controller
 */
@RestController
@RequestMapping("/rest/portal/workplat/system")
@Api(value="常用系统", description = "常用系统", tags={"常用系统菜单 /rest/portal/workplat/system"})
public class SystemMenuController extends BaseController {

	private static Logger logger = Logger.getLogger(SystemMenuController.class);

	//	@Autowired
//	private AuthUtils authUtils;
	@Autowired
	private ISystemMenuTypeService systemMenuTypeService;
	@Autowired
	private ISystemMenuUserService systemMenuUserService;

	/**
	 * 门户首页-常用系统查询
	 */
	@GetMapping("/getSysData")
	@ApiOperation("查询常用系统")
	@ApiImplicitParams({})
	public ReturnVo getSysData(@ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "常用系统查询失败！" );
		try {
			// 常用系统查询
			List<SystemMenu> allByNo = null;
			List<ThirdSystem> thirdSystems = new ArrayList<ThirdSystem>();
			List<SystemMenu> systemMenus = new ArrayList<SystemMenu>();

			//登录用户信息
			UserSessionInfo userSessionInfo = this.getPersonInfo(request, response);
			String userNo = userSessionInfo.getNo();
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("userName", userNo);
			String resultStr;

			//FIXME IDM暂未弄，可以了下面注释部分不掉，删除假数据
//			resultStr = authUtils.getResponseFromServer("/rest/user/get_ssoapp_byuser", params);
//			JSONObject jsonObject = JSONObject.parseObject(resultStr);
//			if (jsonObject != null && jsonObject.getInteger("resultCode") != null
//					&& jsonObject.getInteger("resultCode") == 1) {
//				JSONArray wsSSOServices = jsonObject.getJSONArray("wsSSOServices");
//				Iterator<Object> it = wsSSOServices.iterator();
//				ThirdSystem thirdSystem;
//				while (it.hasNext()) {
//					JSONObject ob = (JSONObject) it.next();
//					thirdSystem = new ThirdSystem();
//					thirdSystem.setAppName(ob.getString("name"));
//					thirdSystem.setAppUrl(ob.getString("serviceId"));
//					thirdSystem.setIconImageSrc(ob.getString("serviceLogo"));
//
//					//过滤
//					if (!limit_display.contains(thirdSystem.getAppName())) {
//						thirdSystems.add(thirdSystem);
//						SystemMenu systemMenu = new SystemMenu();
//						systemMenu.setSysName(thirdSystem.getAppName());
//						systemMenu.setLinkUrl(thirdSystem.getAppUrl());
//						systemMenu.setSysIcon(thirdSystem.getIconImageSrc());
//						systemMenu.setSysSn(thirdSystem.getAppName());
//						systemMenus.add(systemMenu);
//					}
//				}
//			}
//			// 保存IDM常用系统
//			systemMenuService.compareMenu(userNo, systemMenus);
//			allByNo = systemMenuUserService.getAllByNo(userNo);

			// 假数据
			SystemMenu systemMenu1 = new SystemMenu();
			systemMenu1.setId( "8a8a8fb667fa13b30167fa13b3f30000" );
			systemMenu1.setSysName( "绩效系统" );
			systemMenu1.setSysSn( "performance" );
			systemMenu1.setSysIcon( "/sysIcon/2017/07/13/8a8a8c1a5d3b6da1015d3b80505500ff.png" );
			systemMenu1.setLinkUrl( "/pfIndex.jhtml" );
			systemMenu1.setSortNo( 500 );
			systemMenu1.setIsIdmSys( 0 );
			systemMenu1.setRemark( "绩效系统" );
			systemMenu1.setDelFlag( 1 );

			SystemMenu systemMenu2 = new SystemMenu();
			systemMenu2.setId( "8a8a8c1a5d3b6da1015d3b8050610100" );
			systemMenu2.setSysName( "亚厦综合管理" );
			systemMenu2.setSysSn( "亚厦综合管理" );
			systemMenu2.setSysIcon( "/sysIcon/2017/07/13/8a8a8c1a5d3b6da1015d3b80505500ff.png" );
			systemMenu2.setLinkUrl( "http://mos.chinayasha.com:8888/p/main.html" );
			systemMenu2.setSortNo( 1000 );
			systemMenu2.setIsIdmSys( 1 );
			systemMenu2.setRemark( "绩效系统2" );
			systemMenu2.setDelFlag( 1 );
			allByNo =  Arrays.asList(systemMenu1, systemMenu2);

			returnVo = new ReturnVo( ReturnCode.SUCCESS, "常用系统查询成功！", allByNo );
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("HomeController-getSysData:" + e);
		}
		return returnVo;
	}

	/**
	 * 根据Id查询系统菜单
	 */
	@GetMapping("/getSystemById/{id}")
	@ApiOperation("根据Id查询系统菜单")
	@ApiImplicitParams({})
	public ReturnVo getSystemById(@PathVariable(name = "id") String id){
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "常用系统查询失败！" );
		try {
			List<SystemMenuType> classify = systemMenuTypeService.getClassify(1, id);
			returnVo = new ReturnVo<>( ReturnCode.SUCCESS, "常用系统查询成功！" , classify);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("SystemMenuController-getSystemById:",e);
		}
		return returnVo;
	}

	/**
	 * 查询用户系统菜单
	 */
	@GetMapping("/getUserSystem")
	@ApiOperation("查询用户系统菜单")
	@ApiImplicitParams({})
	public ReturnVo getUserSystem(@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response){
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询用户系统菜单失败！" );
		try {
			UserSessionInfo loginUser = this.getPersonInfo(request, response);
			if (null != loginUser){
				String userNo = loginUser.getNo();
				List<SystemMenu> userSystemMenuList = systemMenuUserService.getAllByNo( userNo );
				returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询用户系统菜单成功！", userSystemMenuList );
			}else {
				// 用户未登录
				returnVo = new ReturnVo( ReturnCode.FAIL, "用户未登录！" );
			}
		} catch (Exception e) {
			logger.error("SystemMenuController-getUserSystem:",e);
			e.printStackTrace();
		}

		return returnVo;
	}

	/**
	 * 保存系统菜单
	 */
	@PostMapping("/saveSystemMenu")
	@ApiOperation("保存系统菜单")
	@ApiImplicitParams({})
	public ReturnVo saveSystemMenu(String systemMenuUserJson, @ApiIgnore HttpServletRequest request, @ApiIgnore  HttpServletResponse response){
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "保存常用系统失败!");
		try {
			UserSessionInfo loginUser = this.getPersonInfo(request, response);
			if (null != loginUser){
				String userNo = loginUser.getNo();

				List<SystemMenuUser> list = JsonUtils.getGson().fromJson(systemMenuUserJson, new TypeToken<ArrayList<SystemMenuUser>>(){}.getType());
				for(SystemMenuUser temp : list){
					temp.setUserNo(userNo);
					temp.setStatus(PortalConstant.STATUS_ENABLED);
				}

				//保存
				systemMenuUserService.insertAfterDelByNo(list, userNo);
				returnVo = new ReturnVo( ReturnCode.SUCCESS, "保存常用系统成功！" );
			} else {
				// 用户未登录
				returnVo = new ReturnVo( ReturnCode.FAIL, "用户未登录！" );
			}
		}catch (Exception e){
			e.printStackTrace();
			logger.error("SystemMenuController-saveSystemMenu:",e);
		}
		return returnVo;
	}
}
