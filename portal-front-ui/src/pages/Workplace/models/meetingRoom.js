import {
  delRecordPersons ,
  delDraftDatas,
  sendInviteData ,
  saveDraftData,
  getHistoryData ,
  getWaitStartData,
  getDraftData,
  getMyInviteData,
  getInputData,
  getRecordPer,
  DownloadPerList
} from '../../../services/meetingRoom';
import { message } from 'antd';

export default {
  state: {
    draftData: {
      listDraft: [],
    },

    waitData:{
      listWait:[]
    },

    historyData:{
      listHistory:[]
    },

    inviteData:{
      listInvita:[]
    },

    delPerson: [],
    files:[],
    meeting:{},
    mandatoryPersonList:[],
    optionalPersonList:[],
  },

  namespace: 'meetingRoom',

  effects: {
    /**
     * 获取 历史会议 数据
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getHistoryData({payload},{call,put}) {
      const response= yield call(getHistoryData,payload);
      if(response.code=='100'){
        yield put({
          type: 'saveHistory',
          payload:response.data.data
        })
      }

    },

    /**
     * 查询 待开会议 数据
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getWaitStartData({payload},{call,put}) {
      const response= yield call(getWaitStartData,payload);
      if(response.code=='100'){
        yield put({
          type: 'saveWait',
          payload:response.data.data
        })
      }

    },

    /**
     * 查询 我的草稿 会议数据
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getDraftData({payload},{call,put}) {
      const response= yield call(getDraftData,payload);
      if(response.code=="100"){
        yield put({
          type: 'saveDra',
          payload:response.data.data
        })
      }
    },


    /**
     * 查询 我的邀请 会议数据
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getMyInviteData({payload},{call,put}) {
      const response= yield call(getMyInviteData,payload);
      if(response.code=="100"){
        yield put({
          type: 'saveInvite',
          payload:response.data.data
        })
      }
    },

    /**
     * 根据id获得新建会议数据
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *loadInput({payload,callback},{call,put}) {
      // debugger;
      const response= yield call(getInputData,payload);
      yield put({
        type: 'saveMeetingData',
        payload:response.data
      });
      if(callback) callback(response);
    },

    /**
     * 保存记录人
     * @param payload
     * @param callback
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *saveRecordPer({payload,callback},{call,put}){
      const response= yield call(getRecordPer,payload);
      if(response.code=="100"){
        message.success(response.msg);
      }else{
        message.error(response.msg);
      }
      const response2= yield call(getDraftData,payload);
      yield put({
        type: 'saveDra',
        payload:response2.data.data
      });

      const response3= yield call(getHistoryData,payload);
      yield put({
        type: 'saveHistory',
        payload:response3.data.data
      });

      const response4= yield call(getWaitStartData,payload);
      yield put({
        type: 'saveWait',
        payload:response4.data.data
      });

      const response5= yield call(getMyInviteData,payload);
      yield put({
        type: 'saveInvite',
        payload:response5.data.data
      })
    },


    /**
     * 删除记录人
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *delRecordPerson({payload},{call,put}) {
      const response= yield call(delRecordPersons,payload);
      if(response.code=="100"){
        message.success(response.msg);
      }else{
        message.error(response.msg);
      }

      const response2= yield call(getDraftData,payload);
      yield put({
        type: 'saveDra',
        payload:response2.data.data
      });

      const response3= yield call(getHistoryData,payload);
        yield put({
          type: 'saveHistory',
          payload:response3.data.data
        });

      const response4= yield call(getWaitStartData,payload);
        yield put({
          type: 'saveWait',
          payload:response4.data.data
        });

      const response5= yield call(getMyInviteData,payload);
        yield put({
          type: 'saveInvite',
          payload:response5.data.data
        })
    },



    /**
     * 删除草稿卡片
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *delDraftData({payload,callback},{call,put}) {
      const response= yield call(delDraftDatas,payload);
      if(response.code == '100'){
        yield put({
          type: 'delDraftById',
          payload:{ id: payload.id }
        });
        message.success(response.msg)
      }

    },

    /**
     * 新建会议-按钮-发送邀请
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *sendInvites({payload,callback},{call,put}){
      const response= yield call(sendInviteData,payload);
      // debugger;
      yield put({
        type: 'sendData',
        payload:response
      });
      if(callback) callback(response);
    },

    /**
     * 新建会议-按钮-保存草稿
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *saveDrafts({payload,callback},{call,put}){
      debugger;
      const response = yield call(saveDraftData,payload);
      console.log(11111111);
      // yield put({
      //   type: 'saveDraftData',
      //   payload:payload
      // });
      if(callback) callback(response);
    },


    /**
     * 下载 参会人员列表
     * @param payload
     * @param callback
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getDownloadPerList({payload,callback},{call,put}){
      const response = yield call(DownloadPerList,payload);
      // yield put({
      //   type: 'saveDraftData',
      //   payload:payload
      // });
      if(callback) callback(response);
    }
  },

  reducers: {
    saveDra(state, action) {
      return {
        ...state,
        draftData: { listDraft: action.payload }
      };
    },

    saveWait(state, action) {
      return {
        ...state,
        waitData: { listWait: action.payload }
      };
    },

    saveHistory(state, action) {
      return {
        ...state,
        historyData: { listHistory: action.payload }
      };
    },

    saveInvite(state, action) {
      return {
        ...state,
        inviteData: { listInvita: action.payload }
      };
    },

    /**
     * 通过id删除草稿会议卡片
     * @param state
     * @param action
     * @returns {{}}
     */
    delDraftById(state,action) {
      const id = action.payload.id;
      const meeting = state.meeting.filter(item => id.indexOf(item.id) === -1);
      return {
        ...state,
        meeting
      }
    },


    /**
     * 通过id删除 会议 记录人
     * @param state
     * @param action
     * @returns {{delPerson: *}}
     */
    delDraftRecordById(state, action) {
      const id=action.payload.id;
      // debugger;
      return {
        ...state,
        delPerson: action.payload.recordPersonName
      };
    },


    saveDraftData(state, action) {
      return {
        ...state,
        meeting: action.payload
      };
    },


    saveMeetingData(state, action) {
      const meeting = action.payload
      return {
        ...state,
        ...meeting,
        mandatoryPersonList:meeting.mandatoryPersonList,
        optionalPersonList:meeting.optionalPersonList
      };
    },

    sendData(state, action) {
      return {
        ...state,
        delPerson: action.payload
      };
    },

    /***
     * 添加附件
     * @param state
     * @param action
     * @returns {*}
     */
    addFiles(state, action) {
      if (action.payload.response && action.payload.response.error == 1) {
        return { ...state };
      }

      let type = '';
      if(action.payload.response &&action.payload.response.url.indexOf('.')!=-1 && action.payload.response.url.split('.').length>=2){
        type = action.payload.response.url.split('.')[1];
      }


      const file = {
        id: action.payload.uid,
        name: action.payload.response ? action.payload.fileName : "",
        filePath: action.payload.response ? action.payload.response.url : '',
        fileSize: action.payload.size,
        ...action.payload,
      };

      file.type = type;
      let files = [];
      if(state.files){
        files = state.files.concat(file);
      }else{
        files.push(file);
      }

      const result = {
        ...state,
        files
      };
      return result;
    },

    /**
     * 删除文件
     * @param state
     * @param action
     * @returns {{files: *[]}}
     */
    delFiles(state, action) {
      const id = action.payload.id;
      const files = state.files.filter(file => file.id !== id);
      const result = {
        ...state,
        files
      };
      return result;
    },
  },
};
