import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {Tabs, Button, Icon, Modal, Row, Col, Input, Timeline, Card, Affix, Popover, Tag} from 'antd';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
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
  ProcessBaseInfo,
  ProcessBaseAction,
} from '../../components/ProcessForm';
import formLogo from '../../assets/form-logo.png';
import OwnerInfo from '../../components/ProcessForm/OwnerInfo';
import { message } from 'antd/lib/index';
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
    revertVisible: false,
    selectedPersons: [],
    desc: '',
  };
  handleTurn = () => {
    this.setState({
      visible: true,
    });
  };
  // 撤回操作
  handleRevert = () => {
    this.setState({
      revertVisible: true,
    });
  };
  handleCloseRevert = () => {
    this.setState({
      revertVisible: false,
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

  handleRevertOk = () => {
    this.setState({ loading: true });
    if (this.state.desc.length > 0) {
      this.props.dispatch({
        type: 'processForm/doRevoke',
        payload: {
          message: encodeURIComponent(this.state.desc),
          processInstId: this.props.processForm.formInfo.proInstId,
        },
      });
      setTimeout(() => {
        this.setState({ loading: false, revertVisible: false });
      }, 3000);
    } else {
      this.setState({ loading: false });
      message.error('请输入撤销原因！');
    }
  };

  turnReadCallback = datas => {
    this.setState({ selectedPersons: datas });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleRevertCancel = () => {
    this.setState({ revertVisible: false });
  };

  render() {
    const { visible, loading, selectedPersons, revertVisible } = this.state;
    return (
      <Fragment>
        {this.props.taskType === 'search' ? (
          <div />
        ) : (
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
            <Button
              style={{ display: this.props.processForm.formInfo.revokable ? '' : 'none' }}
              onClick={this.handleRevert}
            >
              撤回
            </Button>

            <Modal
              visible={revertVisible}
              title="撤回"
              onOk={this.handleRevertOk.bind(this)}
              onCancel={this.handleRevertCancel}
              footer={[
                <Button key="submit" type="primary" loading={loading} onClick={this.handleRevertOk}>
                  确定
                </Button>,
                <Button key="reset" onClick={this.handleCloseRevert}>
                  取消
                </Button>,
              ]}
            >
              <Row>
                <Col span={4}>
                  <span style={{ color: 'red', fontSize: '20', fontWeight: 'bold' }}>*</span>
                  撤销原因
                </Col>
                <Col span={20}>
                  <TextArea
                    placeholder="请输入撤销原因"
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
        )}
      </Fragment>
    );
  }
}

@connect(({ processForm, loading }) => ({
  processForm,
  loading: loading.models.processForm,
}))
export default class ProcessView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: { visibility: 'visible' },
      operationkey: 'formInfo',
      formTitle: null,
      loading: false,
      revertVisible: false,
    };
  }
  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };
  componentDidMount() {
    var ZC = '1',
      ZH = '2',
      BH = '3',
      ZY = '4',
      BSP = '5',
      XT = '6',
      PS = '7';
    // 存储基本参数
    this.props.dispatch({
      type: 'processForm/initProcessForm',
      payload: {
        taskId: nullToZero(this.props.match.params.taskId),
        modelId: nullToZero(this.props.match.params.modelId),
        instId: nullToZero(this.props.match.params.instId),
        bizId: nullToZero(this.props.match.params.bizId),
      },
    });

    //如果是知会或者转阅 自动完成任务
    if ('turn_read' == this.props.match.params.modelId) {
      this.props.dispatch({
        type: 'processForm/doZYZH',
        payload: {
          taskId: nullToZero(this.props.match.params.taskId),
          modelId: nullToZero(this.props.match.params.modelId),
          processInstanceId: nullToZero(this.props.match.params.instId),
        },
      });
    }

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
    window.changeFormTitle = function(name) {
      _this.props.dispatch({
        type: 'processForm/changeFormTitle',
        payload: {
          formTitle: name,
        },
      });
    };
  }

  doFormFn = (fnName, msg) => {
    this.refs.formWrapper.doFormFn(fnName, msg);
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
          <FormWrapper ref="formWrapper" src={formInfo.formUrl} />
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
            <ProcessBaseAction
              formInfo={this.props.formInfo}
              actionType="view"
              taskType={match.params.taskType}
            />
          </Fragment>
        );
      }
    }
    return (
      <PageHeaderWrapper
        title={<TitleAction formInfo={formInfo} />}
        logo={<img alt="" src={formLogo} />}
        action={
          <Action
            btnStyle={this.state.style}
            taskType={match.params.taskType}
            doFormFn={this.doFormFn}
          />
        }
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
      </PageHeaderWrapper>
    );
  }
}
