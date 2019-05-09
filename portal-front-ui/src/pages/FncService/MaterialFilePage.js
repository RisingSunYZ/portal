//财务服务--下载详情页面
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs, Table, Card} from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import {getConfig} from "../../utils/utils";

@connect(({ fncService, loading }) => ({
  fncService,
  loading: loading.models.fncService,
}))

export default class FncService extends PureComponent {

  state = {
    activeKey: null,
    page: 0,
    pageSize: 15,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fncService/getMaterialTypeList',
      callback: (res)=>{
        if(res.data && res.data.length){
          this.setState({
            activeKey: res.data[0].id
          });
          this.loadFileListByType(res.data[0].id);
        }
      }
    });
  }

  loadFileListByType = (activeKey) => {
    const { page, pageSize } = this.state;
    this.props.dispatch({
      type: 'fncService/fetchMaterialFiles',
      payload: {
        typeId: activeKey,
        pageIndex: page,
        pageSize,
      },
    });
  };

  tabsChange = (val) => {
    this.setState({
      activeKey: val,
      page: 0,
      pageSize: 15
    }, ()=>{
      this.loadFileListByType(val);
    })
  };

  download = ({filePath, name}) => {
    const address = `${getConfig().domain}/rest/portal/file-operation/download?path=${encodeURIComponent(filePath)}&name=${encodeURIComponent(name)}`;
    return <a href={address} target="_blank">下载</a>
  };
  previewFile = (name, {filePath}) => {
    const address = `${getConfig().domain}/common/fileOnline.jhtml?downloadUrl=${encodeURIComponent(filePath)}&htmlName=${encodeURIComponent(name)}`;
    return <a href={address} target="_blank">{name}</a>
  };

  //页面变化时执行
  handleStandardTableChange = (pagination) => {
    this.setState({
      page: pagination-1
    }, () => {
      this.loadFileListByType(this.state.activeKey);
    });
  };

  //pageSize 变化的回调
  showSizeChange = (current, size) => {
    this.setState({
        pageSize: size,
      }, () => {
        this.loadFileListByType(this.state.activeKey);
      });
  };

  render() {
    const {loading, fncService: {typeList, materialFiles}} = this.props;
    const columns = [
      { title: '文件名称', dataIndex: 'name', key: 'name',render: this.previewFile },
      { title: '文件大小(MB)', dataIndex: 'fileSize', key: 'fileSize' },
      { title: '文件描述', dataIndex: 'remark', key: 'remark' },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
      {title: '操作', dataIndex: '', key: 'id', render: this.download },
    ];

    return (
     <PageHeaderWrapper>
       <Card bordered={false} bodyStyle={{padding: '16px 24px'}}>
         <Tabs onChange={this.tabsChange}>
           {typeList && typeList.length && typeList.map((type)=>(
             <Tabs.TabPane tab={type.name} key={type.id} />
           ))}
         </Tabs>
         <Table
           loading={loading}
           columns={columns}
           dataSource={materialFiles.data}
           rowKey={record => record.id}
           pagination={{
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
          }}
         />
       </Card>
     </PageHeaderWrapper>
    );
  }
}
