import request from '../utils/request';
import { stringify } from 'qs';

/**
 * 获取用户消息列表
 */
export async function getMsgList(params) {
  return request(`/rest/portal/msg/ajaxlist?${stringify(params)}`);
}

/**
 * 获取消息类型
 */
export async function getNoticeType(params) {
  return request(`/rest/portal/msg/getNoticeType?${stringify(params)}`);
}
/**
 * 获取所有系统列表
 */
export async function getAllSystem(params) {
  return request(`/rest/portal/msg/getAllSystem?${stringify(params)}`);
}
/**
 * 获取消息数量
 */
export async function getMsgCount() {
  return request(`/rest/portal/msg/getMsgCount`);
}
/**
 * 修改消息阅读状态
 */
export async function updateMsgStatus(params) {
  return request(`/rest/portal/msg/updateMsgStatus?${stringify(params)}`);
}
/**
 * 修改消息阅读状态
 */
export async function getMsgDetail(params) {
  return request(`/rest/portal/msg/getDetail?${stringify(params)}`);
}

/**
 * 点击 删除 常用联系人
 * @param params
 * @returns {Promise<Object>}
 */
export async function delContactPerData(params) {
  var formdata = new FormData();
  const val = params.contactNo;
  formdata.append("nos",val);
  return request('/rest/addrbook/addressBook/delTopContacts', {
    method: 'POST',
    body: formdata,
  });
}
