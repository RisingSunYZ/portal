import router from 'umi/router';
import { message } from 'antd';
import {
  getFormInfo,
  getBaseInfo,
  getFormUrl,
  doApprove,
  doTempSave,
  doReject,
  insertAttachMsg,
  getProcessFormStateData,
  doTurnRead,
  doTurnDo,
  doAddSign,
  doRevoke,
  getBackNodes,
  backToStep,
  backToAnyStep,
  doSaveBaseInfo,
  doZYZH,
  stopProcess,
  getProcessDiagramData
} from '../../../services/processForm';
import { reloadAuthorized } from '../../../utils/Authorized';
import { getFormType, nullToZero, getConfig } from '../../../utils/utils';

export default {
  namespace: 'processForm',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    formInfo: {
      formTitle: '', // 表单名称
      formDesc: '', // 表单描述
      formUrl: '', // 表单URL
      ownDeptName: '', // 归属部门
      proInstId: '', // 实例id
      bizId: '', // 业务表单编号
      taskId: '', // 任务id
      processDockingName: '', // 流程BP
      processDockingNo: '', // 流程BP工号
      files: [], // 表单附件
      delFiles: [], // 删除的表单附件
      addFiles: [], // 添加的表单附件
      refDocs: [], // 关联流程
      addRefDocs: [], // 添加关联流程
      delRefDocs: [], // 删除关联流程
      approveRecords: [], // 审批记录
      transferRecords: [], // 转阅记录
      flowEnd: {}, // 最后节点（审批结束或终止）
      postscripts: [], // 附言
      attachMsg: '', // 附言文本
      postscriptsFiles: [], // 附言附件
      createTime: '', // 流程提交的时间
      approveType: 'ZC', // 审批类型
      revokable: false,
      nodeName: '',
      taskType: '', // 任务类型,
      userInfo: {
        // 当前节点提交人信息
        name: '',
        mobilePhone: '',
        postname: '',
        companyName: '',
        deptName: '',
        startTime: '',
      },
    },
    taskId: '',
    processDiagramData:[],
    modelId: '',
    instId: '',
    bizId: '',
    formType: 0,
    submitBtnLoading: false,
    saveBtnLoading: false,
    approveBtnLoading: false,
    rejectBtnLoading: false,
    backNodes: [], // 驳回至指定节点列表
    processDiagramImgUrl:"",
    visibleDiagramModal:false
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(getFormInfo, payload);
      yield put({
        type: 'save',
        payload: response,
        formTitle: payload.formTitle,
      });
    },
    * getFormInfo({ payload }, { call, put }) {
      const response = yield call(getFormInfo, payload);
      yield put({
        type: 'saveFormInfo',
        payload: response,
      });
    },
    // 获取流程图节点
    * getProcessDiagramData({ payload }, { call, put }) {
      yield put({
        type: 'saveProcessDiagramVisible',
        payload:{
          ...payload
        }
      });
      const response = yield call(getProcessDiagramData, payload);
      yield put({
        type: 'saveProcessDiagramData',
        payload:{
          ...payload,
          processDiagramData:response
        },
      });
    },

    * getFormUrl({ payload }, { call, put }) {
      const response = yield call(getFormUrl, payload);
      yield put({
        type: 'saveFormInfo',
        payload: response,
      });
    },
    * getBaseInfo({ payload }, { call, put }) {
      const response = yield call(getBaseInfo, payload);
      yield put({
        type: 'saveBaseInfo',
        payload: response,
      });
    },
    * insertAttachMsg({ payload }, { call, put }) {
      const response = yield call(insertAttachMsg, payload);
      if (response.code == '100') {
        yield put({
          type: 'insertAttachMsgCallback',
          payload: response,
        });
      }
    },
    * saveFormBaseInfo({ payload }, { call, put }) {
      const response = yield call(saveData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * doApprove({ payload }, { call, put }) {
      yield put({
        type: 'changeApproveBtnLoading',
        payload: true,
      });
      const response = yield call(doApprove, payload);
      if (response.code == 100) {
        yield put(router.push('/process/result/success/0'));
      } else {
        message.error(response.msg);
      }
    },
    * doReject({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeRejectBtnLoading',
        payload: true,
      });
      let response = {};

      if (payload.code === 'reject') {
        response = yield call(doReject, payload);
      } else if (payload.code === 'backToStep') {
        response = yield call(backToStep, payload);
      } else if (payload.code === 'backToAnyStep') {
        response = yield call(backToAnyStep, payload);
      }
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
      if (response.code === '100') {
        yield put(router.push('/process/result/success/0'));
      } else {
        message.error(response.msg);
      }
    },
    * doTempSave({ payload }, { call, put }) {
      const response = yield call(doTempSave, payload);
      if (response.code === '100') {
        yield put(router.push('/process/result/success/0'));
      } else {
        message.error(response.msg);
      }
    },
    * doTurnRead({ payload }, { call, put }) {
      const response = yield call(doTurnRead, payload);
      response.code === '101' ? message.error(response.msg) : message.success(response.msg);
      ;
    },
    * doRevoke({ payload }, { call, put }) {
      const response = yield call(doRevoke, payload);
      if (response.code == 100) {
        yield put(router.push('/process/result/success/0'));
      } else {
        message.error(response.msg);
      }
    },
    * doTurnDo({ payload }, { call, put }) {
      const response = yield call(doTurnDo, payload);
      if (response.code == 100) {
        yield put(router.push('/process/result/success/0'));
      }
    },
    * doAddSign({ payload }, { call, put }) {
      const response = yield call(doAddSign, payload);
      if (response.code == 100) {
        yield put(router.push('/process/result/success/0'));
      } else {
        message.error(response.msg);
      }
    },
    * getProcessFormState({ payload }, { call, put }) {
      const response = yield call(getProcessFormStateData, payload);
      if (response && typeof response.endTime != 'undefined') {
        yield put(
          router.push(
            '/process/form/view/' +
            nullToZero(response.processDefinitionKey) +
            '/' +
            nullToZero(response.procInstId) +
            '/' +
            nullToZero(response.businessKey) +
            '/' +
            nullToZero(response.taskId) +
            '/0'
          )
        );
      }
    },

    * getBackNodes({ payload }, { call, put }) {
      const response = yield call(getBackNodes, payload);
      yield put({
        type: 'queryBackNodes',
        payload: response,
      });
    },
    * doSaveBaseInfo({ payload }, { select, call, put }) {
      const processForm = yield select(state => state.processForm);
      const formInfo = processForm && processForm.formInfo;
      payload = {
        attachMsg: encodeURIComponent(formInfo.attachMsg),
        modelKey: processForm.modelId,
        bizId: payload,
        headAttAdd: encodeURIComponent(JSON.stringify(formInfo.addFiles)),
        headAttDel: encodeURIComponent(JSON.stringify(formInfo.delFiles)),
        headRefAdd: encodeURIComponent(JSON.stringify(formInfo.addRefDocs)),
        headRefDel: encodeURIComponent(JSON.stringify(formInfo.delRefDocs)),
        attachMsgAttAdd: encodeURIComponent(JSON.stringify(formInfo.postscriptsFiles)),
      };
      consol.log(processForm)
      const response = yield call(doSaveBaseInfo, payload);
      //如果是费用报销平台 则temp=0 提交成功后调回费用报销平台
      const modelId = [
        'ems_business_flow',
        'ems_expense_client_flow',
        'ems_loan_client_flow',
        'ems_repayment_flow',
        'ems_business_change_flow',
      ];
      let temp = 1;
      for (let i = 0; i < modelId.length; i++) {
        if (modelId[i] == processForm.modelId) {
          temp = 0;
          break;
        }
      }
      if (response.code == 100) {
        yield put(router.push('/process/result/success/' + temp));
      } else {
        message.error(response.msg);
      }
    },
    * doZYZH({ payload }, { call, put }) {
      const response = yield call(doZYZH, payload);
    },

    * stopProcess({ payload }, { call, put }) {
      const response = yield call(stopProcess, payload);
      if (response.code == 100) {
        yield put(router.push('/process/result/success/0'));
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    queryBackNodes(state, action) {
      return {
        ...state,
        backNodes: action.payload,
      };
    },

    changeSubmitBtnLoading(state, action) {
      return {
        ...state,
        submitBtnLoading: action.payload,
      };
    },

    updateAttachMsg(state, action) {
      const attachMsg = action.payload.attachMsg;
      return {
        ...state,
        formInfo: { ...state.formInfo, attachMsg },
      };
    },

    changeRejectBtnLoading(state, action) {
      return {
        ...state,
        rejectBtnLoading: action.payload,
      };
    },

    changeSaveBtnLoading(state, action) {
      return {
        ...state,
        saveBtnLoading: action.payload,
      };
    },
    // 关联流程
    addRefDocs(state, action) {
      let result = {};
      let refDocs = state.formInfo.refDocs;
      let addRefDocs = state.formInfo.addRefDocs;
      for (let i = 0; i < action.payload.length; i++) {
        let flag = false;
        for (let j = 0; j < refDocs.length; j++) {
          if (refDocs[j].refBusinessKey && typeof refDocs.refBusinessKey !== undefined) {
            if (refDocs[j].refBusinessKey === action.payload[i].businessKey) {
              flag = true;
              break;
            }
          }
        }
        if (flag) {
          continue;
        }
        let processDefinitionKey = {};
        if (
          action.payload[i].processInstanceId &&
          typeof action.payload[i].processInstanceId !== undefined
        ) {
          processDefinitionKey = action.payload[i].processInstanceId;
        } else {
          processDefinitionKey = action.payload[i].procInstId;
        }

        let name = {};
        if (action.payload[i].formName && typeof action.payload[i].formName !== undefined) {
          name = action.payload[i].formName;
        } else if (
          action.payload[i].procInstName &&
          typeof action.payload[i].procInstName !== undefined
        ) {
          name = action.payload[i].procInstName;
        } else if (action.payload[i].refName && typeof action.payload[i].refName !== undefined) {
          name = action.payload[i].refName;
        } else {
          name = action.payload[i].name;
        }
        const refDoc = {
          id: action.payload[i].id,
          refName: name,
          refBusinessKey: action.payload[i].businessKey,
          refProcessInstanceId: processDefinitionKey,
          refProcessDefinitionKey: action.payload[i].processDefinitionKey,
          businessUrl: action.payload[i].businessUrl,
          modelId: action.payload[i].modelId,
          ...action.payload[i],
        };
        addRefDocs = addRefDocs.concat(refDoc);
        refDocs = refDocs.concat(refDoc);
      }

      result = {
        ...state,
        formInfo: { ...state.formInfo, refDocs, addRefDocs },
      };
      return result;
    },

    // 删除流程
    delRefDocs(state, action) {
      const refBusinessKey = action.payload.refBusinessKey;
      const refDocs = state.formInfo.refDocs.filter(file => file.refBusinessKey !== refBusinessKey);

      const delRefDoc = state.formInfo.refDocs.filter(
        file => file.refBusinessKey === refBusinessKey,
      );
      let delRefDocs = [];
      if (delRefDoc[0].id && typeof delRefDoc[0].id !== undefined) {
        delRefDocs = state.formInfo.delRefDocs.concat(delRefDoc[0].id);
      }
      const addRefDocs = state.formInfo.addRefDocs.filter(
        file => file.refBusinessKey !== refBusinessKey,
      );
      const result = {
        ...state,
        formInfo: { ...state.formInfo, refDocs, delRefDocs, addRefDocs },
      };
      return result;
    },

    // 添加附件
    addProcessFile(state, action) {
      const ProcessFileType = { FY: '1', HF: '2', ZBD: '3' };
      if (action.payload.response && action.payload.response.responseCode == 0) {
        return { ...state };
      }
      const file = {
        id: action.payload.uid,
        fileName: action.payload.name,
        fileUrl: action.payload.response ? action.payload.response.responseMsg : '',
        fileSize: action.payload.size,
        ...action.payload,
      };
      file.type = ProcessFileType.ZBD;
      const files = state.formInfo.files.concat(file);
      const addFiles = state.formInfo.addFiles.concat(file);
      const result = {
        ...state,
        formInfo: { ...state.formInfo, files, addFiles },
      };
      return result;
    },
    // 删除附件
    delProcessFile(state, action) {
      const id = action.payload.id;
      const files = state.formInfo.files.filter(file => file.id !== id);

      const delFile = state.formInfo.files.filter(file => file.id === id);
      const delFiles = state.formInfo.delFiles.concat(delFile[0].uid);

      const addFiles = state.formInfo.addFiles.filter(file => file.id !== id);
      const result = {
        ...state,
        formInfo: { ...state.formInfo, files, delFiles, addFiles },
      };
      return result;
    },

    // 添加附言附件
    addPostScriptsFiles(state, action) {
      if (action.payload.response && action.payload.response.responseCode == 0) {
        return { ...state };
      }

      // FY(1, "附言"), HF(2, "回复"), ZBD(3, "主表单");
      const ProcessFileType = { FY: '1', HF: '2', ZBD: '3' };
      const file = {
        id: action.payload.uid,
        fileName: action.payload.name,
        fileUrl: action.payload.response ? action.payload.response.responseMsg : '',
        // fileUrl: action.payload.response.responseMsg,
        fileSize: action.payload.size,
        ...action.payload,
      };
      file.type = ProcessFileType.FY;
      const postscriptsFiles = state.formInfo.postscriptsFiles.concat(file);
      const result = {
        ...state,
        formInfo: { ...state.formInfo, postscriptsFiles },
      };
      return result;
    },

    // 删除附言附件
    delPostScriptsProcessFile(state, action) {
      const id = action.payload.id;
      const postscriptsFiles = state.formInfo.postscriptsFiles.filter(file => file.id !== id);

      const result = {
        ...state,
        formInfo: { ...state.formInfo, postscriptsFiles },
      };
      return result;
    },

    save(state, action) {
      return {
        ...state,
        formInfo: { ...state.formInfo, ...action.payload },
      };
    },
    saveProcessDiagramData(state, action) {
      return {
        ...state,
        processDiagramData:action.payload.processDiagramData,
      };
    },
    saveProcessDiagramVisible(state, action) {
      const imgUrl = `/rest/process/form/generateDiagramImg?processInstId=${action.payload.processInstId}&processDefineId=${action.payload.processDefineId}&t=${Math.random()}`;
      return {
        ...state,
        processDiagramImgUrl: imgUrl,
        visibleDiagramModal: true
      };
    },
    setProcessDiagramImgModal(state, action) {
      return {
        ...state,
        visibleDiagramModal: action.payload
      };
    },

    saveBaseInfo(state, action) {
      // 加载Window的方法
      window.processMainVo = {
        modelKey: state.modelId,
        bizId: action.payload.bizId,
        taskId: action.payload.taskId,
        processInstId: action.payload.proInstId,
        formName: action.payload.formTitle,
      };
      return {
        ...state,
        formInfo: { ...state.formInfo, ...action.payload },
      };
    },

    saveFormInfo(state, action) {
      // 加载Window的方法
      if (typeof window.processMainVo == 'undefined') {
        window.processMainVo = {};
      }
      return {
        ...state,
        formInfo: { ...state.formInfo, ...action.payload },
      };
    },
    initProcessForm(state, action) {
      const data = action.payload;
      return {
        ...state,
        taskId: data.taskId,
        modelId: data.modelId,
        instId: data.instId,
        bizId: data.bizId,
        formType: data.formType,
      };
    },
    changeFormTitle(state, action) {
      const data = action.payload;
      return {
        ...state,
        formInfo: { ...state.formInfo, ...data },
      };
    },
    insertAttachMsgCallback(state, action) {
      return {
        ...state,
        formInfo: {
          ...state.formInfo,
          postscripts: action.payload.data,
          postscriptsFiles: [],
          attachMsg: '',
        },
      };
    },
  },
};
