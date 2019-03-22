/**
 * 时间选择组件(涉及到其他问题干扰到其他，故重写一个年份组件)
 */
import React, { Component} from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva';

@connect(({ teamPerformance, loading }) => ({
  teamPerformance,
  loading: loading.models.teamPerformance,
}))
export default class YearSelect extends Component {

  state = {
    defaultVal: '',
  };

  componentWillMount () {
    this.yearJudge();
  }

  componentWillReceiveProps(){
    this.setState({
      defaultVal:this.props.defaultYear
    });
  }

  componentDidMount() {
  }

  selectChange = year => {
    this.props.changeDefaultYear(year);
    this.props.yearChange(year);
    this.setState({
      defaultVal: year
    });
  };

  // 判断初始默认时间
  yearJudge = () => {
    if (this.props.defaultVal) {
      this.setState({
        defaultVal: this.props.defaultVal,
      })
    }
  };

  getYearValue = () => {
    const onInit = this.props.onInit;
    const year = this.state.defaultVal;
    onInit && onInit(year);
    return year;
  };

  render() {
    const {
      onInit,
      teamPerformance: { yearList },
    } = this.props;
    //此处方便测试，后期必须更改
    const getYear=()=>{
      let years=[];
      let currentYear=(new Date()).getFullYear()
      for (let i=2018;i<=currentYear;i++){
        years.push(i);
      }
      return years;
    };
    const yeaes = getYear();
    const systemOpts = yeaes &&
      yeaes.map((system, i) => (
        <Select.Option key={i} value={system}>
          {system}
        </Select.Option>
      ));

    return (
      <div style={{ paddingBottom: 16 }}>
        <Select style={{ width: 120 }} defaultValue={this.state.defaultVal} value={this.getYearValue(onInit)} onChange={this.selectChange}>
          {systemOpts}
        </Select>
      </div>
    );
  }
}
