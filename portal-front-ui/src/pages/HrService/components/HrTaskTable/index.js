import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';

@connect(({ hrPerformance, loading }) => ({
  hrPerformance,
  loading: loading.models.hrPerformance,
}))

export default class HrTaskTable extends Component {

  componentDidMount () {
    this.props.dispatch({
      type: 'hrPerformance/fetch',
    });
  }

  render() {

    const {hrPerformance:{data}} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '人事类型',
        dataIndex: 'fraction',
        key: 'fraction',
      },
      {
        title: '提交时间',
        dataIndex: 'grade',
        key: 'grade',
      },
      {
        title: '总耗时',
        dataIndex: 'judge',
        key: 'judge',
      },
      {
        title: '所属系统',
        dataIndex: 'sys',
        key: 'sys',
      },
    ];
    return (
      <div>
        {/*<Table columns={columns} dataSource={data.list} pagination={false} />*/}
      </div>
    );
  }
}
