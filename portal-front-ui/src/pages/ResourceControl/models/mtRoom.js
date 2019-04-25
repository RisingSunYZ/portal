import {
  queryApplyList ,
  querymRoomList,
  getmRoomDetail ,
  getMeetingAddrsTools,
  getMeetingApplyById ,
  queryMyApplyList,
  saveMtRoomMsg,
  submitProcess,
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
      if(response.code === "100"){
        yield put({
          type: 'saveRoomDetail',
          payload: response
        })
      }
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
      if(response.code==="100"){
        yield put({
          type: 'saveMeetingData',
          payload:response.data
        });
      }
    },
    *saveMtRoomMsg({payload},{call,put}) {
      const response= yield call(saveMtRoomMsg,payload);
      if(response.code === "100"){
        yield put({
          type: 'saveMeetingData',
          payload:response.data
        });
      }else{
        message.error(response.msg);
      }
    },
    *submitProcess({payload,callback},{call,put}) {
      const response= yield call(submitProcess,payload);
      if(response.code === '100'){
        yield put({
          type: 'delDraftById',
          payload:{ id: payload.id }
        });
        message.success(response.msg)
      }
    },
    *updateMeetingStatus({payload,callback},{call,put}){
      const response= yield call(updateMeetingStatus,payload);
      yield put({
        type: 'sendData',
        payload:response
      });
      if(callback) callback(response);
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
        roomDetail: action.payload.data
      };
    },
    saveTools(state, action) {
      return {
        ...state,
        meetingroomAddrs: action.payload.meetingroomAddrs,
        meetingroomTools: action.payload.meetingroomTools,
      };
    },
  },
};
