package com.dragon.portal.rest.controller.msg;

import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.ecnice.privilege.api.privilege.IPrivilegeApi;
import com.ecnice.privilege.constant.PrivilegeConstant;
import com.ys.mis.api.IMisApi;
import com.ys.mis.constant.MisConstant;
import com.ys.mis.model.notice.Notification;
import com.ys.tools.pager.PagerModel;
import com.ys.tools.pager.Query;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 消息通知
 * @Title:
 * @Description:
 * @Author:wangzhaoliao
 * @Since:2017年6月16日 下午2:20:37
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@RestController
@RequestMapping("/rest/portal/msg")
@Api(value="消息通知", description = "消息通知", tags={"消息通知 /portal/msg"})
public class MsgNotifyController extends BaseController {
	
	private static Logger logger = Logger.getLogger(MsgNotifyController.class);

	

	@Resource
	private IMisApi misApi;
	
	@Resource
	private IPrivilegeApi privilegeApi;

	/**
	 * 获取所有系统
	 */
	@GetMapping("/getAllSystem")
	@ApiOperation("获取所有系统")
	public ReturnVo getAllSystem( HttpServletRequest request, HttpServletResponse response){
		ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
		try {
			com.ecnice.privilege.vo.ReturnVo rVo = privilegeApi.getAllSystem(null);
			if (null != rVo.getDatas()&&PrivilegeConstant.SUCCESS_CODE==rVo.getStatus()) {
				returnVo.setData(rVo.getDatas());
				returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
			}else{
			    logger.info(rVo.getMessage());
			    returnVo.setMsg(rVo.getMessage());
            }
		}catch (Exception e){
			logger.error("MsgNotifyController-getAllSystem:",e);
		}
		return returnVo;
	}
//	/**
//	 * 消息类型查询
//	 * @param notification
//	 */
//	@GetMapping("/getNoticeType")
//	@ApiOperation("消息类型查询")
//	public ReturnVo<List<Notification>> getNoticeType(@ApiIgnore Notification notification, HttpServletRequest request, HttpServletResponse response){
//		ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
//		try {
//			com.ys.tools.vo.ReturnVo<List<Notification>> system = misApi.getNoticeType(notification);
//			if(null !=system.getData()){
//				List<Notification> noticeTypes = system.getData();
//				for(Notification noticeType :noticeTypes){
//					if(noticeType.getNoticeType()==NoticeTypeEnum.FLOW_NOTIFY.getType()){
//						noticeType.setMessage(NoticeTypeEnum.FLOW_NOTIFY.getName());
//					}else if(noticeType.getNoticeType()==NoticeTypeEnum.FLOW_MESSAGE.getType()){
//						noticeType.setMessage(NoticeTypeEnum.FLOW_MESSAGE.getName());
//					}else if(noticeType.getNoticeType()==NoticeTypeEnum.SYSTEM_NOTIFY.getType()){
//						noticeType.setMessage(NoticeTypeEnum.SYSTEM_NOTIFY.getName());
//					}else{
//						noticeType.setMessage(NoticeTypeEnum.SYSTEM_TODO.getName());
//					}
//				}
//				returnVo.setData(noticeTypes);
//			}
//		}catch (Exception e){
//			logger.error("MsgNotifyController-getNoticeType:",e);
//		}
//		return returnVo;
//	}


	@GetMapping("/ajaxlist")
	@ApiOperation("获取消息列表")
	@ApiImplicitParams({
			@ApiImplicitParam(name="pageIndex",value = "页码",dataType = "String",paramType = "query"),
			@ApiImplicitParam(name="pageSize",value = "条数",dataType = "String",paramType = "query"),
			@ApiImplicitParam(name="messageType",value = "消息类型",dataType = "String",paramType = "query"),
	})
	public ReturnVo<PagerModel<Notification>> ajaxlist(@ApiIgnore Query query, @ApiIgnore Notification notification,HttpServletRequest request, HttpServletResponse response) {
		ReturnVo<PagerModel<Notification>> returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
		String[] messageTypes = request.getParameterValues("messageType");
		String messageType = StringUtils.join(messageTypes,",");
		notification.setMessageType(messageType);
		if(query != null){
			if(StringUtils.isNotBlank(query.getPage())){
				query.setPageSize(query.getRows());
			}
		}

		UserSessionInfo user = getUserSessionInfo(request,response);
		if(user !=null && StringUtils.isNotBlank(user.getNo()) ) {
			notification.setReceiveNo(user.getNo());
		}
		com.ys.tools.vo.ReturnVo<PagerModel<Notification>> ro = misApi.getPagerModelByQuery(notification, query);
		if(ro.getCode() == MisConstant.SUCCESS){
			returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
			returnVo.setData(ro.getData());
		}
		return returnVo;
	}
	
