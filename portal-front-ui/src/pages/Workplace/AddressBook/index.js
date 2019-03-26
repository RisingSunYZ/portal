import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Row, Col, Card, Menu, Drawer,Button ,Modal, Input, Dropdown, List,Layout, Radio, Tree, Table  } from 'antd';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from './index.less';
import TreeMenu from '../components/TreeMenu';
import DeptTree from '../components/DeptTree/DeptTree';
import { message } from 'antd';
const TreeNode = Tree.TreeNode;

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const { Header, Sider, Content } = Layout;



@connect(({ addressBook, loading }) => ({
  addressBook,
  loading: loading.models.addressBook,
}))

export default class AddressBook extends PureComponent {
  searchFormObj = {};
  state = {
    selectedKey: '',
    selectedRowKeys: [],
    visibleDrawer: false,
    visible:false ,//弹窗初始化状态
    ModalTextAdd:''
  };

  componentDidMount(){

  }

  //展示隐藏抽屉
  showDrawer = () => {
    this.setState({
      visibleDrawer: true,
    });
  };

  onClose = () => {
    this.setState({
      visibleDrawer: false,
    });
  };

  selectNode(selectedKeys, e) {
    if (e.selected) {
      this.searchFormObj.categoryId = selectedKeys[0];
      this.props.dispatch({
        type: 'addressBook/getModelList',
        payload: { categoryId: selectedKeys[0] },
      });
      this.setState({
        selectedKey: selectedKeys[0],
      });
    }
  }



  doSearch(modelName) {
    this.searchFormObj.name = modelName;
    //如果右侧点击我的草稿，则搜索我的草稿，其他则搜索全部流程模板，
    this.props.dispatch({
      type: 'addressBook/getModelList',
      payload: {
        name: modelName,
        categoryId: this.state.selectedKey == 'myDraft' ? this.state.selectedKey : '',
      },
    });
  }

  handleDel(businessKey) {
    this.props.dispatch({
      type: 'addressBook/delDraft',
      payload: {
        businessKey: businessKey,
      },
    });
  }


  // 添加到常用联系人
  addContactPer = ()=> {
    const { dispatch }=this.props;
    const { selectedRowKeys  }=this.state;
    const hasSelected = selectedRowKeys.length >0;
    console.log(hasSelected);
    // debugger;
    if(!hasSelected){
      //点击显示 弹出框
      this.setState({
        visible: true,
        ModalTextAdd:'请勾选要添加的项！'
      });
      //间隔一段时间，让弹出框消失
      setTimeout(() => {
        this.setState({
          visible: false,
        });
      }, 500);
      return;

    }else{
      dispatch({
        type:'addressBook/addContactPer',
        payload:selectedRowKeys
      })
    }
  };

  //移除常用联系人
  delContactPer = ()=> {
    const { dispatch }=this.props;
    const { selectedRowKeys  }=this.state;
    const hasSelected = selectedRowKeys.length >0;
    console.log(hasSelected);
    // debugger;
    if(!hasSelected){
      // message.error('请选择！')
      //点击显示 弹出框
      this.setState({
        visible: true,
        ModalTextAdd:'请先勾选要移除的项！'
      });
      //间隔一段时间，让弹出框消失
      setTimeout(() => {
        this.setState({
          visible: false,
        });
      }, 500);
      return;

    }else{
      dispatch({
        type:'addressBook/delContactPer',
        payload: selectedRowKeys
      })
    }
  };

