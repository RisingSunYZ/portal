import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva/index';

@connect(({ assets, loading }) => ({
  assets,
  loading: loading.models.assets,
}))
export default class ChargeAssetsDetails extends PureComponent {
  state = {
    userNo:'',
  };
  componentDidMount() {
    this.setState({
      userNo:this.props.userNo
    }, function() {
      const { dispatch } = this.props;
      dispatch({
        type: 'assets/getChargeAssetsDetails',
        payload: this.state,
      });
    });

  }

  render() {
    const {
      assets: { cData },
      // loading,
    } = this.props;
    return (
      <Card bordered={false}  bodyStyle={{padding: 0}}>
        <div>
          <div>
            <span >
              <span className={styles.ptzt}>
                我的责任资产总
                <span className={styles.number}>
                  {cData.caNumber}
                </span>
                件、固定资产
                <span className={styles.number}>
                  {cData.cfNumber}
                </span>
                件、
              </span>
            </span>
          {/*</div>*/}
          {/*<div style={{ marginTop: 10 }}>*/}
            <span>
              <span className={styles.ptzt}>
                软件资产
                <span className={styles.number}>
                  {cData.csNumber}
                </span>
                件
              </span>
            </span>
          </div>
        </div>
      </Card>
    );
  }
}
