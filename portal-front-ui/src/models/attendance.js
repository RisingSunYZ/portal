import {
  getLeaveDaysStatistic,
  getLeaveDetails,
  getBusinessTripDetail,
  getLateAbsenteeism,
  getAbsenteeism,
  getSummaryAttendance,
  getException,
  getBusinessTrip,
  getAttendanceRecord,
} from '@/services/hrService';

export default {
  namespace: 'attendance',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    qjlist: [],
    a: {},
    b: {},
    c:{},
    d:{},
    e:{},
    aNumberData: {},
    exceptionList:[],
    recordData: [],
  },
  effects: {
    *getLeaveDaysStatistic({ payload }, { call, put }) {
      const response = yield call(getLeaveDaysStatistic, payload);
      yield put({
        type: 'saveLeaveDaysStatistic',
        payload: response,
      });
    },
    *getLeaveDetails({ payload }, { call, put }) {
      const response = yield call(getLeaveDetails, payload);
      yield put({
        type: 'saveLeaveDetails',
        payload: response,
      });
    },
    *getBusinessTripDetail({ payload }, { call, put }) {
      const response = yield call(getBusinessTripDetail, payload);
      yield put({
        type: 'saveBusinessTripDetail',
        payload: response,
      });
    },
    *getBusinessTrip({ payload }, { call, put }) {
      const response = yield call(getBusinessTrip, payload);
      yield put({
        type: 'saveBusinessTrip',
        payload: response,
      });
    },
    *getLateAbsenteeism({ payload }, { call, put }) {
      const response = yield call(getLateAbsenteeism, payload);
      yield put({
        type: 'saveLateAbsenteeism',
        payload: response,
      });
    },
    *getAbsenteeism({ payload }, { call, put }) {
      const response = yield call(getAbsenteeism, payload);
      yield put({
        type: 'saveAbsenteeism',
        payload: response,
      });
    },
    *getSummaryAttendance({ payload }, { call, put }) {
      const response = yield call(getSummaryAttendance, payload);
      yield put({
        type: 'saveSummaryAttendance',
        payload: response,
      });
    },
    *getException({ payload }, { call, put }) {
      const response = yield call(getException, payload);
      yield put({
        type: 'fetchException',
        payload: response,
      });
    },
    *getAttendanceRecord({ payload }, { call, put }) {
      const response = yield call(getAttendanceRecord, payload);
      yield put({
        type: 'saveAttendanceRecord',
        payload: response,
      });
    },
  },

  reducers: {
    saveLeaveDaysStatistic(state, action) {
      return {
        ...state,
        qjlist: action.payload,
      };
    },
    saveLeaveDetails(state, action) {
      return {
        ...state,
        a: action.payload,
      };
    },
    saveBusinessTripDetail(state, action) {
      return {
        ...state,
        b: action.payload,
      };
    },
    saveBusinessTrip(state, action) {
      return {
        ...state,
        c: action.payload,
      };
    },
    saveLateAbsenteeism(state, action) {
      return {
        ...state,
        d: action.payload,
      };
    },
    saveAbsenteeism(state, action) {
      return {
        ...state,
        e: action.payload,
      };
    },
    saveSummaryAttendance(state, action) {
      return {
        ...state,
        aNumberData: action.payload,
      };
    },
    fetchException (state, action) {
      return {
        ...state,
        exceptionList: action.payload,
      };
    },
    saveAttendanceRecord(state, action){
      return {
        ...state,
        recordData: action.payload,
      };
    },
  },
};
