import { getPreviewPath } from '@/services/api';
import { message } from 'antd';

export default {
  state: {
    fileName:'',
    previewPath:''
  },

  namespace: 'filePreview',

  effects: {
    *queryPreviewPath({ payload }, { call, put }) {
      const response = yield call(getPreviewPath, payload);
      yield put({
        type: 'savePreviewPath',
        payload: response
      });
    },
  },

  reducers: {
    savePreviewPath(state, action) {
      return {
        ...state,
        previewPath: action.payload.data[0]
      };
    }
  },
};
