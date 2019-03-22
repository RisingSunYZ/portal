import {
  queryAlreadySend,
  queryTreeData,
  queryTreeDataSearch,
  queryTopConcactData,
  delDraft,
  getModelList,
  getFormDataList,
  addContactPerData
} from '../../../services/addressBook';
import router from 'umi/router';
import { message } from 'antd';
import { regWindowFun } from "../../../utils/utils";
export default {
  state: {
    data: {
      list: [],
      pagination: {},
      selectTableKeys:[]
    },


    // alreadySendData: {//已发数据
    //   list: [],
    //   pagination: {},
    // },
    //
    // formData: {//表单查询数据
    //   list: [],
    //   pagination: {},
    // },
    draftData: {//草稿数据
      list: [],
      pagination: {},
    },

    list: [],
    treeData: [],
    formTypes: [],
    processStatus: [],
    systems: [],
    formTitle: '初始化标题',
    draftCount: 0,
    returnVo: {},
    disabled:true,
  },

  namespace: 'addressBook',

  effects: {
    *getFormDataList({ payload }, { call, put }) {
      const response = yield call(getFormDataList, payload);
      yield put({
        type: 'queryFormDataList',
        payload: response,
        pagination: payload,
      });
    },
    *delDraft({ payload }, { call, put }) {
      const response = yield call(delDraft, payload);
      yield put({
        type: 'delDraftCallback',
        payload: response,
        pagination: payload,
      });
    },

    /**
     * 获取 通讯录树 对应的 表格数据
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getModelList({ payload }, { call, put }) {

      let response = [];
      if(payload.categoryId == "TOP-CONTACTS"){
        response = yield call(queryTopConcactData, payload);
      }else{
        response = yield call(getModelList, payload);
      }

      // const response = yield call(getModelList, payload);
      yield put({
        type: 'modelCallback',
        payload: Array.isArray(response.rows) ? response.rows : [],
      });
    },


    /**
     * 获取 组织机构 的 树形数据
     * @param _
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *queryTreeData(_, { call, put }) {
      const response = yield call(queryTreeData);

      yield put({
        type: 'getTreeData',
        payload: Array.isArray(response) ? response : [],
        // payload: response
      });
    },

    /**
     * 点击添加到 常用联系人
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *addContactPer({payload},{call, put}){
      const response= yield call(addContactPerData,{payload});
      yield put({
        type:'save',
        payload:response
      })
    },

    *queryAlreadySend({ payload }, { call, put }) {
      const response = yield call(queryAlreadySend, payload);
      let sorter = undefined;
      if(typeof payload != 'undefined' ){
        sorter = payload.sorter;
      }
      const obj = {res:response,sorter:sorter};
      yield put({
        type: 'queryAlreadySendList',
        payload: obj,
        pagination: payload,
      });
    },



    *queryTreeDataSearch({ payload }, { call, put }) {
      const response = yield call(queryTreeDataSearch,payload);
      yield put({
        type: 'getTreeData',
        payload: Array.isArray(response) ? response : [],
      });
    },


    *changeFormTitle({ payload }, { put }) {
      const response = { formTitle: payload.formTitle };
      yield put({
        type: 'changeTitle',
        payload: response,
      });
    }

  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload,
        disabled:false,
      };
    },

    queryFormDataList(state, action) {
      return {
        ...state,
        formData: action.payload,
        disabled:false,
      };
    },

    queryAlreadySendList(state, action) {
      const sorter = action.payload.sorter;
      const res = action.payload.res;
      let data = res.list;
      if(typeof sorter =='undefined' || sorter == 'startTime_descend'){
        data = data.sort((a,b) => {return new Date(b.startTime).getTime()-new Date(a.startTime).getTime()});
      }else{
        data = data.sort((a,b) => {return new Date(a.startTime).getTime()-new Date(b.startTime).getTime()});
      }
      return {
        ...state,
        alreadySendData: res,
        disabled:false,
      };
    },
    queryDraftList(state, action) {
      return {
        ...state,
        draftData: action.payload,
        disabled:false,
      };
    },
    disabledTab(state, action) {
      return {
        ...state,
        disabled:true,
      };
    },


    changeTitle(state, { payload }) {
      return {
        ...state,
        formTitle: payload.formTitle,
      };
    },
    querySystems(state, action) {
      return {
        ...state,
        systems: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveProcessEnums(state, action) {
      return {
        ...state,
        formTypes: action.payload.formTypes,
        processStatus: action.payload.processStatus,
      };
    },

    delDraftCallback(state, action) {
      if (action.payload.code == 0) {
        message.error('删除失败');
      } else {
        message.success('删除成功');
        return {
          ...state,
          draftData: action.payload.data,
          list: action.payload.data.list,
          draftCount: action.payload.data.pagination.total,
        };
      }
    },

    modelCallback(state, action) {
      // action.payload.map(row => {
      //   row.url = '/ys/process/form/launch/' + row.modelKey + '/0/0/0/'+getFormType(row.fromUrl);
      // });
      return {
        ...state,
        list: action.payload,
      };
    },

    getTreeData(state, action) {
      return {
        ...state,
        treeData: action.payload,
      };
    },

    appendList(state, action) {
      return {
        ...state,
        // process: state.process.concat(action.payload),
        process: { formTitle: '新标题' },
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {


      regWindowFun();
      // Subscribe history(url) change, trigger `load` action if pathname is `/`

      history.listen(location => {
        if(location.pathname.search('list') ===-1 ){
          return;
        }

        if(window.opener && location.pathname.search('/process/list') === -1){
          window.close()
        }
      });

      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });




    },
  },
};
function getFormType(url){
  var formType="0"
  if(url){
    var reg = new RegExp("(^|)formType=([^&]*)(|$)");
    var array=url.match(reg);
    if(array){
      formType=array[2];
    }
  }
  return formType;
}
