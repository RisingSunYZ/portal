import {query as queryUsers, queryCurrent, queryUserByNo, getAllUser, getAllDept } from '../services/user';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import {getConfig} from "../utils/utils";


export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    list: [],
    currentUser: {},
    userInfo: {},
    orgTree: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },


    /**
     * 获取当前用户相关信息
     * @param callback
     * @param call
     * @param put
     */
    *fetchCurrent({ callback }, { call, put }) {
      const response = yield call(queryCurrent);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
      if(response.code == '100'){
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }else{
        location.href = getConfig().domain
        // if(window.location.href.indexOf("redirect") === -1){
        //   yield put(
        //     routerRedux.push({
        //       pathname: '/user/login',
        //       search: stringify({
        //         redirect: window.location.href,
        //       }),
        //     })
        //   );
        // }
      }
    },



    *getUserByNo({ payload }, { call, put }) {
      const response = yield call(queryUserByNo, payload);
      yield put({
        type: 'saveUserInfo',
        payload: response,
      });
    },
    *getAllUser({ payload }, { call, put }) {
      const response = yield call(getAllUser, payload);
      yield put({
        type: 'saveAllUser',
        payload: response,
      });
    },
    *getAllDept({ payload }, { call, put }) {
      const response = yield call(getAllDept, payload);
      yield put({
        type: 'saveAllDept',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveUserInfo(state, action) {
      return {
        ...state,
        userInfo: action.payload,
      };
    },
    saveAllUser(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveAllDept(state, action) {
      return {
        ...state,
        orgTree: action.payload,
      };
    },


    saveCurrentUser(state, action) {
      window.currentUser = action.payload.data || {};
      return {
        ...state,
        currentUser: action.payload.data || {},
        mobile:action.payload.data.mobile,
      };
    },

    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
