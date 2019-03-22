import React, { Component, Fragment } from 'react';
import { Table,Tooltip } from 'antd';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';
import moment from "moment";

@connect(({ assets, loading }) => ({
  assets,
  loading: loading.models.assets,
}))
export default class ChargeSoftWareAssets extends Component {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assets/getChargeSoftwareAssetsList',
      payload: { cateName: '软件资产',type:'charge',userNo:this.props.userNo },
    });
  }

  render() {
    const {
      assets: { csList },
    } = this.props;
    const columns = [
      {
        title: '资产类别',
        dataIndex: 'secondCateName',
        key: 'thirdCateName',
        fixed: 'left',
        width: 100,
      },
      {
        title: '软件名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        fixed: 'left',
        width: 130,
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '130px',
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
        title: '资产编码',
        dataIndex: 'assetsNo',
        key: 'assetsNo',
        fixed: 'left',
        width: 150,
      },
      // {
      //   title: '软件说明',
      //   dataIndex: 'description',
      // },
      {
        title: '使用情况',
        dataIndex: 'assetsStatusStr',
        width: 100,
      },
      {
        title: '系统管理员',
        dataIndex: 'useMan',
        width: 150,
      },
      // {
      //   title: '建设方式',
      //   dataIndex: 'constructionStr',
      // },
      // {
      //   title: '责任人',
      //   dataIndex: 'chargeMan',
      // },
      // {
      //   title: '开始时间',
      //   dataIndex: 'useTime',
      //   render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      // },
      {
        title: '资产价值',
        dataIndex: 'currentValue',
        width: 100,
      },
      {
        title: '关联项目编码',
        dataIndex: 'ownProjectNo',
        width: 150,
      },
      {
        title: '关联项目名称',
        dataIndex: 'ownProject',
        width: 400,
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '400px',
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
        width:80,
        fixed: 'right',
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
        <Table  scroll={{ x: 1500 }} columns={columns} dataSource={csList} pagination={{pageSize:5,pageSizeOptions:['5','10','20'],showQuickJumper:true,showSizeChanger:true}}/>
      </div>
    );
  }
}
