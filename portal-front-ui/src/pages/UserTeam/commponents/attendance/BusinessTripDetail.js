import React, { Component, Fragment } from 'react';
import { Table, Input, DatePicker, Select, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';
import styles from './index.less';
import { getConfig } from '@/utils/utils';

const Search = Input.Search;
const { RangePicker } = DatePicker;
@connect(({ teamAttendance, loading }) => ({
  teamAttendance,
  loading: loading.models.teamAttendance,
}))
export default class BusinessTripDetail extends Component {
  state = {
    keyWord: '',
  };
  componentDidMount() {
    /*const { dispatch } = this.props;
    dispatch({
      type: 'attendance/getBusinessTripDetail',
      payload: { useManId: '00004907' },
    });*/
  }

  handleShowSizeChange = (current, pageSize) => {
    /*const {dispatch} = this.props;
    const params = {
      pageNumber: current,
      pageSize: pageSize,
    };

    dispatch({
      type: 'attendance/getBusinessTripDetail',
      payload: params,
    });*/
    this.setState(
      {
        pageNumber: current,
        pageSize: pageSize,
      },
      function() {
        this.handBusinessDetailPost();
      }
    );
  };

  onChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState(
      {
        qStartTime: dateString[0],
        qEndTime: dateString[1],
      },
      function() {
        this.handBusinessDetailPost();
      }
    );
  };

  handleGetValue = event => {
    this.setState({
      keyWord: event.target.value,
      pageNumber: 1,
    });
  };

  handBusinessDetailPost = () => {
    this.props.teamBusinessDetails(this.state);

    /*const { dispatch } = this.props;
    console.log(this.state);
    dispatch({
      type: 'teamAttendance/getUserTeamBusinessTripDetail',
      payload: this.state,
    });
    this.setState({
      pageSize:'',
      pageNumber:'',
    })*/
  };

  handleStandardTableChange = (pagination, filtersArg) => {
    /*onst {dispatch} = this.props;
    debugger;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNumber: pagination,
      pageSize: filtersArg,
      ...filters,
    };

    dispatch({
      type: 'attendance/getBusinessTripDetail',
      payload: params,
    });*/

    this.setState(
      {
        pageNumber: pagination,
        pageSize: filtersArg,
      },
      function() {
        this.handBusinessDetailPost();
      }
    );
  };

  render() {
    const {
      teamAttendance: { b },
    } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '出差时间',
        dataIndex: 'startTime',
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
      },
      {
        title: '时长',
        dataIndex: 'day',
      },
      {
        title: '出差原因',
        dataIndex: 'remark',
        width: 400,
        render: (text, record) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '400px',
              overflow: 'hidden',
            }}
          >
            <p placement="topLeft" title={text}>
              {text}
            </p>
          </div>
        ),
      },
      {
        title: '详情',
        dataIndex: 'detial',
        render: (text, record) => {
          let url =
            getConfig().domain +
            '/ys/process/form/view/ems_business_flow/' +
            record.procInstId +
            '/' +
            record.billCode +
            '/0/0';
          return (
            <span>
              <a href={url} target="_blank">
                查看
              </a>
            </span>
          );
        },
      },
    ];
    return (
      <div>
        <Row>
          <Col span={5}>
            <RangePicker onChange={this.onChange} placeholder={['出差时间', '结束时间']} />
          </Col>
          <Col offset={14} span={5}>
            <Search
              style={{ width: 224 }}
              placeholder="请输入姓名/工号"
              value={this.state.keyWord}
              onChange={this.handleGetValue}
              onSearch={this.handBusinessDetailPost}
            />
          </Col>
        </Row>
        <div style={{ marginTop: 8 }}>
          <Table
            columns={columns}
            dataSource={b.cclist}
            pagination={{
              defaultPageSize: 5,
              pageSizeOptions: ['5', '10', '20'],
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: function() {
                return '共 ' + b.pfNumber + ' 条数据';
              },
              onChange: this.handleStandardTableChange,
              onShowSizeChange: this.handleShowSizeChange,
              total: b.pfNumber,
            }}
          />
        </div>
      </div>
    );
  }
}
