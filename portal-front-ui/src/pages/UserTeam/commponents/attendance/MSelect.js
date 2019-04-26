/**
 * 时间选择组件（年份，月份）
 */
import React, { PureComponent } from 'react';
import { Select, Row, Col, Button } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import moment from 'moment';
import OrgSelect from '../common/OrgSelect';

@connect(({ teamPerformance, loading }) => ({
  teamPerformance,
  loading: loading.models.teamPerformance,
}))
export default class MSelect extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'teamPerformance/getYear',
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      year: props.defaultDate ? props.defaultDate.split('-')[0] : moment().year(),
      month: props.defaultDate ? props.defaultDate.split('-')[1] : moment().month() + 1,
    };
  }

  onValueChange = (type, value) => {
    let newState = {};
    newState[type] = value;
    this.setState(newState, () => {
      const date = `${this.state.year}-${this.state.month}`;
      this.props.onDateChange(date);
    });
  };
  onOrgChange(deptMap) {
    const { dispatch } = this.props;
    const date = `${this.state.year}-${this.state.month}`;
    const aaa = { date: date, deptMap: deptMap };
    this.props.onOrguChange(aaa);
    /*this.props.dispatch({
      type: 'teamAttendance/getUserTeamBusinessTripDetail',
      payload:{deptId:deptMap.currentDeptId,time:date}
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamLeaveDaysStatistic',
      payload:{deptId:deptMap.currentDeptId}
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamLeaveDetails',
      payload:{deptId:deptMap.currentDeptId}
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamLateAbsenteeism',
      payload:{deptId:deptMap.currentDeptId}
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamSummaryAttendance',
      payload:{deptId:deptMap.currentDeptId}
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamAbsenteeism',
      payload:{deptId:deptMap.currentDeptId}
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamBusinessTrip',
      payload:{deptId:deptMap.currentDeptId}
    });*/
    /*console.log(deptMap)*/
  }
  initPage(deptIdArray) {
    const date = `${this.state.year}-${this.state.month}`;
    const bbb = { date: date, deptIdArray: deptIdArray };
    this.props.initPage(bbb);
  }

  theMonth = () => {
    let current = {
      year: moment().year(),
      month: moment().month() + 1,
    };
    this.setState(current, () => {
      const date = `${this.state.year}-${this.state.month}`;
      this.props.onDateChange(date);
    });
  };

  render() {
    const {
      teamPerformance: { yearList },
      btnIsShow,
      defaultDate,
      onDateChange,
    } = this.props;
    const { year, month } = this.state;
    const monthList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    //*********************************************************此处后期需要改动*************************************************************
    const getYear=()=>{
      let years=[];
      let currentYear=(new Date()).getFullYear()
      for (var i=2018;i<=currentYear;i++){
        years.push(i);
      }
      return years;
    };
    const yeaes = getYear();
    const selectOpt = monthList.map((system, i) => (
      <Select.Option key={i} value={system}>
        {system}月
      </Select.Option>
    ));
    const systemOpts =
      yeaes &&
      yeaes.map((system, i) => (
        <Select.Option key={i} value={system}>
          {system}
        </Select.Option>
      ));

    return (
      <div>
        <Select
          style={{ width: 100, marginRight: 16 }}
          value={year}
          onChange={year => {
            this.onValueChange('year', year);
          }}
        >
          {systemOpts}
        </Select>
        <Select
          style={{ width: 100, marginRight: 16 }}
          value={month + '月'}
          onChange={month => {
            this.onValueChange('month', month);
          }}
        >
          {selectOpt}
        </Select>
        <div style={{ display: 'inline-block', verticalAlign: 'top', marginRight: 16 }}>
          <OrgSelect
            onOrgChange={this.onOrgChange.bind(this)}
            initPage={this.initPage.bind(this)}
            isBlack = {this.props.isBlack}
          />
        </div>
        <Button type="primary" onClick={this.theMonth}>
          本月
        </Button>
      </div>
    );
  }
}
