import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, List } from 'antd';
import styles from './index.less';

@connect(({ newsInfo, loading }) => ({
  newsInfo,
  loading: loading.models.newsInfo,
}))

class StaffPhoto extends PureComponent {

  state = {

  };

  componentDidMount() {


  }


  render() {
    const { } = this.props;


    return (
      <Fragment>
        <Row gutter={16}>
          <Col span={16}>

          </Col>
          <Col span={8}>

          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default StaffPhoto
