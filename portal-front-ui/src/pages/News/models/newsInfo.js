import {
  queryIndustryDetail,
  queryActivityDetail,
  queryCompanyNewsList,
  queryNewsList,
  getStaffList,
  addNewsStaffs ,
  queryPhoDetail,
  newsSign
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
    staffPresence: {
      list: [],
      pagination: {},
    },
    staffLists:[], //员工相册 更多
    photoFile:[],
    picFiles:[],
    industryDetail: {
      news: {},
      hotter: [],
    },
    activityDetail: {
      news: {}
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

    // 获取员工风采图片列表
    *queryStaffPresenceList({ payload }, { call, put }) {
      const response = yield call(queryNewsList, payload);
      yield put({
        type: 'getStaffPresenceList',
        payload: response.data,
        pagination: payload,
      });
    },


    *queryStaffPhotoDetail({ payload }, { call, put }) {

      const response = yield call(queryPhoDetail, payload);
      yield put({
        type: 'getStaffDetail',
        payload: response.data,
        pagination: payload,
      });
    },

    //获得员工风采的更多页面
    *getListMedia({ payload }, { call, put }) {
      const response = yield call(getStaffList, payload);
      yield put({
        type: 'staffData',
        payload: response.data
      });
    },
    /**
     * 点击发布增加员工相册
     * @param payload
     * @param callback
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
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

    // 员工风采
    getStaffPresenceList(state, action) {
      return {
        ...state,
        staffPresence:{
          list:action.payload.data,
          pagination:action.pagination,
        },
        disabled: false,
      };
    },

    staffData(state, action){
      return {
        ...state,
        staffLists: action.payload.data
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
  },
};
