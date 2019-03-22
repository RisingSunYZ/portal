import {  queryUserByNo,} from '../services/user';

export default {
  namespace: 'userInfo',

  state: {
    userNo:"",
    userInfoMap:{},
  },

  effects: {
    *getUserInfo({ payload }, { call, put }) {
      const response = yield call(queryUserByNo, payload);
      yield put({
        type: 'saveUserInfo',
        payload: response,
      });
    },
  },
  reducers: {
    saveUserInfo(state, action) {
      state.userInfoMap[action.payload.userNo]=action.payload;
      return {...state};
    },
  },
};
