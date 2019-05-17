import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Avatar, Tag, Divider } from 'antd';
// import styles from './index.less';
import { connect } from 'dva/index';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;

@connect(({ baseInfo, loading }) => ({
  baseInfo,
  loading: loading.models.baseInfo,
}))
export default class BasicInfo extends PureComponent {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
  }

  render() {
    const {
      baseInfo: { baseInfo:{ profile }},
      loading,
    } = this.props;
    return (
      <div>
        <Card bordered={false} loading={loading} bodyStyle={{padding: '16px 16px 50px'}}>
          <DescriptionList col="2" size="large" style={{ marginBottom: '16px' }}>
            <Description term="性别">{profile.gender == 1 ? '男' : '女'}</Description>
            <Description term="民族">{profile.nationality}</Description>
            <Description term="婚姻状况">{profile.marital}</Description>
            <Description term="政治面貌">{profile.polity}</Description>
            <Description term="出生日期">{profile.birthdate}</Description>
            <Description term="参加工作日">{profile.joinworkdate}</Description>
            <Description term="籍贯">{profile.permanreside}</Description>
            <Description term="户口性质">{profile.characterrpr}</Description>
            <Description term="户口所在地">{profile.nativeplace}</Description>
            <Description term="身份证号码">{profile.id}</Description>
          </DescriptionList>
          <DescriptionList col="1" size="large">
            <Description term="身份证登记地">{profile.idcardaddr}</Description>
            <Description term="可书面送达地址">{profile.nowaddr}</Description>
            <Description term="家庭住址">{profile.addr}</Description>
          </DescriptionList>
        </Card>
      </div>
    );
  }
}
