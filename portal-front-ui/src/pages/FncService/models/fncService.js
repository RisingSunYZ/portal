//YS首页——财务服务model
import { getFncNotice} from '@/services/fncService';
import { message } from 'antd';

export default {

  state: {
    fncNotice:{},
  },

  namespace: 'fncService',

  effects: {
    *fetchFncNotice({ payload }, { call, put }) {
      const response = yield call(getFncNotice, payload);
      yield put({
        type: 'saveFncNotice',
        payload: response,
      });
    },

  },

  reducers: {
    saveFncNotice(state, action) {
      return {
        ...state,
        fncNotice: action.payload.data,
      };
    },

  },
};
