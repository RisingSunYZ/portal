import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Button } from 'antd';
import styles from '../../BaseInfo/index.less';
import { connect } from 'dva/index';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;
@connect(({ baseInfo, user, loading }) => ({
  user: user,
  baseInfo,
  loading: loading.models.baseInfo,
}))
export default class EnterInfo extends PureComponent {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
  }

  render() {
    const {
      baseInfo: { profile, psnorgs },
      user: { currentUser },
      loading,
    } = this.props;
    return (
      <div>
        <Card bordered={false} loading={loading} bodyStyle={{padding: 0}}>
          <p className="cardTitle">岗位详情</p>
          <Row gutter={32}>
            <Col span={4}>
              <img className={styles.headBox} src={currentUser.userImgUrl} alt=""/>
            </Col>
            <Col span={8}>
              <DescriptionList col="1" size="large">
                <Description term="姓名" termStyle={{minWidth: 'auto'}}>{currentUser.name}</Description>
                <Description term="性别" termStyle={{minWidth: 'auto'}}>{profile.profile.sex == 1 ? '男' : '女'}</Description>
                <Description term="工号" termStyle={{minWidth: 'auto'}}>{currentUser.no}</Description>
                <Description term="职级" termStyle={{minWidth: 'auto'}}>{profile.profile.jobgrade_code}</Description>
              </DescriptionList>
            </Col>
            <Col span={12}>
              <DescriptionList col="1" size="large">
                <Description term="所属公司" termStyle={{minWidth: 'auto'}}>{currentUser.companyName}</Description>
                <Description term="所属部门" termStyle={{minWidth: 'auto'}}>{currentUser.depName}</Description>
                <Description term="所属职位" termStyle={{minWidth: 'auto'}}>{currentUser.userPost}</Description>
              </DescriptionList>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} loading={loading} bodyStyle={{padding: '16px 0'}}>
          <p className="cardTitle">应聘渠道</p>
          <DescriptionList col="2" size="large">
            <Description term="应聘渠道" termStyle={{minWidth: 'auto'}}>{currentUser.begindate}</Description>
            <Description term="投递时间" termStyle={{minWidth: 'auto'}}>{currentUser.begindate}</Description>
            <Description term="面试时间" termStyle={{minWidth: 'auto'}}>{currentUser.begindate}</Description>
          </DescriptionList>
        </Card>
        <Card bordered={false} loading={loading} bodyStyle={{padding: '16px 0'}}>
          <p className="cardTitle">简历文件</p>
          <Button type="primary">查看简历</Button>
        </Card>
        <Card bordered={false} loading={loading} style={{marginBottom: 100}} bodyStyle={{padding: 0}}>
          <p className="cardTitle" style={{marginBottom: 16}}>面试结果</p>
          <DescriptionList col="2" size="large" style={{marginBottom: 16}}>
            <Description term="人才观得分" termStyle={{minWidth: 'auto'}}>{currentUser.begindate}</Description>
            <Description term="任职资格得分" termStyle={{minWidth: 'auto'}}>{currentUser.begindate}</Description>
          </DescriptionList>
          <DescriptionList col="1" size="large">
            <Description term="面试结果" termStyle={{minWidth: 'auto'}}>{currentUser.begindate}</Description>
            <Description term="面试评价" termStyle={{minWidth: 'auto'}}>{currentUser.begindate}</Description>
          </DescriptionList>
        </Card>
      </div>
    )
  }
}
