import { stringify } from 'qs';
import request from '../utils/request';

/**
 * 获取表单信息
 */
export async function getFormInfo(params) {
  transParamsDate(params)
  return request(`/rest/process/form/getFormInfo?${stringify(params)}`);
}
/**
 * 获取流程基本信息
 */
export async function getBaseInfo(params) {
  return request(`/rest/process/form/getBaseInfo?${stringify(params)}`);
}
/**
 * 获取流程连接
 */
export async function getFormUrl(params) {
  return request(`/rest/process/form/getFormUrl?${stringify(params)}`);
}

/**
 * 添加附言数据
 * @param attachMsg
 * @param processInstId
 * @param bizId
 * @param attachMsgAttAdd
 */
export async function insertAttachMsg(params) {
  return request('/rest/process/form/insertAttachMsg', {
    method: 'POST',
    body:params,
  });
}

/**
 * 保存表单基础数据
 */
export async function saveData(params) {
  return request(`/rest/process/form/saveData?${stringify(params)}`);
}

/**
 * 评审、审批、协同
 * @param option
 * @param message
 * @param taskId
 */
export async function doApprove(params) {
  return request('/rest/process/form/saveSp', {
    method: 'POST',
    body:params,
  });
}

/**
 * 审批并加签
 * @param taskId
 * @param processInstanceId
 * @param userCodes
 * @param userNames
 * @param message
 */
export async function doAddSign(params) {
  return request('/rest/process/form/addSign', {
    method: 'POST',
    body:params,
  });
}

/**
 * 转阅
 * @param message
 * @param processInstanceId
 * @param userNames
 * @param userCodes
 */
export async function doTurnRead(params) {
  return request('/rest/process/form/turnRead', {
    method: 'POST',
    body:params,
  });
}

/**
 * 撤回
 * @param message
 * @param taskId
 */
export async function doRevoke(params) {
  return request('/rest/process/form/revoke', {
    method: 'POST',
    body:params,
  });
}

/**
 * 转办
 * @param taskId
 * @param userId
 * @param userName
 */
export async function doTurnDo(params) {
  return request('/rest/process/form/turnDo', {
    method: 'POST',
    body:params,
  });
}

/**
 * 驳回到提交人
 * @param code
 * @param option
 * @param message
 * @param taskId
 */
export async function doReject(params) {
  return request('/rest/process/form/saveSp', {
    method: 'POST',
    body:params,
  });
}

/**
 * 驳回到上一个节点
 * @param code
 * @param option
 * @param message
 * @param taskId
 */
export async function backToStep(params) {
  return request('/rest/process/form/backToStep', {
    method: 'POST',
    body:params,
  });
}

/**
 * 驳回到任意节点
 * @param code
 * @param option
 * @param message
 * @param taskId
 */
export async function backToAnyStep(params) {
  return request('/rest/process/form/backToAnyStep', {
    method: 'POST',
    body:params,
  });
}

/**
 * 暂存
 * @param option
 * @param message
 * @param taskId
 */
export async function doTempSave(params) {
  return request('/rest/process/form/saveSp', {
    method: 'POST',
    body:params,
  });
}

/**
 * 根据任务id获取任务
 */
export async function getProcessFormStateData(params) {
  return request(`/rest/process/form/getProcessFormState?${stringify(params)}`);
}

/**
 * 获取审批节点列表
 * @param taskId
 */
export async function getBackNodes(params) {
  return request(`/rest/process/form/getBackNodes?${stringify(params)}`);
}

/**
 * 表单提交(附言、关联流程、附言)
 */
export async function doSaveBaseInfo(params) {
  return request('/rest/process/form/submit', {
    method: 'POST',
    body:params,
  });
}

/**
 * 表单提交(附言、关联流程、附言)
 */
export async function doZYZH(params) {
  return request('/rest/process/form/doZYZH', {
    method: 'POST',
    body:params,
  });
}

/**
 * 表单终止
 */
export async function stopProcess(params) {
  return request('/rest/process/form/stopProcess', {
    method: 'POST',
    body:params,
  });
}


// /**
//  * 获取流程图图片流
//  */
// export async function getProcessDiagramImg(params) {
//   return request(`/rest/process/form/generateDiagramImg?${stringify(params)}`);
// }

/**
 * 获取流程图数据
 */
export async function getProcessDiagramData(params) {
  return request(`/rest/process/form/loadDiagramData?${stringify(params)}`);
}


function transParamsDate(params) {
  if (typeof params != 'undefined' && typeof params.date != 'undefined' && params.date != '') {
    params.startTime = params.date[0].format('YYYY-MM-DD') + ' 00:00:00';
    params.endTime = params.date[1].format('YYYY-MM-DD') + ' 23:59:59';
    delete params.date;
  }
}
