import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';

@connect(({ train, loading }) => ({
  train,
  loading: loading.models.train,
}))
export default class BusinessTripDetail extends Component {
  state = {
    userNo:'',
  };

  componentDidMount() {
    this.setState({
      userNo:this.props.userNo
    }, function() {
      const { dispatch } = this.props;
      dispatch({
        type: 'train/getTrainingDetails',
        payload: { page: 1, rows: 5 ,userNo:this.state.userNo},
      });
    });

  }

  handleStandardTableChange = (pagination, filtersArg) => {
    const { dispatch } = this.props;
    //debugger;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      page: pagination,
      rows: filtersArg,
      userNo:this.state.userNo,
      ...filters,
    };

    dispatch({
      type: 'train/getTrainingDetails',
      payload: params,
    });
  };

  handleShowSizeChange = (current, pageSize) => {
    const { dispatch } = this.props;
    const params = {
      pageNumber: current,
      pageSize: pageSize,
      userNo:this.state.userNo,
    };

    dispatch({
      type: 'train/getTrainingDetails',
      payload: params,
    });
  };

  render() {
    const {
      train: { data },
    } = this.props;
    const columns = [
      {
        title: '培训课程',
        dataIndex: 'courseName',
      },

      {
        title: '时间',
        dataIndex: 'lectureTime',
      },
      {
        title: '地点',
        dataIndex: 'lecturePlace',
      },
      {
        title: '时长',
        dataIndex: 'classHour',
        render: (text, r, i) => (
          <span>
            {text}
            学时
          </span>
        ),
      },
      {
        title: '授课人',
        dataIndex: 'lecturerName',
      },
      {
        title: '考核结果',
        dataIndex: 'checkResults',
      },
      {
        title: '成绩',
        dataIndex: 'courseScores',
      },
    ];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={data.list}
          pagination={{
            defaultPageSize: 5,
            pageSizeOptions: ['5', '10', '20'],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: function() {
              return '共 ' + data.pagination.total + ' 条数据';
            },
            onChange: this.handleStandardTableChange,
            onShowSizeChange: this.handleShowSizeChange,
            total: data.pagination.total,
          }}
        />
      </div>
    );
  }
}
