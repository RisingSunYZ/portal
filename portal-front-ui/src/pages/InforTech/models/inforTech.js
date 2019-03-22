import {
  queryHotKnowledge,
  getITtrendNews,
  getContactList,
  queryTSCategory,
  queryTSType,
} from '@/services/itsm';
import { message } from 'antd';

export default {
  state: {
    hotKnowledge: {
      data: {},
      datas: [],
    },
    trendNews: [],
    contact: [],
    sugSysList: [],
    questionRemark: {},
  },

  namespace: 'inforTech',

  effects: {
    *queryHotKnowledge({ payload }, { call, put }) {
      const response = yield call(queryHotKnowledge, payload);
      yield put({
        type: 'saveHotKnowledge',
        payload: response,
        pagination: payload,
      });
    },
    *getITtrendNews({ payload }, { call, put }) {
      const response = yield call(getITtrendNews, payload);
      yield put({
        type: 'saveTrendNews',
        payload: response,
        pagination: payload,
      });
    },
    *getContactList({ payload }, { call, put }) {
      const response = yield call(getContactList, payload);
      yield put({
        type: 'saveContactList',
        payload: response,
      });
    },
    *queryTSCategory({ payload }, { call, put }) {
      const response = yield call(queryTSCategory, payload);
      yield put({
        type: 'saveTSCategory',
        payload: response,
      });
    },
    *queryTSType({ payload }, { call, put }) {
      const response = yield call(queryTSType, payload);
      yield put({
        type: 'saveTSType',
        payload: response,
      });
    },

  },

  reducers: {
    saveHotKnowledge(state, action) {
      return {
        ...state,
        hotKnowledge: action.payload,
      };
    },
    saveTrendNews(state, action) {
      return {
        ...state,
        trendNews: action.payload.data,
      };
    },
    saveContactList(state, action) {
      return {
        ...state,
        contact: action.payload.data,
      };
    },
    saveTSCategory(state, action) {
      return {
        ...state,
        sugSysList: action.payload.data,
      };
    },
    saveTSType(state, action) {
      return {
        ...state,
        questionRemark: action.payload.data,
      };
    },
  },
};
