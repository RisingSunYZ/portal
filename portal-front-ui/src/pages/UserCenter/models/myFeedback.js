import {getFeedback, getLeaveDaysStatistic, getYearList} from '../../../services/hrService';
import { referFeedback} from '../../../services/hrServiceAjax';
import { message } from 'antd';
import router from 'umi/router';
export default {

  namespace: 'myFeedback',

  state : {
    feedbackObj: {},
    submitFbRep: {},
  },

  effects: {
    *receiveFeedback ({ payload }, { call, put }) {
      const response = yield call(getFeedback, payload);
      yield put({
        type: 'saveFeedback',
        payload: response,
      });
    },
    *submitFeedback ({ payload }, { call, put }) {
      const response = yield call(referFeedback, payload);
      let code = response.code;
      if (code == 1) {
        message.success(response.msg);
        setTimeout(function(){
          window.opener.focus();
          window.open('','_self','');
          window.close();
        }, 100);
      } else {
        message.error(response.msg);
      }
    }
  },

  reducers: {
    saveFeedback (state, action) {
      return {
        ...state,
        feedbackObj: JSON.parse(action.payload.data),
      };
    },
    saveSubmitFbRep (state, action) {
      return {
        ...state,
        submitFbRep: action.payload,
      };
    }
  },

};
