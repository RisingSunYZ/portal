import { getMsgList, getNoticeType, getAllSystem, updateMsgStatus, getMsgDetail } from '@/services/msgcenter';
import { message } from 'antd';

export default {
  state: {
    msgList: {
      data: [],
      rows: [],
      total: 0,
    },
    noticeType: [],
    sysData: [],
    msgDetail: {},
  },

  namespace: 'msg',

  effects: {

    /**
     * 消息列表
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getMsgList({ payload }, { call, put }) {
      const response = yield call(getMsgList, payload);
      if(response.code === "100"){
        yield put({
          type: 'saveMsgList',
          payload: response,
          pagination: payload,
        });
      }
    },
    *getNoticeType({ payload }, { call, put }) {
      const response = yield call(getNoticeType, payload);
      if(response.code === "100") {
        yield put({
          type: 'saveNoticeType',
          payload: response
        });
      }
    },
    *getAllSystem({ payload }, { call, put }) {
      const response = yield call(getAllSystem, payload);
      if(response.code === "100") {
        yield put({
          type: 'saveSystems',
          payload: response
        });
      }
    },
    *updateMsgStatus({ payload, callback }, { call, put }) {
      const response = yield call(updateMsgStatus, payload);
      if(callback && typeof callback === 'function') {
        callback(response);
      }
    },
    *getMsgDetail({ payload }, { call, put }) {
      const response = yield call(getMsgDetail, payload);
      if(response.code === "100") {
        yield put({
          type: 'saveMsgDetail',
          payload: response
        });
      }
    },
  },

  reducers: {
    saveMsgList(state, action) {
      return {
        ...state,
        msgList: action.payload.data
      };
    },
    saveNoticeType(state, action) {
      return {
        ...state,
        noticeType: action.payload.data
      };
    },
    saveSystems(state, action) {
      return {
        ...state,
        systemList: action.payload.data
      };
    },
    saveMsgDetail(state, action) {
      return {
        ...state,
        msgDetail: action.payload.data
      };
    },
  },
};
