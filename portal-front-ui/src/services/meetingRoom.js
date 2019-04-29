import request from '../utils/request';
import { stringify } from 'qs';
/**
 * 根据日期加载会议室申请数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryApplyList(params) {
  return request('/rest/portal/rscmgmt/meetingroom/ajaxApplyList', {
    method: 'POST',
    body: params,
  });
}

/**
 * 根据用户权限加载会议室数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function querymRoomList(params) {
  return request(`/rest/portal/rscmgmt/meetingroom/ajaxList?${stringify(params.query)}`, {
    method: 'POST',
    body: params.meetingroomViewVo,
  });
}

/**
 * 获取会议室详情
 * @returns {Promise<Object>}
 */
export async function getmRoomDetail(params){
  return request(`/rest/portal/rscmgmt/meetingroom/apply_room?${stringify(params)}`);
}

/**
 * 获取会议室地点以及用具
 * @returns {Promise<Object>}
 */
export async function getMeetingAddrsTools(params){
  return request(`/rest/portal/rscmgmt/meetingroom/getMeetingAddrsTools?${stringify(params)}`);
}

/**
 * 通过Id获取会议室申请信息
 * @returns {Promise<Object>}
 */
export async function getMeetingApplyById(params){
  return request(`/rest/portal/rscmgmt/meetingroom/getMeetingroomApplyById?${stringify(params)}`);
}

/**
 * 查询我的申请列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryMyApplyList(params) {
  return request(`/rest/portal/rscmgmt/meetingroom/myApplyAjaxList?${stringify(params.query)}`, {
    method: 'POST',
    body: params.meetingRoomApply || {},
  });
}

/**
 * 会议室添加/修改
 * @param params
 * @returns {Promise<Object>}
 */
export async function saveMtRoomMsg(params) {
  return request('/rest/portal/rscmgmt/meetingroom/save', {
    method: 'POST',
    body: params,
  });
}

/**
 * 重新发起流程
 * @param params
 * @returns {Promise<Object>}
 */
export async function submitProcess(params) {
  return request('/rest/portal/rscmgmt/meetingroom/submitProcess', {
    method: 'POST',
    body: params,
  });
}

/**
 * 取消申请(没有发起流程的)
 * @param params
 * @returns {Promise<Object>}
 */
export async function updateMeetingStatus(params) {
  return request('/rest/portal/rscmgmt/meetingroom/updateMeetingroomStatus', {
    method: 'POST',
    body: params,
  });
}
