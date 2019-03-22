package com.dragon.portal.component.impl;

import com.alibaba.fastjson.JSONObject;
import com.dragon.flow.api.IFlowApi;
import com.dragon.flow.constant.FlowConstant;
import com.dragon.flow.model.attach.WfAttachment;
import com.dragon.flow.model.extend.RelateFlow;
import com.dragon.flow.vo.flowable.ActivityEditVo;
import com.dragon.flow.vo.flowable.api.BackApiVo;
import com.dragon.flow.vo.flowable.api.RevokeApiVo;
import com.dragon.portal.vo.process.RevokeVo;
import com.dragon.portal.component.IProcessMainComponent;
import com.dragon.portal.vo.process.ProcessMainVo;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.sun.tools.javac.comp.Flow;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;
@Component
public class ProcessMainComponentImpl implements IProcessMainComponent {

	private static Logger logger = Logger.getLogger(ProcessMainComponentImpl.class);
	
	@Resource
	private IFlowApi flowApi;
	

	@Override
	public ProcessMainVo setProcessSenderNo(ProcessMainVo processMainVo, UserSessionInfo loginUser) {
		// 设置当前登录用户工号
		processMainVo.setCurrUserNo(loginUser.getNo());
		processMainVo.setCurrDateTime(new Date());
		if(StringUtils.isNotBlank(processMainVo.getBizId()) || StringUtils.isNotBlank(processMainVo.getProcessInstId())){
			try {
				ReturnVo<String> rVo = flowApi.getFlowStartUserNo(processMainVo.getProcessInstId(), processMainVo.getBizId());
				if(FlowConstant.SUCCESS.equals(rVo.getCode())){
					// 设置流程的发起者工号
					processMainVo.setSenderNo(rVo.getData());
				}else{
					logger.error("调用OA接口【oaApi.getFlowStartUserNo(String, String)】出错!" + rVo.getMsg());
				}
			} catch (Exception e) {
				e.printStackTrace();
				logger.error("调用OA接口【oaApi.getFlowStartUserNo(String, String)】异常!" + e);
			}
		}
		return processMainVo;
	}


