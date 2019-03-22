import { queryMsgCount,getScheduleCount } from '@/services/api';
import {getTodoCount} from "@/services/process";
import { regWindowFun } from '../utils/utils';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    loadedAllNotices: false,
    // 公共头部 获取消息、待办
    msgCount: 0,
    todoCount: 0,
    ScheduleCount: 0,
    attendanceData: '0',
    isLeader:0,
    deptTree:[],
    deptTreeSelect:[],
    personList:[],
    quickProcess:[],
    contactUs:[],
  },

  effects: {
    // 获取用户消息数量
    *getMsgCount({ payload }, { call, put }) {
      const response = yield call(queryMsgCount, payload);
      if(response.code === "100"){
        yield put({
          type: 'saveMsgCount',
          payload: response.data,
        });
      }
    },
    // 获取用户流程中心待办数量
    *getTodoCount({ payload }, { call, put }) {
      const response = yield call(getTodoCount,payload);
      if(response.code === "100"){
        yield put({
          type: 'saveTodoCount',
          payload: response.data,
        });
      }
    },
    // 获取首页日程数量
    *getScheduleCount({ payload }, { call, put }) {
      const response = yield call(getScheduleCount,payload);
      if(response.code === "100"){
        yield put({
          type: 'saveScheduleCount',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    // 存储用户消息数量 action.payload = {lcxx:123, xtxx:55}
    saveMsgCount(state, action) {
      const count = Object.values(action.payload).reduce((prev, next)=>prev+next);
      return {
        ...state,
        msgCount:count
      };
    },
    // 存储首页待办数量
    saveTodoCount(state, action) {
      return {
        ...state,
        todoCount: action.payload,
      };
    },
    // 存储首页日程数量
    saveScheduleCount(state, action) {
      return {
        ...state,
        scheduleCount: action.payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname.includes('/main/workplace')) {
          dispatch({
            type: 'getTodoCount'
          });
          dispatch({
            type: 'getScheduleCount'
          })
        }
      });

      regWindowFun();
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
