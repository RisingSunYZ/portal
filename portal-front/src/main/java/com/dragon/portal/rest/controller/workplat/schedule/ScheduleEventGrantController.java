package com.dragon.portal.rest.controller.workplat.schedule;

import com.dragon.portal.model.schedule.ScheduleEventGrant;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.schedule.IScheduleEventGrantService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.mhome.tools.common.JsonUtils;
import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.mhome.tools.vo.SimpleReturnVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import jdk.nashorn.internal.ir.ReturnNode;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
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
 * @Title:日程事件授权Controller
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-23 10:51:11
 * @Version:1.1.0
 * yright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@RestController
@RequestMapping("/rest/portal/scheduleGrant/")
@Api(value="日程事件授权", description = "日程事件授权", tags={"日程事件授权 /rest/portal/scheduleGrant/"})
public class ScheduleEventGrantController extends BaseController {
	private static Logger logger = Logger.getLogger(ScheduleEventGrantController.class);
	
	@Resource
	private IScheduleEventGrantService scheduleEventGrantService;


	/**
	 * 保存或修改日程授权
	 * @param grantedPersonNo
	 * @param autoType
	 * @param request
	 * @param response
	 * @return
	 */
	@PostMapping("/save")
	@ApiOperation("保存或修改日程授权")
	public ReturnVo save(String grantedPersonNo,String autoType, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
		ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败");
		try {
			UserSessionInfo user =  getUserSessionInfo(request,response);
			if (null != user && StringUtils.isNotBlank(user.getNo())) {
				String userNo = user.getNo();
				String userName = user.getName();
				List<ScheduleEventGrant> scheduleEventGrantsNew = new ArrayList<>();
				List<ScheduleEventGrant> scheduleEventGrantsEdit = new ArrayList<>();
				String[] grantedPersonNos=grantedPersonNo.split(",");
				String[] autoTypes = autoType.split(",");
				Map typeMap = new HashMap();
				for(String s : autoTypes){
					typeMap.put(s.trim().split("_")[0], s.trim().split("_")[1]);
				}
				if(grantedPersonNos.length>0){
					for(int i=0;i<grantedPersonNos.length;i++){
						ScheduleEventGrant se = new ScheduleEventGrant();
						String grantType = typeMap.get(grantedPersonNos[i].trim().split("_")[0]).toString();
						if(grantedPersonNos[i].trim().split("_")[2].equals("0")){
							//为0时代表数据为新增授权用户 添加授权信息
							if(!userNo.equals(grantedPersonNos[i].trim().split("_")[0])){
								se.setId(UUIDGenerator.generate());
								se.setCreator(userNo);
								se.setUpdator(userNo);
								se.setGrantPersonNo(userNo);
								se.setGrantPersonName(userName);
								se.setGrantedPersonNo(grantedPersonNos[i].trim().split("_")[0]);
								se.setGrantedPersonName(grantedPersonNos[i].trim().split("_")[1]);
								se.setGrantType(Integer.parseInt(grantType));
								scheduleEventGrantsNew.add(se);
							}
						}else{
							//修改授权信息
							ScheduleEventGrant editGrant = scheduleEventGrantService.getScheduleEventGrantById(grantedPersonNos[i].trim().split("_")[2]);
							editGrant.setGrantType(Integer.parseInt(grantType));
							scheduleEventGrantsEdit.add(editGrant);
						}
					}
				}
				this.scheduleEventGrantService.addOrUpdateScheduleEventGrant(scheduleEventGrantsNew,scheduleEventGrantsEdit);
				returnVo = new ReturnVo(ReturnCode.SUCCESS, "保存数据成功！");
			}else{
				returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
			}
		} catch (Exception e) {
			logger.error("ScheduleEventGrantController-update-保存或修改日程授权失败:"+e);
			e.printStackTrace();
		}
		return returnVo;
	}


	/**
	 * 查询出授权人信息
	 * @param request
	 * @param response
	 * @return
	 */
	@GetMapping("/empower")
	@ApiOperation("查询出授权人信息")
	public Map<String,Object> empower(@ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
		Map<String,Object> map = new HashMap<>();
		UserSessionInfo user = this.getUserSessionInfo(request, response);
		List<ScheduleEventGrant> scheduleEventGrantList = null;
		String grantedPersonNos = "";
		try {
			scheduleEventGrantList = scheduleEventGrantService.getScheduleEventGrantByGrantPersonNo(user.getNo());
			if(CollectionUtils.isNotEmpty(scheduleEventGrantList)){
				for(ScheduleEventGrant s : scheduleEventGrantList){
					grantedPersonNos = grantedPersonNos + s.getGrantedPersonNo() +"_"+s.getGrantedPersonName()+"_"+s.getId()+"_"+s.getGrantType()+",";
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("ScheduleEventController-empower-查询出授权人信息失败"+e);
		}
		map.put("grantedPersonNos", grantedPersonNos);
		map.put("scheduleEventGrantList", scheduleEventGrantList);
		return map;
	}

	/**
	 * 删除授权
	 * @param id
	 * @param request
	 * @param response
	 * @return
	 */
	@GetMapping("/delEventGrant/{id}")
	@ApiOperation("删除授权")
	public ReturnVo delEventGrant(@ApiParam("授权Id") @PathVariable("id") String id,@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
		ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "删除失败");
		try {
			UserSessionInfo user =  getUserSessionInfo(request,response);
			if (null != user && StringUtils.isNotBlank(user.getNo())) {
				if(StringUtils.isNotBlank(id)){
					this.scheduleEventGrantService.delScheduleEventGrantById(id);
					returnVo = new ReturnVo(ReturnCode.SUCCESS, "删除成功");
				}else{
					returnVo = new ReturnVo(ReturnCode.FAIL, "删除失败,授权ID不能为null");
				}
				returnVo = new ReturnVo(ReturnCode.SUCCESS, "删除成功");
			}else{
				returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
			}
		} catch (Exception e) {
			logger.error("ScheduleEventGrantController-delEventGrant-删除授权失败:"+e);
			e.printStackTrace();
		}
		return returnVo;
	}

}
