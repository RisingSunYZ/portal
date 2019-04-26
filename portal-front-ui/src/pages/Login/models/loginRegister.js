import { fakeRegister } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
// import {routerRedux} from "dva/router";
import router from "umi/router";

export default {
  namespace: 'loginRegister',

  state: {
    status: undefined,
    username:undefined,
  },

  effects: {
    *submit({ payload,callback }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      if (response && callback && typeof callback === 'function') {
        callback(response); // 返回结果
        // Login successfully
        if (response.code === 1) {
          response.status="ok";
          router.push({
            pathname:'/user/register-result',
            query:{username:response.data.username},
          });
          // router.push('/user/register-result');
        }else{
          response.status="error";
        }
      }
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
        username:payload.data
      };
    },
    changeStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
