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
 * 财务通告
 * @param params
 * @returns {Promise<Object>}
 */
export async function getMaterialFiles(params) {
  return request(`/rest/portal/fnc/ajaxListMaterialFile?${stringify(params)}`);
}

/**
 * 获取意见与建议页面内下拉框选项数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getOpinion(params) {
  return request(`/rest/portal/fnc/getOpinionPage`);
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

