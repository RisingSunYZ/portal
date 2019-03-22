/**
 *团队绩效信息model
 */
import { getTeamPerfInfo, getTeamPerfReward ,getTeamPerfTotal} from '../../../services/hrServiceAjax';
export default {

  namespace: 'teamPerformance',

  state: {
    teamPerfInfoTbl: {
      pagination: {},
      list:[]
    },
    teamPerfRewardTbl: {
      pagination: {},
      list:[]
    },
    teamPerfTotal: [],
  },

  // put用于触发action；call用于调用异步逻辑，支持 promise；select用于从 state 里获取数据。
  effects: {
    *fetchTeamPerfInfo({ payload }, { call, put }) {
      const response = yield call(getTeamPerfInfo, payload);
      yield put({
        type: 'saveTeamPerfInfo',
        payload: response,
      });
    },
    *fetchTeamPerfReward({ payload }, { call, put }) {
      const response = yield call(getTeamPerfReward, payload);
      yield put({
        type: 'saveTeamPerfReward',
        payload: response,
      });
    },
    *fetchTeamPerfTotal({ payload }, { call, put }) {
      const response = yield call(getTeamPerfTotal, payload);
      yield put({
        type: 'saveTeamPerfTotal',
        payload: response,
      });
    },
  },

  reducers: {
    saveTeamPerfInfo(state, action) {
      let actionData = action.payload.data;
      //此处增加判断，防止数据未查询到，返回null时，页面崩溃
      if (!! actionData) {
        return {
          ...state,
          teamPerfInfoTbl: actionData,
        };
      } else {
        const obj = { total: 0, data: [] };
        return {
          ...state,
          teamPerfInfoTbl: obj
        };
      }
    },
    saveTeamPerfReward(state, action) {
      return {
        ...state,
        teamPerfRewardTbl: action.payload
      };
    },
    saveTeamPerfTotal(state, action) {
      return {
        ...state,
        teamPerfTotal: action.payload
      };
    },
  },
};
