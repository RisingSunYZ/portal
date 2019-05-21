// 数据可视化页面（团队平均时长）
import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label } from "bizcharts";
import { Card, Breadcrumb, Row, Col,Select, Button, Radio } from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import YearSelect from '../commponents/common/YearSelect';


@connect(({ teamAttendance, loading }) => ({
  teamAttendance,
  loading: loading.models.teamAttendance,
}))
export default class AttendanceChart extends Component {

  state = {
    year: '',
    deptId: '',
    viewType: 'dept',
  };

  pointClick = (ev) => {
    let stateYear;
    if (this.refs.yearSelect) {
      stateYear = this.refs.yearSelect.state.defaultVal
    }
    if (ev.data && ev.data.point ) {
      const deptId =  ev.data.point.deptId;
      if (deptId ) {
        window.open("/user-team/attendanceChart?deptId="+deptId+"&year="+stateYear);
      }
    }
  };

  componentWillMount() {
    const year = this.props.location.query.year;
    const deptId = this.props.location.query.deptId;
    this.reqData(deptId, year);
    if (year) {
      this.setState({
        year: year,
      });
    }
    if (deptId) {
      this.setState({
        deptId: deptId,
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
      deptId: value,
      viewType: 'dept'
    },() => {
      this.reqData(this.state.deptId,this.state.year)
    })
  };

  radioChange = ({target:{value}}) => {
    this.setState({
      viewType: value
    });
  };

  reqData = (deptId, year) => {
    this.props.dispatch({
      type: 'teamAttendance/fetchTeamAttendChart',
      payload: {
        deptId: deptId,
        year: year,
      } ,
    });
    this.props.dispatch({
      type: 'teamAttendance/fetchTeamAttendChartMember',
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
      teamAttendance: { teamAttendChart, teamAttendChartMember, siblingDepts },
    } = this.props;

    const selectOpt = siblingDepts && siblingDepts.map((item, index) => (
      <Select.Option key={index} value={item.id}>
        {item.name}
      </Select.Option>
    ));

    const height = () => {
      return (teamAttendChart.length)*60+115;
    };

    const memberHeight = () => {
      return (teamAttendChartMember.length)*60+115;
    };

    const radioState = () => {
      let str = 'none';
      if (teamAttendChartMember && teamAttendChartMember.length > 0) {
        str = ''
      }
      return str;
    };

    return (
      <div>
        <Card>
          <Breadcrumb>
            <Breadcrumb.Item>您所在的位置：<Link to="/main/hr-service">HR服务</Link> </Breadcrumb.Item>
            <Breadcrumb.Item> <Link to="/user-team">团队总览</Link> </Breadcrumb.Item>
            <Breadcrumb.Item> <Link to="/user-team/attendance">部门考勤</Link> </Breadcrumb.Item>
            <Breadcrumb.Item>平均工作时长</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card style={{marginTop:16}}>
          <Row>
            <Col span={3} style={{marginLeft: 80}}>
              <YearSelect ref="yearSelect" onInit={planYear => {this.state.year = planYear;}} yearChange={this.yearChange}  defaultVal={yearData()} />
            </Col>
            <Col span={3}>
              <Select style={{width: 120, display:this.selectState()}} defaultVal={this.state.deptId} value={this.state.deptId} onChange={this.selectChange}>
                {selectOpt}
              </Select>
            </Col>
            <Col offset={19} style={{display: radioState()}}>
              <Radio.Group  defaultValue='dept' onChange={this.radioChange} value={this.state.viewType}>
                <Radio.Button value="dept">部门</Radio.Button>
                <Radio.Button value="user">成员</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
          <Row >
            {this.state.viewType==='dept' ? (
              <Chart height={height()}  forceFit data={teamAttendChart}  onPlotClick={this.pointClick} onClick={this.pointClick}  >
                <Coord transpose />
                <Axis
                  name="name"
                  deptId="deptId"
                  label={{
                    offset: 0,
                    textStyle: {
                      fill: 'red',
                      fontSize: '14',
                    },
                    htmlTemplate: (text, item, index)=>{
                      return '<span style="position: relative;top: -28px;color:#000000;word-break:keep-all;white-space:nowrap;" companyId="'+index+'">'+text+'</span>'
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
                <Axis name="avgWorkHour" visible={false} />
                {/*开启图表tooltip功能*/}
                <Tooltip />
                {/*开启之后自定义显示内容，则需要在<Geom>中进行配置*/}
                <Geom type="interval" position="name*avgWorkHour" active={ true } color="l(0) 0:#1890FF 0.5:#27BAFF 1:#35E1FF"
                      tooltip={['name*avgWorkHour', (name, avgWorkHour) => {
                        return {
                          //自定义 tooltip 上显示的 title 显示内容等。
                          name: '工作时长',
                          title: name,
                          value: avgWorkHour
                        };
                      }]}
                >
                  <Label
                    // 用以说明作用的柱状图顶部的Label,必须配置在<Geom>之间
                    content="avgWorkHour"
                    offset={-20}
                    textStyle={{
                      fontSize: 14 // 文本大小
                    }}
                  />
                </Geom>
              </Chart>
            ): (
              <Chart height={memberHeight()}  forceFit data={teamAttendChartMember}  onPlotClick={this.pointClick} onClick={this.pointClick}  >
                <Coord transpose />
                <Axis
                  name="name"
                  label={{
                    offset: 0,
                    textStyle: {
                      fontSize: '14',
                    },
                    htmlTemplate: (text, item, index)=>{
                      return '<span style="position: relative;top: -28px;color:#000000;word-break:keep-all;white-space:nowrap;" >'+text+'</span>'
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
                <Axis name="avgWorkHour" visible={false} />
                {/*开启图表tooltip功能*/}
                <Tooltip />
                {/*开启之后自定义显示内容，则需要在<Geom>中进行配置*/}
                <Geom type="interval" position="name*avgWorkHour" active={ true } color="l(0) 0:#1890FF 0.5:#27BAFF 1:#35E1FF"
                      tooltip={['name*avgWorkHour', (name, avgWorkHour) => {
                        return {
                          //自定义 tooltip 上显示的 title 显示内容等。
                          name: '工作时长',
                          title: name,
                          value: avgWorkHour
                        };
                      }]}
                >
                  <Label
                    // 用以说明作用的柱状图顶部的Label,必须配置在<Geom>之间
                    content="avgWorkHour"
                    offset={-20}
                    textStyle={{
                      fontSize: 14 // 文本大小
                    }}
                  />
                </Geom>
              </Chart>
            )}
          </Row>
        </Card>
      </div>
    );
  }

}

