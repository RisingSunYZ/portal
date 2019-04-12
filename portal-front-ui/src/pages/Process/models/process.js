import {
  queryAlreadySend,
  queryTreeData,
  queryTreeDataSearch,
  queryTodo,
  queryAlreadyDo,
  getAllSystems,
  getProcessEnums,
  queryDrafts,
  delDraft,
  getModelList,
  getPermission,
  getTodoCount,
  getFormDataList,
  getDraftsCount,
} from '@/services/process';
import { message } from 'antd';
import {regWindowFun} from "@/utils/utils";

const getFormType = (url)=>{
  let formType="0"
  if(url){
    const reg = new RegExp("(^|)formType=([^&]*)(|$)");
    const array=url.match(reg);
    if(array){
      formType=array[2];
    }
  }
  return formType;
}

export default {
  state: {
    data: {
      list: [],
      pagination: {},
    },
    todoData: {// 待办数据
      list: [],
      pagination: {},
    },
    alreadySendData: {// 已发数据
      list: [],
      pagination: {},
    },
    alreadyDoData: {// 已办数据
      list: [],
      pagination: {},
    },
    formData: {// 表单查询数据
      list: [],
      pagination: {},
    },
    draftData: {// 草稿数据
      list: [],
      pagination: {},
    },
    list: [],
    selectedNode:{},
    treeData: [],
    formTypes: [],
    processStatus: [],
    systems: [],
    formTitle: '初始化标题',
    todoCount: 0,
    draftCount: 0,
    returnVo: {},
    disabled:true,
    hasPermission:false,// 是否有表单查询权限
  },

  namespace: 'process',

  effects: {
    *queryTodo({ payload }, { call, put }) {
      const response = yield call(queryTodo, payload);
      if(response.code == "100"){
        let sorter;
        if(typeof payload !== 'undefined' ){
          sorter = payload.sorter;
        }
        const obj = {res:response.data,sorter};
        yield put({
          type: 'queryTodoList',
          payload: obj,
          pagination: payload,
        });
      }
    },
    *queryAlreadyDo({ payload }, { call, put }) {
      const response = yield call(queryAlreadyDo, payload);
      if(response.code ==="100"){
        let sorter;
        if(typeof payload !== 'undefined' ){
          sorter = payload.sorter;
        }
        const obj = {res:response.data,sorter};
        yield put({
          type: 'queryAlreadyDoList',
          payload: obj,
          pagination: payload,
        });
      }
    },
    *queryAlreadySend({ payload }, { call, put }) {
      const response = yield call(queryAlreadySend, payload);
      if(response.code === "100"){
        let sorter;
        if(typeof payload !== 'undefined' ){
          sorter = payload.sorter;
        }
        const obj = {res:response.data,sorter};
        yield put({
          type: 'queryAlreadySendList',
          payload: obj,
          pagination: payload,
        });
      }
    },
    // 表单查询页面 流程列表数据
    *getFormDataList({ payload }, { call, put }) {
      const response = yield call(getFormDataList, payload);
      if(response.code === "100"){
        yield put({
          type: 'queryFormDataList',
          payload: response.data,
          pagination: payload,
        });
      }else{
        yield put({
          type: 'queryFormDataList',
          payload: {
            list:[],
            pagination:{
              current: 0,
              pageSize: 20,
              total: 0,
            }
          },
          pagination: payload,
        });
      }


    },
    *delDraft({ payload }, { call, put }) {
      const response = yield call(delDraft, payload);
      yield put({
        type: 'delDraftCallback',
        payload: response,
        pagination: payload,
      });
    },
    *queryDrafts({ payload }, { call, put }) {
      const response = yield call(queryDrafts, payload);
      yield put({
        type: 'queryDraftList',
        payload: response,
        pagination: payload,
      });
    },
    *getProcessEnums({ payload }, { call, put }) {
      const response = yield call(getProcessEnums, payload);
      if(response.code == "100"){
        yield put({
          type: 'saveProcessEnums',
          payload: response,
        });

      }

    },
    // 流程中心发起页面 获取流程列表数据
    *getModelList({ payload }, { call, put }) {
      const response = yield call(getModelList, payload);
      // 我的草稿排序
      // if(payload.categoryId == "myDraft"){
      //   Array.isArray(response) && response.sort((a,b) => new Date(b.createTime).getTime()-new Date(a.createTime).getTime())
      // }

      yield put({
        type: 'modelCallback',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryAlreadyDo, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchAllSystems(_, { call, put }) {
      const response = yield call(getAllSystems);
      yield put({
        type: 'querySystems',
        payload: Array.isArray(response.datas) ? response.datas : [],
      });
    },

    *queryTreeData(_, { call, put }) {
      const response = yield call(queryTreeData);
      const data = Array.isArray(response.data) ? response.data : [];

      // const regular = {
      //   children: null,
      //   code: "my_regular",
      //   id: "myRegular",
      //   name: "我常用的",
      //   pid: ""
      // }
      // data.unshift(regular)

      yield put({
        type: 'getTreeData',
        payload: data,
      });
    },
    *getPermission(_, { call, put }) {
      const response = yield call(getPermission);
      yield put({
        type: 'getPermissionBack',
        payload: response,
      });
    },
    *queryTreeDataSearch({ payload }, { call, put }) {
      const response = yield call(queryTreeDataSearch,payload);
      const data = Array.isArray(response.data) ? response.data : [];
      yield put({
        type: 'getTreeData',
        payload: data,
      });
    },
    *changeFormTitle({ payload }, { put }) {
      const response = { formTitle: payload.formTitle };
      yield put({
        type: 'changeTitle',
        payload: response,
      });
    },
    // 代办微标数
    *getTodoCount(_, { call,put }) {
      const response = yield call(getTodoCount);
      if(response.code === "100"){
        yield put({
          type: 'queryCount',
          payload: response.data,
        });
      }
    },

    *getDraftCount(_, { call,put }) {
      const response = yield call(getDraftsCount);
      if(response.code === "100"){
        yield put({
          type: 'queryDraftsCount',
          payload: response.data,
        });
      }

    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload,
        disabled:false,
      };
    },
    setSelectedNode(state, action) {
      return {
        ...state,
        selectedNode:action.payload.selectedNode
      };
    },
    queryTodoList(state, action) {
      const sorter = action.payload.sorter;
      const res = action.payload.res;
      let data = res.list;
      if(typeof sorter ==='undefined' || sorter == 'startTime_descend'){
        data = data.sort((a,b) => new Date(a.startTime).getTime()-new Date(b.startTime).getTime());
      }else{
        data = data.sort((a,b) => new Date(b.startTime).getTime()-new Date(a.startTime).getTime());
      }
      return {
        ...state,
        todoData: res,
        data:res,
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
    queryAlreadyDoList(state, action) {
      const sorter = action.payload.sorter;
      const res = action.payload.res;
      let data = res.list;
      if(typeof sorter ==='undefined' || sorter == 'endTime_descend'){
        data = data.sort((a,b) => new Date(b.endTime).getTime()-new Date(a.endTime).getTime());
      }else{
        data = data.sort((a,b) => new Date(a.endTime).getTime()-new Date(b.endTime).getTime());
      }
      return {
        ...state,
        alreadyDoData: res,
        data:res,
        disabled:false,
      };
    },
    queryAlreadySendList(state, action) {
      const sorter = action.payload.sorter;
      const res = action.payload.res;
      let data = res.list;
      if(typeof sorter ==='undefined' || sorter == 'startTime_descend'){
        data = data.sort((a,b) => new Date(b.startTime).getTime()-new Date(a.startTime).getTime());
      }else{
        data = data.sort((a,b) => new Date(a.startTime).getTime()-new Date(b.startTime).getTime());
      }
      return {
        ...state,
        alreadySendData: res,
        data:res,
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
    queryCount(state, action) {
      return {
        ...state,
        todoCount: action.payload,
      };
    },
    queryDraftsCount(state, action) {
      return {
        ...state,
        draftCount: action.payload,
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
        formTypes: action.payload.data,
        processStatus: action.payload.processStatus,
      };
    },

    delDraftCallback(state, action) {
      if (action.payload.code == "0") {
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
      action.payload.map(row => {
        row.url = `/process/form/launch/${row.modelKey}/0/0/0/${getFormType(row.fromUrl)}`;
      });
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
    getPermissionBack(state, action) {
      const permission = action.payload.code === '100'? action.payload.data:false;
      return {
        ...state,
        hasPermission: permission,
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
      history.listen(location => {

        if(location.pathname.search('list') ===-1 ){
          return;
        }
        // alert(location.pathname)
        // debugger location.pathname.search('/process/list') === -1
        try{
          if(window.opener && window.opener.location.href.search('/process/list') !== -1){
            window.opener.location.reload();
            window.close();
          }
        }catch(e){
          // console.error('=======================',e);
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

