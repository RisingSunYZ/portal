/**团队资料绩效信息model
 */
import { getTrainingCourse, getCourseDevelop, getComplete, getTrainingDetail } from '@/services/hrServiceAjax';

export default {

  namespace: 'teamTrain',

  state: {
    trainingCourse: [],
    courseDevelop: [],
    complete: [],
    trainingDetail: {}
  },

  // put用于触发action；call用于调用异步逻辑，支持 promise；select用于从 state 里获取数据。
  effects: {
    *fetchTrainingCourse({ payload }, { call, put }) {
      const response = yield call(getTrainingCourse, payload);
      yield put({
        type: 'saveTrainingCourse',
        payload: response,
      });
    },
    *fetchCourseDevelop({ payload }, { call, put }) {
      const response = yield call(getCourseDevelop, payload);
      yield put({
        type: 'saveCourseDevelop',
        payload: response,
      });
    },
    *fetchComplete({ payload }, { call, put }) {
      const response = yield call(getComplete, payload);
      yield put({
        type: 'saveComplete',
        payload: response,
      });
    },
    *fetchTrainingDetail({ payload }, { call, put }) {
      const response = yield call(getTrainingDetail, payload);
      yield put({
        type: 'saveTrainingDetail',
        payload: response,
      });
    }
  },

  reducers: {
    saveTrainingCourse (state, action) {
      let data = [];
      if (action.payload != null) {
        data = action.payload;
        const {planTrainCourse, completeTrainCourse, completeTrainOutCourse } = data;
        let rateStr = '';
        if (planTrainCourse) {
          let rate = (Number(completeTrainCourse)/Number(planTrainCourse));
          rateStr = (rate*100).toFixed(2).toString()+'%';
        }
        if (typeof planTrainCourse !== 'undefined') {
          data.planTrainCourse = Number(planTrainCourse).toFixed(2);
        }
        if (typeof completeTrainCourse !== 'undefined') {
          data.completeTrainCourse = Number(completeTrainCourse).toFixed(2)
        }
        if (typeof completeTrainOutCourse !== 'undefined') {
          data.completeTrainOutCourse = Number(completeTrainOutCourse).toFixed(2)
        }
        data.completionRate = rateStr;
        data = [data];
      }
      return {
        ...state,
        trainingCourse: data,
      };
    },
    saveCourseDevelop (state, action) {
      let data = [];
      if (action.payload) {
        data = action.payload;
        const {quarterPlanNum, actualQuarterNum} = data;
        let rateStr = '';
        if (quarterPlanNum) {
          let rate = (Number(actualQuarterNum)/Number(quarterPlanNum));
          rateStr = (rate*100).toFixed(2).toString()+'%';
        }
        if (typeof quarterPlanNum !== 'undefined') {
          data.quarterPlanNum = Number(quarterPlanNum).toFixed(2);
        }
        if (typeof actualQuarterNum !== 'undefined') {
          data.actualQuarterNum = Number(actualQuarterNum).toFixed(2)
        }
        data.completionRate = rateStr;
        data = [data];
      }
      return {
        ...state,
        courseDevelop : data,
      };
    },
    saveComplete (state, action) {
      let data = [];
      if (action.payload) {
        data = action.payload;
        data.averageHours = data.averageHours.toFixed(2);
        data.averageFinishClassHours = data.averageFinishClassHours.toFixed(2);
        data.averageFinishElectiveHours = data.averageFinishElectiveHours.toFixed(2);
        data.averageFinishShareHours = data.averageFinishShareHours.toFixed(2);
        data.averageFinishTotalHours = data.averageFinishTotalHours.toFixed(2);
        if (data.completionRate) {
          let rate = (Number(data.completionRate));
          let rateStr = (rate*100).toFixed(2).toString()+'%';
          data.completionRate = rateStr;
        }
        data = [data];
      }
      return {
        ...state,
        complete: data,
      };
    },
    saveTrainingDetail (state, action) {
      let data = {};
      if (action.payload) {
        data = action.payload
      }
      return {
        ...state,
        trainingDetail: data,
      };
    },
  },
};
