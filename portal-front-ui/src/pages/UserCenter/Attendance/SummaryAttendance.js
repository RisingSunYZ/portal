import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Tabs, Tag, Divider, Spin, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva/index';
import YearSelect from '../commponents/performance/YearSelect';
import LeaveDayStatistics from '../commponents/attendance/LeaveDaysStatistics';
import BusinessTripDetail from '../commponents/attendance/BusinessTripDetail';
import LataAbsenteesim from '../commponents/attendance/LateAbsenteeism';
import Absenteeism from '../commponents/attendance/Absenteeism';
import BusinessTrip from '../commponents/attendance/BusinessTrip';

const TabPane = Tabs.TabPane;

@connect(({ attendance, loading }) => ({
  attendance,
  loading: loading.models.attendance,
}))
export default class SummaryAttendance extends PureComponent {
  state = {
    userNo: this.props.location.query.userNo,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    let userNo = this.props.location.query.userNo;
    dispatch({
      type: 'attendance/getBusinessTripDetail',
      payload: { pageNumber: 1, pageSize: 5, no: userNo },
    });
    dispatch({
      type: 'attendance/getLeaveDetails',
      payload: { pageNumber: 1, pageSize: 5, no: userNo },
    });
    dispatch({
      type: 'attendance/getLeaveDaysStatistic',
      payload: { userNo: userNo },
    });
    dispatch({
      type: 'attendance/getLateAbsenteeism',
      payload: { pageNumber: 1, pageSize: 5, userNo: userNo },
    });
    dispatch({
      type: 'attendance/getSummaryAttendance',
      payload: { userNo: userNo },
    });
    dispatch({
      type: 'attendance/getAbsenteeism',
      payload: { pageNumber: 1, pageSize: 5, userNo: userNo },
    });
    dispatch({
      type: 'attendance/getBusinessTrip',
      payload: { pageNumber: 1, pageSize: 5, no: userNo },
    });
  }
  handleChange = value => {
    const year = this.state.year;
    this.setState(
      {
        chuchai: {
          year: year,
          pageNumber: value.pageNumber,
          pageSize: value.pageSize,
          no: this.state.userNo,
        },
      },
      function() {
        this.handleList();
      }
    );
  };

  handChange = value => {
    const year = this.state.year;
    this.setState(
      {
        yingongwc: {
          year: year,
          pageNumber: value.pageNumber,
          pageSize: value.pageSize,
          no: this.state.userNo,
        },
      },
      function() {
        this.yingongwcList();
      }
    );
  };
  showSizeChange = value => {
    const year = this.state.year;

    this.setState(
      {
        chidaozt: {
          year: year,
          pageNumber: value.pageNumber,
          pageSize: value.pageSize,
          userNo: this.state.userNo,
        },
      },
      function() {
        this.chidaoztList();
      }
    );
  };

  showListChange = value => {
    const year = this.state.year;

    this.setState(
      {
        kuanggong: {
          year: year,
          pageNumber: value.pageNumber,
          pageSize: value.pageSize,
          userNo: this.state.userNo,
        },
      },
      function() {
        this.kuanggongList();
      }
    );
  };

