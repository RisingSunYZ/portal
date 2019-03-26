import request from '../utils/request';
import { stringify } from 'qs';


/**
 * 删除记录人
 * @param params
 * @returns {Promise<Object>}
 */
export async function delRecordPersons(params){
  console.log(params);
  console.log(88888888888);
  return request(`/rest/portal/rscmgmt/meeting/delPersonnel/${params.id}`);
}

/**
 * 保存记录人
 * @param params
 * @returns {Promise<Object>}
 */
export async function getRecordPer(params) {
  debugger;
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
  debugger;
  return request('/rest/portal/rscmgmt/meeting/save', {
    method: 'POST',
    body: params,
  });
}

/**
 * 加载 历史会议 数据
 * @returns {Promise<Object>}
 */
export async function getHistoryData(){
  return request(`/rest/portal/rscmgmt/meeting/ajaxHistoryList`);
}

/**
 * 加载 待开会议 数据
 * @returns {Promise<Object>}
 */
export async function getWaitStartData(){
  return request(`/rest/portal/rscmgmt/meeting/ajaxList`);
}

/**
 * 加载 我的草稿会议 数据
 * @returns {Promise<Object>}
 */
export async function getDraftData(){
  return request(`/rest/portal/rscmgmt/meeting/ajaxMyDraftList`);
}

/**
 * 加载 我的邀请会议 数据
 * @returns {Promise<Object>}
 */
export async function getMyInviteData(){
  return request(`/rest/portal/rscmgmt/meeting/ajaxMyList`);
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
 *查看下的 下载人员列表
 * @returns {Promise<Object>}
 * @constructor
 */
export async function DownloadPerList(){
  // return request(`/rest/portal/rscmgmt/meeting/ajaxMyList`);
}

/**
 * 点击编辑 保存会议纪要和上传附件
 * @param params
 * @returns {Promise<Object>}
 */
export async function getUploadSummary(params) {
  // debugger;
  return request('/rest/portal/rscmgmt/meeting/saveMeetingSummary', {
    method: 'POST',
    body: params,
  });
}
