import { getMenuTree } from '@/services/bizSys';
import { getMsgList, getMsgCount, getAllSystem } from '@/services/msgcenter';
import { message } from 'antd';

export default {
  state: {
    sysData: [],
    menu: [],
    count: {},
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

    *getMenuTree({ payload }, { call, put }) {
      const response = yield call(getMenuTree, payload);
      yield put({
        type: 'saveTreeMenu',
        payload: response
      });
    },
    *getMsgCount({ payload }, { call, put }) {
      const response = yield call(getMsgCount, payload);
      yield put({
        type: 'saveMsgCount',
        payload: response
      });
    },
    *getAllSystem({ payload }, { call, put }) {
      const response = yield call(getAllSystem, payload);
      yield put({
        type: 'saveSystems',
        payload: response
      });
    }
  },

  reducers: {
    saveMsgList(state, action) {
      return {
        ...state,
        msgList: action.payload.data
      };
    },
    saveTreeMenu(state, action) {
      return {
        ...state,
        menu: action.payload.datas
      };
    },
    saveMsgCount(state, action) {
      return {
        ...state,
        count: action.payload.data
      };
    },
    saveSystems(state, action) {
      return {
        ...state,
        systemList: action.payload.data
      };
    },

  },
};
