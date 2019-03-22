import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Table, Timeline } from 'antd';
import styles from '../../Baseinfo/index.less';
import { connect } from 'dva/index';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;
const columns = [
  {
    title: '合同类型',
    dataIndex: 'secondCateName',
  },
  {
    title: '签署时间',
    dataIndex: 'assetsNo',
  },
  {
    title: '截止时间',
    dataIndex: 'assetsStatusStr',
  },
  {
    title: '有效期',
    dataIndex: 'goodsName',
  },
];
@connect(({ baseInfo, user, loading }) => ({
  user: user,
  baseInfo,
  loading: loading.models.baseInfo,
}))
export default class PositionInfo extends PureComponent {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
  }
  getPostionSteps = posts => {
    return (
      posts &&
      posts.map((postion, index) => {
        return <Timeline.Item color="#E8E8E8" key={index + 1}>
          <span className="timeLine">{postion.begindate}</span>
          <span className="textLine">{postion.orgname}</span>
          </Timeline.Item>;
      })
    );
  };

  render() {
    const {
      baseInfo: { profile, psnorgs },
      user: { currentUser },
      user: { userInfo },
      loading,
    } = this.props;

    return (
      <div>
        <Card bordered={false} loading={loading} bodyStyle={{padding: 0}}>
          <p className="cardTitle"><i></i>岗位详情</p>
          <Row gutter={32}>
            <Col span={4}>
              <img className={styles.headBox} src={userInfo.userHead} alt=""/>
            </Col>
            <Col span={8}>
              <DescriptionList col="1" size="large">
                <Description term="姓名" termStyle={{minWidth: 'auto'}}>{userInfo.userName}</Description>
                <Description term="性别" termStyle={{minWidth: 'auto'}}>{profile.profile.sex == 1 ? '男' : '女'}</Description>
                <Description term="工号" termStyle={{minWidth: 'auto'}}>{userInfo.userNo}</Description>
                <Description term="职级" termStyle={{minWidth: 'auto'}}>{userInfo.positionLevel}</Description>
              </DescriptionList>
            </Col>
            <Col span={12}>
              <DescriptionList col="1" size="large">
                <Description term="所属公司" termStyle={{minWidth: 'auto'}}>{userInfo.companyName}</Description>
                <Description term="所属部门" termStyle={{minWidth: 'auto'}}>{userInfo.deptName}</Description>
                <Description term="所属职位" termStyle={{minWidth: 'auto'}}>{userInfo.postname}</Description>
              </DescriptionList>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} loading={loading} bodyStyle={{padding: '16px 0'}}>
          <p className="cardTitle"><i></i>入职及合同信息</p>
          <DescriptionList col="2" size="large">
            <Description term="入职时间" termStyle={{minWidth: 'auto'}}>{currentUser.begindate}</Description>
            <Description term="当前合同签署时间" termStyle={{minWidth: 'auto'}}>{currentUser.begindate}</Description>
            <Description term="有效时间" termStyle={{minWidth: 'auto'}}>{currentUser.begindate}</Description>
            <Description term="当前合同截止时间" termStyle={{minWidth: 'auto'}}>{currentUser.begindate}</Description>
          </DescriptionList>
          <Table style={{marginTop: 16}} columns={columns} />
        </Card>
        <Card bordered={false} loading={loading} bodyStyle={{padding: 0}}>
          <p className="cardTitle" style={{marginBottom: 16}}><i></i>岗位变动</p>
          <div className="postTimeLine">
            <Timeline reverse>
              {this.getPostionSteps(profile.psnorgs)}
              <Timeline.Item key={0}>
                <span className="timeLine">至今</span>
                <span className="textLine">{userInfo.companyName}</span>
              </Timeline.Item>
            </Timeline>
          </div>
        </Card>
      </div>
    )
  }
}
