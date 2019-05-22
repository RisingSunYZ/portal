import React, { PureComponent } from 'react';
import { Breadcrumb, Input, Button, Card, Row, Col } from 'antd';
import styles from '../UserCenter/UserPandect.less';
import { connect } from 'dva/index';
import Link from "umi/link";
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

    let userNo =this.props.match.params && this.props.match.params.userNo;

    dispatch({
      type: 'user/getUserByNo',
      payload: {userNo}
    });
    dispatch({
      type: 'attendance/getSummaryAttendance',
      payload: { userNo }
    });
    dispatch({
      type: 'assets/getPersonalAssetsDetails',
      payload: {userNo}
    });
    dispatch({
      type: 'assets/getChargeAssetsDetails',
      payload: {userNo}
    });
    dispatch({
      type: 'hrPerformance/getPerformanceScore',
      payload: {userNo},
    });
    dispatch({
      type: 'train/getTrainingOverview',
      payload: {userNo},
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
              <Link to="/main/hr-service">HR服务</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/user-team/pandect">团队总览</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/user-team/framework">我的团队</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>个人总览</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card
          bordered={false}
          style={{ marginTop: 16 }}
          bodyStyle={{ padding: '107px 75px' }}
        >

          <div className="userChannels">
            <Card bordered={false}>
              <div className="channel-bg baseinfo"> </div>
              <p>
                <span style={{paddingLeft: 0}} className="strength text">{userInfo.userName}</span>于<span className="strength text">{userInfo.enterTime}</span>加入亚厦，
                司龄{' '}
                <span className="strength">{userInfo.year}</span>
                年。
              </p>
              <p>
                目前任职于{' '}
                <span className="strength text">
                  {userInfo.companyName}
                  {userInfo.deptName}
                </span>
                ，担任 <span className="strength text">{userInfo.postname}</span>
                职务，职级为 <span className="strength">{userInfo.positionLevel}</span>。
              </p>
              <Button type="primary">
                <Link to={"/user-center/baseinfo?userNo="+Base64.encode(userInfo.userNo)} target="_blank">
                  详情
                </Link>
              </Button>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg performance"> </div>
              <p>
                上一年度，Ta的绩效评定结果为 <span className="strength">{performanceObj.yearPer}</span>。
              </p>
              <p>
                <Button type="primary">
                  <Link to={"/user-center/performance?userNo="+Base64.encode(userInfo.userNo)} target="_blank">
                    详情
                  </Link>
                </Button>
              </p>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg attendance"> </div>
              <p>
                本年度，Ta已出勤 <span className="strength">{aNumberData.normalWorkday}</span>
                天，出勤率为
                <span className="strength">{aNumberData.attendance}</span>%
                ；高于 <span className="strength">{aNumberData.moreAttendanceToOthers}</span>%
                的YASHAers。
              </p>
              <p>
                已经完成了
                <span className="strength">{aNumberData.travelCount}</span>
                次出差，一共出差了
                <span className="strength">{aNumberData.travelDay}</span>
                天。
              </p>
              <p>
                请假了
                <span className="strength">{aNumberData.leaveCount}</span>
                次，一共请假了 <span className="strength">{aNumberData.leaveDay}</span>
                天。
              </p>
              <p>
                Ta有
                <span className="strength">{aNumberData.goOutCount}</span>
                次因公外出，
                <span className="strength">{aNumberData.lateOrEarlyleave}</span>
                次迟到早退，
                <span className="strength">{aNumberData.absenteeism}</span>
                次旷工。
              </p>
              <Button type="primary">
                <Link to={"/user-center/attendance?userNo="+Base64.encode(userInfo.userNo)} target="_blank">
                  详情
                </Link>
              </Button>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg train"> </div>
              <p>
                本年度，Ta已参加培训 <span className="strength">{tNumberData.trainNum}</span>
                次，完成
                <span className="strength">{tNumberData.realClassHours}</span>
                培训学时，培训目标达成率为
                <span className="strength">{tNumberData.completionRate}</span>。
              </p>
              <Button type="primary">
                <Link to={"/user-center/train?userNo="+this.props.match.params.userNo} target="_blank">
                  详情
                </Link>
              </Button>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg asset"> </div>
              <p>Ta名下的资产：</p>
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
              <Button type="primary">
                <Link to={"/user-center/asset?userNo="+this.props.match.params.userNo} target="_blank">
                  详情
                </Link>
              </Button>
            </Card>
          </div>
        </Card>
      </div>
    );
  }
}
