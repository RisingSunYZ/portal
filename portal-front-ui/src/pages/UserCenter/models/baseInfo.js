/**
 *个人资料绩效信息model
 */
import {
  saveBaseInfo,
  saveUserPwd,
  loginoutSyn,
  sendUserMobileCode,
  saveUserMobile,
} from '../../../services/hrServiceAjax';
import { getBaseInfo } from '../../../services/hrService';
import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'baseInfo',

  state: {
    profile: {
      profile: {},
      edus: [],
      familys: [],
      langs: [],
      psnorgs: [],
      linkmans: [],
      address: [],
    },
    formInfo: {},
    code:0,
  },
  // put用于触发action；call用于调用异步逻辑，支持 promise；select用于从 state 里获取数据。
  effects: {
    *saveBaseInfo({ payload, callback }, { call }) {
      const response = yield call(saveBaseInfo, payload);
      if(callback && typeof callback === 'function'){
        callback(response);
      }else{
        if (response.code === 1) {
          message.success('保存成功');
        } else {
          message.error(response.msg);
        }
      }
    },
    *saveUserMobile({ payload }, { call }) {
      const response = yield call(saveUserMobile, payload);
      if (response.code === 1) {
        message.success('保存成功');
      } else {
        message.error(response.msg);
      }
    },
    *sendUserMobileCode({ payload,callback }, { call }) {
      const response = yield call(sendUserMobileCode, payload);
      if (response.code === 0) {
        message.error(response.msg);
      }
      if(response.code==1){
        if (callback && typeof callback === 'function') {
          callback(response)
        }
      }
    },
    *saveUserPwd({ payload ,callback }, { call }) {
      let response = yield call(saveUserPwd, payload);
      if (response.code === 1) {
        message.success('保存成功');
        response = yield call(loginoutSyn, {});
        if(response.code==1){
          if (callback && typeof callback === 'function') {
              callback(response)
          }
        }
      } else {
        message.error(response.msg);
      }
    },
    *logoutSyn({ payload ,callback }, { call }) {

        const response = yield call(loginoutSyn, {});
        if(response.code=='100'){
          if (callback && typeof callback === 'function') {
              callback(response)
          }
        }
    },
    *getBaseInfo({ payload }, { call, put }) {
      const response = yield call(getBaseInfo, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        profile: action.payload,
      };
    },
  },
};