  onSearchChange = value => {
    const year = this.state.year;
    this.setState(
      {
        qingjia: {
          year: year,
          pageNumber: value.pageNumber,
          pageSize: value.pageSize,
          qStartTime: value.qStartTime,
          qEndTime: value.qEndTime,
          subType: value.subType,
          no: this.state.userNo,
        },
      },
      function() {
        this.searchList();
      }
    );
  };
  kuanggongList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'attendance/getAbsenteeism',
      payload: this.state.kuanggong,
    });
  };

  yingongwcList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'attendance/getBusinessTrip',
      payload: this.state.yingongwc,
    });
  };
  chidaoztList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'attendance/getLateAbsenteeism',
      payload: this.state.chidaozt,
    });
  };

  handleList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'attendance/getBusinessTripDetail',
      payload: this.state.chuchai,
    });
  };

  searchList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'attendance/getLeaveDetails',
      payload: this.state.qingjia,
    });
  };

  yChange = value => {
    this.setState({ year: value }, function() {
      this.laChange(value);
    });
  };

  laChange = value => {
    let userNo = this.props.location.query.userNo;
    this.props.dispatch({
      type: 'attendance/getBusinessTripDetail',
      payload: { year: value, no: userNo, pageSize: 5 },
    });
    this.props.dispatch({
      type: 'attendance/getLeaveDaysStatistic',
      payload: { year: value, userNo: userNo },
    });
    this.props.dispatch({
      type: 'attendance/getLeaveDetails',
      payload: { year: value, no: userNo, pageSize: 5 },
    });
    this.props.dispatch({
      type: 'attendance/getLateAbsenteeism',
      payload: { year: value, userNo: userNo, pageSize: 5 },
    });
    this.props.dispatch({
      type: 'attendance/getSummaryAttendance',
      payload: { year: value, userNo: userNo },
    });
    this.props.dispatch({
      type: 'attendance/getAbsenteeism',
      payload: { year: value, userNo: userNo, pageSize: 5 },
    });
    this.props.dispatch({
      type: 'attendance/getBusinessTrip',
      payload: { year: value, no: userNo, pageSize: 5 },
    });
  };

  render() {
    const {
      attendance: { aNumberData },
      loading,
    } = this.props;
    return (
      <Card bordered={false} bodyStyle={{ padding: '0 24px' }}>
        <div style={{ paddingTop: 16 }}>
          <YearSelect yearChange={this.yChange} />
        </div>
        <p className="cardTitle">
          <i />
          数据展示
        </p>
        <Row style={{ marginBottom: 16 }}>
          <Col span={16}>
            <div className={styles.ptzt}>
              <p>
                应出勤&nbsp;&nbsp;
                <span className={styles.green}>{aNumberData.shouldWorkday}</span>
                &nbsp;天、 累计正常出勤&nbsp;&nbsp;
                <span className={styles.green}>{aNumberData.normalWorkday}</span>
                &nbsp;天、 出勤率&nbsp;&nbsp;
                <span className={styles.green}>{aNumberData.attendance}</span>
                &nbsp;%、 平均工作时长&nbsp;&nbsp;
                <span className={styles.green}>{aNumberData.avgWorkHour}</span>
                &nbsp;小时
              </p>
              <p>
                累计请假&nbsp;&nbsp;
                <span className={styles.number}>{aNumberData.leaveCount}</span>
                &nbsp;次、 共&nbsp;&nbsp;
                <span className={styles.number}>{aNumberData.leaveDay}</span>
                &nbsp;天
              </p>
              <p>
                累计出差&nbsp;&nbsp;
                <span className={styles.number}>{aNumberData.travelCount}</span>
                &nbsp;次、 出差总时长&nbsp;&nbsp;
                <span className={styles.number}>{aNumberData.travelDay}</span>
                &nbsp;天
              </p>
              <p>
                因公外出&nbsp;&nbsp;
                <span className={styles.number}>{aNumberData.goOutCount}</span>
                &nbsp;次、 迟到/早退&nbsp;&nbsp;
                <span className={styles.warning}>{aNumberData.lateOrEarlyleave}</span>
                &nbsp;次、 旷工&nbsp;&nbsp;
                <span className={styles.error}>{aNumberData.absenteeism}</span>
                &nbsp;天
              </p>
            </div>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="请假详情" key="1">
            <LeaveDayStatistics handlelPost={this.onSearchChange} />
          </TabPane>
          <TabPane tab="出差详情" key="2">
            <BusinessTripDetail handlShowSizeChange={this.handleChange} />
          </TabPane>
          <TabPane tab="因公外出" key="3">
            <BusinessTrip handleSizeChange={this.handChange} />
          </TabPane>
          <TabPane tab="迟到早退" key="4">
            <LataAbsenteesim ShowSizeChange={this.showSizeChange} />
          </TabPane>
          <TabPane tab="旷工" key="5">
            <Absenteeism showListChange={this.showListChange} />
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}
