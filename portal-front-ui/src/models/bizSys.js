import { getMenuTree } from '@/services/bizSys';
import { queryMsgCount } from '@/services/api';
import { message } from 'antd';

export default {
  state: {
    menu: [],
    msgCount: {},
  },

  namespace: 'bizSys',

  effects: {

    /**
     * 所有系统列表
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getMenuTree({ payload }, { call, put }) {
      const response = yield call(getMenuTree, payload);
      yield put({
        type: 'saveTreeMenu',
        payload: response
      });
    },
    // 获取用户消息数量
    *getMsgCount({ payload }, { call, put }) {
      const response = yield call(queryMsgCount, payload);
      if(response.code === "100"){
        yield put({
          type: 'saveMsgCount',
          payload: response,
        });
      }
    },
  },

  reducers: {
    saveTreeMenu(state, action) {
      return {
        ...state,
        menu: action.payload.datas
      };
    },
    saveMsgCount(state, action) {
      return {
        ...state,
        msgCount: action.payload.data
      };
    },
  }
};
