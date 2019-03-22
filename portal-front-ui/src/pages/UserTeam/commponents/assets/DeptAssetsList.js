import React, { Component, Fragment } from 'react';
import { Table, Select, Input,Tooltip } from 'antd';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import styles from '../../Assets/index.less';
import { connect } from 'dva/index';

@connect(({ teamAssets, loading }) => ({
  teamAssets,
  loading: loading.models.teamAssets,
}))
export default class DeptAssetsList extends Component {
  constructor(props) {
    super(props);
  }
  state = {};
  componentDidMount() {
    //const { dispatch } = this.props;
    /*dispatch({
      type: 'teamAssets/getPersonalFixedAssetsList',
      payload: { cateName: '固定资产',type:'use' },
    });
    dispatch({
      type: 'teamAssets/getChargeFixedAssetsList',
      payload: this.state,
    });*/
  }

  pageNumberChange = (pagination, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      page: pagination,
      rows: filtersArg,
      ...filters,
    };
    this.props.onPageChange(params);
  };

  pageSizeChange = (pagination, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      page: 1,
      rows: filtersArg,
      ...filters,
    };
    this.props.onPageChange(params);
  };

  render() {
    const {
      teamAssets: { data },
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'num',
        width: 80,
        render: (text, r, i) => <span>{i + 1}</span>,
      },
      {
        title: '资产类型',
        dataIndex: 'assetsType',
        width: 100,
      },
      {
        title: '资产编码',
        dataIndex: 'assetsNo',
        width: 150,
      },
      {
        title: '物品名称',
        dataIndex: 'goodsName',
        width: 150,
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '150px',
              overflow: 'hidden',
            }}
          >
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          </div>
        ),
      },
      {
        title: '使用人',
        dataIndex: 'useMan',
        width: 80,
      },
      {
        title: '使用部门',
        dataIndex: 'useDept',
        width: 150,
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '150px',
              overflow: 'hidden',
            }}
          >
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          </div>
        ),
      },
      {
        title: '资产状态',
        dataIndex: 'assetsStatus',
        width: 90,
      },
      {
        title: '存放位置',
        dataIndex: 'storePlace',
        width: 200,
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '200px',
              overflow: 'hidden',
            }}
          >
            <Tooltip placement="topLeft" title={text}>
              {text}
            </Tooltip>
          </div>
        ),
      },
      {
        title: '详情',
        key: 'action',
        width: 60,
        render: (text, record) => {
          let url = '/portal/rscmgmt/myApply/myAssetsView.jhtml?id=' + record.id;
          return (
            <span>
              <a href={url} target="_blank">
                查看
              </a>
            </span>
          );
        },
      },
    ];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={data.list}
          pagination={{
            pageSize: data.pagination.pageSize,
            current:data.pagination.current+1,
            pageSizeOptions: ['5', '10', '20'],
            showQuickJumper: true,
            showSizeChanger: true,
            total:data.pagination.total,
            onChange:this.pageNumberChange,
            onShowSizeChange:this.pageSizeChange,
            showTotal: function () {  //设置显示一共几条数据
              return '共 ' + data.pagination.total + ' 条数据';
            }
          }}
        />
      </div>
    );
  }
}
