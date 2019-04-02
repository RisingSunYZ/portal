//YS首页——财务服务model
import { getMaterialFiles, getOpinion, addOpinions } from '@/services/fncService';
import { message } from 'antd';

export default {

  state: {
    materialFiles:{},
    opinion: [],
    opinions: {}
  },

  namespace: 'fncService',

  effects: {
    *fetchMaterialFiles({ payload }, { call, put }) {
      const response = yield call(getMaterialFiles, payload);
      yield put({
        type: 'saveMaterialFiles',
        payload: response,
      });
    },
    *fetchOpinion({ payload }, { call, put }) {
      const response = yield call(getOpinion, payload);
      yield put({
        type: 'saveOpinion',
        payload: response,
      });
    },
    *addOpinion({ payload }, { call, put }) {
      const response = yield call(addOpinions, payload);
      yield put({
        type: 'saveOpinions',
        payload: response,
      });
    },

  },

  reducers: {
    saveMaterialFiles(state, action) {
      let data = action.payload.data.data;
      for (let item of data) {
        item.fileName = item.name;
        item.fileUrl = item.filePath;
        item.fileSize = item.size;
      }
      return {
        ...state,
        materialFiles: action.payload.data,
      };
    },
    saveOpinion(state, action) {
      return {
        ...state,
        opinion: action.payload.data,
      };
    },
    saveOpinions(state, action) {
      if (action.payload) {
        if (action.payload.code === "100") {
          message.success(action.payload.msg)
        } else {
          message.error(action.payload.msg)
        }
      }
      return {
        ...state,
        opinions: action.payload,
      };
    },
  },
};
