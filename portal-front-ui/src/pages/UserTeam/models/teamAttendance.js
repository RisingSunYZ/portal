import {
  getUserTeamLeaveDaysStatistic,
  getUserTeamLeaveDetails,
  getUserTeamBusinessTripDetail,
  getUserTeamLateAbsenteeism,
  getUserTeamAbsenteeism,
  getUserTeamSummaryAttendance,
  getUserTeamBusinessTrip,
  getUserTeamWorkOvertimeDetail,
  getTeamAttendanceRecord,
} from '../../../services/hrServiceAjax';
import {
  getAttendanceRecord,
  getTeamAttendChart,
  getTeamAttendChartMember,
  getTeamAttendRateChart,
  getSiblingDepts,
} from '../../../services/hrUserTeamService';

export default {
  namespace: 'teamAttendance',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    qjlist: [],
    a: {},
    b: {},
    c: {},
    d: {},
    e: {},
    f: {},
    g: {},
    j: {},
    aNumberData: {},
    exceptionList: [],
    recordData: [],
    teamAttendChart: [],
    teamAttendChartMember: [],
    teamAttendRateChart: [],
    siblingDepts: [],
  },
  effects: {
    *getUserTeamSummaryAttendance({ payload }, { call, put }) {
      const response = yield call(getUserTeamSummaryAttendance, payload);
      yield put({
        type: 'saveUserTeamSummaryAttendance',
        payload: response,
      });
    },
    *getUserTeamLeaveDaysStatistic({ payload }, { call, put }) {
      const response = yield call(getUserTeamLeaveDaysStatistic, payload);
      yield put({
        type: 'saveUserTeamLeaveDaysStatistic',
        payload: response,
      });
    },

    *getUserTeamLeaveDetails({ payload }, { call, put }) {
      const response = yield call(getUserTeamLeaveDetails, payload);
      yield put({
        type: 'saveUserTeamLeaveDetails',
        payload: response,
      });
    },

    *getUserTeamWorkOvertimeDetail({ payload }, { call, put }) {
      const response = yield call(getUserTeamWorkOvertimeDetail, payload);
      yield put({
        type: 'saveUserTeamWorkOvertimeDetail',
        payload: response,
      });
    },

    *getUserTeamBusinessTripDetail({ payload }, { call, put }) {
      const response = yield call(getUserTeamBusinessTripDetail, payload);
      yield put({
        type: 'saveUserTeamBusinessTripDetail',
        payload: response,
      });
    },

    *getUserTeamBusinessTrip({ payload }, { call, put }) {
      const response = yield call(getUserTeamBusinessTrip, payload);
      yield put({
        type: 'saveUserTeamBusinessTrip',
        payload: response,
      });
    },

    *getUserTeamLateAbsenteeism({ payload }, { call, put }) {
      const response = yield call(getUserTeamLateAbsenteeism, payload);
      yield put({
        type: 'saveUserTeamLateAbsenteeism',
        payload: response,
      });
    },

    *getUserTeamAbsenteeism({ payload }, { call, put }) {
      const response = yield call(getUserTeamAbsenteeism, payload);
      yield put({
        type: 'saveUserTeamAbsenteeism',
        payload: response,
      });
    },
    *getTeamAttendanceRecord({ payload }, { call, put }) {
      const response = yield call(getTeamAttendanceRecord, payload);
      yield put({
        type: 'saveUserTeamAttendanceRecord',
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

    *fetchTeamAttendChart({ payload }, { call, put }) {
      const response = yield call(getTeamAttendChart, payload);
      yield put({
        type: 'saveTeamAttendChart',
        payload: response,
      });
    },

    *fetchTeamAttendChartMember({ payload }, { call, put }) {
      const response = yield call(getTeamAttendChartMember, payload);
      yield put({
        type: 'saveTeamAttendChartMember',
        payload: response,
      });
    },

    *fetchTeamAttendRateChart({ payload }, { call, put }) {
      const response = yield call(getTeamAttendRateChart, payload);
      yield put({
        type: 'saveTeamAttendRateChart',
        payload: response,
      });
    },

    *fetchSiblingDepts({ payload }, { call, put }) {
      const response = yield call(getSiblingDepts, payload);
      yield put({
        type: 'saveSiblingDepts',
        payload: response,
      });
    },
  },

  reducers: {
    saveUserTeamSummaryAttendance(state, action) {
      return {
        ...state,
        aNumberData: action.payload,
      };
    },

    saveUserTeamLeaveDaysStatistic(state, action) {
      return {
        ...state,
        qjlist: action.payload,
      };
    },
    saveUserTeamLeaveDetails(state, action) {
      return {
        ...state,
        a: action.payload,
      };
    },
    saveUserTeamWorkOvertimeDetail(state, action) {
      return {
        ...state,
        f: action.payload,
      };
    },

    saveUserTeamBusinessTripDetail(state, action) {
      return {
        ...state,
        b: action.payload,
      };
    },
    saveUserTeamBusinessTrip(state, action) {
      return {
        ...state,
        c: action.payload,
      };
    },
    saveUserTeamLateAbsenteeism(state, action) {
      return {
        ...state,
        d: action.payload,
      };
    },
    saveUserTeamAbsenteeism(state, action) {
      return {
        ...state,
        e: action.payload,
      };
    },
    saveUserTeamAttendanceRecord(state, action) {
     let j= action.payload.jl && JSON.parse(action.payload.jl);
     let g= action.payload.tx && JSON.parse(action.payload.tx);
      return {
        ...state,
        g: g,
        j: j,
      };
    },

    saveAttendanceRecord(state, action) {
      return {
        ...state,
        recordData: action.payload,
      };
    },

    saveTeamAttendChart(state, action) {
      let data = action.payload;
      const sequence = (a, b) => {
        if (a.avgWorkHour > b.avgWorkHour) {
          return 1;
        } else if (a.avgWorkHour < b.avgWorkHour) {
          return -1;
        } else {
          return 0;
        }
      };
      data.map((chartData, index) => {
        if (typeof chartData.avgWorkHour == 'undefined') {
          chartData.avgWorkHour = 0;
        } else {
          let number = Number(chartData.avgWorkHour);
          chartData.avgWorkHour = number;
        }
      });
      data.sort(sequence);
      return {
        ...state,
        teamAttendChart: data,
      };
    },

    saveTeamAttendChartMember(state, action) {
      let data = action.payload;
      if (data) {
        data.map((item, index) => {
          if (item.avgWorkHour) {
            let number = Number(item.avgWorkHour);
            item.avgWorkHour = number;
          } else {
            chartData.avgWorkHour = 0;
          }
        })
      }
      return {
        ...state,
        teamAttendChartMember: data,
      };
    },

    saveTeamAttendRateChart(state, action) {
      let data = action.payload;
      const sequence = (a, b) => {
        if (a.totalAtdRate > b.totalAtdRate) {
          return 1;
        } else if (a.totalAtdRate < b.totalAtdRate) {
          return -1;
        } else {
          return 0;
        }
      };
      data.map((chartData, index) => {
        if (typeof chartData.totalAtdRate == 'undefined') {
          chartData.totalAtdRate = 0;
        } else {
          let number = Number(chartData.totalAtdRate);
          chartData.totalAtdRate = number;
        }
        chartData.rateStr = chartData.totalAtdRate * 100 + '%';
      });
      if (data[0] && data[0].deptId) {
        data.sort(sequence);
      }
      return {
        ...state,
        teamAttendRateChart: data,
      };
    },

    saveSiblingDepts(state, action) {
      return {
        ...state,
        siblingDepts: action.payload,
      };
    },
  },
};
