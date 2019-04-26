/**
 *个人资料绩效信息model
 */
import { getTrainingOverview ,queryTrainList, getTrainingDetails } from '../../../services/hrService';

export default {
  namespace: 'train',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    tNumberData: {},
    a: {},
  },
  // put用于触发action；call用于调用异步逻辑，支持 promise；select用于从 state 里获取数据。
  effects: {
    *getTrainingOverview({ payload }, { call, put }) {
      const response = yield call(getTrainingOverview, payload);
      yield put({
        type: 'saveTrainingOverview',
        payload: response,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTrainList, payload);
      yield put({
        type: 'save',
        payload: response,
        pagination: payload,
      });
    },
    *getTrainingDetails({ payload }, { call, put }) {
      const response = yield call(getTrainingDetails, payload);
      yield put({
        type: 'saveTrainingDetails',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        a: action.payload,
      };
    },
    saveTrainingOverview(state, action) {
      let data = action.payload;
      let rate;
      if (!! data) {
        if (data.planClassHours == 0) {
          rate = "";
        } else {
          let rateNum = (data.realClassHours/data.planClassHours)*100;
          rate = rateNum.toFixed(2)+"%";
        }
        data.completionRate = rate;
      }
      return {
        ...state,
        tNumberData: data,
      };
    },
    saveTrainingDetails(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
