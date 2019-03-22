/**
 * 时间选择组件
 */
import React, { Component, Fragment } from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva';

@connect(({ hrPerformance, loading }) => ({
  hrPerformance,
  loading: loading.models.hrPerformance,
}))

export default class YearSelect extends Component {
  state = {
    defaultVal: (new Date()).getFullYear(),
  };

  componentWillMount () {
    this.yearJudge()
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'hrPerformance/getYear',
    });
  }

  selectChange = year => {
    this.props.yearChange(year);
  };

  // 判断初始默认时间
  yearJudge = () => {
    if (this.props.defaultVal) {
      this.setState({
        defaultVal: this.props.defaultVal,
      })
    }
  }

  render() {
    const {
      hrPerformance: { yearList },
    } = this.props;

    const systemOpts = yearList &&
      yearList.map((system, i) => (
        <Select.Option key={i} value={system}>
          {system}
        </Select.Option>
      ));

    return (
      <div style={{ paddingBottom: 16 }}>
        <Select style={{ width: 120 }} defaultValue={this.state.defaultVal} onChange={this.selectChange}>
          {systemOpts}
        </Select>
      </div>
    );
  }
}
