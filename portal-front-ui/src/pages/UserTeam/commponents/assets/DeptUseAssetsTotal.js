import React, { PureComponent,Component, Fragment  } from 'react';
import { Input,List,Table,Select,Map } from 'antd';
import { connect } from 'dva/index';

@connect(({ teamAssets, loading }) => ({
  teamAssets,
  loading: loading.models.teamAssets,
}))
export default class DeptUseAssetsTotal extends Component {
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
      <div >
        <div>
          <Table columns={columns} dataSource={deptAssetsNumber.deptUseAssets} pagination={false} />
        </div>
      </div>
    );
  }
}
