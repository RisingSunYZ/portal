import { getAnnualEntryList,getAnnualLeaveList } from '@/services/hrServiceAjax';
import { getConfig } from '@/utils/utils';

export default {
  namespace: 'annual',

  state: {
    entry: {
      list: [],
      pagination: {},
    },
    leave: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *getAnnualEntryList({ payload }, { call, put }) {
      const response = yield call(getAnnualEntryList, payload);
      yield put({
        type: 'saveAnnualEntryList',
        payload: response,
      });
    },
    *getAnnualLeaveList({ payload }, { call, put }) {
      const response = yield call(getAnnualLeaveList, payload);
      yield put({
        type: 'saveAnnualLeaveList',
        payload: response,
      });
    },
  },

  reducers: {
    saveAnnualEntryList(state, action) {
      return {
        ...state,
        entry: action.payload,
      };
    },
    saveAnnualLeaveList(state, action) {
      return {
        ...state,
        leave: action.payload,
      };
    },
  },
};
