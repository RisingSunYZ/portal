import request from '../utils/request';
import { stringify } from 'qs';

/**
 * 获取用户消息列表
 */
export async function getMenuTree(params) {
  return request(`/rest/portal/biz-sys/getMenuTree?${stringify(params)}`);
}

