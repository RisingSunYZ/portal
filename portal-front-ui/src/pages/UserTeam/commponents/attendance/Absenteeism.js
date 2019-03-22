import React, { Component, Fragment } from 'react';
import { Table, Input, DatePicker, Select, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';
import styles from './index.less';
const Search = Input.Search;
const { RangePicker } = DatePicker;
@connect(({ teamAttendance, loading }) => ({
  teamAttendance,
  loading: loading.models.teamAttendance,
}))
export default class Absenteeism extends Component {
  state = {
    keyWord: '',
  };
  componentDidMount() {
    /*const { dispatch } = this.props;
    dispatch({
      type: 'attendance/getExceptionApplication',
      payload: { useManId: '00004907' },
    });*/
  }

  handleShowSizeChange = (current, pageSize) => {
    /*const { dispatch } = this.props;
    const params = {
      pageNumber: current,
      pageSize: pageSize,
    };

    dispatch({
      type: 'attendance/getAbsenteeism',
      payload: params,
    });*/
    this.setState(
      {
        pageSize: pageSize,
        pageNumber: current,
      },
      function() {
        this.handleAbsenteeismPost();
      }
    );
  };

  onChange = (date, dateString) => {
    this.setState(
      {
        qStartTime: dateString[0],
        qEndTime: dateString[1],
      },
      function() {
        this.handleAbsenteeismPost();
      }
    );
  };

  handleGetValue = event => {
    this.setState({
      keyWord: event.target.value,
      pageNumber: 1,
    });
  };

  handleAbsenteeismPost = () => {
    this.props.teamAbsenteeism(this.state);

    /*const { dispatch } = this.props;
    console.log(this.state);
    dispatch({
      type: 'teamAttendance/getUserTeamLateAbsenteeism',
      payload: this.state,
    });
    this.setState({
      pageSize:'',
      pageNumber:'',
    })*/
  };

  handleStandardTableChange = (pagination, filtersArg) => {
    /*const { dispatch } = this.props;
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

    dispatch({
      type: 'attendance/getAbsenteeism',
      payload: params,
    });*/
    this.setState(
      {
        pageNumber: pagination,
        pageSize: filtersArg,
      },
      function() {
        this.handleAbsenteeismPost();
      }
    );
  };

  render() {
    const {
      teamAttendance: { e },
    } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '时间',
        dataIndex: 'absenteeismTime',
      },

      {
        title: '类型',
        dataIndex: 'type',
        render: (text, record) => {
          return '旷工';
        },
      },
      {
        title: '时长(天)',
        dataIndex: 'absenteeismDay',
      },
      {
        title: '详情',
        dataIndex: 'processingState',
        render: (text, record) => {
          let url =
            '/ys/user-center/attendance/record?month=' +
            record.absenteeismTime.substring(5, 7) +
            '&year=' +
            record.absenteeismTime.substring(0, 4) +
            '&userNo=' +
            Base64.encode(record.no) +
            '&detailView=true';
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
      <div style={{ padding: '0' }}>
        <Row>
          <Col span={5}>
            <RangePicker onChange={this.onChange} placeholder={['请选择', '请选择']} />
          </Col>
          <Col offset={14} span={5}>
            <Search
              style={{ width: 224 }}
              placeholder="请输入姓名/工号"
              value={this.state.keyWord}
              onChange={this.handleGetValue}
              onSearch={this.handleAbsenteeismPost}
            />
          </Col>
        </Row>
        <div style={{ marginTop: 8 }}>
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
      </div>
    );
  }
}
