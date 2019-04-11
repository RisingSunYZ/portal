//财务服务--下载详情页面
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs, Table} from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import {getConfig} from "../../utils/utils";

@connect(({ fncService, loading }) => ({
  fncService,
  loading: loading.models.fncService,
}))

export default class FncService extends PureComponent {

  state = {
    activeKey: '8a8a8c3a5ec10cf2015f04049ce9033d',
    page: 1,
    rows: 15,
    pageSize: 15,
    current: 1,
  };

  componentDidMount() {
    this.reqData()
  }

  tabsChange = (val) => {
    this.setState({
      activeKey: val,
      page: 1,
      pageSize: 15
    }, ()=>{
      this.reqData();
    })
  };

  reqData = () => {
    this.props.dispatch({
      type: 'fncService/fetchMaterialFiles',
      payload: {
        typeId: this.state.activeKey,
        page: this.state.page,
        rows: this.state.pageSize,
      },
    })
  };

  download = ({filePath, name}) => {
    const address = getConfig().domain + '/rest/portal/file-operation/download?' +
      'path=' + encodeURIComponent(filePath) +
      '&name=' + encodeURIComponent(name);
    return <a href= {address} >下载</a>
  };

  //页面变化时执行
  handleStandardTableChange = (pagination, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    this.setState(
      {
        current: pagination,
        page: pagination,
        rows: filtersArg,
        pageSize: filtersArg,
      },
      () => {
        this.reqData();
      }
    );
  };

  //pageSize 变化的回调
  showSizeChange = (current, size) => {
    this.setState(
      {
        current: 1,
        page: 1,
        rows: size,
        pageSize: size,
      },
      () => {
        this.reqData();
      }
    );
  };

  render() {

    const columns = [
      { title: '文件名称', dataIndex: 'fileName', key: 'fileName' },
      { title: '文件大小(MB)', dataIndex: 'fileSize', key: 'fileSize' },
      { title: '文件描述', dataIndex: 'remark', key: 'name' },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
      {title: '操作', dataIndex: '', key: 'id', render: this.download },
    ];


    const {fncService: {materialFiles}} = this.props;

    const paginationSet = {
      current: this.state.current,
      pageSize: this.state.pageSize,
      pageSizeOptions: ['15', '30', '60'],
      showQuickJumper: true,
      showSizeChanger: true,
      total: materialFiles.total,
      onChange: this.handleStandardTableChange,
      onShowSizeChange: this.showSizeChange,
      showTotal: function() {
        //设置显示一共几条数据
        return <div style={{ marginLeft: 0 }}>共 {materialFiles.total} 条数据</div>;
      },
    };

    const materialData = materialFiles ? (materialFiles.data?materialFiles.data:[]) : [];

    return (
     <PageHeaderWrapper>
       <Tabs onChange={this.tabsChange}>
         <Tabs.TabPane tab="管理制度" key="8a8a8c3a5ec10cf2015f04049ce9033d">
         </Tabs.TabPane>
         <Tabs.TabPane tab="项目核算" key="8a8a8c3a5ec10cf2015ec2907a59000e">
         </Tabs.TabPane>
         <Tabs.TabPane tab="费用报销" key="8a8a8c3a5ec10cf2015ec2901e94000d">
         </Tabs.TabPane>
         <Tabs.TabPane tab="财务报告" key="8a8a8c3a5f04d252015f4d14027f0048">
         </Tabs.TabPane>
       </Tabs>
       <Table columns={columns} dataSource={materialData} rowKey={record => record.id}  pagination={paginationSet} />
     </PageHeaderWrapper>
    );
  }
}
