import {
  queryIndustryDetail,
  queryActivityDetail,
  queryCompanyNewsList,
  queryNewsList,
  getStaffList,
  addNewsStaffs,
  queryPhoDetail,
  newsSign,
  makeThumbsUp,
  addNewscomment,
} from '@/services/news';
export default {
  namespace: 'newsInfo',

  state: {
    // 专题活动
    activity: {
      list: [],
      pagination: {},
    },
    // 新闻类数据列表
    NewsDataList:{
      data:[],
      total:0
    },
    // 公司动态
    company: {
      list: [],
      pagination: {},
    },
    // 行业动态
    industry: {
      list: [],
      pagination: {},
    },
    // 员工风采
    staffList: {
      data: [],
      total: 0,
    },
    // 所有员工风采集合
    staffPageIndex: 0,
    staffAllData: [],
    photoFile:[],
    picFiles:[],
    industryDetail: {
      news: {},
      hotter: [],
    },
    activityDetail: {
      news: {}
    },
    staffDetail: {
      list: [],
      data: {},
      comments: []
    },
  },

  effects: {

    // 获取专题活动列表
    *queryActivityList({ payload }, { call, put }) {
      const response = yield call(queryNewsList, payload);
      if ('100' === response.code){
        yield put({
          type: 'getActivityList',
          payload: response,
          pagination: payload,
        });
      }
    },

    // 获取公司动态列表
    *queryCompanyList({ payload }, { call, put }) {
      const response = yield call(queryNewsList, payload);
      yield put({
        type: 'getCompanyList',
        payload: response,
        pagination: payload,
      });
    },

    // 获取行业动态列表
    *queryIndustryList({ payload }, { call, put }) {
      const response = yield call(queryNewsList, payload);
      yield put({
        type: 'getIndustryList',
        payload: response,
        pagination: payload,
      });
    },
    // 获取新闻类数据列表数据
    *queryNewsDataList({ payload }, { call, put }) {
      const response = yield call(queryCompanyNewsList, payload);
      if(response.code === "100"){
        yield put({
          type: 'saveNewsDataList',
          payload: response,
        });
      }
    },

    *queryStaffPhotoDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryPhoDetail, payload);
      if(callback && typeof callback==='function'){callback(response)}
      yield put({
        type: 'saveStaffDetail',
        payload: response.data,
        pagination: payload,
      });
    },

    //获得员工风采列表
    *getListMedia({ payload, callback }, { call, put }) {
      const response = yield call(getStaffList, payload);
      if(callback && typeof callback==='function'){callback(response)}
      const staffPageIndex = payload.pageIndex ? payload.pageIndex : 0;
      if(response.code === '100'){
        yield put({
          type: 'saveStaffList',
          payload: {list: response.data, staffPageIndex}
        });
      }
    },
    // 点击发布增加员工相册
    *addNewsStaffPre({ payload ,callback}, { call, put }) {
      const response = yield call(addNewsStaffs, payload);
      if(callback) callback(response);
    },
    *queryIndustryDetail({ payload }, { call, put }) {
      const response = yield call(queryIndustryDetail, payload);
      yield put({
        type: 'saveIndustryDetail',
        payload: response,
      });
    },
    *queryActivityDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryActivityDetail, payload);
      if(callback && typeof callback==='function'){callback(response)}
      yield put({
        type: 'saveActivityDetail',
        payload: response,
      });
    },
    *newsSign({ payload ,callback}, { call, put }) {
      const response = yield call(newsSign, payload);
      if(callback && typeof callback === 'function') callback(response);
    },
    *makeThumbsUp({ payload ,callback}, { call, put }) {
      const response = yield call(makeThumbsUp, payload);
      if(callback && typeof callback === 'function') callback(response);
      yield put({
        type: 'saveThumbsUpState',
        payload: response,
      });
    },
    *addNewscomment({ payload ,callback}, { call, put }) {
      const response = yield call(addNewscomment, payload);
      if(callback && typeof callback === 'function') callback(response);
      if(response.code === '100'){
        yield put({
          type: 'saveComments',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    // 专题活动
    getActivityList(state, action) {
      return {
        ...state,
        activity:{
          list:action.payload.data.data,
          pagination:action.pagination,
        },
        disabled: false,
      };
    },

    // 公司动态
    getCompanyList(state, action) {
      return {
        ...state,
        company:{
          list:action.payload.data.data,
          pagination:action.pagination,
        },
        disabled: false,
      };
    },
    // 公司动态
    saveNewsDataList(state, action) {
      return {
        ...state,
        NewsDataList: action.payload.data,
      };
    },

    // 行业动态
    getIndustryList(state, action) {
      return {
        ...state,
        industry:{
          list:action.payload.data.data,
          pagination:action.pagination,
        },
        disabled: false,
      };
    },

    saveStaffList(state, action){
      const { staffPageIndex, list } = action.payload;
      return {
        ...state,
        staffPageIndex: staffPageIndex,
        staffList: list,
        staffAllData: staffPageIndex>0 ? state.staffAllData.concat(list.data) : list.data
      };
    },
    saveIndustryDetail(state, action) {
      return {
        ...state,
        industryDetail: action.payload.data,
      };
    },
    saveActivityDetail(state, action) {
      return {
        ...state,
        activityDetail: action.payload.data,
      };
    },
    saveStaffDetail(state, action){
      return {
        ...state,
        staffDetail: action.payload
      }
    },
    saveThumbsUpState(state, action){
      return {
        ...state,
        staffDetail:{
          ...state.staffDetail,
          thumbsUp: action.payload.data==1 ? state.staffDetail.thumbsUp+1 : state.staffDetail.thumbsUp-1
        }
      }
    },
    saveComments(state, action){
      return {
        ...state,
        staffDetail:{
          ...state.staffDetail,
          comments: state.staffDetail.comments.concat([action.payload])
        }
      }
    },
  },
};
