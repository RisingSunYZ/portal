/**
 * 时间选择组件（年份，月份）
 */
import React, { PureComponent } from 'react';
import { Select,Row, Col,Button} from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import moment from 'moment';

@connect(({ teamPerformance, loading }) => ({
  teamPerformance,
  loading: loading.models.teamPerformance,
}))

export default class MonthSelect extends PureComponent {
  componentWillMount () {
    this.props.dispatch({
        type:'teamPerformance/getYear'
      }
    )
  }

  constructor(props){
    super(props);
    this.state = {
      year : props.defaultDate ? props.defaultDate.split("-")[0] : moment().year(),
      month : props.defaultDate ? props.defaultDate.split("-")[1] : moment().month()+1,
    };
  }

  onValueChange = (type, value) => {
    let newState = {};
    newState[type] = value;
    this.setState(newState, ()=>{
      const date = `${this.state.year}-${this.state.month}`;
      this.props.onDateChange(date);
    });
  };

  theMonth = () =>{
    let current = {
      year : moment().year(),
      month : moment().month()+1,
    };
    this.setState(current, ()=>{
      const date = `${this.state.year}-${this.state.month}`;
      this.props.onDateChange(date);
    })
  };

  render() {

    const {
      teamPerformance: { yearList },
      btnIsShow,
      defaultDate,
      onDateChange,
    } = this.props;
    const { year, month } = this.state;
    const monthList = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    const selectOpt = monthList.map((system,i)=> <Select.Option  key={i} value={system}>{system}月</Select.Option>);
    const systemOpts = yearList && yearList.map((system,i) => <Select.Option key={i} value={system}>{system}</Select.Option>);

    return (
      <div>
        <Select style={{ width: 100, marginRight: 16}} value={ year } onChange={(year)=>{this.onValueChange("year", year)}}>
          {systemOpts}
        </Select>
        <Select style={{ width: 100, marginRight: 16}} value={ month } onChange={(month)=>{this.onValueChange("month",month)}}>
          {selectOpt}
        </Select>
        {btnIsShow && <Button type="primary" onClick={this.theMonth}>本月</Button>}
      </div>
    );
  }
}
