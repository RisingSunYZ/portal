import {
  queryTreeData,
  queryTopConcactData,
  getTableList,
  addContactPerData,
  delContactPerData
} from '../../../services/addressBook';
import router from 'umi/router';
import { message } from 'antd';

export default {
  state: {
    list: [],
    pagination: {},
    selectTableKeys:[],

    treeData: [],
    draftCount: 0,
  },

  namespace: 'addressBook',

  effects: {
    /**
     * 获取 通讯录树 对应的 表格数据
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getTableList({ payload }, { call, put }) {
      let response = [];
      if(payload.deptId == "TOP-CONTACTS"){
        response = yield call(queryTopConcactData, payload);
      }else{
        response = yield call(getTableList, payload);
      }
      let list = Array.isArray(response.rows) ? response.rows : [];
      let pagination={current:payload.pageIndex+1,pageSize:payload.pageSize,total:response.total};
      yield put({
        type: 'tableCallback',
        payload:{list:list,pagination:pagination},
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
      debugger;
      const response= yield call(addContactPerData,payload);
      if(response.code=='100'){
        message.success(response.msg)
      }
    },

    /**
     * 删除 常用联系人
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *delContactPer({payload},{call, put}){
      const response= yield call(delContactPerData,payload);
      if(response.code=='100'){
        message.success(response.msg)
      }

      const response2 = yield call(queryTopConcactData, payload);
      // yield put({
      //   type: 'tableCallback',
      //   payload: Array.isArray(response2.rows) ? response2.rows : [],
      // });
    },

  },


  reducers: {
    queryFormDataList(state, action) {
      return {
        ...state,
        formData: action.payload,
        disabled:false,
      };
    },

    tableCallback(state, action) {
      return {
        ...state,
        list:Array.isArray(action.payload.list)?action.payload.list:[],
        pagination:action.payload.pagination!=undefined?action.payload.pagination:{}
      };
    },

    getTreeData(state, action) {
      return {
        ...state,
        treeData: action.payload,
      };
    },
  },

};
