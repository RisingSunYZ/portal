import React, { PureComponent, Fragment } from 'react';
import { Table, Pagination, DatePicker, Select, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';
import styles from './index.less';
import { getConfig } from '@/utils/utils';

const { RangePicker } = DatePicker;
@connect(({ attendance, loading }) => ({
  attendance,
  loading: loading.models.attendance,
}))
export default class LeaveDaysStatistics extends PureComponent {
  state = {};
  componentDidMount() {}

  handleStandardTableChange = (pagination, filtersArg) => {
    const { dispatch } = this.props;
    //debugger; [{name:'zhangsan1', age:23}, {name:'zhangsan2', age:34}, {name:'zhangsan3', age:12}]

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
        this.props.handlelPost(this.state);
      }
    );

    /*dispatch({
      type: 'attendance/getLeaveDetails',
      payload: params,
    });*/
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
        this.props.handlelPost(this.state);
      }
    );
  };

  onChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState(
      {
        qStartTime: dateString[0],
        qEndTime: dateString[1],
        pageNumber: '1',
      },
      function() {
        this.handlePost();
      }
    );
  };
  handleChange = value => {
    this.setState(
      {
        subType: value,
        pageNumber: '1',
      },
      function() {
        this.handlePost();
      }
    );
  };

  handlePost = () => {
    this.props.handlelPost(this.state);
  };

  render() {
    const {
      attendance: { qjlist },
    } = this.props;
    const {
      attendance: { a },
    } = this.props;

    const children = [];
    children.push(<Select.Option key={0}>{'全部'}</Select.Option>);
    if (a.alist) {
      for (const key in a.alist) {
        children.push(<Select.Option key={a.alist[key]}>{key}</Select.Option>);
      }
    }
    const columns = [
      {
        title: '类型',
        dataIndex: 'type',
        render: (text, record) => {
          return '次数';
        },
      },
      {
        title: '婚假',
        dataIndex: '婚假',
      },
      {
        title: '病假',
        //dataIndex: 'sickLeave',
        dataIndex: '病假',
      },
      {
        title: '丧假',
        dataIndex: '丧假',
      },
      {
        title: '产假',
        dataIndex: '产假',
      },
      {
        title: '事假',
        dataIndex: '事假',
      },
      {
        title: '工伤假',
        dataIndex: '工伤假',
      },
    ];

    const coulmns2 = [
      {
        title: '请假类型',
        dataIndex: 'type',
        render: (text, record) => {
          if (record.subType == 10) {
            return '事假';
          } else if (record.subType == 20) {
            return '病假';
          } else if (record.subType == 30) {
            return '婚假';
          } else if (record.subType == 40) {
            return '产假';
          } else if (record.subType == 50) {
            return '哺乳假';
          } else if (record.subType == 60) {
            return '陪护假';
          } else if (record.subType == 70) {
            return '丧假';
          } else if (record.subType == 80) {
            return '工伤假';
          } else if (record.subType == 90) {
            return '调休';
          } else if (record.subType == 100) {
            return '其他';
          }
        },
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
        title: '时长',
        dataIndex: 'day',
      },

      {
        title: '事由',
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
        dataIndex: 'billCode',
        render: (text, record) => {
          let url =
            getConfig().domain +
            '/ys/process/form/view/' +
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
        <div style={{ marginBottom: 16 }}>
          {/*<p className={styles.name} style={{ marginLeft: 625 }}>请假天数统计</p>*/}
          <Table columns={columns} dataSource={qjlist} pagination={false} />
        </div>
        <Row gutter={16}>
          <Col span={5}>
            <Select className={styles.selectcss} onChange={this.handleChange} placeholder="全部">
              {children}
            </Select>
          </Col>
          <Col span={7}>
            <RangePicker onChange={this.onChange} />
          </Col>
        </Row>
        <div style={{ marginTop: 8 }}>
          {/*<p className={styles.name} style={{ marginLeft: 625,marginTop:20}}>请假详情</p>*/}
          <Table
            columns={coulmns2}
            dataSource={a.qxlist}
            pagination={{
              defaultPageSize: 5,
              pageSizeOptions: ['5', '10', '20'],
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: function() {
                return '共 ' + a.pfNumber + ' 条数据';
              },
              onChange: this.handleStandardTableChange,
              onShowSizeChange: this.handleShowSizeChange,
              total: a.pfNumber,
            }}
          />
        </div>
      </div>
    );
  }
}
