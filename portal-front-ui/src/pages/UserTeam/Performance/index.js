import React, { Component } from 'react';
import router from 'umi/router';
import { Card, Tabs, Breadcrumb, Row } from 'antd';
import { connect } from 'dva';
const TabPane = Tabs.TabPane;

@connect(({ train, loading }) => ({
  train,
  loading: loading.models.train,
}))
export default class Index extends Component {

    state = {

    };

  componentDidMount() {}

  componentWillUnmount() {}

  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'information':
        router.push(`${match.url}/information`);
        break;
      case 'reward':
        router.push(`${match.url}/reward`);
        break;
      default:
        break;
    }
  };

  render() {

    const { match, location, children } = this.props;

    return (
      <div className="ucenter-box" >
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="/ys/user-team">团队总览</a></Breadcrumb.Item>
              <Breadcrumb.Item>团队绩效</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">部门绩效</div>
          </div>
          <Tabs activeKey={location.pathname.replace(`${match.path}/`, '')} onChange={this.handleTabChange}>
            <TabPane tab="绩效信息" key="information"> </TabPane>
            <TabPane tab="奖励信息" key="reward"> </TabPane>
          </Tabs>
          <Row>
            {children}
          </Row>
        </Card>
      </div>
    );
  }
}
