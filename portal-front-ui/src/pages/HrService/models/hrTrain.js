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
      if(response.code == "100"){
        yield put({
          type: 'queryTrainlist',
          payload: response.data,
        });
      }

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
