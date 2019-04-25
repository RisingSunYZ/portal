import { checkPersonExp,getMsgCount,checkLeader,getQuickProcess,getContactUs } from '../../../services/hrService';
import { getAllPerson, } from '../../../services/hrServiceAjax';
import { getDeptTree,getDeptList,getTopDept,getDeptIds } from '../../../services/hrUserTeamService';

export default {
  state: {
    msgCount: 0,
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
    //检查个人是否考勤异常
    *getQuickProcess({ payload }, { call, put }) {
      const response = yield call(getQuickProcess, payload);
      yield put({
        type: 'saveQuickProcess',
        payload: response.data,
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
    saveQuickProcess(state, action) {
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
      });
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
