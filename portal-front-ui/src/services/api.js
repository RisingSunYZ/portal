import request from '../utils/request';
import { stringify } from 'qs';

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}


export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}


/**
 *获取消息通知数量
 */
export async function queryMsgCount() {
  return request(`/rest/portal/msg/getMsgCount`);
  // return {code: "100", data:{XTXX:12, LCXX:123}, msg:"获取消息数量成功！"};
}

/**
 * 获取日程微标数
 */
export async function getScheduleCount() {
  // FIXME 获取日程微标数
  return request(`/rest/process/list/queryTodoCount`);
}



/**
 * 文档预览地址数据获取
 * @param params
 * @returns
 */
export async function getPreviewPath(params) {
  const newParams = {
    isCopy:'0',// 是否允许复制
    isZip:'1',// 打包下载
    isDelSrc:'1',
    isShowList:'1',// 是否显示列表
    ...params
  }
  return request(`/office/onlinefile?${stringify(newParams)}`);
}






