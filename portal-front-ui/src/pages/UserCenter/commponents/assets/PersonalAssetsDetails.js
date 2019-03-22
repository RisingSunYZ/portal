import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva/index';

@connect(({ assets, loading }) => ({
  assets,
  loading: loading.models.assets,
}))
export default class PersonalAssetsDetails extends PureComponent {
  state = {
    userNo:'',
  };
  componentDidMount() {
    this.setState({
      userNo:this.props.userNo
    }, function() {
      const { dispatch } = this.props;
      dispatch({
        type: 'assets/getPersonalAssetsDetails',
        payload: this.state,
      });
    });

  }


  // initFunction = (value) => {
  //   console.log(value);
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'assets/getPersonalAssetsDetails',
  //     // payload: { useManId: '00004907' },
  //   });
  // };

  render() {
    const {
      assets: { pData },
      // loading,
    } = this.props;
    return (
      <Card bordered={false}  bodyStyle={{padding: 0}}>
        <div>
          <div>
            <span>
              <span className={styles.ptzt}>
                我的个人资产总
                <span className={styles.number}>
                  {pData.paNumber}
                </span>
                件、固定资产
                <span className={styles.number}>
                  {pData.pfNumber}
                </span>
                件、
              </span>
            </span>
          {/*</div>*/}
          {/*<div style={{ marginTop: 10 }} className={styles.detail}>*/}
            <span>
              <span className={styles.ptzt}>
                软件资产
                <span className={styles.number}>
                  {pData.psNumber}
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
