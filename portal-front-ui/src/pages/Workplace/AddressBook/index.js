import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col, Card, Drawer,Button ,Input,Layout,Table ,message } from 'antd';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from './index.less';
import TreeMenu from '../components/TreeMenu';
import Link from 'umi/link';
import {getConfig} from "../../../utils/utils";


const Search = Input.Search;
const { Sider, Content } = Layout;


@connect(({ user,addressBook, loading }) => ({
  user,
  addressBook,
  loading: loading.models.addressBook,
}))

class AddressBook extends PureComponent {

  state = {
    selectedKey: [],
    selectedRowKeys: [],
    visibleDrawer: false,
    visible:false ,//弹窗初始化状态
    pagination: { pageIndex: 0, pageSize: 20 },
    query:{},
    nos:"",
    personObj:{},
    deptId:'',
    companyId:'',
    selectTreeStr:"",
    key:""
  };

  componentDidMount(){
    const { dispatch, user:{ currentUser } }=this.props;
    dispatch({
      type: 'addressBook/getTableList',
      payload: {
        deptId: currentUser.depId,
        companyId:currentUser.companyId,
        pageIndex:0,
        pageSize:10
      },
    });
    this.setState({
      selectTreeStr:currentUser.depId
    })
  }

  onClose = () => {
    this.setState({
      visibleDrawer: false,
    });
  };

  // 树的点击事件
  selectNode(selectedKeys, e) {
    const key=e.selectedNodes[0].key;
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
        selectedKey:selectedKeys,
        companyId:params.companyId,
        selectTreeStr:key
      });
    }
  }

  // 点击分页改变时，触发的函数
  handleTableChange = (pagination) => {
    const { dispatch ,user:{ currentUser }} = this.props;
    const deptId = this.state.query.deptId;
    const companyId = this.state.query.companyId;
    const params={
      pageIndex:pagination.current-1,
      pageSize:pagination.pageSize,
      deptId:deptId === undefined ? currentUser.deptId : deptId,
      companyId:companyId === undefined ? currentUser.companyId : companyId
    };
    dispatch({
      type: 'addressBook/getTableList',
      payload:params,
    });
    this.setState({
      query:params
    })
  };

  // 显示右侧抽屉
  showDrawer=(record)=>{
    console.log(record);
    this.setState({
      personObj:record,
      visibleDrawer:true,
    })
  };

  // 跳到树目录
  skipMenuTree=(record)=>{
    const { dispatch }=this.props;
    const {companyId, pagination:{pageIndex,pageSize }} = this.state;
    const  params={
      deptId: record.deptId,
      companyId:companyId,
      pageIndex:pageIndex,
      pageSize:pageSize
    };

    if(record.gender === null){
      dispatch({
        type: 'addressBook/getTableList',
        payload: params
      });
      this.setState({
        selectTreeStr:record.deptId,
      })
    }

    this.setState({
      query:params,
    });
  };

  // 搜索table数据
  doSearch=( value )=>{
    const { dispatch } = this.props;
    const {pagination:{pageIndex,pageSize}}=this.state;
    const params={
        keyword: value,
        pageIndex:pageIndex,
        pageSize:pageSize
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
    });
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  };

  // Drawer添加到常用联系人
  drawerAddContactPer=()=>{
    const { dispatch }=this.props;
    const { personObj  }=this.state;
    dispatch({
      type:'addressBook/addContactPer',
      payload:{contactNo:personObj.no}
    })
  };

  // (页面头部)添加到常用联系人
  addContactPer = ()=> {
    const { dispatch }=this.props;
    const { selectedRowKeys  }=this.state;
    const hasSelected = selectedRowKeys.length >0;
    if(!hasSelected){
      message.error('请勾选要添加的项');
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
    if(!hasSelected){
      message.error('请先勾选要移除的项！');
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
    if(!hasSelected){
      message.error('请先勾选邮件发送对象！');
      return;
    }
  };

  // 根据gender区分人员
  disGender=(text,record) =>{
    if( record.gender === 1 ){
      return <span><Icon type="smile" theme="twoTone"/> {text} </span>
    }else if( record.gender===2 ){
      return <span><Icon type="heart" theme="twoTone" twoToneColor="#eb2f96"/> {text} </span>
    }else{
      return <span style={{color:'#0E65AF',cursor:'pointer'}}><Icon type="branches" /> {text} </span>
    }
  };

  // 区分人员与部门
  disDepartment=(text,record)=>{
    return ( record.gender===null ? <span style={{color:'#0E65AF'}}>{text}</span> : <span>{text}</span>)
  };


  render() {
    const { addressBook: {  list, pagination } } = this.props;
    const { selectedRowKeys, personObj ,selectTreeStr}=this.state;
    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: 150,
        render:this.disGender
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
        render:this.disDepartment
      },
      {
        title: '部门',
        dataIndex: 'department',
        render:this.disDepartment
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
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
    };
    const showDrawers=()=>{
        return (
          <Drawer
            placement="right"
            mask={false}
            closable={false}
            width={830}
            style={{position:'absolute',top:170}}
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
              <Col span={6} pull={18} style={{background:'#FAFAFA',height: 830}}>
                <div className={styles.iconRight} onClick={this.onClose}><Icon type="right" /></div>
                <div className={styles.LeftBox}>
                  <div className={styles.headerImg}>
                    {personObj.headImg !== null ? (<img src={getConfig().ftpHost+ personObj.headImg} alt=""/>):(<div className={styles.imgBot}/>)}
                  </div>
                  <h5 className={styles.perName}>{personObj.name}</h5>
                  <p className={styles.perPost}>{personObj.jobStation}</p>
                  <p className={styles.perUnit}>{personObj.deptName}</p>
                  <div className={styles.btnGroup}>
                    <Button type="primary" onClick={this.drawerAddContactPer}>添加到常用联系人</Button>
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
                className={styles.headStyles}
                bodyStyle={{ padding: '0' }}
              >
                <TreeMenu
                  onSelect={this.selectNode.bind(this)}
                  defaultExpandedKeys={[selectTreeStr]}
                  selectedKeys={[selectTreeStr]}
                />
              </Card>
            </Sider>
            <Content>
              <Row style={{marginTop:'8px',zIndex:100 }}>
                {
                 this.state.selectedKey[0] === 'TOP-CONTACTS' ? (
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
                   <Search placeholder="姓名/部门名称" onSearch={this.doSearch} style={{position:'relative',top: -8 }}/>
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
                    onClick: (event) => {this.showDrawer(record) ;this.skipMenuTree(record) },       // 点击行
                  };
                }}
              />
              {personObj.gender === null ? '': showDrawers()}
            </Content>
          </Layout>

        </PageHeaderWrapper>
    );
  }
}

export default AddressBook;
