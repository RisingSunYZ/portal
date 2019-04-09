import request from '../utils/request';
import { stringify } from 'qs';

/**
 * 常用系统数据获取
 * @param params
 * @returns {Promise<Object>}
 */
export async function getSysDatas() {
  return request(`/rest/portal/workplat/system/getUserSystem`);
}

/**
 * 常用系统保存
 * @param params
 * @returns {Promise<void>}
 */
export async function saveSystemMenus(params) {
  const formdata = new FormData();
  const val = JSON.stringify(params.systemMenuUser);
  formdata.append("systemMenuUserJson",val);
  return request(`/rest/portal/workplat/system/saveSystemMenu`, {
    method: 'POST',
    body: formdata,
  });
}

/**
 *根据id查询系统菜单
 * @param params
 * @returns {Promise<Object>}
 */
export async function querySystemById(params) {
  return request(`/rest/portal/workplat/system/getSystemById/${params.id}`);
}

/**
 * 获取所有顶级菜单
 * @returns {Promise<Object>}
 */
export async function getTopSystems() {
  return request(`/rest/portal/workplat/system/getTopSystem`);
}
