import React, { Component } from 'react';
import {Row, Col } from 'antd';
// import styles from './index.less';
import {connect} from "dva/index";

@connect(({ user, processForm, loading }) => ({
  user,processForm,
  loading: loading.models.user,
}))
export default class ProcessBaseInfo extends Component {
  render() {
    const { user :{currentUser}, processForm} = this.props;
    if(!processForm.formInfo.userInfo.name){
      return (<div></div>);
    }
    return (
      <div>
        <Row style={{ marginBottom: '6px' }}>
          <Col span={2}>提交人：</Col>
          <Col span={4}>{processForm.formInfo.userInfo.name}</Col>
          <Col span={2}>移动电话：</Col>
          <Col span={4}>{processForm.formInfo.userInfo.mobilePhone}</Col>
          <Col span={2}>职务：</Col>
          <Col span={4}>{processForm.formInfo.userInfo.postname}</Col>
        </Row>
        <Row>
          <Col span={2}>提交单位：</Col>
          <Col span={4}>{processForm.formInfo.userInfo.companyName}</Col>
          <Col span={2}>提交部门：</Col>
          <Col span={4}>{processForm.formInfo.userInfo.deptName}</Col>
          <Col span={2}>提交时间：</Col>
          <Col span={4}>{processForm.formInfo.userInfo.startTime}</Col>
        </Row>
      </div>
    );
  }
}
