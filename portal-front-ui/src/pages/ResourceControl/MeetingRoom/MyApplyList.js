import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Icon, Row, Col, Card, message, Button, Table  } from 'antd';
import styles from './index.less';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import MeetingRoomApplyDetail from '../components/MeetingRoomApplyDetail';
import moment from 'moment';

@connect(({ mtRoom, loading }) => ({
  mtRoom,
  loading: loading.models.mtRoom,
}))

export default class MeetingRoom extends PureComponent {

  state = {
    pagination: { pageIndex: 1, pageSize: 10 },
    viewType: 0,
    detailVisible: false,
    selApply: null,
  };

  componentDidMount(){
    this.loadApplyList();
  }

  loadApplyList = () => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'mtRoom/queryMyApplyList',
      payload: {
        query: pagination
      },
    })
  };

  handleRoomChange = (pagination) => {
    this.setState({
      pagination: {
        pageSize: pagination.pageSize,
        pageIndex: pagination.current
      }
    }, ()=>{
      this.loadApplyList()
    });
  };

  viewApplyDetail = (applyVo) => {
    this.setState({
      viewType: 0,
      detailVisible: true,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'mtRoom/getmRoomDetail',
      payload: {
        mrId: applyVo.meetingroomId,
        applyNo: applyVo.applyNo,
      }
    });
  };
  //调整申请
  updateApplyMsg = () =>{
    const { selApply } = this.state;
    if(!selApply){ message.warn('请选择一条记录', 1);return; }
    if(selApply.applyType === 1){ message.warn('周期性会议不能调整申请，请取消后重新申请', 1);return; }
    if([1,2,3,4,5,6].indexOf(selApply.status) > -1){ message.warn('当前会议室状态不能调整申请', 1); return; }
    if(selApply.applyNo){
      const { dispatch } = this.props;
      dispatch({
        type: 'mtRoom/getmRoomDetail',
        payload: {
          mrId: selApply.meetingroomId,
          applyNo: selApply.applyNo,
        }
      });
      this.setState({
        viewType: 1,
        detailVisible: true,
      });
    }
  };
  //重新提交
  ReSubmit = () =>{
    const { selApply } = this.state;
    const { dispatch } = this.props;
    if(!selApply){ message.warn('请选择一条记录', 1);return; }
    if(selApply.status !==7 && selApply.status !== 8){ message.warn('当前申请状态不需要重新提交', 1);return; }
    Modal.confirm({
      content: "确定要重新发起当前申请会议室？",
      onOk: () => new Promise((resolve, reject)=>{
        dispatch({
          type: "mtRoom/ReSubmitProcess",
          payload: {
            applyNo: selApply.applyNo
          },
          callback: (res)=>{
            if(res.code === '100'){
              message.success(res.msg);
              this.loadApplyList();
              resolve(res);
            }else{
              reject(res);
              message.error(res.msg);
            }
          }
        });
      })
    })
  };
  //终止流程
  cancelApply = () => {
    const { selApply } = this.state, status = selApply.status;
    if(!selApply){ message.warn('请选择一条记录', 1);return; }
    if(status === 4 || status === 5){message.warn('会议申请已经取消,无需再次终止', 1); return;}
    if(selApply.applyType === 0){
      if( status === 3){message.warn('使用过的会议申请无法终止', 1);return;}
      if(status===0 || status ===1 || status===2 || status===7 || status===8){
        this.updateApplyStatus(selApply);
      }
    }else if(selApply.applyType === 1){
      if(status===0 || status===1 || status===7 || status===8 || status===2 || status===3){
        this.updateApplyStatus(selApply);
      }
    }
  };
  updateApplyStatus = (selApply) => Modal.confirm({
    content: "确定要终止当前申请会议室？",
    onOk: () => new Promise((resolve, reject)=>{
      this.props.dispatch({
        type: "mtRoom/updateMeetingStatus",
        payload: {
          applyNo: selApply.applyNo
        },
        callback: (res)=>{
          if(res.code === '100'){
            message.success(res.msg);
            this.loadApplyList();
            resolve(res);
          }else{
            reject(res);
            message.error(res.msg);
          }
        }
      });
    })
  });

  formatApplyStatus = (value) => {
    let textColor = '',val = '';
    switch(value){
      case 0: textColor = '#FF3D00';val='待审批';break;
      case 1:	textColor = '#33B553';val='申请成功';break;
      case 2:	textColor = '#33B553';val='申请成功';break;
      case 3:	val='申请成功';break;
      case 4:	val='过期未审批';break;
      case 5:	val='终止';break;
      case 6: val='不通过';break;
      case 7: val='撤回';break;
      case 8:val='驳回';break;
    }
    return <span style={textColor ? {color: textColor} : {}}>{val}</span>
  };

  render() {
    const {
      mtRoom: { myApply, applyDetail: { applyVo } },
      loading,
    } = this.props;
    const { pagination, detailVisible, viewType } = this.state;
    const columns = [
      {dataIndex: 'meetingroomName', title: '会议室'},
      {dataIndex: 'status', title: '状态', render: this.formatApplyStatus},
      {dataIndex: 'applyType', title: '申请类型', render: text=> text === 0 ? "单次" : "周期性"},
      {dataIndex: 'useDate', title: '使用日期'},
      {dataIndex: 'useTime', title: '使用时段'},
      {dataIndex: 'applyTime', title: '申请时间'},
    ];
    return (
      <PageHeaderWrapper>
        <Card>
          <div className={styles.myMtApplyOpts}>
              <Button onClick={this.updateApplyMsg}><Icon style={{ color: '#faad14' }} type="clock-circle" />调整申请</Button>
              <Button onClick={this.ReSubmit}><Icon type="upload" />重新提交</Button>
              <Button onClick={this.cancelApply}><Icon type="poweroff" />终止</Button>
          </div>
          <Table
            rowKey="applyNo"
            loading={loading}
            columns={columns}
            dataSource={myApply.rows || []}
            pagination={{
              ...pagination,
              total: myApply.total,
            }}
            onChange={this.handleRoomChange}
            onRow={(record)=>{
              return {
                onClick: () => this.viewApplyDetail(record)
              }
            }}
            rowClassName={(record)=>{
              if (record.status &&( record.status === 3 || record.status === 4 || record.status === 5 || record.status === 6)) {    //已经过期的申请
                return 'apply-out-time'
              }
              return 'enable'
            }}
            rowSelection={{
              type: "radio",
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selApply:selectedRows[0]});
              },
            }}
          />
        </Card>
        {detailVisible ? <MeetingRoomApplyDetail
          disabled={!viewType}
          applyVo={applyVo}
          visible={detailVisible}
          onCancel={()=>this.setState({detailVisible: false })}
        /> : ''}
      </PageHeaderWrapper>
    )
  }
}
