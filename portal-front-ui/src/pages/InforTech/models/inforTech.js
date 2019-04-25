import {
  queryHotKnowledge,
  getKnowledgeCategory,
  getKnowledgeList,
  getKnowledgeDetail,
  getITtrendNews,
  getContactList,
  getCommonDownloadList,
  queryTSCategory,
  queryTSType,
} from '@/services/itsm';
import { message } from 'antd';

export default {
  state: {
    hotKnowledge: [],
    knowledgeCategory: [],
    knowledgeList: {},
    knowledgeDetail: {},
    trendNews: [],
    contact: [],
    sugSysList: [],
    downloadList: [],
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
    *getKnowledgeCategory({ payload }, { call, put }) {
      const response = yield call(getKnowledgeCategory, payload);
      yield put({
        type: 'saveKnowledgeCategory',
        payload: response,
      });
    },
    *getKnowledgeList({ payload }, { call, put }) {
      const response = yield call(getKnowledgeList, payload);
      yield put({
        type: 'saveKnowledgeList',
        payload: response,
      });
    },
    *getKnowledgeDetail({ payload }, { call, put }) {
      const response = yield call(getKnowledgeDetail, payload);
      yield put({
        type: 'saveKnowledgeDetail',
        payload: response,
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
    *getCommonDownloadList({ payload }, { call, put }) {
      const response = yield call(getCommonDownloadList, payload);
      yield put({
        type: 'saveDownloadList',
        payload: response,
      });
    },
    *queryTSCategory({ payload, callback }, { call, put }) {
      const response = yield call(queryTSCategory, payload);
      if(callback && typeof callback === 'function'){
        callback(response);
      }
      if(response && response.code === '100'){
        yield put({
          type: 'saveTSCategory',
          payload: response,
        });
      }
    },
    *queryTSType({ payload, callback }, { call, put }) {
      const response = yield call(queryTSType, payload);
      if(callback && typeof callback === 'function'){
        callback(response);
      }
      if(response && response.code === '100'){
        yield put({
          type: 'saveTSType',
          payload: response,
        });
      }
    },

  },

  reducers: {
    saveHotKnowledge(state, action) {
      return {
        ...state,
        hotKnowledge: action.payload.data,
      };
    },
    saveKnowledgeCategory(state, action) {
      return {
        ...state,
        knowledgeCategory: action.payload.data,
      };
    },
    saveKnowledgeList(state, action) {
      return {
        ...state,
        knowledgeList: action.payload.data,
      };
    },
    saveKnowledgeDetail(state, action) {
      return {
        ...state,
        knowledgeDetail: action.payload.data,
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
    saveDownloadList(state, action) {
      return {
        ...state,
        downloadList: action.payload.datas,
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
