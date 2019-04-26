import React, { Component } from 'react';
import { Table, Card, Row, Col, Input, Button, Icon, Modal, Radio } from 'antd';
import styles from './index.less';
import { message } from 'antd/lib/index';
import { connect } from 'dva/index';
import { isEmpty, nullToZero } from '../../utils/utils';
import { UserSelect } from '../../components/Selector';
import ProcessTable from '../StandardTable/ProcessTable';

const { TextArea } = Input;
const ZC = 'ZC',
  SP = 'applying',
  XT = 'coordination',
  PS = 'review',
  BS = 'bs';
const RadioGroup = Radio.Group;
@connect(({ processForm, loading }) => ({
  processForm,
  loading: loading.models.processForm,
}))
export default class FormApproveTool extends Component {
  state = {
    approveMsg: '',
    approveBtnLoading: false,
    rejectBtnLoading: false,
    visible: false,
    rowVisible: false,
    codeValue: '',
    activityName: '',
    activityId: '',
  };

  //审批
  doApprove = () => {
    // this.setState({approveBtnLoading:true});
    const { processForm } = this.props;
    this.props.doFormFn('doApprove', this.state.approveMsg);
  };

  //评审
  doApproveReview = () => {
    if (isEmpty(this.state.approveMsg)) {
      message.warn('请填写评审意见！');
      return;
    }
    this.props.doFormFn('doApproveReview', this.state.approveMsg);
  };

  //协同
  doApproveCooperate = () => {
    if (isEmpty(this.state.approveMsg)) {
      message.warn('请填写协同意见！');
      return;
    }
    this.props.doFormFn('doApproveCooperate', this.state.approveMsg);
  };

