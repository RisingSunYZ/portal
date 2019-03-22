import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';

@connect(({ attendance, loading }) => ({
  attendance,
  loading: loading.models.attendance,
}))
export default class Absenteeism extends Component {
  componentDidMount() {
    /*const { dispatch } = this.props;
    dispatch({
      type: 'attendance/getExceptionApplication',
      payload: { useManId: '00004907' },
    });*/
  }

  handleShowSizeChange = (current, pageSize) => {
    this.setState(
      {
        pageNumber: current,
        pageSize: pageSize,
      },
      function() {
        this.handlaPost(this.state);
      }
    );
  };

  handleStandardTableChange = (pagination, filtersArg) => {
    const { dispatch } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNumber: pagination,
      pageSize: filtersArg,
      ...filters,
    };
    this.setState(
      {
        pageNumber: pagination,
        pageSize: filtersArg,
      },
      function() {
        this.handlaPost(this.state);
      }
    );

    /*dispatch({
      type: 'attendance/getAbsenteeism',
      payload: params,
    });*/
  };

  handlaPost = () => {
    this.props.showListChange(this.state);
  };
  render() {
    const {
      attendance: { e },
    } = this.props;
    const columns = [
      {
        title: '时间',
        dataIndex: 'absenteeismTime',
      },

      {
        title: '类型',
        dataIndex: 'week',
        render: (text, record) => {
          return '旷工';
        },
      },
      {
        title: '旷工时长(天)',
        dataIndex: 'absenteeismDay',
      },
      {
        title: '详情',
        dataIndex: 'processingState',
        render: (text, record) => {
          let url = '/ys/user-center/attendance/record';
          return (
            <span>
              <a href={url}>查看</a>
            </span>
          );
        },
      },
    ];
    return (
      <div style={{ padding: '0' }}>
        <Table
          columns={columns}
          dataSource={e.ealist}
          pagination={{
            defaultPageSize: 5,
            pageSizeOptions: ['5', '10', '20'],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: function() {
              return '共 ' + e.pfNumber + ' 条数据';
            },
            onChange: this.handleStandardTableChange,
            onShowSizeChange: this.handleShowSizeChange,
            total: e.pfNumber,
          }}
        />
      </div>
    );
  }
}
