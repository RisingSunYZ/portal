import {
  getAuthorizedStrengthTotal,
  getAuthorizedStrengthList,
  getAuthorizedStrengthDetails,
} from '../../../services/hrServiceAjax';
import config from '../../../../config/config';
import { getConfig } from '../../../utils/utils';

export default {
  namespace: 'authorizedStrength',

  state: {
    totals: {},
    data: {
      list: [],
      pagination: {},
    },
    details: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *getAuthorizedStrengthTotal({ payload }, { call, put }) {
      const response = yield call(getAuthorizedStrengthTotal, payload);
      yield put({
        type: 'saveAuthorizedStrengthTotal',
        payload: response,
      });
    },
    *getAuthorizedStrengthList({ payload }, { call, put }) {
      const response = yield call(getAuthorizedStrengthList, payload);
      yield put({
        type: 'saveAuthorizedStrengthList',
        payload: response,
      });
    },
    *getAuthorizedStrengthDetails({ payload }, { call, put }) {
      const response = yield call(getAuthorizedStrengthDetails, payload);
      yield put({
        type: 'saveAuthorizedStrengthDetails',
        payload: response,
      });
    },
  },

  reducers: {
    saveAuthorizedStrengthTotal(state, action) {
      return {
        ...state,
        totals: action.payload,
      };
    },
    saveAuthorizedStrengthList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveAuthorizedStrengthDetails(state, action) {
      return {
        ...state,
        details: action.payload,
      };
    },
  },
};
