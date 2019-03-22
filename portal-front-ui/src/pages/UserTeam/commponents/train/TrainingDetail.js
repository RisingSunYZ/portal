/**
 * 培训详情
 */
import React, { Component } from 'react';
import { Card, Table, Row, Col,Input } from 'antd';
import { connect } from 'dva/index';

const columns = [
  {
    title: '培训课程',
    dataIndex: 'courseName',
    key: 'courseName',
  },{
    title: '授课时间',
    dataIndex: 'lectureTime',
    key: 'lectureTime',
  },
  {
    title: '授课人',
    dataIndex: 'lecturerName',
    key: 'lecturerName',
  },
  {
    title: '地点',
    dataIndex: 'lecturePlace',
    key: 'lecturePlace',
  },
  {
    title: '计划课程类型',
    dataIndex: 'setupFlag',
    key: 'setupFlag',
  },
  {
    title: '课程学时',
    dataIndex: 'classHour',
    key: 'classHour',
  },
  //产品经理说暂时不需要（培训系统没有配套的页面）
  // {
  //   title: '详情',
  //   dataIndex: 'completeRate',
  //   render: () => <a href="#">查看</a>,
  // }
];

@connect(({ teamTrain, loading }) => ({
  teamTrain,
  loading: loading.models.teamTrain,
}))
export default class TrainingDetail extends Component {

  state = {
    current:1
  };

  componentDidMount() {

  };

  handleStandardTableChange = (pagination, filtersArg) => {
    this.setState({
      current: pagination,
    });
    this.props.onPageChange(pagination, filtersArg);
  };

  showSizeChange = (current, size) => {
    this.setState({
      current: 1,
    });
    this.props.onSizeChange(current, size);
  };

  search = (val) => {
    this.props.onSearch(val)
  };

  render() {

    const {teamTrain: { trainingDetail }} = this.props;

    const paginationSet = {
      current:this.state.current,
      pageSizeOptions: ['5', '10', '20'],
      showQuickJumper: true,
      showSizeChanger: true,
      total:trainingDetail.total,
      onChange:this.handleStandardTableChange,
      onShowSizeChange: this.showSizeChange,
      showTotal: function () {  //设置显示一共几条数据
        return <div style={{marginLeft:0}}>共 {trainingDetail.total} 条数据</div>;
      }
    };

    return (
      <Card bordered={false}  bodyStyle={{padding: "0"}}>
        <Row>
          <Col span={4}>
            <p className="cardTitle"><i></i>培训详情</p>
          </Col>
          <Col offset={14} span={6}>
            <Input.Search  placeholder="课程名称/授课人" onSearch={this.search} style={{ width: 250, marginTop: 8, float: 'right'}} />
          </Col>
        </Row>
        <Table columns={columns} dataSource={trainingDetail.data} pagination={paginationSet} rowKey={record => record.aa} />
      </Card>
    );
  }
}
