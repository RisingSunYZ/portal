import { getSysDatas,saveSystemMenus,querySystemById,getTopSystems } from '../../../services/systemCustom';
import { message } from 'antd';

export default {
  state: {
    sysData: [],
    sysMenusDate:[],
    sysTopMenusDate:[]
  },

  namespace: 'workplace',

  effects: {

    /**
     * 常用系统
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getSysData({ payload }, { call, put }) {
      const response = yield call(getSysDatas, payload);
      if(response.code === "100"){
        yield put({
          type: 'sysList',
          payload: response,
          pagination: payload,
        });
      }
    },

    /**
     * 获取所有顶级菜单
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getTopSystem({ payload,callback }, { call, put }) {
      const response = yield call(getTopSystems, payload);
      if(response.code === "100"){
        yield put({
          type: 'sysTopMenu',
          payload: response.data,
        });
      }
      if(callback) callback(response);
    },

    /**
     * 保存系统菜单
     * @param payload
     * @param callback
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *saveSystemMenu({ payload,callback }, { call, put }) {
      const response = yield call(saveSystemMenus, payload);
      if(callback) callback(response);
    },

    /**
     * 根据id查询系统菜单
     * @param paylode
     * @param callback
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getSystemById({ payload,callback }, { call, put }) {
      const response = yield call(querySystemById, payload);
      yield put({
        type: 'sysMenu',
        payload: response,
      });
      if(callback) callback(response);
    }
  },

  reducers: {
    sysList(state, action) {
      return {
        ...state,
        sysData: action.payload.data
      };
    },

    sysMenu(state,action){
      return {
        ...state,
        sysMenusDate:action.payload.data
      }
    },

    sysTopMenu(state,action){
      return {
        ...state,
        sysTopMenusDate:action.payload
      }
    },

    /**
     * 添加或删除常用菜单
     * @param state
     * @param action
     * @returns {{sysData: Array}}
     */
    update(state,action){
      let id = action.payload.id;
      let arr = [];
      let flag = true;
      for(let i=0;i<state.sysData.length;i++){
          if(id===state.sysData[i].id){
            flag = false;
          }else{
            arr.push(state.sysData[i]);
          }
      }
      if(flag){
        arr.push(action.payload);
      }
      return {
        ...state,
        sysData:arr
      }
    }
  },
};

