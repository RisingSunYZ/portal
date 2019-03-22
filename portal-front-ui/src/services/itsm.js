import { stringify } from 'qs';
import request from '../utils/request';

/**
 * IT知识库
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryHotKnowledge(params) {
  return request(`/rest/portal/itsm/getHotKnowledge?${stringify(params)}`);
}

/**
 * IT行业资讯
 * @param params
 * @returns {Promise<Object>}
 */
export async function getITtrendNews(params) {
  return request(`/rest/itService/getItrendNews?${stringify(params)}`);
}

/**
 * 联系我们
 * @param params
 * @returns {Promise<Object>}
 */
export async function getContactList(params) {
  return request(`/rest/itService/getContactUsList?${stringify(params)}`);
}

/**
 * 问题反馈 - 所属业务
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryTSCategory(params) {
  return request(`/rest/portal/itsm/apiFindTSCategoryController?${stringify(params)}`);
}
/**
 * 问题反馈 - 所属业务
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryTSType(params) {
  return request(`/rest/portal/itsm/apiFindTSTypeController?${stringify(params)}`);
}

