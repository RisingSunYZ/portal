import { getSysData,saveSystemMenu } from '@/services/api';
import { message } from 'antd';

export default {
  state: {
    sysData: [],
  },

  namespace: 'workplace',

  effects: {

    /**
     * 常用系统
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getSysData({ payload }, { call, put }) {
      const response = yield call(getSysData, payload);
      if(response.code === "100"){
        yield put({
          type: 'sysList',
          payload: response,
          pagination: payload,
        });
      }

    },

    *saveSystemMenu({ payload }, { call, put }) {
      // debugger;
      const response = yield call(saveSystemMenu, payload);
      if(callback) callback(response);
      // if(response.code === "100"){
      //   yield put({
      //     type: 'sysList',
      //     payload: response
      //   });
      // }
    }
  },

  reducers: {
    sysList(state, action) {
      return {
        ...state,
        sysData: action.payload.data
      };
    }
  },
};
