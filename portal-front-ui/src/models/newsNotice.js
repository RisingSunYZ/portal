import {
  queryNewsList,
  queryNoticeList,
  queryCompanyNewsList,
  queryNewsDetail,
  queryNoticeDetail,
  queryNewsNotice,
  queryNewsBanner,
  ajaxSearchNoticeList,
} from '../services/news';

export default {
  namespace: 'newsNotice',

  state: {
    data: {
      list: [],
      pagination: {},
    },

    ntlist: {},
    newsBanners:[],
    tblist: {
      data: [],
      rows: [],
      total: 0
    },
    companyNewsList: {
      data: [],
      rows: [],
      total: 0,
    },
    notice: {
      data: [],
      rows: [],
      total: 0
    },
    searchList: {
      data: [],
      rows: [],
      total: 0,
    },
    company_news: {
      data: [],
      rows: [],
      total: 0
    },
    home_notice: {
      data: [],
      rows: [],
      total: 0
    },
    msg_notice: {
      data: [],
      rows: [],
      total: 0
    },
    newsDetail: {
      news: {},
      files: [],
      newsByKeyword: [],
    },
    noticeDetail: {
      notice: {},
      files: [],
      approveRecords: [],
      watermarkTxt: '',
    },
    finance_notice: {},
    finance_expense: {},
    finance_pro: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryNewsNotice, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },

    /**
     * 登录页轮播数据获取
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *fetchNewsBanner({ payload }, { call, put }) {
      const response = yield call(queryNewsBanner, payload);
      yield put({
        type: 'saveNewsBanner',
        payload: response.data,
      });
    },

    *queryNewsList({ payload }, { call, put }) {
      const response = yield call(queryNewsList, payload);
      if(response.code === "100"){
        yield put({
          type: 'saveNewsList',
          payload: response,
        });
      }
    },

    *queryNewsNoticeData({ payload,callback }, { call, put }) {
      const response = yield call(queryNewsList, payload);
      if(response.code === "100" && callback && typeof callback === 'function'){
        callback(response.data);
      }
    },
    *queryNoticeList({ payload }, { call, put }) {
      const response = yield call(queryNoticeList, payload);
      if(response && response.data && response.data.length>0 ){
        yield put({
          type: 'saveNoticeList',
          payload: response,
        });
      }
    },
    *ajaxSearchNoticeList({ payload }, { call, put }) {
      const response = yield call(ajaxSearchNoticeList, payload);
      yield put({
        type: 'saveSearchList',
        payload: response,
      });
    },
    *queryCompanyNewsList({ payload }, { call, put }) {
      const response = yield call(queryCompanyNewsList, payload);
      yield put({
        type: 'saveCompanyNewsList',
        payload: response,
      });
    },
    *queryNoticeDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryNoticeDetail, payload);
      if(callback && typeof callback === 'function'){
        callback(response);
      }
      yield put({
        type: 'saveNoticeDetail',
        payload: response,
      });
    },
    *queryNewsDetail({ payload }, { call, put }) {
      const response = yield call(queryNewsDetail, payload);
      yield put({
        type: 'saveNewsDetail',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ntlist : action.payload,
      };
    },
    saveNewsBanner(state, action) {
      return {
        ...state,
        newsBanners : action.payload.data,
      };
    },
    saveNewsList(state, action) {
      return {
        ...state,
        notice: action.payload.data,
      };
    },

    saveNoticeList(state, action) {
      return {
        ...state,
        tblist: action.payload,
      };
    },
    saveCompanyNewsList(state, action) {
      return {
        ...state,
        companyNewsList: action.payload.data,
      };
    },
    saveNoticeDetail(state, action) {
      return {
        ...state,
        noticeDetail: action.payload.data,
      };
    },
    saveNewsDetail(state, action) {
      return {
        ...state,
        newsDetail: action.payload.data,
      };
    },
    saveSearchList(state, action){
      return {
        ...state,
        searchList: action.payload
      }
    }
  },
};
