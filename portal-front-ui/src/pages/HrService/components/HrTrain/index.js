import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';

@connect(({ hrTrain, loading }) => ({
  hrTrain,
  loading: loading.models.hrTrain,
}))

export default class HrTrain extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'hrTrain/queryTrain',
      payload: { page: 1, rows: 5 },
    });
  }

  handleStandardTableChange = (pagination, filtersArg) => {
    const { dispatch } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination,
      rows: filtersArg,
      ...filters,
    };

    dispatch({
      type: 'hrTrain/queryTrain',
      payload: params,
    });
  };
  render() {
    const {
      hrTrain: { data },
    } = this.props;
    const columns = [
      {
        title: '课程名称',
        dataIndex: 'courseName',

      },
      {
        title: '讲师',
        dataIndex: 'lecturerName',

      },
      {
        title: '课程类型',
        dataIndex: 'courseType',

      },

      {
        title: '授课时间',
        dataIndex: 'lectureTime',

      },

    ];
    return (
      <div className="hrMainTable">
        <Table
          columns={columns}
          dataSource={data.list}
          onChange={this.handleStandardTableChange}
          pagination={{pageSize:5,total:data.pagination.total,showQuickJumper:true}}   />
      </div>
    );
  }
}
