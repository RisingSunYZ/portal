import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {Tabs, Button, Icon, Modal, Timeline, Card, Affix, Popover, message, Row, Col, Input, Tag} from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import { deepCopy, nullToZero } from '../../utils/utils';
import FormWrapper from '../../components/FormWrapper';
import {
  FormApproveTool,
  CreatorInfo,
  ApproveRecord,
  TransferRecord,
  PostscriptRecord,
  ProcessFileList,
  ProcessBaseAction,
} from '../../components/ProcessForm';
import formLogo from '../../assets/form-logo.png';
import OwnerInfo from '../../components/ProcessForm/OwnerInfo';
import ProcessBaseInfo from '../../components/ProcessForm/ProcessBaseInfo';
import { UserSelect } from '../../components/Selector';

const { TextArea } = Input;
@connect(({ processForm, loading }) => ({
  processForm,
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
  // 撤回操作
  handleRevert = () => {};
  handleOk = () => {
    this.props.doFormFn('doTurnRead',this.state.selectedPersons);

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

  render() {
    const { visible, loading, selectedPersons } = this.state;
    return (
      <Fragment>
        <div style={this.props.btnStyle}>
          <Button onClick={this.handleTurn} type="primary">
            转阅
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
          {/*<Button onClick={this.handleRevert}>撤回</Button>*/}
        </div>
      </Fragment>
    );
  }
}

@connect(({ processForm, loading }) => ({
  processForm,
  loading: loading.models.processForm,
}))
export default class ProcessApprove extends React.Component {
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

  componentWillMount() {
    const { match } = this.props;

    //判断审批状态(已审批跳转到view页面)
    /*this.props.dispatch({
      type: 'processForm/getProcessFormState',
      payload: { taskId: nullToZero(match.params.taskId) },
    });*/
  }

  componentDidMount() {
    const { match } = this.props;

    // 存储基本参数
    this.props.dispatch({
      type: 'processForm/initProcessForm',
      payload: {
        taskId: nullToZero(match.params.taskId),
        modelId: nullToZero(match.params.modelId),
        instId: nullToZero(match.params.instId),
        bizId: nullToZero(match.params.bizId),
      },
    });

    this.props.dispatch({
      type: 'processForm/getFormUrl',
      payload: this.props.match.params,
    });
    this.props.dispatch({
      type: 'processForm/getBaseInfo',
      payload: this.props.match.params,
    });

    this.props.dispatch({
      type: 'processForm/getFormInfo',
      payload: this.props.match.params,
    });

    this.props.dispatch({
      type: 'processForm/getBackNodes',
      payload: { taskId: nullToZero(match.params.taskId) },
    });
  }
  doFormFn = (fnName, msg) => {
    this.refs.formWrapper.doFormFn(fnName, msg);
  };

  /**
   * 审批
   * @param msg
   */
  doApprove = msg => {
    this.props.dispatch({
      type: 'processForm/doApprove',
      payload: {
        type: 'SP',
        message: encodeURIComponent(msg),
        taskId: this.props.processForm.taskId,
        processInstanceId: this.props.processForm.instId,
      },
    });
  };


  /**
   * 评审
   * @param msg
   */
  doApproveReview = msg =>{
    this.props.dispatch({
      type: 'processForm/doApprove',
      payload: {
        option: 'PS',
        message: encodeURIComponent(msg),
        taskId: this.props.processForm.taskId,
        processInstanceId: this.props.processForm.instId,
      },
    });
  };


  /**
   * 审批并加签
   * @param obj
   *
   * {
        "bizId": "string",
        "createTime": "2019-03-18T05:47:44.520Z",
        "creator": "string",
        "delFlag": 0,
        "message": "string",
        "modelKey": "string",
        "processInstId": "string",
        "taskId": "string",
        "updateTime": "2019-03-18T05:47:44.520Z",
        "updator": "string",
        "userCodes": "string",
        "userNames": "string"
      }
   */
  doAddSign = obj => {
    if (obj && obj.datas.length > 0) {
      this.props.dispatch({
        type: 'processForm/doAddSign',
        payload: {
          taskId: this.props.processForm.taskId,
          processInstanceId: this.props.processForm.instId,
          modelKey:this.props.processForm.modelKey,
          bizId:this.props.processForm.bizId,
          userCodes: obj.datas
            .map(data => {
              return data.no;
            })
            .join(','),
          userNames: encodeURIComponent(
            obj.datas
              .map(data => {
                return data.name;
              })
              .join(',')
          ),
          message: encodeURIComponent(obj.approveMsg),
        },
      });
    }
  };

  //转办
  doTurnDo = obj => {
    if (obj && obj.datas.length > 0) {
      this.props.dispatch({
        type: 'processForm/doTurnDo',
        payload: {
          taskId: this.props.processForm.taskId,
          userId: obj.datas[0].no,
          userName: obj.datas[0].name,
          message: obj.approveMsg,
        },
      });
    }
  };

  handleOk = () => {
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

  methods = {
    doApprove: this.doApprove,
    doTurnDo: this.doTurnDo,
    doAddSign: this.doAddSign,
    doApproveReview:this.doApproveReview
  };

  render() {
    const {
      processForm: { formInfo, bizId },
      match,
      routerData,
      location,
    } = this.props;
    const tabList =
      formInfo.approveRecords && formInfo.transferRecords
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
          <FormWrapper ref="formWrapper" src={formInfo.formUrl} {...this.methods} />
          <PostscriptRecord
            postscripts={formInfo.postscripts}
            proInstId={match.params.instId}
            showPost={formInfo.postscripts.length}
          />
          <ApproveRecord
            approveRecords={formInfo.approveRecords}
            flowEnd={formInfo.flowEnd}
            showApprove={formInfo.approveRecords.length}
          />
          <TransferRecord
            transferRecords={formInfo.transferRecords}
            showTransfer={formInfo.transferRecords.length}
          />
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
            <ProcessBaseAction formInfo={this.props.formInfo} actionType="approve" />
          </Fragment>
        );
      }
    }

    return (
      <PageHeaderWrapper
        isAffix
        title={<TitleAction formInfo={formInfo} />}
        logo={<img alt="" src={formLogo} />}
        action={<Action btnStyle={this.state.style} doFormFn={this.doFormFn} />}
        content={
          <Fragment>
            <OwnerInfo
              ownerDept={formInfo.ownDeptName}
              userName={formInfo.processDockingName}
              userNo={formInfo.processDockingNo}
              bizId={bizId}
            />
            <ProcessBaseInfo />
          </Fragment>
        }
        // tabList={tabList}
        // onTabChange={this.onOperationTabChange}
      >
        {contentBox[this.state.operationkey]}
        <Affix
          style={{
            position: 'fixed',
            bottom: 0,
            width: '1200px',
            background: '#E1EDFF',
            borderTop: '3px solid rgba(24,144,255,1)',
          }}
        >
          <FormApproveTool doFormFn={this.doFormFn.bind(this)} />
        </Affix>
      </PageHeaderWrapper>
    );
  }
}
