/**
 * 时间选择组件（年份，月份）
 */
import React, { Component } from 'react';
import { Select,Row, Col,Button} from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva';
@connect(({ hrPerformance, loading }) => ({
  hrPerformance,
  loading: loading.models.hrPerformance,
}))
@connect(({ attendance, loading }) => ({
  attendance,
  loading: loading.models.attendance,
}))

export default class MonthSelect extends Component {

  state = {
    year : (new Date()).getFullYear().toString(),
    month : ((new Date()).getMonth()+1).toString(),
  };

  changeVal = (name, val) => {
    var newState = {};
    newState[name] = val;
    // 此处调用setState之后，并不能获取到预想的值，必须执行在回调函数过程中获取到最新值
    this.setState(newState,
      ()=>{
        let value = {
          year:this.state.year,
          mouth:this.state.month,
        };
        this.props.dispatch({
          type: 'attendance/getException',
          payload: value,
        });
      }
    );
  };

  theMonth = () =>{
    var newState = {
      year : (new Date()).getFullYear().toString(),
      month : ((new Date()).getMonth()+1).toString(),
    };
    this.setState(newState, ()=>{
      let value = {
        year:this.state.year,
        month:this.state.month,
      };
      this.props.dispatch({
        type: 'attendance/getException',
        payload: value,
      });
    })
  };

  render() {

    const {
      hrPerformance: { yearList },
    } = this.props;

    const monthList = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    const selectOpt = monthList.map((system,i)=> <Select.Option  key={i} value={system}>{system}</Select.Option>);
    const systemOpts = yearList.map((system,i) => <Select.Option key={i} value={system}>{system}</Select.Option>);

    return (
      <div>
        <Row style={{left:-20}}>
          <Col span={1}>
            <Select style={{ width: 100, left:-40 }} defaultValue={ this.state.year } value	={this.state.year} onChange={this.changeVal.bind(this,"year")}>
              {systemOpts}
            </Select>
          </Col>
          <Col span={1}>
            <Select style={{ width: 100,left:80 }} defaultValue={ this.state.month } value	={this.state.month} onChange={this.changeVal.bind(this,"month")}>
              {selectOpt}
            </Select>
          </Col>
          <Col span={1} style={{left:280}}>
              <Button type="primary" onClick={this.theMonth}>本月</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