  doReject = () => {
    this.setState({
      visible: true,
      value: 'reject',
    });
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
    });

    if (e.target.value === 'backToAnyStep') {
      this.setState({
        rowVisible: true,
      });
    } else {
      this.setState({
        rowVisible: false,
        codeValue: '',
        activityName: '',
        activityId: '',
      });
    }
  };
  handleOk = () => {
    if (isEmpty(this.state.approveMsg)) {
      message.error('请输入驳回意见！');
      return;
    }

    if (isEmpty(this.state.value)) {
      message.error('请选择驳回类型！');
      return;
    }

    const { processForm } = this.props;


    if ('reject' === this.state.value) {
      //驳回至提交者
      this.props.dispatch({
        type: 'processForm/doReject',
        payload: {
          code: this.state.value,
          option: 'BH',
          type:"BH",
          message: encodeURIComponent(this.state.approveMsg),
          taskId: processForm.taskId,
          processInstanceId: processForm.instId,
        },
        callback: res => {
          if (res) {
            if(res.code === "100" ){
              this.props.doFormFn("doReject",'');
            }
          }
        }
      });
    } else if ('backToStep' === this.state.value) {
      //驳回至上一审批节点
      this.props.dispatch({
        type: 'processForm/doReject',
        payload: {
          code: this.state.value,
          processInstanceId: processForm.instId,
          message: encodeURIComponent(this.state.approveMsg),
          taskId: processForm.taskId,
        },
        callback: res => {
          if (res) {
            if(res.code =="100" ){
              this.props.doFormFn("doReject",'');
            }
          }
        }
      });
    } else if ('backToAnyStep' === this.state.value) {
      //驳回至指定节点
      const assigneeName = this.state.codeValue.substr(1, this.state.codeValue.length - 2);
      this.props.dispatch({
        type: 'processForm/doReject',
        payload: {
          code: this.state.value,
          processInstanceId: processForm.instId,
          message: encodeURIComponent(this.state.approveMsg),
          taskId: processForm.taskId,
          assigneeName: encodeURIComponent(assigneeName),
          activityName: encodeURIComponent(this.state.activityName),
          activityId: this.state.activityId,
        },
        callback: res => {
          if (res) {
            if(res.code =="100" ){
              this.props.doFormFn("doReject",'');
            }
          }
        }
      });
    }

  };
  handleCancel = () => {
    this.setState({
      visible: false,
      value: '',
      rowVisible: false,
    });
  };
  doTempSave = () => {
    const { processForm } = this.props;
    this.props.dispatch({
      type: 'processForm/doTempSave',
      payload: {
        type: 'ZC',
        message: encodeURIComponent(this.state.approveMsg),
        taskId: processForm.taskId,
      },
    });
  };
  handleChangeApproveMsg = e => {
    this.setState({ approveMsg: e.target.value });
  };

  /**
   * 转办回调
   * @param datas
   */
  turnDoCallback = datas => {
    let obj = {
      approveMsg: this.state.approveMsg,
      datas: datas,
    };
    this.props.doFormFn('doTurnDo', obj);
  };

  /**
   * 加签回调
   * @param datas
   */
  addSignCallback = datas => {
    let obj = {
      approveMsg: this.state.approveMsg,
      datas: datas,
    };

    this.props.doFormFn('doAddSign', obj);
  };

  rowClick = record => {
    this.setState({
      codeValue: '(' + record.userName + ')',
      activityName: record.nodeName,
      activityId: record.nodeId,
    });
  };

  render() {
    const {
      processForm: { approveBtnLoading, rejectBtnLoading, formInfo, backNodes },
    } = this.props;
    const approveType = formInfo.approveType || ZC;
    const approveTypeObj = {};
    approveTypeObj[PS] = { icon: 'solution', text: '评审' };
    approveTypeObj[XT] = { icon: 'solution', text: '协同' };
    approveTypeObj[ZC] = { icon: 'solution', text: '审批' };
    approveTypeObj[SP] = { icon: 'solution', text: '审批' };
    approveTypeObj[BS] = { icon: 'solution', text: '审批' };
    const showApproveType = type => (
      <div className={styles.approveStateBox}>
        <div>当前流程节点</div>
        <h2>
          <Icon
            type={approveTypeObj[type] && approveTypeObj[type].icon}
            style={{ color: '#4E8CEE' }}
            className={styles.approveIcon}
          />
          <span>{approveTypeObj[type] && approveTypeObj[type].text}</span>
        </h2>
      </div>
    );

    // 显示按钮，显示按钮排序
    const approveBtns = () => {
      const btns = [];
      if (approveType === PS) {
        btns.push(
          <Button
            key={'PS'}
            loading={approveBtnLoading}
            onClick={this.doApproveReview.bind(this)}
            className={styles.approveBtn}
          >
            评审
          </Button>
        );
      } else if (approveType === BS || approveType === ZC || approveType === SP) {
        btns.push(
          <Button
            key={'SP'}
            loading={approveBtnLoading}
            onClick={this.doApprove.bind(this)}
            className={styles.approveBtn}
          >
            审批
          </Button>
        );
      } else if (approveType === XT) {
        btns.push(
          <Button
            key={'XT'}
            loading={approveBtnLoading}
            onClick={this.doApproveCooperate.bind(this)}
            className={styles.approveBtn}
          >
            协同
          </Button>
        );
      }
      btns.push(
        <Button key={'ZC'} onClick={this.doTempSave.bind(this)} className={styles.approveBtn}>
          暂存
        </Button>
      );
      if (approveType === BS || approveType === ZC || approveType === SP) {
        btns.push(
          <UserSelect
            key={'JQ'}
            type="button"
            showText="审批并加签"
            multiple={true}
            width={102}
            className={styles.approveBtn}
            onChange={(a)=>{this.addSignCallback(a)}}
          />
        );
      }
      btns.push(
        <UserSelect
          key={'ZB'}
          type="button"
          showText="转办"
          multiple={false}
          width={64}
          className={styles.approveBtn}
          onChange={(a)=>{this.turnDoCallback(a)}}
        />
      );
      if (approveType === BS || approveType === ZC || approveType === SP) {
        btns.push(
          <Button
            key={'BH'}
            loading={rejectBtnLoading}
            onClick={this.doReject.bind(this)}
            className={styles.approveBtn}
          >
            驳回
          </Button>
        );
      }
      return btns;
    };

    const columns = [
      {
        title: '节点名称',
        dataIndex: 'nodeName',
        key: 'nodeName',
        width: 300,
      },
      {
        title: '员工工号',
        dataIndex: 'userCode',
        key: 'userCode',
        width: 200,
      },
      {
        title: '员工姓名',
        dataIndex: 'userName',
        key: 'userName',
        width: 200,
      },
    ];

    return (
      <Card
        className={styles.approveTool}
        style={{
          height: '110px',
          marginBottom: 24,
          width: '1200px',
          margin: 'auto',
          background: '#E1EDFF',
        }}
        bordered={false}
        bodyStyle={{padding: '8px 24px'}}
      >
        <Row>
          <Col span={3}>{showApproveType(approveType)}</Col>
          <Col span={21}>
            <TextArea
              ref="approveMsgIpt"
              value={this.state.approveMsg}
              onChange={this.handleChangeApproveMsg}
              placeholder="请输入审批意见!"
              autosize={{ minRows: 2, maxRows: 6 }}
            />
            {approveBtns(approveType)}
            <Modal
              width={700}
              visible={this.state.visible}
              title="驳回"
              onOk={this.handleOk.bind(this)}
              onCancel={this.handleCancel}
              footer={[
                <Button key="submit" type="primary" onClick={this.handleOk}>
                  确定
                </Button>,
                <Button key="reset" onClick={this.handleCancel}>
                  取消
                </Button>,
              ]}
            >
              <Row>
                <Col span={24}>
                  <span style={{ color: 'red', fontSize: '20', fontWeight: 'bold' }}>*</span>
                  <span style={{ fontSize: '30', fontWeight: 'bold' }}>驳回意见:</span>
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col span={24}>
                  <TextArea
                    placeholder="请输入驳回意见!"
                    value={this.state.approveMsg}
                    onChange={e => {
                      this.setState({ approveMsg: e.target.value });
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col span={4}>
                  <span style={{ color: 'red', fontSize: '20', fontWeight: 'bold' }}>*</span>
                  <span style={{ fontSize: '30', fontWeight: 'bold' }}>驳回类型:</span>
                </Col>
                <Col span={20}>
                  <RadioGroup
                    onChange={this.onChange}
                    value={this.state.value}
                    defaultValue={'reject'}
                  >
                    <Radio key={'reject'} value={'reject'}>
                      驳回至提交者
                    </Radio>
                    <Radio key={'backToAnyStep'} value={'backToAnyStep'}>
                      驳回至指定节点
                      {this.state.codeValue.length > 0 ? this.state.codeValue : ''}
                    </Radio>
                  </RadioGroup>
                </Col>
              </Row>

              <Row style={{ display: this.state.rowVisible ? '' : 'none', marginTop: '10px' }}>
                <Col span={24}>
                  <ProcessTable
                    rowKey="nodeId"
                    data={backNodes}
                    columns={columns}
                    showPagination={false}
                    click={record => {
                      return {
                        onClick: this.rowClick.bind(this, record),
                      };
                    }}
                  />
                </Col>
              </Row>
            </Modal>
          </Col>
        </Row>
      </Card>
    );
  }
}
