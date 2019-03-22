import {
  queryNewsList,
  queryNoticeList,
  queryCompanyNewsList,
  queryNewsDetail,
  queryNoticeDetail,
  queryNewsNotice,
  queryNewsBanner,
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
    newsDetail: {},
    noticeDetail: {},
    finance_notice: {},
    finance_info: {},
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

    *queryNewsNoticeData({ payload }, { call, put }) {
      const response = yield call(queryNewsList, payload);
      // response.typeSn = payload.typeSn
      if(response.code === "100"){
        yield put({
          type:  "save" + payload.typeSn,
          payload: response,
          typeSn:payload.typeSn
        });
      }

    },
    *queryNoticeList({ payload }, { call, put }) {
      const response = yield call(queryNoticeList, payload);
      yield put({
        type: 'saveNoticeList',
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
    *queryNoticeDetail({ payload }, { call, put }) {
      const response = yield call(queryNoticeDetail, payload);
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
    savehome_notice(state, action) {
      return {
        ...state,
        home_notice: action.payload.data,
      };
    },
    savecompany_news(state, action) {
      return {
        ...state,
        company_news: action.payload.data,
      };
    },
    savemsg_notice(state, action){
      return {
        ...state,
        msg_notice: action.payload.data,
      };
    },
    saveNoticeList(state, action) {
      return {
        ...state,
        tblist: action.payload,
      };
    },
    queryCompanyNewsList(state, action) {
      return {
        ...state,
        companyNewsList: action.payload,
      };
    },
    saveNoticeDetail(state, action) {
      return {
        ...state,
        noticeDetail: action.payload,
      };
    },
    saveNewsDetail(state, action) {
      return {
        ...state,
        newsDetail: action.payload,
      };
    },
    savefinance_notice(state, action) {
      return {
        ...state,
        finance_notice: action.payload.data,
      };
    },
    savefinance_info(state, action) {
      return {
        ...state,
        finance_info: action.payload.data,
      };
    },
    savefinance_expense(state, action) {
      return {
        ...state,
        finance_expense: action.payload.data,
      };
    },
    savefinance_pro(state, action) {
      return {
        ...state,
        finance_pro: action.payload.data,
      };
    },
  },
};
