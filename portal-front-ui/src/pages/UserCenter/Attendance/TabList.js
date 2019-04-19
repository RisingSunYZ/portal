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
    const userNo = this.props.location.query.userNo;
    let url = match.url;
    if(typeof userNo != 'undefined'){
      switch (key) {
        case 'summary':
          url += '/summary?userNo='+userNo;
          break;
        case 'record':
          url += '/record?userNo='+userNo;
          break;
        case 'exception':
          url += '/exception?userNo='+userNo;
          break;
        default:
          break;
      }
    }else{
      switch (key) {
        case 'summary':
          url += '/summary';
          break;
        case 'record':
          url += '/record';
          break;
        case 'exception':
          url += '/exception';
          break;
        default:
          break;
      }
    }
    router.push(url);
  };
  componentDidMount() {
    const { match } = this.props;
    const userNo = this.props.location.query.userNo;
    const month = this.props.location.query.month;
    const year = this.props.location.query.year;
    const detailView = this.props.location.query.detailView;
    let url =this.props.location.pathname
    if(url==match.url){
        url=match.url+'/summary';
    }
    if(typeof userNo != 'undefined'){
      url+='?userNo='+userNo;
    }
    if(typeof year != 'undefined'){
      url+='&year='+year;
    }
    if(typeof month != 'undefined'){
      url+='&month='+month;
    }
    if(typeof detailView != 'undefined'){
      url+='&detailView='+detailView;
    }
    router.push(url);
  }

  componentWillUnmount() {}

  render() {
    const { match, location, children } = this.props;

    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<a href="/portal/main/hr-service">HR服务</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="/portal/user-center">个人总览</a></Breadcrumb.Item>
              <Breadcrumb.Item>{this.props.location.query.userNo?'Ta的考勤':'我的考勤'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">{this.props.location.query.userNo?'Ta的考勤':'我的考勤'}</div>
          </div>
          <Tabs activeKey={location.pathname.replace(`${match.path}/`, '')} onChange={this.handleTabChange}>
            <TabPane tab="考勤汇总" key="summary"> </TabPane>
            <TabPane tab="考勤记录" key="record"> </TabPane>
            <TabPane tab="异常处理" key="exception"> </TabPane>
          </Tabs>
          {children}
        </Card>
      </div>
    );
  }
}
