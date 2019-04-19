import request from '../utils/request';

/**
 * 删除记录人
 * @param params
 * @returns {Promise<Object>}
 */
export async function delRecordPersons(params){

  return request(`/rest/portal/rscmgmt/meeting/delPersonnel/${params.id}`);
}

/**
 * 保存记录人
 * @param params
 * @returns {Promise<Object>}
 */
export async function getRecordPer(params) {
  return request('/rest/portal/rscmgmt/meeting/insertPersonnel', {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除 我的草稿会议 数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function delDraftDatas(params){
  // debugger;
  console.log(params);
  return request(`/rest/portal/rscmgmt/meeting/delMyDraft/${params.id}`);
}

/**
 * 新建会议-按钮-发送邀请
 * @param params
 * @returns {Promise<Object>}
 */
export async function sendInviteData(params) {
  return request('/rest/portal/rscmgmt/meeting/sendInvitation', {
    method: 'POST',
    body: params,
  });
}

/**
 * 新建会议(或点击 编辑 )-按钮-保存草稿
 * @param params
 * @returns {Promise<Object>}
 */
export async function saveDraftData(params) {
  return request('/rest/portal/rscmgmt/meeting/save', {
    method: 'POST',
    body: params,
  });
}

/**
 * 加载 历史会议 数据
 * @returns {Promise<Object>}
 */
export async function getHistoryData(params){
  let data="";
  for(var key in params){
    data += key + '=' + params[key] + '&';
  }
  if(data.length>0) data=data.substr(0,data.length-1);
  return request(`/rest/portal/rscmgmt/meeting/ajaxHistoryList?`+data);
}

/**
 * 加载 待开会议 数据
 * @returns {Promise<Object>}
 */
export async function getWaitStartData(params){
  let data="";
  for(var key in params){
    data += key + '=' + params[key] + '&';
  }
  if(data.length>0) data=data.substr(0,data.length-1);
  return request(`/rest/portal/rscmgmt/meeting/ajaxList?`+data);
}

/**
 * 加载 我的草稿会议 数据
 * @returns {Promise<Object>}
 */
export async function getDraftData(params){
  let data="";
  for(var key in params){
    data += key + '=' + params[key] + '&';
  }
  if(data.length>0) data=data.substr(0,data.length-1);
  return request(`/rest/portal/rscmgmt/meeting/ajaxMyDraftList?`+data);
}

/**
 * 加载 我的邀请会议 数据
 * @returns {Promise<Object>}
 */
export async function getMyInviteData(params){
  let data="";
  for(var key in params){
    data += key + '=' + params[key] + '&';
  }
  if(data.length>0) data=data.substr(0,data.length-1);
  return request(`/rest/portal/rscmgmt/meeting/ajaxMyList?`+data);
}

/**
 * 根据 id 查询新建会议数据
 * @returns {Promise<Object>}
 */
export async function getInputData(params){
  // debugger
  return request(`/rest/portal/rscmgmt/meeting/getMeetingById/${params.id}`);
}



/**
 * 点击编辑 保存会议纪要和上传附件
 * @param params
 * @returns {Promise<Object>}
 */
export async function getUploadSummary(params) {
  return request('/rest/portal/rscmgmt/meeting/saveMeetingSummary', {
    method: 'POST',
    body: params,
  });
}

/**
 * 根据id查询 会议纪要 和 附件
 * @param params
 * @returns {Promise<Object>}
 */
export async function getSummaryMeetingDatas(params){

  return request(`/rest/portal/rscmgmt/meeting/getSummaryMeeting?id=${params.id}`);
}
