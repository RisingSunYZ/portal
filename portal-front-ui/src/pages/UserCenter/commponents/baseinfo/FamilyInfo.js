import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Avatar, Tag, Divider } from 'antd';
// import styles from './index.less';
import { connect } from 'dva/index';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;

const familyList = [
  {
    name: '张三',
    relate: '父子',
    company: '蘑菇加',
    postname: '经理',
    address: '杭州',
    tel: '13158467895',
  },
  {
    name: '张三',
    relate: '父子',
    company: '蘑菇加',
    postname: '经理',
    address: '杭州',
    tel: '13158467895',
  },
  {
    name: '张三',
    relate: '父子',
    company: '蘑菇加',
    postname: '经理',
    address: '杭州',
    tel: '13158467895',
  },
];
@connect(({ baseInfo, loading }) => ({
  baseInfo,
  loading: loading.models.baseInfo,
}))
export default class FamilyInfo extends PureComponent {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
  }
  getFamilyList = family => {
    return family.map((member, index) => {
      return (
        <DescriptionList key={index} col="2" size="large" style={{ marginBottom: '32px' }}>
          <Description term="家庭成员姓名">{member.mem_name}</Description>
          <Description term="职务">{member.mem_job}</Description>
          <Description term="与本人关系">{member.mem_relation}</Description>
          <Description term="联系地址">{member.relaaddr}</Description>
          <Description term="联系电话">{member.relaphone}</Description>
        </DescriptionList>
      );
    });
  };
  getLinkmansList = linkMans => {
    return linkMans.map((member, index) => {
      return (
        <DescriptionList key={index} col="1" size="large" style={{ marginBottom: '32px' }}>
          <Description term="紧急联系人姓名">{member.linkman}</Description>
          <Description term="与联系人关系">{member.relation}</Description>
          <Description term="手机">{member.mobile}</Description>
        </DescriptionList>
      );
    });
  };

  render() {
    const {
      baseInfo: {
        profile: { familys, linkmans },
      },
      loading,
    } = this.props;
    return (
      <div>
        <Card bordered={false} loading={loading} bodyStyle={{padding: '16px 16px 0'}}>
          {
            typeof familys != 'undefined'?this.getFamilyList(familys):null
          }
        </Card>
        <Card bordered={false} loading={loading} bodyStyle={{padding: '0 16px 32px'}}>
          {
            typeof linkmans != 'undefined'?this.getLinkmansList(linkmans):null
          }
        </Card>
      </div>
    );
  }
}
