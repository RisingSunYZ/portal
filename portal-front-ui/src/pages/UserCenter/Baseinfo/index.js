import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Col, Card, Form, Input, Select, Tabs } from 'antd';
import PositionInfo from '../commponents/baseinfo/PositionInfo';
import BasicInfo from '../commponents/baseinfo/BasicInfo';
import FamilyInfo from '../commponents/baseinfo/FamilyInfo';
import EduInfo from '../commponents/baseinfo/EduInfo';
import EntryInfo from '../commponents/baseinfo/EntryInfo';
import Link from "umi/link";

const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;
@connect(({ user,baseInfo, loading }) => ({
  user,
  baseInfo,
  loading: loading.models.baseInfo,
}))
export default class Baseinfo extends Component {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;

    const userNo = this.props.location.query.userNo;
    dispatch({
      type: 'baseInfo/getBaseInfo',
      payload: {userNo},
    });
    dispatch({
      type: 'user/getUserByNo',
      payload: userNo
    });

  }


  render() {

    const {user,baseInfo:{ baseInfo:{ profile }}} = this.props;
    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{padding: 0}}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<Link to="/main/hr-service">HR服务</Link></Breadcrumb.Item>
              <Breadcrumb.Item><Link to="/user-center">个人总览</Link></Breadcrumb.Item>
              <Breadcrumb.Item>{user.currentUser.no == user.userInfo.userNo?'我':'Ta'}的信息</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">{user.currentUser.no == user.userInfo.userNo?'我':'Ta'}的信息</div>
          </div>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="岗位信息" key="1">
              <PositionInfo />
            </TabPane>
            {user.currentUser.no == user.userInfo.userNo || typeof profile.entry == 'undefined'?null:
              <TabPane tab="入职信息" key="2">
                <EntryInfo />
              </TabPane>}
            <TabPane tab="基本信息" key="3">
              <BasicInfo />
            </TabPane>
            <TabPane tab="家庭信息" key="4">
              <FamilyInfo />
            </TabPane>
            <TabPane tab="学历信息" key="5">
              <EduInfo />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}
