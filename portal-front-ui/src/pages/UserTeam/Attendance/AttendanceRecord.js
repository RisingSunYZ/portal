import React, { Component, Fragment } from 'react';
import { Calendar, Popover, DatePicker, Row, Col, Button, Switch, Table } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';
import MonthSelect from '../commponents/common/MonthSelect';
import MSelect from '../commponents/attendance/MSelect';
import styles from './index.less';
import moment from 'moment';
const subType = [{"name":"事假","code":"10","remark":"sj"},{"name":"病假","code":"20","remark":"bj"},{"name":"婚假","code":"30","remark":"hj"},{"name":"产假","code":"40","remark":"cj"},{"name":"哺乳假","code":"50","remark":"qtj"},{"name":"陪护假","code":"60","remark":"cj"},{"name":"丧假","code":"70","remark":"shj"},{"name":"工伤假","code":"80","remark":"gsj"},{"name":"其他假","code":"90","remark":"qtj"},{"name":"调休","code":"95","remark":"tx"},{"name":"节假日加班","code":"100","remark":"qtj"},{"name":"周末加班","code":"110","remark":"qtj"},{"name":"迟到1","code":"120","remark":"cdzt"},{"name":"迟到2","code":"130","remark":"cdzt"},{"name":"上班打卡异常","code":"140","remark":"yc"},{"name":"下班打卡异常","code":"150","remark":"yc"},{"name":"异常","code":"500"},{"name":"单据异常","code":"501"}];
const staticType =[{"name":"正常","code":"10","remark":"cq"},{"name":"请假","code":"20","remark":"atj"},{"name":"出差","code":"40","remark":"cc"},{"name":"因公外出","code":"50","remark":"cq"},{"name":"加班","code":"60","remark":"ctj"},{"name":"迟到","code":"70","remark":"cdzt"},{"name":"早退","code":"80","remark":"cdzt"},{"name":"打卡异常","code":"90","remark":"kg"},{"name":"旷工","code":"110","remark":"kg"},{"name":"休息","code":"300","remark":"xx"},{"name":"异常","code":"500","remark":"yc"}];

@connect(({ teamAttendance, loading }) => ({
  teamAttendance,
  loading: loading.models.teamAttendance,
}))
export default class AttendanceRecord extends Component {
  constructor(props) {
    super(props);
    this.recordMap = {};
    this.state = {
      month: moment(),
      detailView: false,
      firstJustify: true,
    };
  }
  componentDidMount() {
    /*const moment = this.state.month;
    const value = {
      month: moment.month()+1,
      year: moment.year()
    };
    this.attendanceReq(value);*/
  }

  getDateColumns = () => {
    const date = this.state.month, _this = this,
      columns = [],
      typeColumns = [
        { title: '应出勤', dataIndex: 'ycq' },
        { title: '实出勤', dataIndex: 'scq' },
        { title: '事假', dataIndex: 'shij' },
        { title: '病假', dataIndex: 'bj' },
        { title: '婚假', dataIndex: 'hj' },
        { title: '产假', dataIndex: 'cjDayCount' },
        { title: '工伤假', dataIndex: 'gsj' },
        { title: '丧假', dataIndex: 'sangj' },
        { title: '其他假', dataIndex: 'qtjDayCount' },
        { title: '出差', dataIndex: 'chuc' },
        { title: '调休', dataIndex: 'tx' },
        { title: '迟到', dataIndex: 'cdDayCount' },
        { title: '早退', dataIndex: 'ztDayCount' },
        { title: '月迟到', dataIndex: 'monthCdDaycount' },
        { title: '月旷工', dataIndex: 'yljkg' },
      ];
    const week = ['日', '一', '二', '三', '四', '五', '六'];
    const month1 = date.clone();
    month1.date(1);
    columns.push({
      dataIndex: 'name',
      title: '姓名',
      fixed: true,
    });
    for (let i = 0; i < month1.daysInMonth(); i++) {
      let current = month1.clone();
      current.add(i, 'days');
      columns.push({
        dataIndex: 'day' + current.date(),
        title: (
          <div className={styles.headBox}>
            <span>{week[current.day()]}</span>
            <span className={styles.dateHead}>{current.date()}</span>
          </div>
        ),
        render: text => {
          if (text && this.state.detailView) {
            text =  eval("("+text+")");
            return text.sb || text.xb ? (
              <div style={{ lineHeight: '14px', textAlign: 'center' }}>
                {text.sb}
                <div>—</div>
                {text.xb}
              </div>
            ) : (
              ''
            );
          } else if (text) {
            const arr = text.split("-");
            const type = arr[1] ? _this.getCodeByNum(subType, arr[1]) : _this.getCodeByNum(staticType, arr[0]);
            return (
              <div className={styles.typeColor}>
                <i className={styles[type]}> </i>
              </div>
            );
          }
        },
      });
    }

    return this.state.detailView ? columns : columns.concat(typeColumns);
  };
  /*onMonthChange = (date, dateStr) => {
    this.setState({month: date});
    const dateArr = dateStr.split("-");
    let value = {
      year : dateArr[0],
      month :dateArr[1],
    };
    this.attendanceReq(value);
  };*/

