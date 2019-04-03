import {
  queryScheduleGrant,
  delScheduleGrant,
  saveGrant,
  queryScheduleList,
  queryScheduleInfo,
  doSaveSchedule,
  delSchedule
} from '@/services/schedule';
import { message } from 'antd';
import router from "umi/router";

export default {
  state: {
    scheduleGrant: {
      grantedPersonNos: '',
      scheduleEventGrantList: [],
    },
    scheduleList: [],
    scheduleEvent: {},
    delGrantLoading: false,
    saveGrantLoading: false,
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
    *delScheduleGrant({ payload, callback }, { call, put }) {
      yield put({
        type: 'saveDelScheduleGrant',
        payload: true,
      });
      const response = yield call(delScheduleGrant, payload);
      if (response.code === '100') {
        if (callback && typeof callback === 'function') {
          callback(response);
        }
      } else {
        message.error(response.msg);
      }
    },
    *saveGrant({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeGrantLoading',
        payload: true,
      });
      const response = yield call(saveGrant, payload);
      if (response.code === '100') {
        if (callback && typeof callback === 'function') {
          callback(response);
        }
      } else {
        message.error(response.msg);
      }
    },
    *queryScheduleList({ payload }, { call, put }) {
      const response = yield call(queryScheduleList, payload);
      yield put({
        type: 'saveScheduleList',
        payload: response,
      });
    },
    *queryScheduleInfo({ payload, callback }, { call, put }) {
      const response = yield call(queryScheduleInfo, payload);
      if (callback && typeof callback === 'function') {
        callback(response);
      }
      yield put({
        type: 'saveScheduleInfo',
        payload: response,
      });
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
    saveDelScheduleGrant(state, action) {
      return {
        ...state,
        delGrantLoading: action.payload
      };
    },
    changeGrantLoading(state, action) {
      return {
        ...state,
        saveGrantLoading: action.payload
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
        scheduleEvent: action.payload
      };
    },
  },
};
