package com.dragon.portal.rest.controller.process;

import com.dragon.flow.api.IFlowApi;
import com.dragon.flow.constant.FlowConstant;
import com.dragon.flow.enm.flowable.run.CommentTypeEnum;
import com.dragon.flow.enm.flowable.run.ProcessStatusEnum;
import com.dragon.flow.enm.from.AttachmentType;
import com.dragon.flow.enm.from.ModelAppliedRangeEnum;
import com.dragon.flow.model.attach.WfAttachment;
import com.dragon.flow.model.attach.WfPostscript;
import com.dragon.flow.model.extend.ExtendModel;
import com.dragon.flow.model.extend.RelateFlow;
import com.dragon.flow.vo.flowable.ActReProcdefExtendVo;
import com.dragon.flow.vo.flowable.ReviewTaskVo;
import com.dragon.flow.vo.flowable.api.*;
import com.dragon.flow.vo.flowable.comment.FlowCommentVo;
import com.dragon.flow.vo.flowable.run.FlowNodeVo;
import com.dragon.flow.vo.mongdb.SearchTaskVo;
import com.dragon.portal.component.IProcessMainComponent;
import com.dragon.portal.enm.process.OptionEnum;
import com.dragon.portal.utils.CommUtil;
import com.dragon.portal.vo.process.*;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import com.dragon.tools.common.JsonUtils;
import com.dragon.tools.common.ReturnCode;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.*;
import jdk.nashorn.internal.ir.annotations.Ignore;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 流程中心-表单操作
 */
@RestController
@RequestMapping("/rest/process/form")
@Api(value="流程中心-表单操作", description = "流程中心-表单操作", tags={"流程中心-表单操作 /rest/process/form"})
public class ProcessFormController extends BaseController {
	private static Logger logger = Logger.getLogger(ProcessFormController.class);

