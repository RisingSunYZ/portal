/**
 * 个人中心绩效页面
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Row, Col, Card, Breadcrumb, Tabs } from 'antd';
import PerformanceTable from '../commponents/performance/PerformanceTable';
import YearSelect from '../commponents/performance/YearSelect';

@connect(({ hrPerformance, loading }) => ({
  hrPerformance,
  loading: loading.models.hrPerformance,
}))
export default class PerformanceProfile extends Component {

  state = {
    defaultVal: ((new Date()).getFullYear()-1),
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'hrPerformance/getPerformanceScore',
      payload: {
        userNo: this.props.location.query.userNo
      },
    });
  }

  yearChange = value => {
    //暂时注掉，后期需要
    // this.props.dispatch({
    //   type: 'hrPerformance/fetch',
    //   payload: { year: value },
    // });
    this.props.dispatch({
      type: 'hrPerformance/getPerformanceScore',
      payload: {
        year: value,
        userNo: this.props.location.query.userNo
      },
    });
  };

  //判断身份
  identity = () => {
    let str = '';
    if ((typeof this.props.location.query.userNo) != 'undefined') {
      str = 'Ta'
    }else {
      str = '我'
    }
    return str;
  };

  id = () => {
    let str = '';
    if ((typeof this.props.location.query.userNo) != 'undefined') {
      str = 'Ta'
    }else {
      str = '您'
    }
    return str;
  };

  render() {

    const {
      hrPerformance: { performanceObj },
    } = this.props;

    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{padding: 0}} style={{marginBottom: 16}}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="/ys/user-center">个人总览</a></Breadcrumb.Item>
              <Breadcrumb.Item>{this.identity()}的绩效</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">{this.identity()}的绩效</div>
          </div>
        </Card>
        <Card bordered={false} bodyStyle={{padding: '16px 24px'}}>
          <Row >
            <Col span={4}>
              <YearSelect yearChange={this.yearChange} defaultVal={this.state.defaultVal}/>
            </Col>
          </Row>
          <Row>
            <p className="cardTitle">
              <i />
              {this.identity()}的绩效
            </p>
          </Row>
          <Row>
            <Col span={24}>
              <p className={styles.ptzt}>
                {this.id()}的半年度绩效评定结果等级为<span className={styles.number}>&nbsp;&nbsp;{performanceObj.halfYearPer}&nbsp;</span>级,
                年度绩效评定结果等级为<span className={styles.number}>&nbsp;&nbsp;{performanceObj.yearPer}&nbsp;</span>级
              </p>
            </Col>
          </Row>
          <Row>
            <p className="cardTitle">
              <i />
              奖励信息
            </p>
          </Row>

          <Row>
            <PerformanceTable />
          </Row>
        </Card>
      </div>
    );
  }
}
