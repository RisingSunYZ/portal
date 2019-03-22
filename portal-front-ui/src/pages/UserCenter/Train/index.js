import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Breadcrumb } from 'antd';
import styles from './index.less';
import TrainingOverview from '../commponents/train/TrainingOverview'
import TrainingDetails from '../commponents/train/TrainingDetails'

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class TrainProfile extends Component {
  state = {};

  componentDidMount() {
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{padding: 0}}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="/ys/user-center">个人总览</a></Breadcrumb.Item>
              <Breadcrumb.Item>{this.props.location.query.userNo?'Ta的培训':'我的培训'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">{this.props.location.query.userNo?'Ta的培训':'我的培训'}</div>
          </div>
        </Card>
        <Card bordered={false} bodyStyle={{padding: '0 24px 30px'}} style={{marginTop: 16}}>
          <Row>
            <TrainingOverview userNo={this.props.location.query.userNo}/>
          </Row>
          <Row>
            <p className="cardTitle"><i></i>培训详情</p>
            <TrainingDetails userNo={this.props.location.query.userNo}/>
          </Row>
        </Card>
      </div>
    );
  }
}
