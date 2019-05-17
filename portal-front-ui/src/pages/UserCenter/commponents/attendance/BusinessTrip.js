import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';
import { getConfig } from '@/utils/utils';
import Link from "umi/link";

@connect(({ attendance, loading }) => ({
  attendance,
  loading: loading.models.attendance,
}))
export default class BusinessTrip extends Component {
  componentDidMount() {
    /*const { dispatch } = this.props;
    dispatch({
      type: 'attendance/getBusinessTripDetail',
      payload: { useManId: '00004907' },
    });*/
  }

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
        this.handlbPost(this.state);
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
        this.handlbPost(this.state);
      }
    );
  };
  handlbPost = () => {
    this.props.handleSizeChange(this.state);
  };

  render() {
    const {
      attendance: { c },
    } = this.props;
    const columns = [
      {
        title: '外出时间',
        dataIndex: 'startTime',
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
      },
      {
        title: '外出时长',
        dataIndex: 'day',
      },
      {
        title: '外出原因',
        dataIndex: 'remark',
        width:400,
        render:(text,record) =>(
          <div style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '400px',
            overflow: 'hidden',
          }}>
            <p placement="topLeft" title={text}>
              {text}
            </p>
          </div>
        )
      },
      {
        title: '详情',
        dataIndex: 'detial',
        render: (text, record) => {
          let url =
            getConfig().domain +
            '/process/form/view/' +
            record.proDefKey +
            '/' +
            record.procInstId +
            '/' +
            record.billCode +
            '/0/0';
          return (
            <span>
              <Link to={url} target="_blank">
                查看
              </Link>
            </span>
          );
        },
      },
    ];
    return (
      <div style={{ padding: '0' }}>
        <Table
          columns={columns}
          dataSource={c.btlist}
          pagination={{
            defaultPageSize: 5,
            pageSizeOptions: ['5', '10', '20'],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: function() {
              return '共 ' + c.pfNumber + ' 条数据';
            },
            onChange: this.handleStandardTableChange,
            onShowSizeChange: this.handleShowSizeChange,
            total: c.pfNumber,
          }}
        />
      </div>
    );
  }
}
