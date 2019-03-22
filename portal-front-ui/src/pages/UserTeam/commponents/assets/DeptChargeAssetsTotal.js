import React, { PureComponent } from 'react';
import { Input,List,Table,Map } from 'antd';
import { connect } from 'dva/index';

@connect(({ teamAssets, loading }) => ({
  teamAssets,
  loading: loading.models.teamAssets,
}))
export default class DeptChargeAssetsTotal extends PureComponent {
  render() {
    const {
      teamAssets: { deptAssetsNumber },
    } = this.props;
    const columns = [
      {
        title: '总资产',
        dataIndex: 'totalNumber',
      },
      {
        title: '固定资产',
        dataIndex: 'fixedNumber',
      },
      {
        title: '软件资产',
        dataIndex: 'softWareNumber',
      },
    ];
    return (
      <div>
        <Table columns={columns} dataSource={deptAssetsNumber.deptChargeAssets} pagination={false} />
      </div>
    );
  }
}
