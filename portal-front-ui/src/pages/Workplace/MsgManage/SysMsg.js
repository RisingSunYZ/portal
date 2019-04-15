import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Row, Col, Card, Drawer,Button ,Modal, Input,Layout,Tree, Table  } from 'antd';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from './index.less';
import TreeMenu from '../components/TreeMenu';
import Link from 'umi/link';
import { message } from 'antd';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const { Sider, Content } = Layout;

@connect(({ msg, loading }) => ({
  msg,
  loading: loading.models.msg,
}))

export default class SysMsg extends PureComponent {

  state = {
    visible:false ,
  };

  componentDidMount(){
    const { dispatch }=this.props;
    dispatch({
      type: 'msg/getMsgMenu'
    });
  }

  onClose = () => {
    this.setState({
      visibleDrawer: false,
    });
  };

  // 树的点击事件
  selectNode(selectedKeys, e) {
    // console.log(selectedKeys)
    if (e.selected) {}
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
    });
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  };

  render() {
    const {
      msg: {  msgMenu, msgList },
    } = this.props;
    const { visible }=this.state;

    const columns = [
      {
        title: '消息类型',
        dataIndex: 'name',
        width: 150,
        render:this.disGender
      },
      {
        title: '消息主题 ',
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

    return (
        <Card>
          系统
        </Card>
    );
  }
}

//http://file.chinayasha.com/p-head/2017/12/20/8a8a94aa6059716b016071f33d2002fb.jpg
//http://file.chinayasha.com/p-head/2017/12/13/00000000602edd7001604f193af80543.jpg
//http://hometest.chinayasha.com

