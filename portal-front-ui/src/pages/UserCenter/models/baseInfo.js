import router from 'umi/router';
import { message } from 'antd';
import {getBaseInfo,saveBaseInfo,saveUserMobile,verificationCode,updatePwdAfterLogin,logOutSyn} from '@/services/user'

export default {
  namespace: 'baseInfo',

  state: {
    baseInfo: {
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
        if (response.code === '100') {
          message.success('保存成功');
        } else {
          message.error(response.msg);
        }
      }
    },
    *saveUserMobile({ payload }, { call }) {
      const response = yield call(saveUserMobile, payload);
      if (response.code === '100') {
        message.success('保存成功');
      } else {
        message.error(response.msg);
      }
    },
    *sendUserMobileCode({ payload,callback }, { call }) {
      const response = yield call(verificationCode, payload);
      if(response.code=='100'){
        if (callback && typeof callback === 'function') {
          callback(response)
        }
      }else{
        message.error(response.msg);
      }
    },
    *saveUserPwd({ payload ,callback }, { call }) {
      let response = yield call(updatePwdAfterLogin, payload);
      if (response.code === '100') {
        message.success('保存成功');
        response = yield call(logOutSyn, {});
        if (response.code === '100') {
          if (callback && typeof callback === 'function') {
              callback(response)
          }
        }
      } else {
        message.error(response.msg);
      }
    },
    *getBaseInfo({ payload }, { call, put }) {

      const response = yield call(getBaseInfo, payload);
      debugger
      yield put({
        type: 'save',
        payload: response!=undefined&&response.code=="1"?response:{},
      });
      // if(response.code=="100"){
      //   yield put({
      //     type: 'save',
      //     payload: response.data!=undefined?response.data:{},
      //   });
      // }else{
      //   message.error(response.msg);
      // }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        baseInfo: action.payload,
      };
    },
  },
};
