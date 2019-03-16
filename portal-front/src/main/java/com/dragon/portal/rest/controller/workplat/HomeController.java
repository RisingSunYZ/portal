package com.dragon.portal.rest.controller.workplat;

import com.dragon.portal.model.schedule.ScheduleEvent;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.cstm.ISystemMenuService;
import com.dragon.portal.service.cstm.ISystemMenuUserService;
import com.dragon.portal.service.schedule.IScheduleEventService;
import com.dragon.portal.vo.user.UserSessionInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

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
	@Autowired
	private IScheduleEventService scheduleEventService;


	/*
	*
	 * @Author yangzhao
	 * @Description //TODO 获取日程总数量
	 * @Date 13:14 2019/3/15
	 * @Param [request, response]
	 * @return java.lang.String
	 **/
	@GetMapping("/getNewSchduleCount")
	@ApiOperation("获取日程总数量")
	public String getNewSchduleCount(@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
		UserSessionInfo user = getUserSessionInfo(request,response);
		ScheduleEvent scheduleEvent = new ScheduleEvent();
		scheduleEvent.setStartTime(new Date());
		scheduleEvent.setReceiveNo(user.getNo());

		String jsonp = request.getParameter("jsonpcallback");
		Integer pendingCount=0;
		try {
			List<ScheduleEvent> listScheduleEvent = scheduleEventService.getAll(scheduleEvent);
			if(null != listScheduleEvent){
				pendingCount = listScheduleEvent.size();
				String userJson = jsonp+"("+pendingCount+")";
				OutputStream out = response.getOutputStream();
				out.write(userJson.getBytes("UTF-8"));
				out.flush();
				out.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("HomeController-getNewSchduleCount:获取日程总数量失败:"+e);
		}
		return "";
	}



}
