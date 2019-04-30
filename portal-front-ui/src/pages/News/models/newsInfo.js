import { queryNewsList,getStaffList,addNewsStaffs ,queryPhoDetail} from '../../../services/news';
export default {
  namespace: 'newsInfo',

  state: {
    // 专题活动
    activity: {
      list: [],
      pagination: {},
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
    picFiles:[]
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

    /**
     * 上传图片
     * @param state
     * @param action
     * @returns {*}
     */
    addPhotos(state, action) {
      const photoList = action.payload.fileList[0];
      if(photoList.response){
        if (photoList && photoList.percent === 100) {
          return { ...state };
        }

        const file = {
          id: photoList.uid,
          name: photoList.name,
          filePath: photoList.response ? photoList.response.data : '',
          ...photoList,
        };

        let picFiles = [];
        if(state.photoFile){
          picFiles = state.photoFile.concat(file);
        }else{
          picFiles.push(file);
        }
        const result = {
          ...state,
          picFiles
        };
        return result;
      }

      const result = {
        ...state,
      };
      return result;

    },
  },
};
