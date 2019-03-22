import React, { PureComponent, Fragment } from 'react';
import { Table,Select, Input, Breadcrumb, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';

const columns = [
  {
    title: '入职人员姓名',
    dataIndex: 'name',
  },
  {
    title: '工号',
    dataIndex: 'no',
  },
  {
    title: '岗位',
    dataIndex: 'postName',
  },
  {
    title: '入职时间',
    dataIndex: 'joinTime',
  },
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
            <Breadcrumb.Item>年度入职</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <div>
          <Row style={{padding: '16px 0'}}>
            <Col span={4}>

            </Col>
            <Col offset={16} span={4}>
              <Search
                placeholder="姓名/岗位"
                value={this.state.keyWord}
              />
            </Col>
          </Row>
          <Table columns={columns} dataSource={[]} pagination={{pageSize:10,pageSizeOptions:['10','20','50'],showQuickJumper:true,showSizeChanger:true}} />
        </div>
      </div>
    );
  }
}
