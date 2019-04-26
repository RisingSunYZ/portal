/**
 *个人资料绩效信息model
 */
import {
  checkPwd,
} from '../../../services/hrService';
import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'salary',

  state: {
    data: [],
    enabled:false,
    msg:"",
  },
  // put用于触发action；call用于调用异步逻辑，支持 promise；select用于从 state 里获取数据。
  effects: {
    *checkPwd({ payload,callback }, { call,put }) {
      const response = yield call(checkPwd, payload);
      if(callback && typeof callback === 'function'){
        callback(response);
      }else{
        !response.enabled && message.error(response.msg);
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },

  },

  reducers: {
    save(state, action) {
      let data=[];
      data.push(action.payload.salary)
      return {
        ...state,
        data: data,
        enabled:action.payload.enabled,
      };
    },
    disabled(state, action) {
      return {
        ...state,
        enabled:false,
      };
    },
  },
};
