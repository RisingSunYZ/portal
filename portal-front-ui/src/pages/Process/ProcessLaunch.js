import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Button, Col, Input, message, Modal, Row,Affix, Tag,} from 'antd';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import {deepCopy, nullToZero} from '../../utils/utils';
import ProcessBaseInfo from '../../components/ProcessForm/ProcessBaseInfo';
import FormWrapper from '../../components/FormWrapper';
import {
  ApproveRecord,
  PostscriptRecord,
  ProcessBaseAction,
  ProcessFileList,
  TransferRecord,
} from '../../components/ProcessForm';
import formLogo from '../../assets/form-logo.png';
import OwnerInfo from '../../components/ProcessForm/OwnerInfo';
import commonLayoutStyles from '../../layouts/CommonLayout.less';
import {UserSelect} from '../../components/Selector';
// import DocumentTitle from 'react-document-title';

// 流程操作按钮
const { TextArea } = Input;
@connect(({ processForm, loading, global }) => ({
  processForm,
  global,
  // loading: loading.models.processForm,
  loading: loading.models.processForm,
}))
class Action extends Component {
  state = {
    loading: false,
    visible: false,
    selectedPersons: [],
    desc: '',
  };
  handleTurn = () => {
    this.setState({
      visible: true,
    });
  };

  //终止
  stopProcess = () => {
    this.props.dispatch({
      type: 'processForm/stopProcess',
      payload: {
        processInstanceId: this.props.processForm.instId,
      },
    });
  };
  handleOk = () => {
    this.props.doFormFn('doTurnRead', this.state.selectedPersons);

    this.setState({ loading: true });
    if (this.state.selectedPersons.length > 0) {
      this.props.dispatch({
        type: 'processForm/doTurnRead',
        payload: {
          message: encodeURIComponent(this.state.desc),
          processInstId: this.props.processForm.instId,
          userNames: encodeURIComponent(
            this.state.selectedPersons
              .map(x => {
                return x.name;
              })
              .join(',')
          ),
          userCodes: encodeURIComponent(
            this.state.selectedPersons
              .map(x => {
                return x.no;
              })
              .join(',')
          ),
        },
      });
      setTimeout(() => {
        this.setState({ loading: false, visible: false });

        this.props.dispatch({
          //转阅后刷新转阅记录列表
          type: 'processForm/getFormInfo',
          payload: {
            bizId: this.props.processForm.bizId,
            instId: this.props.processForm.instId,
            modelId: this.props.processForm.modelId,
            taskId: this.props.processForm.taskId,
          },
        });
      }, 1000);
    } else {
      this.setState({ loading: false });
      message.error('请选择转阅人员！');
    }
  };

  turnReadCallback = datas => {
    this.setState({ selectedPersons: datas });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };

  doSubmit = () => {
    this.props.dispatch({ type: 'processForm/changeSubmitBtnLoading', payload: true });
    this.props.dispatch({ type: 'processForm/changeSaveBtnLoading', payload: true });
    this.props.doFormFn('doSubmit', this.props.processForm.modelId);
  };
  doSaveDraft = () => {
    this.props.dispatch({ type: 'processForm/changeSubmitBtnLoading', payload: true });
    this.props.dispatch({ type: 'processForm/changeSaveBtnLoading', payload: true });
    this.props.doFormFn('doSave', this.props.processForm.modelId);
  };
  doCancel = () => {
    window.close();
  };