  /*attendanceReq = (val) => {
    this.props.dispatch({
      type: 'attendance/getAttendanceRecord',
      payload: val,
    });
  }*/
  getCodeByNum = (list, code) => {
    var type = '';
    list.map((obj, i)=>{
      if(code == obj.code){
        type = obj.remark;
        return;
      }
    });
    return type;
  }
  onMonthChange = value => {
    this.setState(
      {
        month: moment(value),
        dateStr: value,
      },
      function() {
        this.onTeList();
      }
    );
  };

  onOrguChange = value => {
    const currentDeptIdStr = value.deptMap.currentDeptId;
    let currentDeptId = '';
    if (currentDeptIdStr) {
      currentDeptId = currentDeptIdStr;
    }
    if (!currentDeptId) {
      currentDeptId = value.deptMap.childrenDeptId[0];
    }

    this.setState(
      {
        deptId: currentDeptId,
      },
      function() {
        this.onTeList();
      }
    );
  };

  onInitPageChange = value => {
    let deptId = value.deptIdArray[0];
    const userNo = this.props.location.query.no;
    const dateStr = this.props.location.query.dateStr;
    if (typeof userNo != 'undefined') {
      this.props.dispatch({
        type: 'teamAttendance/getTeamAttendanceRecord',
        payload: {no: userNo, dateStr: dateStr},
      });
    } else {
      this.props.dispatch({
        type: 'teamAttendance/getTeamAttendanceRecord',
        payload: {deptId: deptId, dateStr: value.date},
      });
    }
    this.setState({ dateStr: value.date, deptId: deptId });
  };

  onTeList = () => {
    this.props.dispatch({
      type: 'teamAttendance/getTeamAttendanceRecord',
      payload: { dateStr: this.state.dateStr, deptId: this.state.deptId },
    });
  };

  changeCalendarView = bool => {
    this.setState({
      detailView: bool,
    });
  };

  render() {
    const {
      teamAttendance: { g,j },
    } = this.props;
    const { detailView } = this.state;
    return (
      <div style={{ padding: '16px 24px' }}>
        <Row>
          <Col span={21}>
            {/*<MonthSelect onDateChange={this.onMonthChange} btnIsShow />*/}
            <MSelect
              onDateChange={this.onMonthChange}
              onOrguChange={this.onOrguChange}
              initPage={this.onInitPageChange}
              isBlack={true}
            />
          </Col>
          <Col span={3}>
            <p style={{ position: 'relative', top: 4 }}>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                onChange={this.changeCalendarView}
              />
              <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 8 }}>
                打卡时间
              </span>
            </p>
          </Col>
        </Row>
        <Row>
          <Col span={21}>
            <ul
              style={{ marginBottom: 16, textAlign:'left', display: this.state.detailView ? 'none' : 'block' }}
              className={`${styles.tipList} ${styles.typeColor}`}
            >
              <li>
                <i className={styles.cq}> </i>
                出勤
              </li>
              <li>
                <i className={styles.yc}> </i>
                异常
              </li>
              <li>
                <i className={styles.qj}> </i>
                请假
              </li>
              <li>
                <i className={styles.tx}> </i>
                调休
              </li>
              <li>
                <i className={styles.hj}> </i>
                婚假
              </li>
              <li>
                <i className={styles.shj}> </i>
                丧假
              </li>
              <li>
                <i className={styles.cc}> </i>
                出差
              </li>
              <li>
                <i className={styles.sj}> </i>
                事假
              </li>
              <li>
                <i className={styles.kg}> </i>
                旷工
              </li>
              <li>
                <i className={styles.xx}> </i>
                休息
              </li>
              <li>
                <i className={styles.bt}> </i>
                半天
              </li>
              <li>
                <i className={styles.cj}> </i>
                产假
              </li>
              <li>
                <i className={styles.cdzt}> </i>
                迟到早退
              </li>
              <li>
                <i className={styles.gsj}> </i>
                工伤假
              </li>
              <li>
                <i className={styles.qtj}> </i>
                其他
              </li>
            </ul>
          </Col>
        </Row>
        <div className="deptAtdsList">
          <Table
            scroll={{ x: 2000 }}
            columns={this.getDateColumns()}
            dataSource={detailView ? j : g.rows}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}
