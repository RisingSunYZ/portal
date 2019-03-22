import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Tabs, Breadcrumb } from 'antd';
import PersonalAssetsDetails from '../commponents/assets/PersonalAssetsDetails';
import PersonalFixedAssets from '../commponents/assets/PersonalFixedAssets';
import PersonalSoftWareAssets from '../commponents/assets/PersonalSoftWareAssets';
import ChargeAssetsDetails from '../commponents/assets/ChargeAssetsDetails';
import ChargeFixedAssets from '../commponents/assets/ChargeFixedAssets';
import ChargeSoftWareAssets from '../commponents/assets/ChargeSoftWareAssets';

import PersonalFixedAssetsTotal from '../commponents/assets/PersonalFixedAssetsTotal';
import PersonalSoftWareAssetsTotal from '../commponents/assets/PersonalSoftWareAssetsTotal';
import ChargeFixedAssetsTotal from '../commponents/assets/ChargeFixedAssetsTotal';
import ChargeSoftWareAssetsTotal from '../commponents/assets/ChargeSoftWareAssetsTotal';
import styles from './index.less';

const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class AssetsProfile extends Component {
  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="/ys/user-center">个人总览</a></Breadcrumb.Item>
              <Breadcrumb.Item>{this.props.location.query.userNo?'Ta的资产':'我的资产'}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">{this.props.location.query.userNo?'Ta的资产':'我的资产'}</div>
          </div>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="个人资产" key="1">
              <Row>
                <p className="cardTitle">
                  个人资产详情
                </p>
                <PersonalAssetsDetails userNo={this.props.location.query.userNo} />
              </Row>
              <Row style={{ marginTop: 32 }}>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                  <TabPane tab="固定资产" key="1">
                    <Row>
                      <PersonalFixedAssetsTotal userNo={this.props.location.query.userNo}/>
                    </Row>
                    <Row style={{marginTop: 8}}>
                      <PersonalFixedAssets userNo={this.props.location.query.userNo}/>
                    </Row>
                  </TabPane>
                  <TabPane tab="软件资产" key="2">
                    <Row>
                      <PersonalSoftWareAssetsTotal userNo={this.props.location.query.userNo}/>
                    </Row>
                    <Row style={{marginTop: 8}}>
                      <PersonalSoftWareAssets userNo={this.props.location.query.userNo}/>
                    </Row>
                  </TabPane>
                </Tabs>
              </Row>
            </TabPane>
            <TabPane tab="责任资产" key="2">
              <Row>
                <p className="cardTitle">
                  责任资产详情
                </p>
                <ChargeAssetsDetails userNo={this.props.location.query.userNo} />
              </Row>
              <Row style={{ marginTop: 32 }}>
                <Tabs defaultActiveKey="1" onChange={this.callback}>
                  <TabPane tab="固定资产" key="1">
                    <Row>
                      <ChargeFixedAssetsTotal userNo={this.props.location.query.userNo}/>
                    </Row>
                    <Row style={{marginTop: 8}}>
                      <ChargeFixedAssets userNo={this.props.location.query.userNo}/>
                    </Row>
                  </TabPane>
                  <TabPane tab="软件资产" key="2">
                    <Row>
                      <ChargeSoftWareAssetsTotal userNo={this.props.location.query.userNo}/>
                    </Row>
                    <Row style={{marginTop: 8}}>
                      <ChargeSoftWareAssets userNo={this.props.location.query.userNo}/>
                    </Row>
                  </TabPane>
                </Tabs>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );

  }
}
