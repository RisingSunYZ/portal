import { getDeptAssetsList, getDeptAssets } from '@/services/hrServiceAjax';

export default {
  namespace: 'teamAssets',

  state: {
    deptAssetsNumber: {},
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *getDeptAssets({ payload }, { call, put }) {
      const response = yield call(getDeptAssets, payload);
      yield put({
        type: 'saveDeptAssets',
        payload: response,
      });
    },
    *getDeptAssetsList({ payload }, { call, put }) {
      const response = yield call(getDeptAssetsList, payload);
      yield put({
        type: 'saveDeptAssetsList',
        payload: response,
      });
    },
  },

  reducers: {
    saveDeptAssets(state, action) {
      return {
        ...state,
        deptAssetsNumber: action.payload,
      };
    },
    saveDeptAssetsList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
