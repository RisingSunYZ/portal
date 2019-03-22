import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Card, Tabs,Breadcrumb } from 'antd';

const TabPane = Tabs.TabPane;

export default class TabList extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'summary':
        router.push(`${match.url}/summary`);
        break;
      case 'record':
        router.push(`${match.url}/record`);
        break;
      case 'exception':
        router.push(`${match.url}/exception`);
        break;
      default:
        break;
    }
  };
  componentDidMount() {
  }

  componentWillUnmount() {}

  render() {
    const { match, location, children } = this.props;

    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="/ys/user-team">团队总览</a></Breadcrumb.Item>
              <Breadcrumb.Item>部门考勤</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">部门考勤</div>
          </div>
          <Tabs activeKey={location.pathname.replace(`${match.path}/`, '')} onChange={this.handleTabChange}>
            <TabPane tab="考勤总汇" key="summary"> </TabPane>
            <TabPane tab="考勤记录" key="record"> </TabPane>
          </Tabs>
          {children}
        </Card>
      </div>
    );
  }
}
