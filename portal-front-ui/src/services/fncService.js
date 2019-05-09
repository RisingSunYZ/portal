/**
 * 财务服务service
 */
import { stringify } from 'qs';
import request from '../utils/request';

/**
 * GET请求例子
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

/**
 * POST请求例子
 * @param params
 * @returns {Promise<Object>}
 */
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

/**
 * 获取资料下载类型列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function getMaterialTypeList(params) {
  return request(`/rest/portal/fnc/getFileTypeList?${stringify(params)}`);
}

/**
 * 获取财务模块联系人列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function getContactList(params) {
  return request(`/rest/portal/fnc/getContactList?${stringify(params)}`);
}

/**
 * 财务通告
 * @param params
 * @returns {Promise<Object>}
 */
export async function getMaterialFiles(params) {
  return request(`/rest/portal/fnc/ajaxMaterialFileList?${stringify(params)}`);
}

/**
 * 获取意见分类数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getOpinionTypeList(params) {
  return request(`/rest/portal/fnc/getOpinionPage`);
}

/**
 * 获取意见反馈列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function getOpinionList(params) {
  return request(`/rest/portal/fnc/getOpinionList`);
}
/**
 * 根据id获取意见反馈详情
 * @param params
 * @returns {Promise<Object>}
 */
export async function getOpinionDetail(params) {
  return request(`/rest/portal/fnc/getOpinionDetail?${stringify(params)}`);
}

/**
 * 获取未读意见反馈数量
 * @param params
 * @returns {Promise<Object>}
 */
export async function getOpinionReadNum(params) {
  return request(`/rest/portal/fnc/getOpinionReadNum`);
}
/**
 * 更新意见反馈阅读状态
 * @param params
 * @returns {Promise<Object>}
 */
export async function updateOpinionReadById(params) {
  return request(`/rest/portal/fnc/updateOpinionReadById?${stringify(params)}`);
}

/**
 * 添加建议
 * @param params
 * @returns {Promise<Object>}
 */
export async function addOpinions(params) {
  return request('/rest/portal/fnc/addOpinion', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