  render() {
    const { loading, visible, selectedPersons } = this.state;
    const {
      processForm: { submitBtnLoading, saveBtnLoading },
    } = this.props;
    const nodeName = this.props.processForm.formInfo.nodeName;
    const formType = this.props.processForm.formType;
    return (
      <Fragment>
        <div>
          <Button
            style={{ display: formType === '3' ? 'none' : '' }}
            loading={submitBtnLoading}
            onClick={this.doSubmit.bind(this)}
            type="primary"
          >
            提交
          </Button>
          <Button
            style={{ display: nodeName === '提交人' || formType === '3' ? 'none' : '' }}
            loading={saveBtnLoading}
            onClick={this.doSaveDraft}
          >
            存草稿
          </Button>
          <Button onClick={this.doCancel}>取消</Button>
          <Button
            style={{ display: nodeName === '提交人' ? '' : 'none' }}
            onClick={this.handleTurn}
            type="primary"
          >
            转阅
          </Button>
          <Button
            style={{ display: nodeName === '提交人' ? '' : 'none' }}
            onClick={this.stopProcess}
            type="primary"
          >
            终止
          </Button>
          <Modal
            visible={visible}
            title="流程转阅"
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel}
            footer={[
              <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                确定
              </Button>,
              <Button key="cancel" loading={loading} onClick={this.handleCancel}>
                取消
              </Button>,
            ]}
          >
            <Row style={{ marginBottom: '10px' }}>
              <Col span={4} style={{}}>
                <span style={{ color: 'red', fontSize: '20', fontWeight: 'bold' }}>*</span>
                转阅人员：
              </Col>
              <Col span={20}>
                <UserSelect
                  required={true}
                  type="input"
                  multiple={true}
                  width={'100%'}
                  onChange={(a)=>{this.turnReadCallback(a)}}
                />
              </Col>
            </Row>
            <Row>
              <Col span={4}>转阅附言：</Col>
              <Col span={20}>
                <TextArea
                  placeholder="请输入转阅附言"
                  value={this.state.desc}
                  onChange={e => {
                    this.setState({ desc: e.target.value });
                  }}
                  autosize={{ minRows: 2, maxRows: 6 }}
                />
              </Col>
            </Row>
          </Modal>
        </div>
      </Fragment>
    );
  }
}

