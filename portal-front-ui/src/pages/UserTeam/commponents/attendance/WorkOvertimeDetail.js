import React, { PureComponent, Fragment } from 'react';
import { Table, Input, DatePicker, Select, Row, Col, Tooltip } from 'antd';
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
export default class WorkOvertimeDetail extends PureComponent {
  state = {
    keyWord: '',
  };
  componentDidMount() {}

  handleStandardTableChange = (pagination, filtersArg) => {
    /* const { dispatch } = this.props;
    //debugger;
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
      type: 'attendance/getLeaveDetails',
      payload: params,
    });*/
    this.setState(
      {
        pageNumber: pagination,
        pageSize: filtersArg,
      },
      function() {
        this.handPost();
      }
    );
  };

  handleShowSizeChange = (current, pageSize) => {
    /*const { dispatch } = this.props;
    const params = {
      pageNumber: current,
      pageSize: pageSize,
    };

    dispatch({
      type: 'attendance/getLeaveDetails',
      payload: params,
    });*/
    this.setState(
      {
        pageNumber: current,
        pageSize: pageSize,
      },
      function() {
        this.handPost();
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
        this.handPost();
      }
    );
  };

  handleGetValue = event => {
    this.setState({
      keyWord: event.target.value,
      pageNumber: 1,
    });
  };

  handPost = () => {
    this.props.teamWorkPost(this.state);
    /* const { dispatch } = this.props;
    console.log(this.state);
    dispatch({
      type: 'teamAttendance/getLeaveDetails',
      payload: this.state,
    });
    this.setState({
      pageNumber: '',
      pageSize: '',
    })*/
  };

  render() {
    const {
      teamAttendance: { f },
    } = this.props;

    /*const children = [];
    children.push(<Select.Option key={0}>{'全部'}</Select.Option>);
    if (a.alist){
      for (const key in a.alist) {
        children.push(<Select.Option key={f.[key]}>{key}</Select.Option>);
      }
    }*/
    const coulmns2 = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
      },
      {
        title: '类型',
        dataIndex: 'type',
        render: (text, record) => {
          return '加班';
        },
      },
      {
        title: '加班事由',
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
        dataIndex: 'detail',
        render: (text, record) => {
          let url =
            getConfig().domain +
            '/ys/process/form/approve/' +
            record.proDefKey +
            '/' +
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
            <RangePicker onChange={this.onChange} placeholder={['开始时间', '结束时间']} />
          </Col>
          <Col offset={14} span={4}>
            <Search
              style={{ width: 224 }}
              placeholder="请输入姓名/工号"
              value={this.state.keyWord}
              onChange={this.handleGetValue}
              onSearch={this.handPost}
            />
          </Col>
        </Row>
        <div style={{ marginTop: 8 }}>
          <Table
            columns={coulmns2}
            dataSource={f.wdlist}
            pagination={{
              defaultPageSize: 5,
              pageSizeOptions: ['5', '10', '20'],
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: function() {
                return '共 ' + f.pfNumber + ' 条数据';
              },
              onChange: this.handleStandardTableChange,
              onShowSizeChange: this.handleShowSizeChange,
              total: f.pfNumber,
            }}
          />
        </div>
      </div>
    );
  }
}
