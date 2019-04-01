import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Row, Col, Card, Drawer,Button ,Modal, Input,Layout,Tree, Table  } from 'antd';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from './index.less';
import TreeMenu from '../components/TreeMenu';
import Link from 'umi/link';
import { message } from 'antd';

const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const { Sider, Content } = Layout;



@connect(({ addressBook, loading }) => ({
  addressBook,
  loading: loading.models.addressBook,
}))

export default class AddressBook extends PureComponent {

  state = {
    selectedKey: '',
    selectedRowKeys: [],
    visibleDrawer: false,
    visible:false ,//弹窗初始化状态
    ModalTextAdd:'',
    pagination: { pageIndex: 0, pageSize: 20 },
    query:{},
    nos:"",
    personObj:{},
    deptId:'',
    companyId:''
  };

  componentDidMount(){
    const { dispatch }=this.props;
    dispatch({
      type: 'addressBook/getTableList',
      payload: {
        deptId: "1001K31000000002GLCT",
        companyId:"0001K310000000008TK6",
        pageIndex:0,
        pageSize:10
      },
    });
  }

  onClose = () => {
    this.setState({
      visibleDrawer: false,
    });
  };

  selectNode(selectedKeys, e) {
    console.log(selectedKeys)
    if (e.selected) {
      const params={
        deptId: selectedKeys[0],
        companyId:e.selectedNodes[0].props.companyId,
        pageIndex:this.state.pagination.pageIndex,
        pageSize:this.state.pagination.pageSize
      };
      this.props.dispatch({
        type: 'addressBook/getTableList',
        payload: params
      });
      this.setState({
        query:params,
      });
    }
  }

  // 点击分页改变时，触发的函数
  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const deptId = this.state.query.deptId;
    const companyId = this.state.query.companyId;
    const params={
      pageIndex:pagination.current-1,
      pageSize:pagination.pageSize,
      deptId:deptId==undefined ? '1001K31000000002GLCT':deptId,
      companyId:companyId==undefined ? '0001K310000000008TK6':companyId
    };
    dispatch({
      type: 'addressBook/getTableList',
      payload:params,
    });
    this.setState({
      query:params
    })
  };

  showDrawer=(record)=>{
    // console.log(record)
    this.setState({
      personObj:record,
      visibleDrawer:true,
    })

  };

  // 搜索table数据
  doSearch=( value )=>{
    const { dispatch } = this.props;
    const params={
        keyword: value,
        pageIndex:this.state.pagination.pageIndex,
        pageSize:this.state.pagination.pageSize
      };
    dispatch({
      type: 'addressBook/getTableList',
      payload:params
    });
    this.setState({
      query:params
    })
  };


  onSelectChange=(selectedRowKeys, selectedRows) => {
    let no = '';
    for(let i=0;i<selectedRows.length; i++){
      no += selectedRows[i].no+",";
    }
    if(no.length>0) no=no.substr(0,no.length-1);

    this.setState({
      selectedRowKeys,
      nos:no
    })
    console.log(no)
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }

  // 添加到常用联系人
  addContactPer = ()=> {
    const { dispatch }=this.props;
    const { selectedRowKeys  }=this.state;
    const hasSelected = selectedRowKeys.length >0;
    console.log(hasSelected);
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
        payload:{contactNo:this.state.nos}
      })
    }
  };

  //移除常用联系人
  delContactPer = ()=> {
    const { dispatch }=this.props;
    const { selectedRowKeys  }=this.state;
    const hasSelected = selectedRowKeys.length >0;
    console.log(hasSelected);
    if(!hasSelected){
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
        payload: {contactNo:this.state.nos}
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


  render() {
    const {
      addressBook: {  list,pagination },
      loading,
    } = this.props;
    const { selectedRowKeys,visible ,ModalTextAdd, personObj }=this.state;
    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: 150,
        render:(text,record)=> {
          return record.gender === 1 ? <span><Icon type="smile" theme="twoTone"/> {text} </span> :
            <span><Icon type="heart" theme="twoTone" twoToneColor="#eb2f96"/> {text} </span>
        }
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

    const showDrawers=()=>{
        return (
          <Drawer
            placement="right"
            mask={false}
            closable={true}
            onClose={this.onClose}
            width={830}
            style={{position:'absolute',top:180}}
            visible={this.state.visibleDrawer}
          >
            <Row>
              <Col span={18} push={6}>
                <div className={styles.RightBox}>
                  <ul className={styles.boxTopMsg}>
                    <li>性别 ：<span>{personObj.gender===1?'男':'女'}</span></li>
                    <li>部门 ：<span>{personObj.deptName}</span></li>
                    <li>岗位 ：<span>{personObj.jobStation}</span></li>
                    <li>办公地址 ：<span>{personObj.workAddress}</span></li>
                  </ul>
                  <ul className={styles.boxBotMsg}>
                    <li>手机 ：<span>{personObj.mobile}</span></li>
                    <li>短号 ：<span>{personObj.shortPhone}</span></li>
                    <li>座机号码 ：<span>{personObj.companyMobile}</span></li>
                    <li>座机短号 ：<span>{personObj.shortWorkPhone}</span></li>
                    <li>邮箱 ：<span>{personObj.email}</span></li>
                  </ul>
                </div>
              </Col>
              <Col span={6} pull={18} style={{background:'#FAFAFA'}}>
                <div className={styles.LeftBox}>
                  <div className={styles.headerImg}>
                    <img src={'http://file.chinayasha.com'+ personObj.headImg} alt=""/>
                  </div>
                  <h5 className={styles.perName}>{personObj.name}</h5>
                  <p className={styles.perPost}>{personObj.jobStation}</p>
                  <p className={styles.perUnit}>{personObj.deptName}</p>
                  <div className={styles.btnGroup}>
                    <Button type="primary">添加到常用联系人</Button>
                    <Link to={'mailto:'+personObj.email}>
                      <Button className={styles.btnEmail}>发邮件</Button>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Drawer>
        )
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
                <TreeMenu
                  onSelect={this.selectNode.bind(this)}
                  defaultExpandedKeys={[ '1001K31000000002GLCT']}
                  defaultSelectedKeys={[ '1001K31000000002GLCT']} />
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
                   <Search placeholder="姓名/部门名称" onSearch={this.doSearch} style={{position:'relative',top: -8}}/>
                 </Col>
              </Row>
              <Table
                columns={columns}
                dataSource={list}
                pagination={pagination}
                scroll={{ y: 640 }}
                rowSelection={rowSelection}
                onChange={this.handleTableChange}
                onRow={(record) => {
                  return {
                    onClick: (event) => {this.showDrawer(record) },       // 点击行
                  };
                }}
              />
            </Content>
          </Layout>
          {showDrawers()}
        </PageHeaderWrapper>
    );
  }
}

//http://file.chinayasha.com/p-head/2017/12/20/8a8a94aa6059716b016071f33d2002fb.jpg
//http://file.chinayasha.com/p-head/2017/12/13/00000000602edd7001604f193af80543.jpg
//http://hometest.chinayasha.com

