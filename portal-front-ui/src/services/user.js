import request from '../utils/request';
import { stringify } from 'qs';

export async function query() {
  return request('/api/users');
}


/**
 * 获取当前用户信息
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryCurrent(params) {
  return request(`/rest/user/currentUser?${stringify(params)}`);
}

export async function queryUserByNo(params) {
  return request(`/rest/user/getUserByNo?${stringify(params)}`);
}
export async function getAllUser(params) {
  return request(`/rest/user/ajaxListPerson?${stringify(params)}`);
}
export async function getAllDept(params) {
  return request(`/rest/user/ajaxListOrgTree?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

/**
 * 用户登录
 * @param params
 * @returns {Promise<void>}
 */
export async function accountLogin(params) {
  return request('/rest/portal/user/userLogin/login', {
    method: 'POST',
    body: params,
  });
}


/**
 * 退出登录
 * @returns {Promise<Object>}
 */
export async function logOutSyn() {
  return request('/rest/portal/user/userLogin/out');
}


/**
 * 忘记密码--修改密码
 * @param params
 * @returns {Promise<Object>}
 */
export async function changePwd(params) {
  return request('/rest/portal/user/userLogin/updatePwdBeforeLogin', {
    method: 'POST',
    body: params,
  });
}
/**
 * 获取个人资料
 */
export async function getBaseInfo() {
  return request(`/rest/portal/user/userLogin/getEditUserInfo`);
}

/**
 * 个人资料 保存基本信息
 * @param params
 * @returns {Promise<Object>}
 */
export async function saveBaseInfo(params) {
  var formData = new FormData();
  for(let key in params){
    formData.append(key,params[key]);
  }
  return request('/rest/portal/user/userLogin/saveUserInfo', {
    method: 'POST',
    body: formData,
  });
}
/**
 * 个人资料-修改用户手机号
 * @param params
 * @returns {Promise<Object>}
 */
export async function saveUserMobile(params) {
  var formData = new FormData();
  for(let key in params){
    formData.append(key,params[key]);
  }
  return request('/rest/portal/user/userLogin/saveUserMobile', {
    method: 'POST',
    body: formData,
  });
}

/**
 * 个人资料--修改密码
 * @param params
 * @returns {Promise<Object>}
 */
export async function updatePwdAfterLogin(params) {
  return request('/rest/portal/user/userLogin/updatePwdAfterLogin', {
    method: 'POST',
    body: params,
  });
}


/**
 * 获取短信验证码
 * @returns {Promise<void>}
 */
export async function verificationCode() {
  return request(`/rest/portal/user/userLogin/getVerificationCode`);
}

/**
 *  提交按钮 校验手机验证码
 * @param params
 * @returns {Promise<void>}
 */
export async function checkCaptchaCode(params) {
  return request(`/rest/portal/user/userLogin/checkVerificationCode/${params.captcha}`);
}

/**
 * 获取图片验证码
 * @param params
 * @returns {Promise<void>}
 */
export async function imgCaptchaCode(params) {
  return request('/mqpms/wl/labour/user/getPicCode');
}

/**
 * 检查账号（手机号）状态 ，是否存在 code 1 账号可注册（不存在）  code 0 账号不可注册（存在）
 * @param params
 * @returns {Promise<void>}
 */
export async function fakeAccount(params) {
  return request(`/rest/portal/user/userLogin/verificationCode/${params.userNo}`);
}

/**
 * 校验图片验证码
 * @param params
 * @returns {Promise<void>}
 */
export async function checkPicCode(params) {
  return request(`/mqpms/wl/labour/user/checkPicCode?picCode=${params.picCode}`);
}

/**
 * 退出登录
 * @param params
 * @returns {Promise<void>}
 */
export async function logoutAccount(params) {
  return request('/mqpms/wl/labour/user/loginOut',{
    method: 'POST',
    body: params,
  });
}

export async function updateAccountInfo(params) {
  return request('/mqpms/labour/user/personSet', {
    method: 'POST',
    body: params,
  });
}



