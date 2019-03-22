import React, { PureComponent, Fragment } from 'react';
import { Table,Select, Input, Breadcrumb, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import styles from './index.less';
import { connect } from 'dva/index';

const columns = [
  {
    title: '公司',
    dataIndex: 'companyName',
  },
  {
    title: '部门',
    dataIndex: 'deptName',
  },
  {
    title: '岗位',
    dataIndex: 'postName',
  },
  {
    title: '编制人数',
    dataIndex: 'planNum',
  },
  {
    title: '现有人数',
    dataIndex: 'currNum',
  },
  {
    title: '详情',
    dataIndex: 'detail'
  }
];

@connect(({ teamAssets, loading }) => ({
  teamAssets,
  loading: loading.models.teamAssets,
}))
export default class AnnualEntry extends PureComponent {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
  }

  render() {
    const {
      teamAssets: { pfList, cData },
    } = this.props;
    const Search = Input.Search;
    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{padding: '16px 0', marginBottom: 16}}>
          <Breadcrumb>
            <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
            <Breadcrumb.Item><a href="/ys/user-team">团队总览</a></Breadcrumb.Item>
            <Breadcrumb.Item>团队编制</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <div>
          <Row gutter={32} className={styles.authorizedTotal}>
            <Col span={4}>
              <h5>编制人数</h5>
              <p> </p>
            </Col>
            <Col span={4}>
              <h5>现有人数</h5>
              <p> </p>
            </Col>
            <Col span={4}>
              <h5>M序列</h5>
              <p> </p>
            </Col>
            <Col span={4}>
              <h5>P序列</h5>
              <p> </p>
            </Col>
            <Col span={4}>
              <h5>A序列</h5>
              <p> </p>
            </Col>
            <Col span={4}>
              <h5>O序列</h5>
              <p> </p>
            </Col>
          </Row>
          <Table columns={columns} dataSource={[]} pagination={{pageSize:10,pageSizeOptions:['10','20','50'],showQuickJumper:true,showSizeChanger:true}} />
        </div>
      </div>
    );
  }
}
