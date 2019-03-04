package com.dragon.portal.component;

import com.dragon.portal.vo.process.ProcessMainVo;
import com.dragon.portal.vo.process.RevokeVo;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.vo.ReturnVo;

/**
 * 流程公共组件
 * @Title:
 * @Description:
 * @Author:xietongjian
 * @Since:2017年8月27日 下午2:22:17
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public interface IProcessMainComponent {
	
	/**
	 * 获取设置流程发起者的工号
	 * @param processMainVo
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午2:44:27
	 */
	public ProcessMainVo setProcessSenderNo(ProcessMainVo processMainVo, UserSessionInfo loginUser);
	
	/**
	 * 附件添加 【 表单各个部位的附件，根据类别区分 】
	 * @param headAttAdd 添加的
	 * @param headAttDel 删除的
	 * @param no	发起人工号
	 * @param bizId	业务表单ID
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午5:46:25
	 */
	public ReturnVo<String> formAttOpt(String headAttAdd, String headAttDel, String no, String bizId);
	
	/**
	 * 表单引用添加 【 表单各个部位的附件，根据类别区分 】
	 * @param headRefAdd 添加的
	 * @param headRefDel 删除的
	 * @param no	发起人工号
	 * @param bizId	业务表单ID
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午5:46:25
	 */
	public ReturnVo<String> formRefOpt(String headRefAdd, String headRefDel, String no, String bizId);

	/**
	 * 撤回
	 * @param userNo 撤销人工号
	 * @param taskId 任务id
	 * @return
	 */
	public ReturnVo<String> revoke(String userNo, String processInstId, String message);

	/**
	 * 驳回任意节点
	 * @return
	 */
	public ReturnVo<String> backToAnyStep(RevokeVo revokeVo);
	/**
	 * 当前审批人是否具有编辑表单的权限
	 * @param userNo 审批人工号
	 * @param taskId 任务id
	 * @param processInstanceId 实例id
	 * @return
	 */
	public ReturnVo<Boolean> isEditData(String userNo, String taskId, String processInstanceId);

}