	@Autowired
	private IFlowApi flowApi;
	@Autowired
	private IPersonnelApi personnelApi;
	@Autowired
	private IProcessMainComponent processMainComponent;
	/**
	 * 得到状态及类型枚举数据
	 * @return
	 */
	@ApiOperation("得到状态及类型枚举数据")
	@RequestMapping(value = "/getProcessEnums",method = RequestMethod.GET)
	public Map<String, Object> getProcessStatus() {
		Map<String, Object> map = new HashMap<>();
		try{
			map.put("formTypes", ModelAppliedRangeEnum.getAllinfo());
		}catch(Exception e){
			e.printStackTrace();
			logger.error("ApiProcessController-getProcessEnums",e);
		}
		return map;
	}
	/**
	 * 流程的基本信息
	 * @param modelId
	 * @param instId
	 * @param bizId
	 * @param taskId
	 * @param request
	 * @param response
	 * @return
	 */
	@ApiOperation("流程的基本信息")
	@ApiImplicitParams({
			@ApiImplicitParam(value="模板id",name="modelId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="流程实例id",name="instId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="业务表单id",name="bizId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="任务id",name="taskId",dataType = "String",paramType = "query")
	})
	@RequestMapping(value = "/getBaseInfo",method = RequestMethod.GET)
	private Map<String,Object> getBaseInfo( String modelId,String instId,String bizId,String taskId,HttpServletRequest request, HttpServletResponse response) {
		Map<String,Object> formInfo=new HashMap<String,Object>();
		ExtendModel modelExtend=new ExtendModel();
		modelExtend.setBusinessKey(bizId);
		modelExtend.setModelKey(modelId);
		String processDefineId="";
		try{
			if(!"0".equals(instId)&&"0".equals(taskId)){
				ReturnVo<ActReProcdefExtendVo> rVo = flowApi.getPInfoByPId(instId);
				if(null != rVo && null!=rVo.getData()){
					taskId = rVo.getData().getTaskId();
					formInfo.put("ownDeptName",rVo.getData().getOwnDeptName());
					formInfo.put("processDockingName",rVo.getData().getProcessDockingName());
					formInfo.put("processDockingNo",rVo.getData().getProcessDockingNo());
					formInfo.put("formTitle", StringUtils.isNotBlank(bizId)&&!"0".equals(bizId)?rVo.getData().getName()+"-"+bizId:rVo.getData().getName());
				}else{
					formInfo.put("ownDeptName","");
					formInfo.put("processDockingName","");
					formInfo.put("processDockingNo","");
					formInfo.put("formTitle","");
				}

				//获取流程提交人信息
				this.getUserInfo(formInfo,instId);


			}else{
				ReturnVo<ExtendModel> rVo = flowApi.getModelBySearch(modelExtend);
				if(rVo.getData()!=null && rVo.getData().getAppliedRange()!=null){
					ExtendModel actReModelExtend= rVo.getData();
					formInfo.put("ownDeptName",actReModelExtend.getOwnDeptName());
					formInfo.put("processDockingName",actReModelExtend.getProcessDockingName());
					formInfo.put("processDockingNo",actReModelExtend.getProcessDockingNo());
					String formTitle = "";
					formTitle = StringUtils.isNotBlank(bizId)&&!"0".equals(bizId)?actReModelExtend.getName()+"-"+bizId:actReModelExtend.getName();
					formInfo.put("formTitle",formTitle);
					if(StringUtils.isNotBlank(instId)&&"0".equals(instId)){
						processDefineId = actReModelExtend.getProcessDefinitionId();
					}else{
						//获取流程提交人信息
						this.getUserInfo(formInfo,instId);
					}
				}
			}
			formInfo.put("bizId",bizId);
			formInfo.put("proInstId",(instId));
			formInfo.put("processDefineId",(processDefineId));
			formInfo.put("taskId",taskId);
		}catch (Exception e){
			e.printStackTrace();
			logger.error("流程的基本信息 ApiProcessController-getBaseInfo"+e);
		}

		return formInfo;
	}
	/**
	 * 获取iframe连接
	 * @param modelId
	 * @param instId
	 * @param bizId
	 * @param taskId
	 * @param expType
	 * @param request
	 * @param response
	 * @return
	 */
	@ApiOperation("获取iframe连接")
	@ApiImplicitParams({
			@ApiImplicitParam(value="模板id",name="modelId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="流程实例id",name="instId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="业务表单id",name="bizId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="任务id",name="taskId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="差旅报销单使用",name="expType",dataType = "String",paramType = "query")
	})
	@RequestMapping(value = "/getFormUrl",method = RequestMethod.GET)
	private Map<String,Object> getFormUrl( String modelId,String instId,String bizId,String taskId,String expType,HttpServletRequest request, HttpServletResponse response) {
		Map<String,Object> formInfo=new HashMap<String,Object>();
		Integer appliedRange=ModelAppliedRangeEnum.UNKNOW.getStatus();
		String url="";
		boolean errorFlag=false;
		try{
			ExtendModel modelExtend=new ExtendModel();
			modelExtend.setModelKey(modelId);
			modelExtend.setBusinessKey(bizId);
			ReturnVo<ExtendModel> rVo = flowApi.getModelBySearch(modelExtend);
			if(rVo.getData()!=null && rVo.getData().getAppliedRange()!=null){
				if(null!=rVo.getData() && StringUtils.isNotBlank(rVo.getData().getModelKey())){
					modelId = rVo.getData().getModelKey();
				}
				appliedRange=rVo.getData().getAppliedRange();
			}
			if(appliedRange== ModelAppliedRangeEnum.YWXTMH.getStatus()
					|| appliedRange==ModelAppliedRangeEnum.YWXTYW.getStatus()){
				url=rVo.getData().getBusinessUrl();
				if(url.indexOf("/portal/form/biz/index-")>-1){
					url = "/flow/form/s/page/biz-form.html";
				}
			}else{
				url="/flow/form/s/page/custm-form.html";
			}
			if(StringUtils.isNotBlank(bizId) && !"0".equals(bizId)){
				url= changeParam(url,"bizId",bizId);
			}
			if(StringUtils.isNotBlank(modelId) && !"0".equals(modelId)){
				url=changeParam(url,"modelKey",modelId);
				url=changeParam(url,"bizFormSn",modelId);
			}
			if(StringUtils.isNotBlank(taskId)&& !"0".equals(taskId)){
				url=changeParam(url,"taskId",taskId);
			}
			if(StringUtils.isNotBlank(instId)&& !"0".equals(instId)){
				url=changeParam(url,"processInstId",instId);
			}
			if(StringUtils.isNotBlank(expType)){
				url=changeParam(url,"formType",expType);
			}
			formInfo.put("formUrl",errorFlag?"/error404.jhtml":url);
		}catch (Exception e){
			e.printStackTrace();
			logger.error("获取iframe连接 ApiProcessController-getFromUrl"+e);
		}
		return formInfo;
	}
	/**
	 * 获取表单信息
	 * @param instId
	 * @param bizId
	 * @param taskId
	 * @param request
	 * @param response
	 * @return
	 */
	@ApiOperation("获取表单信息")
	@ApiImplicitParams({
			@ApiImplicitParam(value="流程实例id",name="instId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="业务表单id",name="bizId",dataType = "String",paramType = "query"),
			@ApiImplicitParam(value="任务id",name="taskId",dataType = "String",paramType = "query")
	})
	@RequestMapping(value = "/getFormInfo",method = RequestMethod.GET)
	public Map<String,Object> getFormInfo( String instId, String bizId, String taskId, HttpServletRequest request, HttpServletResponse response) {
		Map<String,Object> formInfo=new HashMap<String,Object>();
		long beginTime=System.currentTimeMillis();
		try{
			UserSessionInfo user=getLoginUser(request,response);
			ActReProcdefExtendVo actReProcdefExtendVo=new ActReProcdefExtendVo();
			if(user!=null && StringUtils.isNotBlank(user.getNo())){
				if(!"0".equals(instId) || !"0".equals(bizId)){
					String senderNo = "";
					if(!"0".equals(instId)){
						senderNo=this.getSenderNo(instId,bizId);
						//1、表单基本信息
						ReturnVo<ActReProcdefExtendVo> rVo = flowApi.getPInfoByPId(instId);
						if(FlowConstant.SUCCESS.equals(rVo.getCode())){
							actReProcdefExtendVo = rVo.getData();
							actReProcdefExtendVo.setProcessInstanceId(instId);
						}else{
							logger.error("调用 OA 【oaApi.getPInfoByPId()】 接口异常！" + rVo.getMsg());
						}
						String approveType=actReProcdefExtendVo.getTaskType();
						//获取节点类型
						if(!"0".equals(taskId)){
							String nodeType=flowApi.getNodeType(taskId);
							if(StringUtils.isNotBlank(nodeType)){
								approveType=nodeType;
							}else{
								approveType="ZC";
							}
						}
						formInfo.put("taskType",actReProcdefExtendVo.getTaskType());
						formInfo.put("approveType",approveType);
						String nodeType = "";
						formInfo.put("revokable",false);
						if((user.getNo().equals(senderNo)) && (null==actReProcdefExtendVo.getEndTime())){
							//发起人是当前登录人并且尚未结束的时候可以撤回
							formInfo.put("revokable",true);
						}
						if(StringUtils.isNotBlank(actReProcdefExtendVo.getTaskId())){
							ReturnVo<ActivityVo> vo = flowApi.getNodeInfoByTaskId(actReProcdefExtendVo.getTaskId());
							if(FlowConstant.SUCCESS.equals(vo.getCode()) && "提交人".equals(vo.getData().getName())){
								//如果当前节点是提交人不能撤回
								formInfo.put("revokable",false);
								formInfo.put("nodeName","提交人");
							}
						}
						//4、审批记录
						this.approvalHistoryMsg(formInfo,instId);
					}
					//2、附件
					WfAttachment attachment = new WfAttachment();
					attachment.setCreator(senderNo);
					attachment.setSourceId(bizId);
					attachment.setType(AttachmentType.ZBD.getType());
					List<WfAttachment> attachments=this.getAllAttachment(attachment);
					formInfo.put("files",attachments);
					//3、关联流程
					RelateFlow formRelateFlow=new RelateFlow();
					formRelateFlow.setBusinessKey(bizId);
					List<RelateFlow> refDocs= getAllRefProcess(formRelateFlow);
					formInfo.put("refDocs",refDocs);
					//5、附言
					WfPostscript wfPostscript =new WfPostscript();
					//				wfPostscript.setCreator(senderNo);
					wfPostscript.setProcFormId(bizId);
					List<Map<String,Object>> postscripts= getAttachMsg(wfPostscript);
					formInfo.put("postscripts",postscripts);
				}

			}
		}catch (Exception e){
			e.printStackTrace();
			logger.error("获取表单信息出错 ApiProcessController-getFormInfo"+e);
		}

		return formInfo;
	}
	/**
	 * 添加附言数据
	 * @return
	 * @Description:
	 */
	@ApiOperation("添加附言数据")
	@ApiImplicitParams({
			@ApiImplicitParam(value="附言内容",name="attachMsg",dataType="String",paramType="query"),
			@ApiImplicitParam(value="附言添加的附件",name="attachMsgAttAdd",dataType="String",paramType="query"),
			@ApiImplicitParam(value="附言内容删除的附件",name="attachMsgAttDel",dataType="String",paramType="query")
	})
	@RequestMapping(value = "/insertAttachMsg",method = RequestMethod.POST)
	public ReturnVo<List<Map<String,Object>>> insertAttachMsg(HttpServletRequest request, HttpServletResponse response,
								  @RequestBody @ApiParam(value = "流程参数对象") ProcessMainVo processMainVo, String attachMsg, String attachMsgAttAdd, String attachMsgAttDel) {
		ReturnVo<List<Map<String,Object>>> returnVo = new ReturnVo<List<Map<String,Object>>>(ReturnCode.FAIL, "保存失败");
		WfPostscript wfPostscript = new WfPostscript();
		UserSessionInfo loginUser = this.getLoginUser(request, response);
		if(StringUtils.isNotBlank(attachMsg)){
			if(StringUtils.isNotBlank(processMainVo.getBizId()) || StringUtils.isNotBlank(processMainVo.getProcessInstId())){
				wfPostscript.setProcFormId(processMainVo.getBizId());
				wfPostscript.setProcInstId(processMainVo.getProcessInstId());
				wfPostscript.setCreator(loginUser.getNo());
				wfPostscript.setMassage(CommUtil.decodeString(attachMsg,"UTF-8"));
				try {
					ReturnVo<String> rVo = flowApi.addWfPostscript(wfPostscript);
					if(FlowConstant.SUCCESS.equals(rVo.getCode())){
						// 添加附件
						processMainComponent.formAttOpt(CommUtil.decodeString(attachMsgAttAdd,"UTF-8"), attachMsgAttDel, loginUser.getNo(), rVo.getData());
						WfPostscript wfPostscript2 =new WfPostscript();
//						wfPostscript2.setCreator(processMainVo.getSenderNo());
						wfPostscript2.setProcFormId(processMainVo.getBizId());
						returnVo.setData(this.getAttachMsg(wfPostscript2));
						returnVo.setCode(ReturnCode.SUCCESS);
						returnVo.setMsg(rVo.getMsg());
					}else{
						logger.error("调用添加附言接口异常！" + rVo.getMsg());
					}
				} catch (Exception e) {
					logger.error("调用添加附言接口异常！" + e);
					e.printStackTrace();
				}
			}
		}else{
			returnVo.setMsg("附言不能为空！");
		}
		return returnVo;
	}
	/**
	 *
	 * @param request
	 * @return
	 * @Description:审批，暂存，协同，评审都用此方法
	 */
	@ApiOperation("审批，暂存，协同，评审都用此方法")
	@RequestMapping(value = "/saveSp",method = RequestMethod.POST)
	public ReturnVo<String> option(@RequestBody @ApiParam("任务API对象")CompleteTaskApiVo params, HttpServletRequest request, HttpServletResponse response) {
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "操作失败");
		UserSessionInfo user=getLoginUser(request,response);
		try {
			if(StringUtils.isNotBlank(params.getTaskId())){
				params.setMessage(CommUtil.decodeString(params.getMessage(),"UTF-8"));
				if(CommentTypeEnum.ZC.equals(params.getType())){
					params.setUserCode(user.getNo());
					ReturnVo<String> claimVo=flowApi.claim(params);
					if(FlowConstant.SUCCESS.equals(claimVo.getCode())){
						returnVo.setMsg(claimVo.getMsg());
						returnVo.setCode(ReturnCode.SUCCESS);
					}else {
						returnVo.setMsg(claimVo.getMsg());
					}
				}else if(CommentTypeEnum.BH.equals(params.getType())){
					BackApiVo backVo=new BackApiVo();
					backVo.setUserCode(user.getNo());
					backVo.setTaskId(params.getTaskId());
					backVo.setProcessInstanceId(params.getProcessInstanceId());
					ReturnVo<ActReProcdefExtendVo> vo = flowApi.getPInfoByPId(params.getProcessInstanceId());
					backVo.setMessage(params.getMessage());
					if(vo.getData()!=null ){
						backVo.setMessage("【驳回到提交人"+ vo.getData().getStartUserName()+" 】"+params.getMessage());
					}
					boolean flag=flowApi.backToStepByProcessInstanceId(backVo);
					if(flag){
						returnVo.setCode(ReturnCode.SUCCESS);
						returnVo.setMsg("操作成功");
					}else{
						returnVo.setMsg("此节点不许与驳回！");
					}
				}else if(CommentTypeEnum.SP.equals(params.getType())
						||CommentTypeEnum.PS.equals(params.getType())
						||CommentTypeEnum.XT.equals(params.getType())){
					params.setUserCode(user.getNo());
					flowApi.completeTask(params);
					returnVo.setCode(ReturnCode.SUCCESS);
					returnVo.setMsg("保存成功");
				}
			}else{
				returnVo.setMsg("任务id不能为空！");
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("ApplyController-update:"+e);
		}
		return returnVo;
	}
	/**
	 *
	 * @param request
	 * @return
	 * @Description:转办
	 */
	@ApiOperation("转办")
	@RequestMapping(value = "/turnDo",method = RequestMethod.POST)
	public ReturnVo<String> turnDo(@RequestBody TurnDoVo turnDoVo, HttpServletRequest request, HttpServletResponse response) {
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "流程转办失败");
		UserSessionInfo user=getLoginUser(request,response);
		try {
			if(user!=null && StringUtils.isNotBlank(user.getNo())){
				TurnTaskApiVo turnTaskVo=new TurnTaskApiVo();
				turnTaskVo.setTaskId(turnDoVo.getTaskId());
				turnTaskVo.setTurnToUserId(turnDoVo.getUserId());
				turnTaskVo.setTurnUserId(user.getNo());
				StringBuffer stringBuffer=new StringBuffer("");
				if(StringUtils.isNotBlank(turnDoVo.getUserName())){
					stringBuffer.append("【"+user.getName()+"转办给"+turnDoVo.getUserName()+"】");
					if(StringUtils.isNotBlank(turnDoVo.getMessage())){
						stringBuffer.append("<br>"+CommUtil.decodeString(turnDoVo.getMessage(),"UTF-8"));
					}
				}
				turnTaskVo.setMessage(stringBuffer.toString());
				ReturnVo<String> vo=flowApi.turnTask(turnTaskVo);
				if(FlowConstant.SUCCESS.equals(vo.getCode())){
					returnVo.setCode(ReturnCode.SUCCESS);
					returnVo.setMsg("转办成功");
				}else{
					returnVo.setMsg(vo.getMsg());
				}
			}
		} catch (Exception e) {
			logger.error("ApplyController-update:"+e);
			e.printStackTrace();
		}
		return returnVo;
	}
	/**
	 *
	 * @param request
	 * @return
	 * @Description:加签
	 */
	@ApiOperation("加签")
	@RequestMapping(value = "/addSign",method = RequestMethod.POST)
	public ReturnVo<String> addSign(@RequestBody TurnReadVo addSignVo,HttpServletRequest request, HttpServletResponse response) {
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "操作失败");
		UserSessionInfo user=getLoginUser(request,response);
		try {
			if(StringUtils.isNotBlank(addSignVo.getUserCodes()) && StringUtils.isNotBlank(user.getNo())){
				String[] userNoArray=addSignVo.getUserCodes().split(",");
				SignApiVo signVo=new SignApiVo();
				signVo.setSignPersoneds(Arrays.asList(userNoArray));
				signVo.setTaskId(addSignVo.getTaskId());
				signVo.setSignPerson(user.getNo());
				StringBuffer stringBuffer=new StringBuffer("");
				if(StringUtils.isNotBlank(addSignVo.getUserNames())){
					stringBuffer.append("【"+user.getName()+"审批并加签给"+CommUtil.decodeString(addSignVo.getUserNames(),"UTF-8")+"】");
					if(StringUtils.isNotBlank(addSignVo.getMessage())){
						stringBuffer.append("<br>"+CommUtil.decodeString(addSignVo.getMessage(),"UTF-8"));
					}
				}
				signVo.setMessage(stringBuffer.toString());
				ReturnVo<String> vo=flowApi.addSign(signVo);
				if(FlowConstant.SUCCESS.equals(vo.getCode())){
					returnVo.setMsg(vo.getMsg());
					returnVo.setCode(ReturnCode.SUCCESS);
				}else{
					returnVo.setMsg(vo.getMsg());
				}
			}
		} catch (Exception e) {
			logger.error("加签操作异常！ ApplyController-addSign:"+e);
			e.printStackTrace();
		}
		return returnVo;
	}

