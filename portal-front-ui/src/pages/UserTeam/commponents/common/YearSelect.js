/**
 *  时间选择组件
 */
import React, { Component, Fragment } from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva';

export default class YearSelect extends Component {
  state = {
    defaultVal: (new Date()).getFullYear(),
  };

  componentWillMount () {
    this.getYearValue();
    this.yearJudge()
  }

  getYearValue = () => {
    const onInit = this.props.onInit;
    const year = this.state.defaultVal;
    onInit && onInit(year);
    return year;
  };

  selectChange = year => {
    this.setState({defaultVal: year});
    this.props.yearChange(year);
  };

  // 判断初始默认时间
  yearJudge = () => {
    if ( !! this.props.defaultVal) {
      this.setState({
        defaultVal: this.props.defaultVal,
      })
    }
  };

  render() {

    const {
      onInit,
    } = this.props;

    const getYear =() => {
      let years=[];
      let currentYear=(new Date()).getFullYear();
      for (let i=2018;i<=currentYear;i++){
        years.push(i);
      }
      return years;
    };
    const  years = getYear();
    const systemOpts = years &&
      years.map((system, i) => (
        <Select.Option key={i} value={system}>
          {system}
        </Select.Option>
      ));

    return (
      <div style={{ paddingBottom: 16 }}>
        <Select style={{ width: 120 }} defaultValue={this.state.defaultVal} onChange={this.selectChange} value={this.state.defaultVal}>
          {systemOpts}
        </Select>
      </div>
    );
  }
}
