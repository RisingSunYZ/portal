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
 * 知识库分类
 * @param params
 * @returns {Promise<Object>}
 */
export async function getKnowledgeCategory(params) {
  return request(`/rest/portal/itsm/knowledgeCategory?${stringify(params)}`);
}
/**
 * 知识库查询列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function getKnowledgeList(params) {
  return request(`/rest/portal/itsm/apiKnowledgeController?${stringify(params)}`);
}
/**
 * 知识详情
 * @param params
 * @returns {Promise<Object>}
 */
export async function getKnowledgeDetail(params) {
  return request(`/rest/portal/itsm/knowledgeDetail/${params}`);
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
 * 常用下载列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function getCommonDownloadList(params) {
  return request(`/rest/itService/getCommonDownloadList?${stringify(params)}`);
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