	/**
	 *
	 * @param request
	 * @return
	 * @Description:转阅
	 */
	@ApiOperation("转阅")
	@RequestMapping(value = "/turnRead",method = RequestMethod.POST)
	public ReturnVo<String> turnRead(@RequestBody TurnReadVo param , HttpServletRequest request, HttpServletResponse response) {
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "操作失败");
		UserSessionInfo user=getLoginUser(request,response);
		try {
			if(StringUtils.isNotBlank(param.getUserCodes()) && StringUtils.isNotBlank(user.getNo())){
				String userCodes = CommUtil.decodeString(param.getUserCodes(),"UTF-8");
				String[] userNoArray=userCodes.split(",");
				ReviewTaskVo vo=new ReviewTaskVo();
				vo.setReviewToUserIds(Arrays.asList(userNoArray));
				vo.setReviewUserId(user.getNo());
				vo.setProcessInstanceId(param.getProcessInstId());
				if(StringUtils.isNotBlank(param.getUserNames())){
					vo.setMessage("【"+user.getName()+"转阅给"+CommUtil.decodeString(param.getUserNames(),"UTF-8")+"】</br>"+CommUtil.decodeString(param.getMessage(),"UTF-8"));
				}else{
					vo.setMessage(CommUtil.decodeString(param.getMessage(),"UTF-8"));
				}
				flowApi.reviewTask(vo);
				returnVo.setCode(ReturnCode.SUCCESS);
				returnVo.setMsg("操作成功");
			}
		} catch (Exception e) {
			logger.error("转阅异常！ApplyController-turnRead:"+e);
			e.printStackTrace();
		}
		return returnVo;
	}
	/**
	 *
	 * @param request
	 * @param response
	 * @param taskId
	 * @return
	 * @Description:根据任务id获取任务
	 */
	@ApiOperation("根据任务id获取任务信息")
	@ApiImplicitParams({
			@ApiImplicitParam(value="任务id",name="taskId",dataType = "String",paramType = "query")
	})
	@RequestMapping(value = "/getProcessFormState",method = RequestMethod.GET)
	public String getProcessFormState(HttpServletRequest request, HttpServletResponse response,String taskId){
		ReturnVo<SearchTaskVo> vo=new ReturnVo<SearchTaskVo>(FlowConstant.ERROR,"查询失败");
		try{
			vo = this.flowApi.getSearchTaskVoById(taskId);
		}catch(Exception e){
			e.printStackTrace();
			logger.error("ApplyController-getProcessFormState:"+e);
		}
		return JsonUtils.toJson(vo.getData());
	}
	/**
	 * 撤销操作
	 * @param request
	 * @return
	 * @Description:撤销
	 */
	@ApiOperation("撤销")
	@RequestMapping(value = "/revoke",method = RequestMethod.POST)
	public String revoke(@RequestBody RevokeVo revokeVo,HttpServletRequest request, HttpServletResponse response) {
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "操作失败");
		UserSessionInfo user=getLoginUser(request,response);
		try {
			if(user!=null && StringUtils.isNotBlank(user.getNo())){
				returnVo=processMainComponent.revoke(user.getNo(),revokeVo.getProcessInstId(),CommUtil.decodeString(revokeVo.getMessage(),"UTF-8"));
			}
		} catch (Exception e) {
			logger.error("撤回操作异常！ApplyController-revoke:"+e);
			e.printStackTrace();
		}
		return JsonUtils.toJson(returnVo);
	}
	/**
	 * 驳回到任意节点
	 * @param request
	 * @param response
	 * @return
	 */
	@ApiOperation("驳回到任意节点")
	@RequestMapping(value = "/backToAnyStep",method = RequestMethod.POST)
	public ReturnVo<String> backToAnyStep(@RequestBody @ApiParam("撤回的对象") RevokeVo revokeVo, HttpServletRequest request, HttpServletResponse response) {
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "操作失败");
		UserSessionInfo user=getLoginUser(request,response);
		try {
			if(user!=null && StringUtils.isNotBlank(user.getNo())){
				revokeVo.setMessage(CommUtil.decodeString(revokeVo.getMessage(),"UTF-8"));
				revokeVo.setUserNo(user.getNo());
				revokeVo.setActivityName(CommUtil.decodeString(revokeVo.getActivityName(),"UTF-8"));
				revokeVo.setAssigneeName(CommUtil.decodeString(revokeVo.getAssigneeName(),"UTF-8"));
				returnVo=processMainComponent.backToAnyStep(revokeVo);
			}
		} catch (Exception e) {
			logger.error("撤回操作异常！ApplyController-revoke:"+e);
			e.printStackTrace();
		}
		return returnVo;
	}
	/**
	 * 表单提交，保存待发。
	 * @param request
	 * @param response
	 * @return
	 */
	@ApiOperation("表单提交，保存待发。")
	@RequestMapping(value = "/submit",method = RequestMethod.POST)
	public ReturnVo<String> submit(HttpServletRequest request, HttpServletResponse response, @RequestBody ProcessSubmitVo processSubmitVo){
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "保存失败!");
		UserSessionInfo loginUser = getLoginUser(request, response);
		try {
			String attachMsg=CommUtil.decodeString(processSubmitVo.getAttachMsg(),"UTF-8");
			if(StringUtils.isNotBlank(processSubmitVo.getBizId())){
				// 如果有附言数据则保存附言
				if(StringUtils.isNotBlank(attachMsg) || (StringUtils.isNotBlank(processSubmitVo.getAttachMsgAttAdd()) && (processSubmitVo.getAttachMsgAttAdd().length()>10))){
					// 防止内容为时添加失败的情况
					if(StringUtils.isBlank(attachMsg)) {
						attachMsg="无";
					}
					ReturnVo<String> rtVo = saveAttachMsg(attachMsg, processSubmitVo.getBizId(),processSubmitVo.getProcessInstId(),loginUser.getNo());
					if(FlowConstant.SUCCESS.equals(rtVo.getCode())) {
						// 保存附言中的附件
						this.processMainComponent.formAttOpt(CommUtil.decodeString(processSubmitVo.getAttachMsgAttAdd(),"UTF-8"), processSubmitVo.getAttachMsgAttDel(), loginUser.getNo(), rtVo.getData());
					}
				}
				processMainComponent.formAttOpt(CommUtil.decodeString(processSubmitVo.getHeadAttAdd(),"UTF-8"), CommUtil.decodeString(processSubmitVo.getHeadAttDel(),"UTF-8"), loginUser.getNo(), processSubmitVo.getBizId());
				processMainComponent.formRefOpt(CommUtil.decodeString(processSubmitVo.getHeadRefAdd(),"UTF-8"), CommUtil.decodeString(processSubmitVo.getHeadRefDel(),"UTF-8"), loginUser.getNo(), processSubmitVo.getBizId());
				returnVo = new ReturnVo<String>(ReturnCode.SUCCESS, "保存成功!");
			}else{
				logger.error("发起流程失败！ApiProcessController-submit");
			}
		} catch (Exception e) {
			logger.error("调用接口【oaApi.addFormDes(args)】异常！" + e);
			returnVo.setMsg("调用接口异常！");
			e.printStackTrace();
		}
		return returnVo;
	}

	/**
	 * 保存附言数据
	 * @param attachMsg
	 * @Description:
	 * @author xietongjian 2017 下午6:18:27
	 * @return
	 */
	private ReturnVo<String> saveAttachMsg(String attachMsg, String bizId,String processInstId,String userNo){
		// 获取附言数据，如果不为空则添加附言
		WfPostscript wfPostscript = new WfPostscript();
		wfPostscript.setMassage(attachMsg);
		wfPostscript.setProcFormId(bizId);
		wfPostscript.setCreator(userNo);
		wfPostscript.setProcInstId(processInstId);
		return this.flowApi.addWfPostscript(wfPostscript);
	}

	/**
	 *
	 * @param request
	 * @return
	 * @Description:转阅知会操作
	 */
	@ApiOperation("转阅知会进入页面时进行的审批操作")
	@RequestMapping(value = "/doZYZH",method = RequestMethod.POST)
	public ReturnVo<String> doZYZH(@RequestBody @ApiParam("结束任务的对象") CompleteTaskApiVo params,HttpServletRequest request, HttpServletResponse response) {
		ReturnVo<String> returnVo = new ReturnVo<String>(FlowConstant.ERROR, "操作失败");
		UserSessionInfo user=getLoginUser(request,response);
		try {
			if(StringUtils.isNotBlank(params.getTaskId())){
				params.setUserCode(user.getNo());
				params.setType(CommentTypeEnum.YY);
				flowApi.completeTask(params);
				returnVo = new ReturnVo<String>(FlowConstant.SUCCESS, "操作成功");
			}else{
				returnVo.setMsg("任务id不能为空！");;
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("ApplyController-doZYZH:"+e);
		}
		return returnVo;
	}


	/**
	 *
	 * @param request
	 * @return
	 * @Description:终止
	 */
	@ApiOperation("终止")
	@RequestMapping(value = "/stopProcess",method = RequestMethod.POST)
	public ReturnVo<String> stopProcess(@RequestBody @ApiParam("流程终止对象") EndApiVo vo,HttpServletRequest request, HttpServletResponse response) {
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "操作失败");
		UserSessionInfo user=getLoginUser(request,response);
		try {
			if(user!=null && StringUtils.isNotBlank(user.getNo())){
				vo.setMessage(ProcessStatusEnum.ZZ.getMsg());
				vo.setUserCode(user.getNo());
				ReturnVo<String> rvo=flowApi.stopProcess(vo);
				if(FlowConstant.SUCCESS.equals(rvo.getCode())){

				}
			}
		} catch (Exception e) {
			logger.error("回退到起点异常！ApplyController-stopProcess:"+e);
			e.printStackTrace();
		}
		return returnVo;
	}
	/**
	 *  获取审批节点列表
	 * @param taskId
	 * @param request
	 * @param response
	 * @return
	 */
	@ApiOperation("获取审批节点列表分页查询")
	@ApiImplicitParams({
			@ApiImplicitParam(value="第几页",name="page",dataType="String",paramType="query"),
			@ApiImplicitParam(value="一页多少行",name="rows",dataType="String",paramType="query"),
			@ApiImplicitParam(value="任务id",name="taskId",dataType="String",paramType="query")
	})
	@RequestMapping(value = "/getBackNodes",method = RequestMethod.GET)
	public Map<String, Object> getBackNodes( String page, Integer rows, String taskId, HttpServletRequest request, HttpServletResponse response) {
		Map<String,Object> formInfo=new HashMap<String,Object>();
		Map<String, Object> maps = new HashMap<>();
		Query query=new Query();
		if(StringUtils.isNotBlank(page)){
			query.setPageIndex(Integer.valueOf(page));
			query.setPageSize(rows);
		}
		try{
			ReturnVo<FlowNodeVo> vo =flowApi.findBackNodesByTaskId(taskId);
			List<FlowNodeVo> list =new ArrayList<>();
			if(FlowConstant.SUCCESS.equals(vo.getCode())){
				list=vo.getDatas();
			}
			formInfo.put("BackNodes",list);
			maps.put("list",list);
			Map<String, Object> pageMap = new HashMap<>();
			pageMap.put("current", query.getPageIndex()-1);
			pageMap.put("pageSize", query.getPageSize());
			pageMap.put("total", CollectionUtils.isNotEmpty(list)?list.size():0);
			maps.put("pagination", pageMap);
		}catch (Exception e){
			e.printStackTrace();
		}
		return maps;
	}

	/**
	 * 获取发起者工号
	 * @param instId
	 * @param bizId
	 * @return
	 */
	private String getSenderNo(String instId,String bizId){
		String senderNo="";
		ReturnVo<String> rVo = flowApi.getFlowStartUserNo(instId, bizId);
		if(FlowConstant.SUCCESS.equals(rVo.getCode())){
			senderNo= rVo.getData();
		}else{
			logger.error("调用OA接口【oaApi.getFlowStartUserNo(String, String)】出错!" + rVo.getMsg());
		}
		return senderNo;
	}
	/**
	 * 获取附言信息
	 * @param wfPostscript
	 * @return
	 */
	private List<Map<String,Object>> getAttachMsg(WfPostscript wfPostscript){
		List<Map<String,Object>> attachMsgs=new ArrayList<Map<String,Object>>();
		ReturnVo<List<WfPostscript>> rVo = flowApi.getWfPostscriptList(wfPostscript);
		if(FlowConstant.SUCCESS.equals(rVo.getCode()) && null != rVo.getData()){
			for (WfPostscript wfPostscript2: rVo.getData()) {
				Map<String,Object> wfPostscriptMap=new HashMap<String,Object>();
				wfPostscriptMap.put("id",wfPostscript2.getId());
				wfPostscriptMap.put("content",CommUtil.text2Html(wfPostscript2.getMassage()));
				wfPostscriptMap.put("createTime",wfPostscript2.getCreateTime());
				WfAttachment attachment = new WfAttachment();
				attachment.setCreator(wfPostscript.getCreator());
				attachment.setSourceId(wfPostscript2.getId());
				attachment.setType(AttachmentType.FY.getType());
				List<WfAttachment> attachments=this.getAllAttachment(attachment);
				wfPostscriptMap.put("files",attachments);
				attachMsgs.add(wfPostscriptMap);
			}
		}else{
			logger.error("调用查询附言接口异常！" + rVo.getMsg());
		}
		return attachMsgs;
	}
	/**
	 * 获取附件数据
	 * @param attachment
	 * @return
	 */
	private List<WfAttachment> getAllAttachment(WfAttachment attachment){
		List<WfAttachment> rVo = new ArrayList<WfAttachment>();
		try {
			if(StringUtils.isNotBlank(attachment.getSourceId())){
				rVo = this.flowApi.getAttachmentVo(attachment);
			}
		} catch (Exception e) {
			logger.error("查询数据异常！");
		}

		return rVo;
	}

	/**
	 * 获取关联流程，文档数据
	 * @param formRelateFlow
	 * @return
	 */
	private List<RelateFlow> getAllRefProcess(RelateFlow formRelateFlow){
		List<RelateFlow> list = new ArrayList<RelateFlow>();
		ReturnVo<RelateFlow> rVo = new ReturnVo<RelateFlow>();
		try {
			if(StringUtils.isNotBlank(formRelateFlow.getBusinessKey())){
				rVo = flowApi.getAllFormRelateFlowInfo(formRelateFlow);
				if (rVo!=null && FlowConstant.SUCCESS.equals(rVo.getCode())){
					list=rVo.getDatas();
				}
			}
		} catch (Exception e) {
			logger.error("调用接口失败-oaApi.getAllFormRelateFlowInfo");
		}
		return list;
	}
	/**
	 * 获取审批记录
	 * @param model
	 * @param instId
	 */
	private void approvalHistoryMsg(Map<String,Object> model,String instId) {
		List<FlowCommentVo> comments=new ArrayList<FlowCommentVo>();
		List<FlowCommentVo> readRecords=new ArrayList<FlowCommentVo>();
		List<FlowCommentVo> approveRecords=new ArrayList<FlowCommentVo>();
		FlowCommentVo flowEnd=new FlowCommentVo();
		boolean endFlag=false;
		try {
			comments = flowApi.getCommentsByProcessInstanceId(instId);
			List<String> userNos = new ArrayList<String>();
			for (FlowCommentVo commentVo : comments) {
				if(StringUtils.isNotBlank(commentVo.getUserId())){
					userNos.add(commentVo.getUserId());
				}
			}
			Map<String, PersonnelApiVo> pMap = getPersonnelVoMapByNos(userNos);
			for (FlowCommentVo commentVo : comments) {
				if(StringUtils.isNotBlank(commentVo.getUserId())){
					PersonnelApiVo pVo = pMap.get(commentVo.getUserId());
					if(null != pVo){
						commentVo.setUserName(pVo.getName());
					}
				}
				if(CommentTypeEnum.SPJS.getName().equals(commentVo.getTypeName())){
					flowEnd=commentVo;
				}else if(CommentTypeEnum.ZY.getName().equals(commentVo.getTypeName())||CommentTypeEnum.YY.getName().equals(commentVo.getTypeName())){
					commentVo.setMessage(CommUtil.text2Html(commentVo.getFullMsg()));
					readRecords.add(commentVo);
				}else{
					commentVo.setMessage(CommUtil.text2Html(commentVo.getFullMsg()));
					approveRecords.add(commentVo);
					endFlag=endFlag||(CommentTypeEnum.LCZZ.getName().equals(commentVo.getTypeName()));
				}
			}
			if(endFlag){
				flowEnd.setTypeName(CommentTypeEnum.LCZZ.getName());
				flowEnd.setType(CommentTypeEnum.LCZZ.toString());
			}
		} catch (Exception e) {
			logger.error("调用查询审批记录的接口异常！"+e);
			e.printStackTrace();
		}

		model.put("approveRecords", approveRecords);
		model.put("transferRecords", readRecords);
		model.put("flowEnd", flowEnd);
	}
	/**
	 * 获取流程图图片流
	 * @param processInstId
	 * @param processDefineId
	 * @param response
	 * @Description:
	 * @author xietongjian 2017 下午11:21:24
	 */
	@ApiOperation("获取流程图图片流")
	@ApiImplicitParams({
			@ApiImplicitParam(value="流程实例id",name="processInstId",dataType="String",paramType="query"),
			@ApiImplicitParam(value="流程定义id",name="processDefineId",dataType="String",paramType="query")
	})
	@RequestMapping(value = "/generateDiagramImg",method = RequestMethod.GET)
	public void generateDiagramImg(String processInstId, String processDefineId ,@Ignore HttpServletResponse response){
		try {
			// 如果有流程实例，则通过流程实例ID查询流程图片
			if(StringUtils.isNotBlank(processInstId)){
				com.dragon.tools.vo.ReturnVo<byte[]> vo= flowApi.generateDiagram(processInstId);
				if(FlowConstant.SUCCESS.equals(vo.getCode())){
					byte[] b=vo.getData();
					response.getOutputStream().write(b, 0, b.length);
				}
			}else{
				byte[] b= flowApi.generateDiagramByProcessDefinitionId(processDefineId);
				response.getOutputStream().write(b, 0, b.length);
			}
		} catch (IOException e) {
			e.printStackTrace();
			logger.error("流转换异常！");
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("获取流程图的图片流异常！" + e.getMessage());
		}
	}
	/**
	 * 加载流程图上的审批人节点数据
	 * @param processInstId
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午11:37:17
	 */
	@ApiOperation("加载流程图上的审批人节点数据")
	@ApiImplicitParams(
			@ApiImplicitParam(value="流程实例id",name="processInstId",dataType="String",paramType="query")
	)
	@RequestMapping(value = "/loadDiagramData",method = RequestMethod.GET)
	public List<ActivityVo> loadDiagramData(String processInstId){
		List<ActivityVo> nodes = null;
		try {
			if(StringUtils.isNotBlank(processInstId)){
				nodes = flowApi.getProcessActivityVos(processInstId);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return nodes;
	}
	/**
	 * 封装人员主数据列表
	 * @param nos
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午3:11:07
	 */
	private Map<String, PersonnelApiVo> getPersonnelVoMapByNos(List<String> nos){
		Map<String, PersonnelApiVo> pMap = new HashMap<String, PersonnelApiVo>();

		try {
			com.ys.tools.vo.ReturnVo<PersonnelApiVo> pvo = personnelApi.getPersonnelApiVoByNos(nos);
			if(pvo.getCode()== UcenterConstant.SUCCESS && org.apache.commons.collections.CollectionUtils.isNotEmpty(pvo.getDatas())){
				for(PersonnelApiVo vo : pvo.getDatas()){
					pMap.put(vo.getNo(), vo);
				}
			}
		} catch (Exception e) {
			logger.error("调用人员主数据接口【personnelApi.getPersonnelApiVoByNos(nos)】异常！" + e);
			e.printStackTrace();
		}
		return pMap;
	}
	/**
	 *
	 * @param url
	 * @param name
	 * @param value
	 * @return 更改URL的参数
	 */
	@ApiIgnore
	private String changeParam (String url, String name,String value) {
		String reg = "(^|\\?|&)("+name+"=.*)(&|$)";
		Pattern pattern=Pattern.compile(reg);
		Matcher matcher=pattern.matcher(url);
		String tmp = name + "=" + value;
		if (matcher.find()) {
			url = url.replace(matcher.group(2), tmp);
		} else {
			if (url.indexOf("?")>-1) {
				url = url + "&" + tmp;
			} else {
				url = url + "?" + tmp;
			}
		}
		return url;
	}
	/**
	 * 获取流程提交人信息
	 * @param model
	 * @param instId
	 */
	@ApiIgnore
	private void getUserInfo(Map<String,Object> model,String instId) {
		try{
			Map<String,Object> userInfo = new HashMap<String,Object>();

			List<FlowCommentVo> comments=new ArrayList<FlowCommentVo>();
			comments = flowApi.getCommentsByProcessInstanceId(instId);
			//根据流程实列查询流程实列和流程定义信息
			ReturnVo<ActReProcdefExtendVo> rVo = flowApi.getPInfoByPId(instId);
			List<String> userNos = new ArrayList<String>();

			if(null!=comments &&comments.size()>0){
				com.ys.tools.vo.ReturnVo<PersonnelApiVo> pvo=this.personnelApi.getPersonnelApiVoByNo(comments.get(0).getUserId());
				if(pvo.getCode()== UcenterConstant.SUCCESS){
					PersonnelApiVo user=pvo.getData();
					userInfo.put("name",user.getName());
					userInfo.put("mobilePhone",user.getMobilePhone());
					userInfo.put("postname",user.getPostname());
					userInfo.put("companyName",user.getCompanyName());
					userInfo.put("deptName",user.getDeptName());
				}
				String stateTime = "";
				if(null!=rVo.getData()&&null!=rVo.getData().getStartTime()){
					stateTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(rVo.getData().getStartTime());
				}
				userInfo.put("startTime",stateTime);
			}

			model.put("userInfo",userInfo);
		}catch (Exception e){
			e.printStackTrace();
			logger.error("查询提交人信息出错ApiProcessController-getUserInfo"+e);
		}
	}

}

	