	@Override
	public ReturnVo<String> formAttOpt(String headAttAdd, String headAttDel, String no, String bizId) {
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "保存附件失败！");
		try {
			//判断有没有附件
			if(StringUtils.isNotBlank(headAttAdd)){
				List<WfAttachment> parseArray = JSONObject.parseArray(headAttAdd, WfAttachment.class);
				if(CollectionUtils.isNotEmpty(parseArray)) {
					for(WfAttachment temp : parseArray){
						temp.setSourceId(bizId);
						temp.setCreator(no);
					}
					flowApi.addAttachmentList(parseArray);
				}
			}
			//判断是有删除附件
			if(StringUtils.isNotBlank(headAttDel)){
				List<String> parseArray = JSONObject.parseArray(headAttDel, String.class);
				if(CollectionUtils.isNotEmpty(parseArray)) {
					flowApi.delAttachmentList(parseArray);
				}
			}
			returnVo.setCode(ReturnCode.SUCCESS);
		} catch (Exception e) {
			returnVo.setMsg("附件添加或删除异常！" + e);
			e.printStackTrace();
		}
		return returnVo;
	}
	
	@Override
	public ReturnVo<String> formRefOpt(String headRefAdd, String headRefDel, String no, String bizId) {
		ReturnVo<String> returnVo = new ReturnVo<String>(ReturnCode.FAIL, "保存附件失败！");
		try {
			//判断有没有关联的流程数据
			if(StringUtils.isNotBlank(headRefAdd)){
				List<RelateFlow> parseArray = JSONObject.parseArray(headRefAdd, RelateFlow.class);
				if(CollectionUtils.isNotEmpty(parseArray)) {
					for(RelateFlow temp : parseArray){
						temp.setBusinessKey(bizId);
					}
					ReturnVo<String> rvo = flowApi.addFormRelateFlowInfo(parseArray);
					if(!FlowConstant.SUCCESS.equals(rvo.getCode())) {
						logger.error("添加流程关联失败！" + rvo.getMsg());
					}
				}
			}
			//判断是有删除的关联流程数据
			if(StringUtils.isNotBlank(headRefDel)){
				List<String> parseArray = JSONObject.parseArray(headRefDel, String.class);
				if(CollectionUtils.isNotEmpty(parseArray)) {
					ReturnVo<String> rvo = flowApi.delFormRelateFlowInfo(parseArray);
					if(!FlowConstant.SUCCESS.equals(rvo.getCode())) {
						logger.error("删除关联的流程失败！" + rvo.getMsg());
					}
				}
			}
			returnVo.setCode(ReturnCode.SUCCESS);
		} catch (Exception e) {
			returnVo.setMsg("关联流程添加或删除异常！" + e);
			e.printStackTrace();
		}
		return returnVo;
	}
	@Override
	public ReturnVo<String> revoke(String userNo,String processInstId,String message){
		ReturnVo<String> returnVo=new ReturnVo<>(ReturnCode.FAIL, "撤回失败！");
		RevokeApiVo backVo=new RevokeApiVo();
		if(StringUtils.isNotBlank(userNo) && StringUtils.isNotBlank(processInstId)){
			backVo.setProcessInstanceId(processInstId);
			backVo.setUserCode(userNo);
			backVo.setMessage(message);
			returnVo = flowApi.revocationTask(backVo);
			if(FlowConstant.SUCCESS.equals(returnVo.getCode())){
				returnVo.setCode(ReturnCode.SUCCESS);
			}
		}else{
			returnVo.setMsg("驳回人工号，实例id不能为空");
		}
		return returnVo;
	}
	@Override
	public ReturnVo<String> backToAnyStep(RevokeVo revoke){
		com.dragon.tools.vo.ReturnVo<String> vo=new com.dragon.tools.vo.ReturnVo<String>(ReturnCode.FAIL,"驳回失败");
		BackApiVo backVo=new BackApiVo();
		if(StringUtils.isNotBlank(revoke.getUserNo())
				&& StringUtils.isNotBlank(revoke.getActivityId())
				&& StringUtils.isNotBlank(revoke.getTaskId())){
			backVo.setTaskId(revoke.getTaskId());
			backVo.setUserCode(revoke.getUserNo());
			backVo.setMessage("【驳回到"+revoke.getActivityName()+" "+revoke.getAssigneeName()+"】"+revoke.getMessage());
			backVo.setProcessInstanceId(revoke.getProcessInstId());
			backVo.setDistFlowElementId(revoke.getActivityId());
			flowApi.backToStep(backVo);
			vo=new com.dragon.tools.vo.ReturnVo<String>(ReturnCode.SUCCESS,"驳回成功");
		}else{
			vo.setMsg("驳回人工号，任务id不能为空");
		}
		return vo;
	}

	@Override
	public ReturnVo<Boolean> isEditData(String userNo,String taskId,String processInstanceId){
		ReturnVo<Boolean> vo=new ReturnVo<Boolean>(ReturnCode.FAIL,"查询失败");
		if(StringUtils.isNotBlank(userNo) && StringUtils.isNotBlank(taskId) && StringUtils.isNotBlank(processInstanceId)){
			ActivityEditVo activityEditVo=new ActivityEditVo();
			activityEditVo.setProcessInstanceId(processInstanceId);
			activityEditVo.setTaskId(taskId);
			activityEditVo.setUserCode(userNo);
			boolean flag = flowApi.isActivityEditdata(activityEditVo);
			vo.setData(flag);
			vo.setCode(ReturnCode.SUCCESS);
			vo.setMsg("查询成功");
		}else{
			vo.setMsg("审批人工号，任务id，实例id不能为空");
		}
		return vo;
	}

}
