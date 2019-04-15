import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col, Card,Button, Input,Tree, Table  } from 'antd';
import styles from './index.less';
import TreeMenu from '../components/TreeMenu';
import Link from 'umi/link';
import { message } from 'antd';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;



@connect(({ msg, loading }) => ({
  msg,
  loading: loading.models.msg,
}))

export default class FlowMsg extends PureComponent {

  state = {
    visible:false ,
  };

  componentDidMount(){
    const { dispatch }=this.props;
    dispatch({
      type: 'msg/getMsgList'
    });
  }

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

  render() {
    const {
      msg: {  msgList },
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

    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
    };

    return (
        <Card bordered={false} bodyStyle={{padding: '16px'}}>
          <div className={styles.msgOpt}>
            <Button><Icon type="reload" style={{color: '#0e65af'}} />刷新</Button>
            <Button><Icon type="file-protect" style={{color: '#0e65af'}} />设为已读</Button>
          </div>
        </Card>
    );
  }
}
