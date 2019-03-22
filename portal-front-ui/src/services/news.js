import request from '../utils/request';
import { stringify } from 'qs';

export async function query() {
  return request('/api/news');
}

/**
 * 获取新闻公告  、公司动态 数据
 * @param params
 * @returns {Promise<Object>}
 */

export async function queryNewsList(params) {
  return request(`/rest/portal/news/ajaxListVo?${stringify(params)}`);
}

/**
 * 获取新闻banner数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryNewsBanner(params) {
  // return request(`/rest/index/loginNews`);
  return request(`/rest/portal/news/ajaxListVo?${stringify(params)}`);
}

/**
 * 登录页新闻公告
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryNewsNotice() {
  return request(`/rest/index/ajaxCompanyNews`);
}


/**
 * 获取新闻详情
 * @param params
 * @returns {Promise<Object>}
 */

export async function queryNoticeDetail(params) {
  return request(`/rest/portal/notice/noticeDetail?${stringify(params)}`);
}

export async function queryNewsDetail(params) {
  return request(`/rest/portal/news/newsDetail?${stringify(params)}`);
}

export async function queryNoticeList(params) {
  return request(`/rest/portal/notice/ajaxHomeNoticeList?${stringify(params)}`);
}

export async function queryCompanyNewsList(params) {
  return request(`/rest/portal/news/ajaxCompanyNewsList?${stringify(params)}`);
}




