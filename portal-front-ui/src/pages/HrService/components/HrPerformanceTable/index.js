import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import {nullToZero} from "../../../../utils/utils";

@connect(({ hrPerformance, loading }) => ({
  hrPerformance,
  loading: loading.models.hrPerformance,
}))

export default class HrPerformanceTable extends Component {


  componentDidMount () {
    this.props.dispatch({
      type: 'hrPerformance/fetch',
    });
  }

  render() {

    const {hrPerformance:{data}} = this.props;
    const columns = [
      {
        title: '月份',
        dataIndex: 'month',
        key: 'month',
      },
      {
        title: '总分',
        dataIndex: 'fraction',
        key: 'fraction',
      },
      {
        title: '等级',
        dataIndex: 'grade',
        key: 'grade',
      },
      {
        title: '评分人',
        dataIndex: 'judge',
        key: 'judge',
      },
    ];
    return (
      <div>
        <Table columns={columns} dataSource={data.list} pagination={false} />
      </div>
    );
  }
}
