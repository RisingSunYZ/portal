import { queryTodo,queryAlreadyDo} from '../../../services/process';

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

  namespace: 'hrProcess',

  effects: {
    *queryTodo({ payload }, { call, put }) {

      const response = yield call(queryTodo, payload);
      yield put({
        type: 'queryList',
        payload: response.data,
        // pagination: payload,
      });
    },
    *queryDone({ payload }, { call, put }) {
      const response = yield call(queryAlreadyDo, payload);
      yield put({
        type: 'queryDoneList',
        payload: response.data
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
