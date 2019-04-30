import {
  queryApplyList ,
  querymRoomList,
  getmRoomDetail ,
  getMeetingAddrsTools,
  getMeetingApplyById ,
  queryMyApplyList,
  saveMtRoomMsg,
  ReSubmitProcess,
  updateMeetingStatus,
} from '@/services/meetingRoom';
import { message } from 'antd';

export default {
  state: {
    roomList: {
      total: 0,
      data: [],
    },
    applyList: [],
    meetingroomAddrs: [],
    meetingroomTools: [],
    applyDetail: {
      applyVo: {},
      loginUser: {},
      meetingroom: {},
      meetingroomAddr: {},
    },
    myApply: {
      total: 0,
      rows: []
    }
  },
  namespace: 'mtRoom',
  effects: {
    *queryApplyList({ payload, callback }, { call, put }) {
      const response = yield call(queryApplyList, payload);
      if(callback && typeof callback === 'function'){
        callback(response.applyVos);
      }
      yield put({
        type: 'saveApplyList',
        payload: response
      })
    },
    *querymRoomList({ payload, callback }, { call, put }) {
      const response = yield call(querymRoomList, payload);
      if(callback && typeof callback === 'function'){
        callback(response);
      }
      yield put({
        type: 'saveRoomList',
        payload: response
      })
    },
    *getmRoomDetail({ payload }, { call, put }) {
      const response = yield call(getmRoomDetail, payload);
      yield put({
        type: 'saveRoomDetail',
        payload: response
      })
    },
    *getMeetingAddrsTools({payload},{call,put}) {
      const response= yield call(getMeetingAddrsTools,payload);
      yield put({
        type: 'saveTools',
        payload: response
      })
    },
    *getMeetingApplyById({payload},{call,put}) {
      const response= yield call(getMeetingApplyById,payload);
      yield put({
        type: 'saveMeetingData',
        payload:response.data
      });
    },
    *queryMyApplyList({payload},{call,put}){
      const response= yield call(queryMyApplyList,payload);
      yield put({
        type: 'saveMyApplyList',
        payload:response
      });
    },
    *saveMtRoomMsg({payload, callback},{call,put}) {
      const response= yield call(saveMtRoomMsg,payload);
      if(callback && typeof callback === 'function'){
        callback(response)
      }
    },
    *ReSubmitProcess({payload,callback},{call,put}) {
      const response= yield call(ReSubmitProcess,payload);
      if(callback && typeof callback === 'function'){
        callback(response)
      }
    },
    *updateMeetingStatus({payload,callback},{call,put}){
      const response= yield call(updateMeetingStatus,payload);
      if(callback && typeof callback === 'function') callback(response);
    },
  },

  reducers: {
    saveApplyList(state, action) {
      return {
        ...state,
        applyList: action.payload.applyVos
      };
    },
    saveRoomList(state, action) {
      return {
        ...state,
        roomList: action.payload
      };
    },
    saveRoomDetail(state, action) {
      return {
        ...state,
        applyDetail: action.payload
      };
    },
    saveTools(state, action) {
      return {
        ...state,
        meetingroomAddrs: action.payload.meetingroomAddrs,
        meetingroomTools: action.payload.meetingroomTools,
      };
    },
    saveMyApplyList(state, action) {
      return {
        ...state,
        myApply: action.payload,
      };
    },
  },
};