  //发送邮件
  sendEmail= ()=>{
    const { selectedRowKeys  }=this.state;
    const hasSelected = selectedRowKeys.length >0;
    // console.log(hasSelected);
    if(!hasSelected){
      //点击显示 弹出框
      this.setState({
        visible: true,
        ModalTextAdd:'请先勾选邮件发送对象！'
      });
      //间隔一段时间，让弹出框消失
      setTimeout(() => {
        this.setState({
          visible: false,
        });
      }, 500);
      return;
    }
  };


  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { keyword, deptId } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      keyword,
      ...filters,
      deptId,

    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'user/getAllUser',
      payload: params,
    });

  };


  onSelectChange=(selectedRowKeys, selectedRows) => {
      let nos = '';
      for(let i=0;i<selectedRowKeys.length; i++){
      nos += selectedRowKeys[i]+",";
    }
    if(nos.length>0) nos=nos.substr(0,nos.length-1);

    this.setState({selectedRowKeys:nos})
    console.log(nos)
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }

  render() {
    const {
      addressBook: { list, data ,pagination},
      loading,
    } = this.props;
    const { selectedRowKeys,visible ,ModalTextAdd }=this.state;

    const hasSelected = selectedRowKeys.length > 0;
    // console.log(hasSelected)
    // console.log(55)

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      width: 150
    },
      {
        title: '工号',
        dataIndex: 'jobNum',
        width: 150
      },
      {
        title: '企业邮箱',
        dataIndex: 'email',
      },
      {
        title: '单位',
        dataIndex: 'address',
      },
      {
        title: '部门',
        dataIndex: 'department',
      },
      {
        title: '岗位',
        dataIndex: 'post',
      },
      {
        title: '短号',
        dataIndex: 'shortNum',
      }];

    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
        <PageHeaderWrapper>
          <Layout>
            <Sider>
              <Card
                title="企业通讯录"
                bordered={false}
                headStyle={{ borderLeft: '1px solid #e5e5e5', borderRight: '1px solid #e5e5e5',borderBottom:'2px solid #0E65AF',color:'#0E65AF',fontSize:'14px' }}
                bodyStyle={{ padding: '0' }}
              >
                {/*<DeptTree onSelect={this.selectNode} />*/}
                <TreeMenu onSelect={this.selectNode.bind(this)} />
              </Card>
            </Sider>
            <Content>
              <Row style={{marginTop:'12px'}}>
                {
                 this.state.selectedKey == 'TOP-CONTACTS' ? (
                   <Col span={1} className={styles.colHeader}>
                     {!hasSelected ? (
                       <div onClick={this.delContactPer} className={styles.setDisable}>
                         <Icon type="delete" className={styles.icon}/>
                         <span className={styles.text}>移除</span>
                       </div>
                     ):(
                       <div onClick={this.delContactPer}>
                         <Icon type="delete" className={styles.icon}/>
                         <span className={styles.text}>移除</span>
                       </div>
                     )}
                   </Col>
                 ) : (
                  <Col span={2} className={styles.colHeader}>
                    {!hasSelected ? (
                      <div onClick={this.addContactPer} className={styles.setDisable}>
                        <Icon type="plus" className={styles.icon}/>
                        <span className={styles.text}>添加到常用联系人</span>
                      </div>
                    ):(
                      <div onClick={this.addContactPer}>
                        <Icon type="plus" className={styles.icon}/>
                        <span className={styles.text}>添加到常用联系人</span>
                      </div>
                    )}
                    <Modal
                      visible={visible}
                      footer={null}
                      closable={false}
                      centered
                      bodyStyle={{backgroundColor:'#5C5C5C',color:'#fff',textAlign:'center'}}
                      maskStyle={{backgroundColor:'#E6E6E6'}}>
                      <p>{ModalTextAdd}</p>
                    </Modal>
                  </Col>
                 )
               }
                 <Col span={2} className={styles.colHeader}>
                   {!hasSelected ? (
                     <div onClick={this.sendEmail} className={styles.setDisable}>
                       <Icon type="mail" className={styles.icon}/>
                       <span className={styles.text}>发邮件</span>
                     </div>
                   ):(
                     <div onClick={this.sendEmail}>
                       <Icon type="mail" className={styles.icon}/>
                       <span className={styles.text}>发邮件</span>
                     </div>
                   )}
                 </Col>
                 <Col span={4}>
                   <Search placeholder="姓名/部门名称" onSearch={value => console.log(value)} style={{position:'relative',top: -8}}/>
                   {/*<Search*/}
                   {/*placeholder={*/}
                   {/*this.state.selectedKey == 'TOP-CONTACTS' ? '搜索我的草稿' : '搜索流程模板'*/}
                   {/*}*/}
                   {/*onSearch={this.doSearch.bind(this)}*/}
                   {/*style={{ width: '100%' }}*/}
                   {/*/>*/}
                 </Col>
              </Row>
              <Table
                columns={columns}
                dataSource={list}
                pagination={{showSizeChanger: true, showQuickJumper: true,...pagination}}
                scroll={{ y: 260 }}
                size="middle"
                rowKey="no"
                rowSelection={rowSelection}
                onChange={this.handleTableChange}
              />
            </Content>
          </Layout>
        </PageHeaderWrapper>
    );
  }
}

