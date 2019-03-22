// 数据可视化页面（团队平均时长）
import React, { Component } from 'react';
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util} from "bizcharts";
import { Card, Breadcrumb, Row, Col,Select } from 'antd';
import { connect } from 'dva';
import YearSelect from '../commponents/common/YearSelect';


@connect(({ teamAttendance, loading }) => ({
  teamAttendance,
  loading: loading.models.teamAttendance,
}))
export default class AttendanceRateChart extends Component {

  state = {
    year: '',
    deptId: '',
  };

  pointClick = (ev) => {
    let stateYear;
    if (this.refs.yearSelect) {
      stateYear = this.refs.yearSelect.state.defaultVal
    }
    if ( ev.data && ev.data.point ) {
      const deptId =  ev.data.point.deptId;
      if (!!deptId ) {
        window.open("/ys/user-team/attendanceRateChart?deptId="+deptId+"&year="+stateYear);
      }
    }
  };

  componentDidMount() {
    const year = this.props.location.query.year;
    const deptId = this.props.location.query.deptId;
    this.reqData(deptId, year);
    if (!!year && !!deptId) {
      this.setState({
        deptId : deptId,
        year: year,
      });
    }
    if (!!deptId) {
      this.props.dispatch({
        type: 'teamAttendance/fetchSiblingDepts',
        payload: {deptId: deptId}
      })
    }
  };

  yearChange = (planYear) => {
    this.setState({
      year: planYear,
    },() => {
      this.reqData(this.state.deptId, this.state.year);
    })
  };

  selectState = () => {
    let stateStr = 'none';
    const childIds = this.props.location.query.deptId;
    if (!! childIds) {
      stateStr = '';
    }
    return stateStr
  };

  selectChange = (value) => {
    this.setState({
      deptId: value
    },() => {
      this.reqData(this.state.deptId,this.state.year)
    })
  };

  reqData = (deptId, year) => {
    this.props.dispatch({
      type: 'teamAttendance/fetchTeamAttendRateChart',
      payload: {
        deptId: deptId,
        year: year,
      } ,
    })
  };

  render() {

    const yearData = () => {
      let year = this.state.year;
      if ((typeof this.props.location) != 'undefined') {
        year = this.props.location.query.year
      }
      return year;
    };

    const {
      teamAttendance: { teamAttendRateChart, siblingDepts },
    } = this.props;

    const selectOpt = siblingDepts && siblingDepts.map((item, index) => (
      <Select.Option key={index} value={item.id}>
        {item.name}
      </Select.Option>
    ));

    const height = () => {
      let  heightData = (teamAttendRateChart.length)*60+115;
      return heightData;
    };

    return (
      <div>
        <Card>
          <Breadcrumb>
            <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a> </Breadcrumb.Item>
            <Breadcrumb.Item> <a href="/ys/user-team">团队总览</a> </Breadcrumb.Item>
            <Breadcrumb.Item> <a href="/ys/user-team/attendance">部门考勤</a> </Breadcrumb.Item>
            <Breadcrumb.Item>出勤率</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card style={{marginTop:16}} bodyStyle={{padding: '16px 24px'}}>
          <Row>
            <Col span={3} style={{marginLeft: 80}}>
              <YearSelect ref="yearSelect" onInit={planYear => {this.state.year = planYear;}} yearChange={this.yearChange}  defaultVal={yearData()} />
            </Col>
            <Col>
              <Select style={{width: 120, display:this.selectState()}} defaultVal={this.state.deptId} value={this.state.deptId} onChange={this.selectChange} >
                {selectOpt}
              </Select>
            </Col>
          </Row>
          <Chart height={height()}  data={teamAttendRateChart} forceFit  onPlotClick={this.pointClick}>
            <Coord transpose />
            <Axis
              name="name"
              label={{
                offset: 0,
                textStyle: {
                  fill: '#000000',
                  fontSize: '14',
                },
                htmlTemplate: (text, item, index)=>{
                  return '<span style="position: relative; top: -28px; color:#000000;word-break:keep-all;white-space:nowrap;" companyId="'+index+'">'+text+'</span>'
                },
                autoRotate: true
              }}
              //设置坐标轴线的样式
              line={{
                lineWidth: 0
              }}
              //配置刻度规则
              tickLine={null}
            />
            <Axis name="totalAtdRate" visible={false} />
            {/*开启图表tooltip功能*/}
            <Tooltip />
            {/*开启之后自定义显示内容，则需要在<Geom>中进行配置*/}
            <Geom type="interval" position="name*totalAtdRate" active={ true } color="l(0) 0:#4FD864 0.5:#42CDB0 1:#35C3FF"
                  tooltip={['name*totalAtdRate', (name, totalAtdRate) => {
                    return {
                      //自定义 tooltip 上显示的 title 显示内容等。
                      name: '考勤率',
                      title: name,
                      value: totalAtdRate*100+"%"
                    };
                  }]}
            >
              <Label
                // 用以说明作用的柱状图顶部的Label,必须配置在<Geom>之间
                content="rateStr"
                offset={-20}
                textStyle={{
                  fontSize: 14 // 文本大小
                }}
              />
            </Geom>
          </Chart>
        </Card>
      </div>
    );
  }

}

