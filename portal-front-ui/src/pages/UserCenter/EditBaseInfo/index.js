import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Card, Form, Input, Select, Tabs, Breadcrumb } from 'antd';

const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class EditBaseInfo extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  componentWillUnmount() {}

  onChangeTab = (key) => {
    const { match } = this.props;
    switch (key) {
      case 'baseInfo':
        router.push(`${match.url}/baseInfo`);
        break;
      case 'password':
        router.push(`${match.url}/password`);
        break;
      case 'mobile':
        router.push(`${match.url}/mobile`);
        break;
      default:
        break;
    }
  };

  render() {
    const { match, location, children } = this.props;

    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{padding: 0}}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="/ys/user-center">个人总览</a></Breadcrumb.Item>
              <Breadcrumb.Item>编辑资料</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">编辑资料</div>
          </div>
          <Tabs activeKey={location.pathname.replace(`${match.path}/`, '')} onChange={this.onChangeTab}>
            <TabPane tab="修改资料" key="baseInfo">
            </TabPane>
            <TabPane tab="修改密码" key="password">
            </TabPane>
            <TabPane tab="修改密保" key="mobile">
            </TabPane>
          </Tabs>
          <div>
            {children}
          </div>
        </Card>
      </div>
    );
  }
}
