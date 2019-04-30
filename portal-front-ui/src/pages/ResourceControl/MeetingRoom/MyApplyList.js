import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Popover, Icon, Row, Col, Card, Modal, Button, Table  } from 'antd';
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
    detailVisible: false,
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

  updateApplyMsg = () =>{

  };

  render() {
    const {
      mtRoom: { myApply },
      loading,
    } = this.props;
    const { pagination } = this.state;
    const columns = [
      {dataIndex: 'meetingroomName', title: '会议室'},
      {dataIndex: 'status', title: '状态', render: (text,record)=>{}},
      {dataIndex: 'applyType', title: '申请类型', render: text=> text === 0 ? "单次" : "周期性"},
      {dataIndex: 'useDate', title: '使用日期'},
      {dataIndex: 'useTime', title: '使用时段'},
      {dataIndex: 'applyTime', title: '申请时间'},
    ];
    return (
      <PageHeaderWrapper>
        <Card>
          <Row>
            <Col md={3} sm={6}>
              <Button onClick={this.updateApplyMsg}><Icon type="clock-circle" />调整申请</Button>
            </Col>
            <Col md={3} sm={6}>
              <Button onClick={this.goPrevWeek}><Icon type="upload" />重新提交</Button>
            </Col>
            <Col md={3} sm={6}>
              <Button onClick={this.goNextWeek}><Icon type="poweroff" />终止</Button>
            </Col>
          </Row>
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
            rowSelection={{
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRows:selectedRows});
              },
            }}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}
