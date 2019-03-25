//YS首页——财务服务model
import { getMaterialFiles } from '@/services/fncService';
import { message } from 'antd';

export default {

  state: {
    materialFiles:{},
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
  },
};
