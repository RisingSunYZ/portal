package com.dragon.portal.rest.controller.workplat.sysmenu;


import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.model.cstm.SystemMenu;
import com.dragon.portal.model.cstm.SystemMenuType;
import com.dragon.portal.model.cstm.SystemMenuUser;
import com.dragon.portal.service.cstm.ISystemMenuTypeService;
import com.dragon.portal.service.cstm.ISystemMenuUserService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.web.controller.BaseController;
import com.dragon.tools.vo.ReturnVo;
import com.google.gson.reflect.TypeToken;
import com.ys.tools.common.JsonUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/rest/portal/workplat/system")
@Api(value="门户首页（工作台）-系统菜单", description = "门户首页（工作台）-系统菜单", tags={"门户首页（工作台）-系统菜单 /rest/portal/workplat/system"})
public class SystemMenuController extends BaseController {

	private static Logger logger = Logger.getLogger(SystemMenuController.class);

	@Resource
	private ISystemMenuTypeService systemMenuTypeService;
	@Resource
	private ISystemMenuUserService systemMenuUserService;

	@GetMapping("/getSystemByetId")
	@ApiOperation("系统菜单查询")
	@ApiImplicitParams({})
	public List<SystemMenuType> getSystemById(String id){

		List<SystemMenuType> classify = null;
		try {
			classify = systemMenuTypeService.getClassify(1, id);
		} catch (Exception e) {
			logger.error("SystemMenuController-getSystemById:",e);
			e.printStackTrace();
		}
		return classify;
	}

	@GetMapping("/userSys")
	@ApiOperation("用户系统菜单查询")
	@ApiImplicitParams({})
	public String userSys(@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response){
		UserSessionInfo loginUser = this.getPersonInfo(request, response);
		List<SystemMenu> allByNo = null;
		if(loginUser!=null){
			try {
				allByNo = systemMenuUserService.getAllByNo(loginUser.getNo());
			} catch (Exception e) {
				logger.error("SystemMenuController--userSys",e);
				e.printStackTrace();
			}
		}
		return JsonUtils.toJson(allByNo);
	}

	@PostMapping("/save")
	@ApiOperation("系统菜单保存")
	@ApiImplicitParams({})
	public ReturnVo<String> save(@ApiIgnore HttpServletRequest request,@ApiIgnore  HttpServletResponse response, String systemMenuUserJson){
		UserSessionInfo loginUser = this.getPersonInfo(request, response);
		ReturnVo<String> returnVo = new ReturnVo<String>( PortalConstant.ERROR, "常用系统保存失败");
		try {
			List<SystemMenuUser> list = JsonUtils.getGson().fromJson(systemMenuUserJson,
					new TypeToken<ArrayList<SystemMenuUser>>(){}.getType());
			for(SystemMenuUser temp : list){
				temp.setUserNo(loginUser.getNo());
				temp.setStatus(PortalConstant.STATUS_ENABLED);
			}
			//保存
			systemMenuUserService.insertAfterDelByNo(list, loginUser.getNo());
			returnVo.setMsg("常用系统保存成功");
			returnVo.setCode(PortalConstant.SUCCESS);
		}catch (Exception e){
			e.printStackTrace();
			logger.error("SystemMenuController-save保存常用系统异常",e);
		}
		return returnVo;
	}
}
