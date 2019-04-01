import {
  queryScheduleGrant,
  queryScheduleList,
  queryScheduleInfo,
  doSaveSchedule,
  delSchedule
} from '@/services/schedule';
import { message } from 'antd';

export default {
  state: {
    scheduleGrant: {
      grantedPersonNos: '',
      scheduleEventGrantList: [],
    },
    scheduleList: [],
  },

  namespace: 'schedule',

  effects: {
    *queryScheduleGrant({ payload }, { call, put }) {
      const response = yield call(queryScheduleGrant, payload);
      yield put({
        type: 'saveScheduleGrant',
        payload: response,
      });
    },
    *queryScheduleList({ payload }, { call, put }) {
      const response = yield call(queryScheduleList, payload);
      yield put({
        type: 'saveScheduleList',
        payload: response,
      });
    },
    *queryScheduleInfo({ payload }, { call, put }) {
      const response = yield call(queryScheduleInfo, payload);
      if(response.code === "100"){
        yield put({
          type: 'saveScheduleInfo',
          payload: response,
        });
      }
    },
    *doSaveSchedule({ payload }, { call, put }) {
      const response = yield call(doSaveSchedule, payload);
      if(response.code === "100"){
        message.success(response.msg);
      }
    },
    *delSchedule({ payload }, { call, put }) {
      const response = yield call(delSchedule, payload);
      if(response.code === "100"){
        message.success(response.msg);
      }
    },
  },

  reducers: {
    saveScheduleGrant(state, action) {
      return {
        ...state,
        scheduleGrant: action.payload
      };
    },
    saveScheduleList(state, action) {
      return {
        ...state,
        scheduleList: action.payload
      };
    },
    saveScheduleInfo(state, action) {
      return {
        ...state,
        scheduleEvent: action.payload.data
      };
    },
  },
};
