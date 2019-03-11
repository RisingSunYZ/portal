package com.dragon.portal.rest.controller.workplat;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.dragon.portal.model.cstm.SystemMenu;
import com.dragon.portal.model.workplat.ThirdSystem;
import com.dragon.portal.service.cstm.ISystemMenuService;
import com.dragon.portal.service.cstm.ISystemMenuUserService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * @Title:门户首页
 * @Description:
 * @Author:xietongjian
 * @Since:2017年4月11日 下午11:20:22
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
// FIXME 暂未使用此类，如果不要可删除
@RestController
@RequestMapping("/rest/portal/workplat")
@Api(value="门户首页", description = "门户首页", tags={"门户首页 /rest/portal/workplat"})
public class HomeController extends BaseController {

	private static Logger logger = Logger.getLogger(HomeController.class);
	private static  List<String> limit_display = Arrays.asList("HRIT系统", "邮件系统", "YS-OA-NEWEIP");// 不显示的系统

	//FIXME IDM暂未弄，可以了下面注释部分不掉
//	@Autowired
//	private AuthUtils authUtils;
	@Autowired
	private ISystemMenuService systemMenuService;
	@Autowired
	private ISystemMenuUserService systemMenuUserService;



}
