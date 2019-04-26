import React, { PureComponent } from 'react';
import { Breadcrumb, Input, Button, Card, Row, Col } from 'antd';
import styles from './UserPandect.less';
import { connect } from 'dva/index';
import { Base64 } from 'js-base64';
@connect(({ user, attendance, assets, hrPerformance,train, loading }) => ({
  user,
  attendance,
  assets,
  hrPerformance,
  train,
  loading: loading.models.user,
}))
export default class UserPandect extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserByNo',
      payload: '',
    });
    dispatch({
      type: 'attendance/getSummaryAttendance',
    });
    dispatch({
      type: 'assets/getPersonalAssetsDetails',
      // payload: { useManId: '00004907' },
    });
    dispatch({
      type: 'assets/getChargeAssetsDetails',
      // payload: { chargeManId: '00004907' },
    });
    dispatch({
      type: 'hrPerformance/getPerformanceScore',
    });
    dispatch({
      type: 'train/getTrainingOverview',
    });
  }

  render() {
    const {
      user: { userInfo },
      attendance: { aNumberData },
      assets: { pData, cData },
      hrPerformance: { performanceObj },
      train:{tNumberData},
      loading,
    } = this.props;
    return (
      <div>
        <Card
          bordered={false}
          bodyStyle={{ padding: '16px 24px', boxShadow: '0 2px 4px 0 #e5e5e5' }}
        >
          <Breadcrumb>
            <Breadcrumb.Item>
              您所在的位置：
              <a href="/ys/main/hr-service">HR服务</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>个人总览</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card
          bordered={false}
          style={{ marginTop: 16 }}
          bodyStyle={{ padding: '0 75px 170px 75px' }}
        >
          <div className={styles.userName}>
            <span>{userInfo.userName}</span>
            你好！
          </div>
          <div className="userChannels">
            <Card bordered={false}>
              <div className="channel-bg baseinfo"> </div>
              <p>
                你于 <span className="strength text">{userInfo.enterTime}</span>
                加入亚厦，作为这个大家庭的一员，我们已共同度过{' '}
                <span className="strength">{userInfo.year}</span>
                年。
              </p>
              <p>
                你目前任职于{' '}
                <span className="strength text">
                  {userInfo.companyName}
                  {userInfo.deptName}
                </span>
                ，担任 <span className="strength text">{userInfo.postname}</span>
                职务，你的职级为 <span className="strength">{userInfo.positionLevel}</span>。
              </p>
              <Button type="primary">
                <a href="baseinfo" target="_blank">
                  详情
                </a>
              </Button>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg performance"> </div>
              <p>
                你上一年度的绩效评定为 <span className="strength">{performanceObj.yearPer}</span>。
              </p>
              <p>本年度，请继续与我们一起“艰苦奋斗、创新变革”。</p>
              <p>
                <Button type="primary">
                  <a href="performance" target="_blank">
                    详情
                  </a>
                </Button>
              </p>
              <p>
                秉承“感恩怀德”的精神，你的点滴付出与收获都记录在你的{' '}
                <a href="salary" target="_blank" style={{fontWeight: 600}}>
                  薪资条
                </a>{' '}
                中。
              </p>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg attendance"> </div>
              <p>
                本年度，你已出勤 <span className="strength">{aNumberData.normalWorkday}</span>
                天，出勤率为
                <span className="strength">{aNumberData.attendance}</span>%
                ；高于 <span className="strength">{aNumberData.moreAttendanceToOthers}</span>%
                的YASHAers。
              </p>
              <p>
                你已经完成了
                <span className="strength">{aNumberData.travelCount}</span>
                次出差，一共出差了
                <span className="strength">{aNumberData.travelDay}</span>
                天。
              </p>
              <p>
                你请假了
                <span className="strength">{aNumberData.leaveCount}</span>
                次，一共请假了 <span className="strength">{aNumberData.leaveDay}</span>
                天。
              </p>
              <p>
                你有
                <span className="strength">{aNumberData.goOutCount}</span>
                次因公外出，
                <span className="strength">{aNumberData.lateOrEarlyleave}</span>
                次迟到早退，
                <span className="strength">{aNumberData.absenteeism}</span>
                次旷工。
              </p>
              <Button type="primary">
                <a href="attendance" target="_blank">
                  详情
                </a>
              </Button>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg train"> </div>
              <p>
                你本年度已参加培训 <span className="strength">{tNumberData.trainNum}</span>
                次，完成
                <span className="strength">{tNumberData.realClassHours}</span>
                培训学时，你的培训目标达成率为
                <span className="strength">{tNumberData.completionRate}</span>。
              </p>
              <Button type="primary">
                <a href="train" target="_blank">
                  详情
                </a>
              </Button>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg asset"> </div>
              <p>你名下的资产：</p>
              <p>
                个人资产
                <span className="strength">{pData.paNumber}</span>
                件（其中软件资产
                <span className="strength">{pData.psNumber}</span>
                件，硬件资产
                <span className="strength">{pData.pfNumber}</span> 件）；
              </p>
              <p>
                责任资产
                <span className="strength">{cData.caNumber}</span>
                件（其中软件资产
                <span className="strength">{cData.csNumber}</span>
                件，硬件资产
                <span className="strength">{cData.cfNumber}</span> 件）；
              </p>
              <p>请妥善保管和使用它们，它们将会为你的工作提供帮助和便利。</p>
              <Button type="primary">
                <a href="asset" target="_blank">
                  详情
                </a>
              </Button>
            </Card>
            <div style={{ color: '#333', paddingLeft: 30 }}>
              <p>
                为了方便其他人能及时联系到你，请随时{' '}
                <a href="edit" target="_blank" style={{fontWeight: 600}}>
                  更新
                </a>{' '}
                你的联系方式至最新。
              </p>
              <p>期待你在亚厦的每一天都有所成长和收获。</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
