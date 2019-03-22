import { getPersonalAssetsDetails, getChargeAssetsDetails,getAssetsList } from '../../../services/hrService';

export default {
  namespace: 'assets',

  state: {
    pData: {},
    cData: {},
    pfList:[],
    psList:[],
    cfList:[],
    csList:[],
  },

  effects: {
    *getPersonalAssetsDetails({ payload }, { call, put }) {
      const response = yield call(getPersonalAssetsDetails, payload);
      yield put({
        type: 'savePersonalAssetsDetails',
        payload: response,
      });
    },
    *getChargeAssetsDetails({ payload }, { call, put }) {
      const response = yield call(getChargeAssetsDetails, payload);
      yield put({
        type: 'saveChargeAssetsDetails',
        payload: response,
      });
    },
    *getPersonalFixedAssetsList({ payload }, { call, put }) {
      const response = yield call(getAssetsList, payload);
      yield put({
        type: 'savePersonalFixedAssetsList',
        payload: response,
      });
    },
    *getPersonalSoftwareAssetsList({ payload }, { call, put }) {
      const response = yield call(getAssetsList, payload);
      yield put({
        type: 'savePersonalSoftwareAssetsList',
        payload: response,
      });
    },
    *getChargeFixedAssetsList({ payload }, { call, put }) {
      const response = yield call(getAssetsList, payload);
      yield put({
        type: 'saveChargeFixedAssetsList',
        payload: response,
      });
    },
    *getChargeSoftwareAssetsList({ payload }, { call, put }) {
      const response = yield call(getAssetsList, payload);
      yield put({
        type: 'saveChargeSoftwareAssetsList',
        payload: response,
      });
    },
  },

  reducers: {
    savePersonalAssetsDetails(state, action) {
      return {
        ...state,
        pData: action.payload,
      };
    },
    saveChargeAssetsDetails(state, action) {
      return {
        ...state,
        cData: action.payload,
      };
    },
    savePersonalFixedAssetsList(state, action) {
      return {
        ...state,
        pfList: action.payload,
      };
    },
    savePersonalSoftwareAssetsList(state, action) {
      return {
        ...state,
        psList: action.payload,
      };
    },
    saveChargeFixedAssetsList(state, action) {
      return {
        ...state,
        cfList: action.payload,
      };
    },
    saveChargeSoftwareAssetsList(state, action) {
      return {
        ...state,
        csList: action.payload,
      };
    },
  },
};
