import { queryTodo,queryDone} from '@/services/process';
import { message } from 'antd';

export default {
  state: {
    data: {
      list: [],
      pagination: {},
    },
    DoneData: {
      list: [],
      pagination: {},
    },
  },

  namespace: 'inforTech',

  effects: {
    *queryTodo({ payload }, { call, put }) {
      const response = yield call(queryTodo, payload);
      yield put({
        type: 'queryList',
        payload: response,
        pagination: payload,
      });
    },
    *queryDone({ payload }, { call, put }) {
      const response = yield call(queryDone, payload);
      yield put({
        type: 'queryDoneList',
        payload: response,
        pagination: payload,
      });
    },

  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload,
        disabled: false,
      };
    },
    queryDoneList(state, action) {
      return {
        ...state,
        DoneData: action.payload,
        disabled: false,
      };
    },
  },
};
