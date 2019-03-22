
import { queryTrain } from '@/services/hrService';

export default {
  namespace: 'hrTrain',

  state: {
    data: {
      list: [],
      pagination: {},
    },

  },


  effects: {
    *queryTrain({ payload }, { call, put }) {
      const response = yield call(queryTrain, payload);
      yield put({
        type: 'queryTrainlist',
        payload: response,
      });
    },


  },

  reducers: {
    queryTrainlist(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

  },
};
