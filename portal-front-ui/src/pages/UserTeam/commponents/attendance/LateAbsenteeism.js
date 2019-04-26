import React, { Component, Fragment } from 'react';
import { Table, Input, DatePicker, Select, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';
import styles from './index.less';
import { Base64 } from 'js-base64';
const Search = Input.Search;
const { RangePicker } = DatePicker;
@connect(({ teamAttendance, loading }) => ({
  teamAttendance,
  loading: loading.models.teamAttendance,
}))
export default class LateAbsenteeism extends Component {
  state = {
    keyWord: '',
  };

  componentDidMount() {
    /*const { dispatch } = this.props;
    dispatch({
      type: 'attendance/getLateAbsenteeism',
      payload: { useManId: '00004907' },
    });*/
  }

  handleStandardTableChange = (pagination, filtersArg) => {
    /*const {dispatch} = this.props;
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
      type: 'attendance/getLateAbsenteeism',
      payload: params,
    });*/
    this.setState(
      {
        pageNumber: pagination,
        pageSize: filtersArg,
      },
      function() {
        this.handleLatePost();
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
        this.handleLatePost();
      }
    );
  };

  handleGetValue = event => {
    this.setState({
      keyWord: event.target.value,
      pageNumber: 1,
    });
  };

  handleLatePost = () => {
    this.props.teamLateAbsenteesim(this.state);

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

  handleShowSizeChange = (current, pageSize) => {
    /*
    const {dispatch} = this.props;
    const params = {
      pageNumber: current,
      pageSize: pageSize,
    };

    dispatch({
      type: 'attendance/getLateAbsenteeism',
      payload: params,
    });
*/
    this.setState(
      {
        pageNumber: current,
        pageSize: pageSize,
      },
      function() {
        this.handleLatePost();
      }
    );
  };

  render() {
    const {
      teamAttendance: { d },
    } = this.props;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '时间',
        dataIndex: 'sdate',
      },

      {
        title: '类型',
        dataIndex: 'typeName',
      },
      {
        title: '时长(分钟)',
        dataIndex: 'typeTime',
      },
      {
        title: '详情',
        dataIndex: 'detail',
        render: (text, record) => {
          let url =
            '/ys/user-center/attendance/record?month=' +
            record.sdate.substring(5, 7) +
            '&year=' +
            record.sdate.substring(0, 4) +
            '&userNo=' +
            Base64.encode(record.code) +
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
              onSearch={this.handleLatePost}
            />
          </Col>
        </Row>
        <div style={{ marginTop: 8 }}>
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
      </div>
    );
  }
}
