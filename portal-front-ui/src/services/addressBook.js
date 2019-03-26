import request from '../utils/request';
import { stringify } from 'qs';

/**
 * 获取常用联系人数据
 */
export async function queryTopConcactData() {
  // transParamsDate(params);
  return request(`/rest/addrbook/addressBook/getTopContactsData`);
}

/**
 * 获取企业通讯录表单模板目录
 */
export async function queryTreeData() {
  return request(`/rest/addrbook/addressBook/getOrgTreeDataforBook`);
}

/**
 * 查询通讯录人员数据
 */
export async function getModelList(params) {
  return request(`/rest/addrbook/addressBook/getPersonnelDataForBook?${stringify(params)}`);
}

/**
 * 点击 添加到 常用联系人
 * @param params
 * @returns {Promise<Object>}
 */
export async function addContactPerData(params) {

  return request('/rest/addrbook/addressBook/addTopContacts', {
    method: 'POST',
    body: params,
  });
}

/**
 * 点击 删除 常用联系人
 * @param params
 * @returns {Promise<Object>}
 */
export async function delContactPerData(params) {

  return request('/rest/addrbook/addressBook/delTopContacts', {
    method: 'POST',
    body: params,
  });
}

function transParamsDate(params) {
  if (typeof params != 'undefined' && typeof params.date != 'undefined' && params.date != '') {
    params.startTime = params.date[0].format('YYYY-MM-DD') + ' 00:00:00';
    params.endTime = params.date[1].format('YYYY-MM-DD') + ' 23:59:59';
    delete params.date;
  }
}
