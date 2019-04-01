import request from '../utils/request';
import { stringify } from 'qs';

export async function query() {
  return request('/api/news');
}

/**
 * 通过当前用户工号查询授权信息
 * @param params
 * @returns {Promise<Object>}
 */

export async function queryScheduleGrant(params) {
  return request(`/rest/portal/scheduleGrant/empower?${stringify(params)}`);
}

/**
 * 根据工号获取本月所有的日程信息
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryScheduleList(params) {
  return request(`/rest/portal/schedule/ajaxList?${stringify(params)}`);
}

/**
 * 通过Id获取日程详细信息
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryScheduleInfo(params) {
  return request(`/rest/portal/schedule/getScheduleEventById?${stringify(params)}`);
}


/**
 * 新建日程
 * @param params
 * @returns {Promise<Object>}
 */
export async function doSaveSchedule(params) {
  return request('/rest/portal/schedule/save', {
    method: 'POST',
    body:params,
  });
}

/**
 * 删除日程
 * @param params
 * @returns {Promise<Object>}
 */

export async function delSchedule(params) {
  return request(`/rest/portal/schedule/delEvent?${stringify(params)}`);
}