	/**
	 * 获取消息数量
	 * @return
	 */
	@GetMapping("/getMsgCount")
	@ApiOperation("获取消息数量")
	public ReturnVo getMsgCount(HttpServletRequest request, HttpServletResponse response) {
		ReturnVo<Map<String, Integer>> returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
		try {
			UserSessionInfo user = getUserSessionInfo(request, response);
			if(user != null && StringUtils.isNotBlank(user.getNo())) {
				com.ys.tools.vo.ReturnVo<Map<String, Integer>> rVo = misApi.getNotifyTypeAndNoReadNumberByNo(user.getNo());
				if (!MisConstant.SUCCESS.equals(rVo.getCode())) {
					logger.error("调用接口失败" + rVo.getMsg());
				}else{
					returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
					returnVo.setData(rVo.getData());
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("【调用接口异常misApi.getNotifyTypeAndNoReadNumberByNo】" , e);
		}
		return returnVo;
	}
	

   /**
    *@Description 批量修改阅读状态
    */
	@GetMapping("/updateMsgStatus")
	@ApiOperation("批量修改阅读状态")
	@ApiImplicitParam(name="ids",value = "多个id逗号隔开",dataType = "String",paramType = "query",required = true)
	public ReturnVo updateMsgStatus(HttpServletRequest request, HttpServletResponse response, String ids) {
		ReturnVo<String> returnVo = new ReturnVo(ReturnCode.FAIL, "修改阅读状态失败!");
		try {
			List<String> idList = new ArrayList();
			UserSessionInfo userInfo = this.getUserSessionInfo(request, response);
			if (userInfo != null && StringUtils.isNotBlank(userInfo.getNo())) {
				String userNo = userInfo.getNo();
				if (StringUtils.isNotBlank(ids)) {
					// 批量设置已读
					String[] idsStr = ids.trim().split(",");
					if (idsStr != null && idsStr.length > 0) {
						for (String id : idsStr) {
                            idList.add(id);
						}
						com.ys.tools.vo.ReturnVo rVo = misApi.updateReadingStatus(idList, userNo);
						if(MisConstant.SUCCESS.equals(rVo.getCode())){
							returnVo.setCode(ReturnCode.SUCCESS);
							returnVo.setMsg("修改阅读状态成功!");
                        }
					}else{
						returnVo.setMsg("修改阅读状态失败:id不能为空!");
                    }
				}
			}else{
				returnVo.setMsg("用户未登录,请重新登录!");
            }
		} catch (Exception e) {
			e.printStackTrace();
            logger.error("【MsgNotifyController：updateMsgStatus】" + e);
		}
		return returnVo;
	}
	
	/**
	 * 获取详情
	 */
	@GetMapping("/getDetail")
	@ApiOperation("获取详情")
	@ApiImplicitParam(name="id",value = "id",dataType = "String",paramType = "query",required = true)
	public ReturnVo<Notification> getDetail( HttpServletRequest request, HttpServletResponse response, String id) {
        ReturnVo<Notification> returnVo = new ReturnVo(ReturnCode.FAIL, "调用接口失败！");
		try {
			UserSessionInfo user = getUserSessionInfo(request, response);
			if (user != null && StringUtils.isNotBlank(user.getNo())) {
				String userNo = user.getNo();
				com.ys.tools.vo.ReturnVo<Notification> rVo = misApi.getNotificationById(id);
				List<String> ids = new ArrayList();
				ids.add(id);
				misApi.updateReadingStatus(ids, userNo);
				returnVo = new ReturnVo(ReturnCode.SUCCESS, "查询成功！");
				returnVo.setData(rVo.getData());
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("【MsgNotifyController：getDetail】" + e);
		}
		return returnVo;
	}
	

}

	