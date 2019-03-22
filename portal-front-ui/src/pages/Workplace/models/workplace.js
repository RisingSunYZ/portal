import { getSysData } from '@/services/api';
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
