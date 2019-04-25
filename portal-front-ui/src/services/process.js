import request from '../utils/request';
import { stringify } from 'qs';

/**
 * 获取待办数据
 */

export async function queryTodo(params) {
  transParamsDate(params);
  const random=Math.random();
  return request(`/rest/process/list/queryTodo?t=${random}&${stringify(params)}`);
}

/**
 * 获取已办数据
 */
export async function queryAlreadyDo(params) {
  transParamsDate(params);
  const random=Math.random();

  return request(`/rest/process/list/queryAlreadyDo?t=${random}&${stringify(params)}`);
}

/**
 * 获取已发数据
 */
export async function queryAlreadySend(params) {
  transParamsDate(params);
  const random=Math.random();
  return request(`/rest/process/list/getAlreadySend?t=${random}&${stringify(params)}`);
}

/**
 * 根据查询条件获取表单数据
 */
export async function getFormDataList(params) {
  transParamsDate(params);
  const random=Math.random();
  return request(`/rest/process/list/getFormDataList?t=${random}&${stringify(params)}`);
}

/**
 * 获取所有表单模板目录
 */
export async function queryTreeData(params) {
  return request(`/rest/process/list/ajaxListWfCategory?${stringify(params)}`);
  // return request(`/api/getProcessModelList`);
}
/**
 * 根据查询条件获取表单模板目录
 */
export async function queryTreeDataSearch(params) {
  return request(`/rest/process/list/getWfCategoryByUser?${stringify(params)}`);
  // return request(`/api/getProcessSearchList?${stringify(params)}`);
}

/**
 * 获取表单模板列表
 */
export async function getModelList(params) {
  if(params.categoryId == "myRegular"){
    let regularList = (JSON.parse(localStorage.getItem("regularData")) && JSON.parse(localStorage.getItem("regularData")).length>0)?JSON.parse(localStorage.getItem("regularData")):[];
    return regularList
  }else{
    const random=Math.random();
    return request(`/rest/process/list/ajaxListModel?t=${random}&${stringify(params)}`);
  }
}

/**
 * 存为我的常用表单模板数据
 */
export async function saveRegularData(params) {
  // modelItem

  let flag=true;
  let regularList = (JSON.parse(localStorage.getItem("regularData")) && JSON.parse(localStorage.getItem("regularData")).length>0)?JSON.parse(localStorage.getItem("regularData")):[];
  // 如果列表里有此条数据，则发起次数++ ，
  regularList.length>0&&regularList.forEach(function (obj) {
    if( obj.modelKey == params.modelKey ){
      flag=false;
      obj.launchCount++;
      return;
    }
  })
  // 如果列表里无此条数据，则在列表最后添加一条，
  if(flag){
    params.modelItem.launchCount =1;
    if(regularList.length == 10){
      regularList.splice(9,1,params.modelItem);
    }else{
      regularList.push(params.modelItem);
    }
  }
  regularList = regularList.sort((a,b) => b.launchCount-a.launchCount);
  localStorage.setItem("regularData",JSON.stringify(regularList));

}

/**
 * 获取权限资格
 */
export async function getPermission() {
  return request(`/rest/process/list/hasPermission`);
}

/**
 * 获取草稿数据
 */
export async function queryDrafts(params) {
  transParamsDate(params);
  const random=Math.random();
  return request(`/portal/api/process/ajaxListMyDraft?t=${random}&${stringify(params)}`);
  // return request(`/api/getDraftList`);
}

/**
 * 删除草稿
 * @param businessKey
 */
export async function delDraft(params) {
  return request('/rest/process/list/delDraft', {
    method: 'POST',
    body:params,
  });
}

/**
 * 获取所属系统数据
 */
export async function getAllSystems() {
  return request(`/rest/process/list/getAllSystems`);
  //GET /rest/portal/msg/getAllSystem
}

/**
 * 获取状态及类型枚举数据
 */
export async function getProcessEnums() {
  return request(`/rest/process/list/getProcessEnums`);
}

/**
 * 获取待办微标数
 */
export async function getTodoCount() {
  const random=Math.random();
  return request(`/rest/process/list/queryTodoCount?t=${random}`);
}

/**
 * 获取草稿微标数
 */
export async function getDraftsCount() {
  const random=Math.random();
  return request(`/rest/process/list/ajaxListMyDraftCount?t=${random}`);
}

function transParamsDate(params) {
  if (typeof params != 'undefined' && typeof params.date != 'undefined' && params.date != '') {
    params.startTime = params.date[0].format('YYYY-MM-DD') + ' 00:00:00';
    params.endTime = params.date[1].format('YYYY-MM-DD') + ' 23:59:59';
    delete params.date;
  }
}
