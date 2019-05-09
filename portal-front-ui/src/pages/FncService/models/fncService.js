//YS首页——财务服务model
import {
  getMaterialTypeList,
  getContactList,
  getMaterialFiles,
  getOpinionList,
  getOpinionDetail,
  getOpinionTypeList,
  addOpinions,
  getOpinionReadNum,
  updateOpinionReadById,
} from '@/services/fncService';
import { message } from 'antd';

export default {

  state: {
    materialFiles: {
      total: 0,
      data: []
    },
    opinionTypeList: [],
    opinionList: [],
    opinionDetail: {
      opinion: {},
      opinionTypeName: ''
    },
    typeList: [],
    contactList: [],
    opinionCount: 0,
  },

  namespace: 'fncService',

  effects: {
    *getMaterialTypeList({ payload, callback }, { call, put }) {
      const response = yield call(getMaterialTypeList, payload);
      if(callback && typeof callback === 'function'){
        callback(response);
      }
      yield put({
        type: 'saveMaterialTypeList',
        payload: response,
      });
    },
    *getContactList({ payload }, { call, put }) {
      const response = yield call(getContactList, payload);
      yield put({
        type: 'saveContactList',
        payload: response,
      });
    },
    *fetchMaterialFiles({ payload }, { call, put }) {
      const response = yield call(getMaterialFiles, payload);
      yield put({
        type: 'saveMaterialFiles',
        payload: response,
      });
    },
    *getOpinionTypeList({ payload }, { call, put }) {
      const response = yield call(getOpinionTypeList, payload);
      yield put({
        type: 'saveOpinionType',
        payload: response,
      });
    },
    *getOpinionList({ payload }, { call, put }) {
      const response = yield call(getOpinionList, payload);
      yield put({
        type: 'saveOpinionList',
        payload: response,
      });
    },
    *getOpinionDetail({ payload }, { call, put }) {
      const response = yield call(getOpinionDetail, payload);
      yield put({
        type: 'saveOpinionDetail',
        payload: response,
      });
    },
    *addOpinion({ payload, callback }, { call, put }) {
      const response = yield call(addOpinions, payload);
      if(callback && typeof callback === 'function'){
        callback(response)
      }
    },
    *getOpinionReadNum({ payload, callback }, { call, put }) {
      const response = yield call(getOpinionReadNum, payload);
      yield put({
        type: 'saveOpinionReadCount',
        payload: response,
      });
    },
    *updateOpinionReadById({ payload, callback }, { call, put }) {
      const response = yield call(updateOpinionReadById, payload);
      if(callback && typeof callback === 'function'){
        callback(response)
      }
    },

  },

  reducers: {
    saveMaterialFiles(state, action) {
      let data = action.payload.data;
      for (let item of data) {
        item.fileName = item.name;
        item.fileUrl = item.filePath;
        item.fileSize = item.size;
      }
      return {
        ...state,
        materialFiles: action.payload,
      };
    },
    saveMaterialTypeList(state, action) {
      return {
        ...state,
        typeList: action.payload.data,
      };
    },
    saveContactList(state, action) {
      return {
        ...state,
        contactList: action.payload.data,
      };
    },
    saveOpinionType(state, action) {
      return {
        ...state,
        opinionTypeList: action.payload.data,
      };
    },
    saveOpinionList(state, action) {
      return {
        ...state,
        opinionList: action.payload.data,
      };
    },
    saveOpinionDetail(state, action) {
      return {
        ...state,
        opinionDetail: action.payload,
      };
    },
    saveOpinionReadCount(state, action) {
      return {
        ...state,
        opinionCount: action.payload.data,
      };
    },
  },
};
