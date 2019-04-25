import { checkPersonExp,getMsgCount,checkLeader,getQuickProcess,getContactUs } from '@/services/hrService';
import { getAllPerson, } from '@/services/hrServiceAjax';
import { queryTodo,queryAlreadyDo} from '@/services/process';
import { getDeptTree,getDeptList,getTopDept,getDeptIds } from '@/services/hrUserTeamService';

export default {
  state: {
    msgCount: 0,
    todoData: {
      list: [],
      pagination: {},
    },
    DoneData: {
      list: [],
      pagination: {},
    },
    attendanceData: '0',
    isLeader:0,
    deptTree:[],
    deptTreeSelect:[],
    personList:[],
    quickProcess:[],
    contactUs:[],
  },

  namespace: 'hrService',

  effects: {
    // 获取HR服务快速点击数据
    *getQuickProcess({ payload }, { call, put }) {
      const response = yield call(getQuickProcess, payload);
      if(response.code == "100" && Array.isArray(response.data) && response.data.length > 0 ){
        yield put({
          type: 'saveQuickProcess',
          payload: response.data,
        });
      }
    },

    *queryTodo({ payload }, { call, put }) {
      const response = yield call(queryTodo, payload);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *queryDone({ payload }, { call, put }) {
      const response = yield call(queryAlreadyDo, payload);
      yield put({
        type: 'queryDoneList',
        payload: response.data
      });
    },


    //检查个人是否考勤异常
    *checkPersonExp({ payload }, { call, put }) {
      const response = yield call(checkPersonExp, payload);
      yield put({
        type: 'callBack',
        payload: response,
      });
    },
    *getMsgCount({ payload }, { call, put }) {
      const response = yield call(getMsgCount, payload);
      if(response.code==1){
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },
    *checkLeader({ payload }, { call, put }) {
      const response = yield call(checkLeader, payload);
      yield put({
        type: 'saveIsLeader',
        payload: response,
      });
    },
    *getDeptList({ payload,callback }, { call, put }) {
      const response = yield call(getDeptList, payload);
      callback && callback(response);
      yield put({
        type: 'saveDeptList',
        payload: {data:response,deptId:payload.deptId},
      });
    },
    *getDeptTree({ payload,callback }, { call, put }) {
      const response = yield call(getDeptTree, payload);
      callback && callback(response);
      yield put({
        type: 'saveDeptTree',
        payload: response,
      });
    },
    *getTopDept({ payload,callback }, { call, put }) {
      const response = yield call(getTopDept, payload);
      callback && callback(response);
      yield put({
        type: 'saveTopDept',
        payload: response,
      });
    },
    *getDeptIds({ payload,callback }, { call, put }) {
      const response = yield call(getDeptIds, payload);
      callback && callback(response);
    },
    *getAllPerson({ payload }, { call, put }) {
      const response = yield call(getAllPerson, payload);
      yield put({
        type: 'saveAllPerson',
        payload: response,
      });
    },
    *getContactUs({ payload }, { call, put }) {
      const response = yield call(getContactUs, payload);
      yield put({
        type: 'saveContactUs',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        todoData: action.payload,
        disabled: false,
      };
    },
    queryDoneList(state, action) {
      return {
        ...state,
        DoneData: action.payload,
        disabled: false,
      };
    },
    saveQuickProcess(state, action) {
    // debugger;
      return {
        ...state,
        quickProcess:action.payload
    };
    },
    saveContactUs(state, action) {

      return {
        ...state,
        contactUs:action.payload
    };
    },
    save(state, action) {
      let count =0;
      $.each(action.payload,function (key,val) {
        count=count+val;
      })
      return {
        ...state,
        msgCount:count
    };
    },
    callBack(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveIsLeader(state, action) {
      return {
        ...state,
        isLeader:action.payload,
      };
    },
    saveDeptList(state, action) {
      if(!action.payload){
        return state;
      }
      const parentId=action.payload.deptId;
      const children=action.payload.data;
      let deptTree=state.deptTree;
      function recursive(deptTree){
        deptTree.forEach(function (value) {
          if(value.id==parentId){
            value.children=children;
          }else {
            if(value.children){
              recursive(value.children);
            }
          }
        })
      }
      if(deptTree.length){
        recursive(deptTree);
        deptTree[0].companyChildren && recursive(deptTree[0].companyChildren);
      }else{
        deptTree=children
      }
      return {
        ...state,
        deptTree:deptTree,
      };
    },
    saveDeptTree(state, action) {
      return {
        ...state,
        deptTreeSelect:action.payload,
      };
    },
    saveTopDept(state, action) {
      return {
        ...state,
        deptTree:action.payload,
      };
    },
    saveAllPerson(state, action) {
      return {
        ...state,
        personList:action.payload,
      };
    },

  },
};
