/**
 * 团队培训
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Breadcrumb,Button } from 'antd';

import TrainingCourse from '../commponents/train/TrainingCourse';
import TrainingDetail from '../commponents/train/TrainingDetail';
import SeasonSelect from '../commponents/common/SeasonSelect';
import YearSelect from '../commponents/train/YearSelect';
import OrgSelect from '../commponents/common/OrgSelect';

@connect(({ teamTrain, loading }) => ({
  teamTrain,
  loading: loading.models.teamTrain,
}))
export default class TeamTrain extends Component {

  state = {
    planYear: '',
    season: '',
    deptIds: [],
    defaultYear: (new Date()).getFullYear(),
    page: 1,
    rows: 10,
    pageSize: 10,
    current: 1,
  };

  componentDidMount() {}

  componentWillUnmount() {}

  // 置于当前年,季度
  theSeason = () => {
    this.setState({
      defaultYear: (new Date()).getFullYear(),
    });
    const refSeason = this.refs.seasonSelect;
    if ((typeof refSeason) != 'undefined') {
      refSeason.defaultSeason();
      const val = refSeason.state.defaultVal;
      this.seasonChange(val);
    }
  };

  //YearSelect改变时子组件触发
  yearChange = (planYear) =>{
    this.setState({
      planYear: planYear,
    },()=>{
      this.reqData(this.state)
    });
  };

  // 季度改变时子组件触发
  seasonChange = (season) =>{
    this.setState({
      season: season,
    },()=>{
      this.reqData(this.state)
    });
  };

  //部门改变时触发
  orgChange = (org)=>{
    let orgStr;
    if (org.childrenDeptId.length > 0) {
      orgStr = org.childrenDeptId.toString()+','+org.currentDeptId;
    } else {
      orgStr = org.currentDeptId;
    }
    this.setState({
      deptIds: orgStr
    },()=>{
      this.reqData(this.state);
    })
  };

  initPage = (deptArray) => {
    this.setState({
      deptIds:deptArray.toString()
    },()=>{
      this.reqData(this.state);
    });
  };

  changeDefaultYear=(year)=>{
    this.setState({
      defaultYear:year
    });
  };

  pageChange = (pagination, filtersArg) => {
    this.setState(
      {
        current: pagination,
        page: pagination,
        rows: filtersArg,
        pageSize: filtersArg,
      },
      () => {
        this.props.dispatch({
          type: 'teamTrain/fetchTrainingDetail',
          payload: this.state
        })
      }
    );
  };

  sizeChange = (va, vb) => {
    this.setState(
      {
        current: 1,
        page: 1,
        rows: vb,
        pageSize: vb,
      },
      () => {
        this.props.dispatch({
          type: 'teamTrain/fetchTrainingDetail',
          payload: this.state
        })
      }
    );
  };

  search = (val) => {
    this.setState({
      searchStr : encodeURIComponent(val)
    },()=> {
      this.props.dispatch({
        type: 'teamTrain/fetchTrainingDetail',
        payload: this.state
      })
    })
  };

  //请求数据
  reqData = (val) => {
    let param = {
      planYear: val.defaultYear,
      season: val.season,
      deptIds: val.deptIds,
    };
    setTimeout( () => {
      this.props.dispatch({
        type: 'teamTrain/fetchTrainingCourse',
        payload: val
      });
      this.props.dispatch({
        type: 'teamTrain/fetchCourseDevelop',
        payload: val
      });
      this.props.dispatch({
        type: 'teamTrain/fetchComplete',
        payload: val
      });
      this.props.dispatch({
        type: 'teamTrain/fetchTrainingDetail',
        payload: val
      })
    },200);
  };

  render() {
    return (
      <div className="ucenter-box">
        <Card  bodyStyle={{padding: 0}}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="/ys/user-team">团队总览</a></Breadcrumb.Item>
              <Breadcrumb.Item>部门培训</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">我的培训</div>
          </div>
        </Card>
        <Card bordered={false} bodyStyle={{padding: '16px 24px'}} style={{marginTop: 16}}>
          <Row>
            <Col span={3} > <YearSelect ref="yearSelect" changeDefaultYear={this.changeDefaultYear} defaultYear={this.state.defaultYear} onInit={(planYear)=>{this.state.planYear=planYear}} yearChange={this.yearChange}/> </Col>
            <Col span={3} > <SeasonSelect ref="seasonSelect" onInit={(season)=>{this.state.season=season}}  onChange={this.seasonChange} /> </Col>
            <Col span={7} > <OrgSelect ref="orgSelect" initPage={this.initPage} onOrgChange={this.orgChange}  /> </Col>
            <Col span={2} > <Button ref="but" type="primary" onClick={this.theSeason}>本季度</Button> </Col>
          </Row>
          <Row>
            <TrainingCourse/>
          </Row>
          <Row>
            <TrainingDetail onPageChange={this.pageChange} onSizeChange={this.sizeChange} onSearch={this.search}/>
          </Row>
        </Card>
      </div>
    );
  }
}
