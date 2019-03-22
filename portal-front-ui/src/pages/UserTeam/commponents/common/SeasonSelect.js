import React, { Component, Fragment } from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';

const seasonOption = [
  "请选择",
  "第一季度",
  "第二季度",
  "第三季度",
  "第四季度"
];

export default class SeasonSelect extends Component {

  state = {
    defaultVal: '',
  };

  componentWillMount () {
    this.setState({
      defaultVal: 0
    })
  }

  getInitValue = (callback) =>{
    const season = this.state.defaultVal;
    callback && callback(season);
    return season;
  };

  defaultSeason = () => {
    let season = '';
    const month = (new Date).getMonth()+1;

    if (1<= month <= 3) {
      season = 1
    } else if (4<= month <= 6) {
      season = 2
    } else if (7<= month <= 9) {
      season = 3
    } else {
      season = 4
    }
    this.setState({
      defaultVal: season
    })
  };

  seasonChange = (val) =>{
    this.props.onChange(val);
    this.setState({
      defaultVal: val
    });
  };

  render() {
    const { onInit } = this.props;
    const seasonOpts = seasonOption &&
      seasonOption.map((item, index) => (
        <Select.Option key={index} value={index}>
          {item}
        </Select.Option>
      ));

    return (
      <div style={{ paddingBottom: 16 }}>
        <Select style={{ width: 120 }} defaultValue={this.state.defaultVal}  value={this.getInitValue(onInit)} onChange={this.seasonChange}>
          { seasonOpts }
        </Select>
      </div>
    );
  }
}
