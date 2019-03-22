import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';

@connect(({ attendance, loading }) => ({
  attendance,
  loading: loading.models.attendance,
}))
export default class BusinessTripDetail extends Component {
  componentDidMount() {
    /*const { dispatch } = this.props;
    dispatch({
      type: 'attendance/getLateAbsenteeism',
      payload: { useManId: '00004907' },
    });*/
  }

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
        this.handlesPost(this.state);
      }
    );

    /*  dispatch({
        type: 'attendance/getLateAbsenteeism',
        payload: params,
      });*/
  };

  handleShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    const params = {
      pageNumber: current,
      pageSize: pageSize,
    };
    this.setState(
      {
        pageNumber: current,
        pageSize: pageSize,
      },
      function() {
        this.handlesPost(this.state);
      }
    );

    /*dispatch({
      type: 'attendance/getLateAbsenteeism',
      payload: params,
    });*/
  };
  handlesPost = () => {
    this.props.ShowSizeChange(this.state);
  };

  render() {
    const {
      attendance: { d },
    } = this.props;
    const columns = [
      {
        title: '时间',
        dataIndex: 'sdate',
      },

      {
        title: '类型',
        dataIndex: 'type',
        render: (text, record) => {
          if (record.type == 70) {
            return '迟到';
          } else if (record.type == 80) {
            return '早退';
          }
        },
      },
      {
        title: '时长(分钟)',
        dataIndex: 'typeTime',
      },
      {
        title: '详情',
        dataIndex: 'remark',
        render: (text, record) => {
          let url = 'record';
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
          dataSource={d.lalist}
          pagination={{
            defaultPageSize: 5,
            pageSizeOptions: ['5', '10', '20'],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: function() {
              return '共 ' + d.pfNumber + ' 条数据';
            },
            onChange: this.handleStandardTableChange,
            onShowSizeChange: this.handleShowSizeChange,
            total: d.pfNumber,
          }}
        />
      </div>
    );
  }
}
