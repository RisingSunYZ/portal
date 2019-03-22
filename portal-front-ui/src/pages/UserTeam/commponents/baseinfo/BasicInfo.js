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
      baseInfo: { profile },
      loading,
    } = this.props;
    return (
      <div>
        <Card bordered={false} loading={loading} bodyStyle={{padding: '16px 0'}}>
          <DescriptionList col="2" size="large" style={{ marginBottom: '16px' }}>
            <Description term="性别">{profile.profile.sex == 1 ? '男' : '女'}</Description>
            <Description term="民族">{profile.profile.nationality}</Description>
            <Description term="婚姻状况">{profile.profile.marital}</Description>
            <Description term="政治面貌">{profile.profile.polity}</Description>
            <Description term="出生日期">{profile.profile.birthdate}</Description>
            <Description term="参加工作日">{profile.profile.joinworkdate}</Description>
            <Description term="籍贯">{profile.profile.permanreside}</Description>
            <Description term="户口性质">{profile.profile.characterrpr}</Description>
            <Description term="户口所在地">{profile.profile.nativeplace}</Description>
            <Description term="身份证号码">{profile.profile.id}</Description>
          </DescriptionList>
          <DescriptionList col="1" size="large">
            <Description term="身份证登记地">{profile.profile.idcardaddr}</Description>
            <Description term="可书面送达地址">{profile.profile.nowaddr}</Description>
            <Description term="家庭住址">{profile.profile.addr}</Description>
          </DescriptionList>
        </Card>
      </div>
    );
  }
}