@connect(({ processForm, loading, global }) => ({
  processForm,
  global,
  loading: loading.models.processForm,
}))
export default class ProcessLaunch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: { visibility: 'visible' },
      operationkey: 'formInfo',
      formTitle: null,
    };
  }
  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };
  componentDidMount() {
    const _this = this;
    const { dispatch, match } = this.props;
    window.changeFormTitle = function(name) {
      _this.props.dispatch({
        type: 'processForm/changeFormTitle',
        payload: {
          formTitle: name,
        },
      });
    };
    // 存储基本参数
    this.props.dispatch({
      type: 'processForm/initProcessForm',
      payload: {
        taskId: nullToZero(match.params.taskId),
        modelId: nullToZero(match.params.modelId),
        instId: nullToZero(match.params.instId),
        bizId: nullToZero(match.params.bizId),
        formType: nullToZero(match.params.formType),
      },
    });
    let expType = '';
    const queryString = window.location.search.substring(1);
    if (queryString != '') {
      expType = queryString.split('&')[0].split('=')[1];
    }
    this.props.dispatch({
      type: 'processForm/getFormUrl',
      payload: { ...this.props.match.params, expType: expType },
    });
    this.props.dispatch({
      type: 'processForm/getBaseInfo',
      payload: this.props.match.params,
    });
    this.props.dispatch({
      type: 'processForm/getFormInfo',
      payload: this.props.match.params,
    });

    // 保存表单基本信息
    window.saveBaseInfo = function(obj) {
      const formData = new FormData();
      _this.props.processForm.formInfo.files.forEach(file => {
        formData.append('files[]', file);
      });

      const saveData = {
        files: [..._this.props.processForm.formInfo.files],
        postscripts: [{}],
      };

      // 保存表单基础数据
      _this.props.dispatch({
        type: 'processForm/saveFormBaseInfo',
        payload: formData,
      });
    };
    window.formLoading = function() {
      dispatch({ type: 'processForm/changeSubmitBtnLoading', payload: true });
      dispatch({ type: 'processForm/changeSaveBtnLoading', payload: true });
    };
    window.formUnLoading = function() {
      dispatch({ type: 'processForm/changeSubmitBtnLoading', payload: false });
      dispatch({ type: 'processForm/changeSaveBtnLoading', payload: false });
    };
  }
  componentWillMount() {
    const { match } = this.props;

    // 判断审批状态(已审批跳转到view页面)
    /*this.props.dispatch({
      type: 'processForm/getProcessFormState',
      payload: { taskId: nullToZero(match.params.taskId) },
    });*/

    // 存储基本参数
    this.props.dispatch({
      type: 'processForm/initProcessForm',
      payload: {
        taskId: match.taskId,
        modelId: match.modelId,
        instId: match.instId,
        bizId: match.bizId,
      },
    });

    if (match.params.formType === '2' || match.params.formType === '3') {
      // 添加宽屏样式!
      this.props.dispatch({
        type: 'global/changeMainBoxStyle',
        payload: commonLayoutStyles.maxLayout,
      });
    }
  }

  changeBtnState = e => {
    this.props.dispatch({ type: 'processForm/changeSubmitBtnLoading', payload: e });
    this.props.dispatch({ type: 'processForm/changeSaveBtnLoading', payload: e });
  };

  // 保存基本信息
  doSaveBaseInfo = bizNo => {
    this.props.dispatch({ type: 'processForm/doSaveBaseInfo', payload: bizNo });
  };

  // doFormFn = fnName => {
  //   console.info(fnName);
  //   this.refs.formWrapper.doFormFn(fnName);
  // };

  doFormFn = (fnName, msg) => {
    this.refs.formWrapper.doFormFn(fnName, msg);
  };

  render() {
    const {
      processForm: { formInfo, bizId, modelId, formType, instId },
      match,
      routerData,
      location,
    } = this.props;
    // 得到表单类型，formType，用于判断流程发起页面的样式
    // styles.mainBox, styles.bigFormBox
    // classNames({ foo: true, bar: true }); // => 'foo bar'
    // 判断是否有实例ID
    const tabList =
      match.params.instId !== '0'
        ? [
            {
              key: 'formInfo',
              tab: '申请信息',
            },
            {
              key: 'recordInfo',
              tab: '处理记录',
            },
          ]
        : null;
    const contentBox = {
      formInfo: (
        <div>
          <ProcessFileList files={formInfo.files} refDocs={formInfo.refDocs} />
          <FormWrapper
            ref="formWrapper"
            src={formInfo.formUrl || ''}
            changeBtnState={this.changeBtnState.bind(this)}
            doSaveBaseInfo={this.doSaveBaseInfo.bind(this)}
          />
          {formType === '3' || formType === '2' ? (
            <div />
          ) : (
            <PostscriptRecord
              postscripts={formInfo.postscripts}
              proInstId={match.params.instId}
              showPost={formInfo.postscripts.length}
            />
          )}
          {instId === '0' ? (
            <div />
          ) : (
            <ApproveRecord
              approveRecords={formInfo.approveRecords}
              flowEnd={formInfo.flowEnd}
              showApprove={formInfo.approveRecords.length}
            />
          )}
          {instId === '0' ? (
            <div />
          ) : (
            <TransferRecord
              transferRecords={formInfo.transferRecords}
              showTransfer={formInfo.transferRecords.length}
            />
          )}
        </div>
      ),
      recordInfo: (
        <div>
          <ApproveRecord approveRecords={formInfo.approveRecords} flowEnd={formInfo.flowEnd} />
          <TransferRecord transferRecords={formInfo.transferRecords} />
        </div>
      ),
    };

    class TitleAction extends Component {
      render() {
        return (
          <Fragment>
            {this.props.formInfo.formTitle}
            <ProcessBaseAction formInfo={this.props.formInfo} actionType="launch" />
          </Fragment>
        );
      }
    }

    return (
      <PageHeaderWrapper
        isAffix
        logo={<img alt="流程中心" src={formLogo} />}
        title={<TitleAction formInfo={formInfo} />}
        action={<Action doFormFn={this.doFormFn.bind(this)} />}
        content={
          <Fragment>
            <OwnerInfo
              ownerDept={formInfo.ownDeptName}
              userName={formInfo.processDockingName}
              userNo={formInfo.processDockingNo}
              bizId={bizId}
              modelId={modelId}
            />
            <ProcessBaseInfo />
          </Fragment>
        }
        // tabList={tabList}
        // onTabChange={this.onOperationTabChange}
      >
        {contentBox[this.state.operationkey]}
      </PageHeaderWrapper>
    );
  }
}
