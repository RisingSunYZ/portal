import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva/index';

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
export default class HrRecruit extends PureComponent {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserByNo',
      payload: '00004907',
    });
  }

  render() {
    const {
      user: { userInfo },
      loading,
    } = this.props;
    return (
      <Card
        bordered={true}
        style={{ marginBottom: 24 }}
        loading={loading}
        actions={[
          <div>
            考勤情况
            <Icon type="setting" />
          </div>,
          <div>
            我的学时
            <Icon type="setting" />
          </div>,
          <div>更多</div>,
        ]}
      >
        {userInfo && Object.keys(userInfo).length ? (
          <div style={{ textAlign: 'center' }}>
            <div className={styles.avatarHolder}>
              <img alt="" src={userInfo.userHead} />
            </div>
            <div className={styles.name}>
              <p>{userInfo.userName}</p>
            </div>
            <div className={styles.detail}>
              <p>{userInfo.deptName}</p>
              <p>
                {userInfo.postname} {userInfo.positionLevel}
              </p>
            </div>
          </div>
        ) : (
          'loading...'
        )}
      </Card>
    );
  }
}
