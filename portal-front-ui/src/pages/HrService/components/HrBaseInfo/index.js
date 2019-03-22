import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import styles from './index.less';
import { connect } from 'dva/index';

@connect(({ user, hrService, loading }) => ({
  user,
  hrService,
  loading: loading.models.user,
}))
export default class HrBaseInfo extends PureComponent {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserByNo',
      payload: '',
    });
    dispatch({
      type: 'hrService/checkPersonExp',
    });
  }

  render() {
    const {
      isLeader,
      user: { userInfo },
      hrService: { attendanceData },
      loading,
    } = this.props;
    return (
      <Card
        className="hrUserModule"
        style={{ width: 310, height: 200, display: 'inline-block' }}
        bordered={false}
        loading={loading}
        bodyStyle={{ padding: 0 }}
        actions={[
          <div className="actionBtn">
            {attendanceData == '1' ? (
              <a href="/ys/user-center/attendance/record" target="_blank">
                考勤情况
                <Icon
                  type="close-circle"
                  theme="filled"
                  style={{ fontSize: 20, marginLeft: 5, color: 'red' }}
                />
              </a>
            ) : (
              <a href="/ys/user-center/attendance" target="_blank">
                考勤情况
                <Icon
                  type="check-circle"
                  theme="filled"
                  style={{ fontSize: 20, marginLeft: 5, color: '#52C41A' }}
                />
              </a>
            )}
          </div>,
          <div className="actionBtn">
            <a href="/ys/user-center/train" target="_blank">我的学时
              <span className="learnHours">0</span>
            </a>
          </div>,
          <div className="actionBtn">
            <a href="/ys/user-center" target="_blank">更多</a>
          </div>,
        ]}
      >
        {userInfo && Object.keys(userInfo).length ? (
          <div style={{ textAlign: 'center' }}>
            <div className={styles.avatarHolder}>
              <img alt="" src={userInfo.userHead} />
            </div>
            <div className={styles.infoBox}>
              <div className={styles.name}>{userInfo.userName}</div>
              <div className={styles.detail}>
                <p title={userInfo.deptName}><Ellipsis length={12}>{userInfo.deptName}</Ellipsis></p>
                <p title={userInfo.postname}><Ellipsis length={12}>{userInfo.postname}</Ellipsis></p>
                <p>
                  {userInfo.positionLevel}
                  {isLeader?(<a href="/ys/user-team" target="_blank" className={styles.teamBtn}>我的团队</a>):""}
                </p>
              </div>
            </div>
          </div>
        ) : (
          'loading...'
        )}
      </Card>
    );
  }
}
