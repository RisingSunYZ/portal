package com.dragon.portal.rest.controller.workplat.schedule;

import com.dragon.portal.model.schedule.ScheduleEvent;
import com.dragon.portal.model.schedule.ScheduleEventGrant;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.schedule.IScheduleEventGrantService;
import com.dragon.portal.service.schedule.IScheduleEventService;
import com.dragon.portal.util.DateUtils;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * @Description:日程事件Controller
 * @Author:YangZhao
 * @Since:2019/3/20 14:09
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2018 ~ 2026 版权所有
 */
@RestController
@RequestMapping("/rest/portal/schedule/")
@Api(value="日程", description = "日程", tags={"日程 /rest/portal/schedule/"})
public class ScheduleEventController extends BaseController {
	private static Logger logger = Logger.getLogger(ScheduleEventController.class);
	
	@Resource
	private IScheduleEventService scheduleEventService;
	@Resource
	private IScheduleEventGrantService scheduleEventGrantService;
	@Resource
	private IPersonnelApi personnelApi;


	@GetMapping("/getScheduleEventGrantByGrantedPersonNo")
	@ApiOperation("通过当前用户工号查询授权信息")
	public List<ScheduleEventGrant> getScheduleEventGrantByGrantedPersonNo(@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
		UserSessionInfo user = this.getUserSessionInfo(request, response);
		String userNo = user.getNo();
		String personNos = user.getNo()+",";
		List<ScheduleEventGrant> scheduleEventGrantList = null;
		try {
			scheduleEventGrantList = scheduleEventGrantService.getScheduleEventGrantByGrantedPersonNo(userNo);
			if(CollectionUtils.isNotEmpty(scheduleEventGrantList)){
				for(ScheduleEventGrant sg : scheduleEventGrantList){
					if(StringUtils.isNotBlank(sg.getGrantPersonNo())){
						personNos = personNos + sg.getGrantPersonNo()+",";
					}
					if(sg.getGrantType() == 0){
						sg.setGrantTypeStr("查阅");
					}else if(sg.getGrantType() == 1){
						sg.setGrantTypeStr("修改");
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("ScheduleEventController-getScheduleEventGrantByGrantedPersonNo-通过当前用户工号查询授权信息失败:"+e);
		}
		return scheduleEventGrantList;
	}

   /*
   *
    * @Author yangzhao
    * @Description //TODO 加载该用户或者授权用户本月所有的日程信息
    * @Date 18:05 2019/3/18
    * @Param [scheduleEvent, request, response]
    * @return java.util.List<com.dragon.portal.model.schedule.ScheduleEvent>
    **/
	@GetMapping("/ajaxList")
	@ApiOperation("加载该用户或者授权用户本月所有的日程信息")
	@ApiImplicitParams({
			@ApiImplicitParam(value="开始时间",name="start",dataType="String",paramType="query"),
			@ApiImplicitParam(value="结束时间",name="end",dataType="String",paramType="query"),
			@ApiImplicitParam(value="日程接收人工号",name="receiveNo",dataType="String",paramType="query")
	})
	public List<ScheduleEvent> ajaxList(ScheduleEvent scheduleEvent, @ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
		List<ScheduleEvent> scheduleEventList = null;
		UserSessionInfo user =  getUserSessionInfo(request,response);
		String userNo = null == user?"":user.getNo();
		String personNos = "";
		try {
			scheduleEvent.setStartTime(DateUtils.StringToDate(scheduleEvent.getStart()+":00", "yyyy-MM-dd HH:mm:ss"));
			scheduleEvent.setEndTime(DateUtils.StringToDate(scheduleEvent.getEnd()+":00", "yyyy-MM-dd HH:mm:ss"));
			if(StringUtils.isBlank(scheduleEvent.getReceiveNo())){
				//查询当前用户的日程
				personNos = userNo;
			}else{
				//查询授权用户的日程
				personNos = scheduleEvent.getReceiveNo();
			}
			scheduleEventList = this.scheduleEventService.getScheduleEvenList(scheduleEvent,personNos);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("ScheduleEventController-ajaxList-加载该用户或者授权用户本月所有的日程信息失败:"+e);
		}
		return scheduleEventList;
	}


	/**
	 * 通过Id获取日程信息
	 * @param id
	 * @return
	 */
	@GetMapping("/getScheduleEventById/{id}")
    @ApiOperation("通过Id获取日程信息")
    public ScheduleEvent getScheduleEventById(@ApiParam("日程Id") @PathVariable("id") String id) {
        try {
            if(StringUtils.isNotBlank(id)){
                ScheduleEvent scheduleEvent = this.scheduleEventService.getScheduleEventById(id);
                return scheduleEvent;
            }else{
                logger.error("ScheduleEventController-getScheduleEventById-日程Id获取失败");
            }
        } catch (Exception e) {
            logger.error("ScheduleEventController-getScheduleEventById-通过Id获取日程信息失败"+e);
            e.printStackTrace();
        }
        return null;
    }


	/**
	 * 新建日程
	 * @param scheduleEvent
	 * @param request
	 * @param response
	 * @return
	 */
	@ApiOperation("新建日程")
	@PostMapping("/save")
	public ReturnVo save(@RequestBody ScheduleEvent scheduleEvent,@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
		ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"修改失败");
		try {
			UserSessionInfo user =  getUserSessionInfo(request,response);
			if (null != user && StringUtils.isNotBlank(user.getNo())) {
				String userNo = user.getNo();
				scheduleEvent.setUserNo(userNo);
				returnVo = this.scheduleEventService.addOrUpdateScheduleEvent(scheduleEvent);
			}else{
				returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
			}
		} catch (Exception e) {
			logger.error("ScheduleEventController-save-日程新建修改失败:"+e);
			e.printStackTrace();
		}
		return returnVo;
	}


	/**
	 * 删除日程
	 * @param id
	 * @param request
	 * @param response
	 * @return
	 */
	@GetMapping("/delEvent/{id}")
	@ApiOperation("删除日程")
	public ReturnVo delEvent(@ApiParam("日程Id") @PathVariable("id") String id,@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
		ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "删除失败");
		try {
			UserSessionInfo user =  getUserSessionInfo(request,response);
			if (null != user && StringUtils.isNotBlank(user.getNo())) {
				String userNo=user.getNo();
				if(StringUtils.isNotBlank(id)){
					ReturnVo<PersonnelApiVo> person = new ReturnVo<>();
					PersonnelApiVo personnelApiVo = null;
					ScheduleEvent scheduleEvent = this.scheduleEventService.getScheduleEventById(id);
					if(null != scheduleEvent){
						scheduleEvent.setUserNo(userNo);
						com.ys.tools.vo.ReturnVo<PersonnelApiVo> personnelApiVoByNo = personnelApi.getPersonnelApiVoByNo(scheduleEvent.getReceiveNo());
						if(null !=personnelApiVoByNo && UcenterConstant.SUCCESS == personnelApiVoByNo.getCode()){
							person= new ReturnVo(ReturnCode.SUCCESS,"查询成功",personnelApiVoByNo.getData());
						}else{
							person= new ReturnVo(ReturnCode.FAIL,"查询失败");
						}
						if(null != person){
							personnelApiVo = person.getData();
							if(null != personnelApiVo){
								scheduleEvent.setEmail(personnelApiVo.getEmail());
								scheduleEvent.setOldStart(scheduleEvent.getStartTime());
								scheduleEvent.setOldEnd(scheduleEvent.getEndTime());
								this.scheduleEventService.delScheduleEvent(scheduleEvent);
								returnVo = new ReturnVo(ReturnCode.SUCCESS, "删除成功");
							}else{
								returnVo = new ReturnVo(ReturnCode.FAIL, "查询人员信息为空");
							}
						}
					}else{
						returnVo = new ReturnVo(ReturnCode.FAIL, "日程信息信息为空");
					}
				}else{
					returnVo = new ReturnVo(ReturnCode.FAIL, "日程id不能为空");
				}
			}else{
				returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
			}
		} catch (Exception e) {
			logger.error("ScheduleEventController-delEvent-删除日程失败:"+e);
			e.printStackTrace();
		}
		return returnVo;
	}
}
