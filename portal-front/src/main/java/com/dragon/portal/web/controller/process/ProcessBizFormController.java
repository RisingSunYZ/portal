package com.dragon.portal.web.controller.process;

import com.dragon.flow.api.IFlowApi;
import com.dragon.portal.config.PropertiesConfig;
import com.dragon.portal.service.basedata.IDicItemService;
import com.dragon.portal.web.controller.BaseController;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

@Controller
@RequestMapping("/portal/process/biz/form")
public class ProcessBizFormController extends BaseController {
	private static Logger logger = Logger.getLogger(ProcessBizFormController.class);

	@Resource
	private IFlowApi flowApi;

	@Resource
	private IDicItemService dicItemService;

	@Autowired
	private PropertiesConfig propertiesConfig;

	@ResponseBody
	@RequestMapping("/test")
	public String test(){
		// propertiesConfig.getBaseListCode();
		return "tset";
	}

}

	