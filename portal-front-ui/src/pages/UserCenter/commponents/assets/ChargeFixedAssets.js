import React, { Component, Fragment } from 'react';
import { Table,Tooltip } from 'antd';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';

@connect(({ assets, loading }) => ({
  assets,
  loading: loading.models.assets,
}))
export default class ChargeFixedAssets extends Component {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assets/getChargeFixedAssetsList',
      payload: { cateName: '固定资产',type:'charge',userNo:this.props.userNo },
    });
  }

  render() {
    const {
      assets: { cfList },
    } = this.props;
    const columns = [
      {
        title: '资产类别',
        dataIndex: 'secondCateName',
        width: 130,
      },
      {
        title: '资产编码',
        dataIndex: 'assetsNo',
        width: 150,
      },
      {
        title: '资产状态',
        dataIndex: 'assetsStatusStr',
        width: 90,
      },
      {
        title: '物品名称',
        dataIndex: 'goodsName',
        width: 140,
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '140px',
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
        title: '规格型号',
        dataIndex: 'proModel',
        width: 100,
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100px',
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
        title: '序列号',
        dataIndex: 'serialNo',
        width: 100,
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100px',
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
        title: '责任人',
        dataIndex: 'chargeMan',
        width: 80,
      },
      {
        title: '存放位置',
        dataIndex: 'storePlace',
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
        <Table columns={columns} dataSource={cfList} pagination={{pageSize:5,pageSizeOptions:['5','10','20'],showQuickJumper:true,showSizeChanger:true}} />
      </div>
    );
  }
}
