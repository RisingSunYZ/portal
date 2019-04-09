import request from '../utils/request';
import { stringify } from 'qs';

/**
 * 获取常用联系人数据
 */
export async function queryTopConcactData() {
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
export async function getTableList(params) {
  let data="";
  for(var key in params){
    data+= key + '='+ params[key]+ '&';
  }
  if(data.length>0) data= data.substr(0,data.length-1);
  return request(`/rest/addrbook/addressBook/getPersonnelDataForBook?`+data);
}

/**
 * 点击 添加到 常用联系人
 * @param params
 * @returns {Promise<Object>}
 */
export async function addContactPerData(params) {
  var formdata = new FormData();
  const val = params.contactNo;
  formdata.append("nos",val);
  return request('/rest/addrbook/addressBook/addTopContacts', {
    method: 'POST',
    body: formdata,
  });
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


