/**
 *个人资料绩效信息model
 */
import { getHrPerformanceList, getYearList, getPerformanceScore } from '../../../services/hrService';
export default {

  namespace: 'hrPerformance',

  state: {
    performanceTable:{},
    yearList: [],
    performanceObj: {},
  },
  // put用于触发action；call用于调用异步逻辑，支持 promise；select用于从 state 里获取数据。
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getHrPerformanceList, payload);
      yield put({
        type: 'hrPerformanceList',
        payload: response,
      });
    },
    *getYear({ payload, callback }, { call, put }) {
      const response = yield call(getYearList, payload);
      let code = response.code;
      if (code == 1) {
        yield put({
          type: 'getYears',
          payload: response,
        });
      }
    },
    *getPerformanceScore({ payload }, { call, put }) {
      const response = yield call(getPerformanceScore, payload);
      let code = response.code;
      if (code == 1) {
        yield put({
          type: 'performanceScore',
          payload: response,
        });
      }
    },
  },

  reducers: {
    hrPerformanceList(state, action) {
      return {
        ...state,
        performanceTable: action.payload,
      };
    },
    getYears(state, action) {
      return {
        ...state,
        yearList: action.payload.datas,
      };
    },
    performanceScore(state, action) {
      return {
        ...state,
        performanceObj: action.payload.data,
      };
    },
  },
};
