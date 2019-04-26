/**
 * 个人资料绩效信息表格组件
 */
import React, { Component, Fragment } from 'react';
import { Table, Row } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva';

@connect(({ hrPerformance, loading }) => ({
  hrPerformance,
  loading: loading.models.hrPerformance,
}))
export default class PerformanceTable extends Component {

  state = {
    list: ''
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'hrPerformance/fetch',
    });
  }

  render() {
    const {
      hrPerformance: { performanceTable },
    } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'assessmentYearStr',
        key: 'assessmentYearStr',
      },
      {
        title: '奖励日期',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '奖励类型',
        dataIndex: 'score',
        key: 'score',
      },
      {
        title: '奖励级别',
        dataIndex: 'examScoreVoList',
        key: 'examScoreVoList',
      },
      {
        title: '奖励机构',
        dataIndex: 'flowStatusStr',
        key: 'flowStatusStr',
      },
      {
        title: '奖励措施',
        dataIndex: 'flowStatusStr',
        key: 'flowStatusStr',
      },
      {
        title: '奖励事由',
        dataIndex: 'flowStatusStr',
        key: 'flowStatusStr',
      },
    ];

    return (
      <div>
        <Row>
          <Table columns={columns} dataSource={this.state.list} pagination={false} />
        </Row>
      </div>
    );
  }
}
