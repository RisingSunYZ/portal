import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Col, Card, Form, Input, Select, Tabs } from 'antd';
import PositionInfo from '../commponents/baseinfo/PositionInfo';
import EnterInfo from '../commponents/baseinfo/EnterInfo';
import BasicInfo from '../commponents/baseinfo/BasicInfo';
import FamilyInfo from '../commponents/baseinfo/FamilyInfo';
import EduInfo from '../commponents/baseinfo/EduInfo';
import Link from "umi/link";

const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;
@connect(({ baseInfo, loading }) => ({
  baseInfo,
  loading: loading.models.baseInfo,
}))
export default class Baseinfo extends Component {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/getBaseInfo',
      payload: {},
    });
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{padding: 0}}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<Link to="/main/hr-service">HR服务</Link></Breadcrumb.Item>
              <Breadcrumb.Item><Link to="/user-team">团队总览</Link></Breadcrumb.Item>
              <Breadcrumb.Item>Ta的信息</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">Ta的信息</div>
          </div>
          <Tabs defaultActiveKey="0" onChange={this.callback}>
            <TabPane tab="岗位信息" key="0">
              <PositionInfo />
            </TabPane>
            <TabPane tab="入职信息" key="1">
              <EnterInfo />
            </TabPane>
            <TabPane tab="基本信息" key="2">
              <BasicInfo />
            </TabPane>
            <TabPane tab="家庭信息" key="3">
              <FamilyInfo />
            </TabPane>
            <TabPane tab="学历信息" key="4">
              <EduInfo />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}
