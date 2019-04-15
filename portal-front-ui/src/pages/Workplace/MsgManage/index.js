import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Menu, Badge, Layout  } from 'antd';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from './index.less';
import Link from 'umi/link';
import { message } from 'antd';
let nodeChildrenMaps = {};

const { Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

@connect(({ msg, loading }) => ({
  msg,
  loading: loading.models.msg,
}))

export default class MsgManage extends PureComponent {

  state = {
    visible:false ,
  };

  componentDidMount(){
    const { dispatch }=this.props;
    dispatch({
      type: 'msg/getMenuTree',
      payload:{
        sys: 'xxzx'
      }
    });
    dispatch({
      type: 'msg/getMsgCount',
    });
  }

  buildMenu = (menu, count) => menu.map((item)=>(
    <SubMenu key={item.sn} title={<span>{item.name}</span>}>
      {nodeChildrenMaps[item.id] ? nodeChildrenMaps[item.id].map((m)=>{
        return count[m.sn] ? (
          <Menu.Item key={m.sn}><Link to={`/workplace/msg/${m.sn}`}>{m.name}<Badge style={{marginTop: -3, marginLeft: 3}} count={count[m.sn]} /></Link></Menu.Item>
        ) : (
          <Menu.Item key={m.sn}><Link to={`/workplace/msg/${m.sn}`}>{m.name}</Link></Menu.Item>
        )
      }) : ""}
    </SubMenu>
  ));

  render() {
    const {
      msg: {  menu, count },
      location, match,
      children
    } = this.props;
    const jsonTree = [];
    nodeChildrenMaps = {};
    menu && menu.length && menu.map((item)=>{
      if(item.pid){
        nodeChildrenMaps[item.pid] ? nodeChildrenMaps[item.pid].push(item) : (nodeChildrenMaps[item.pid] = [item]);return;
      }
      jsonTree.push(item);
    });
    return (
      <PageHeaderWrapper>
        <Layout>
          <Sider width={200} style={{background: '#fff'}}>
            <Menu
              className="msg-tree"
              inlineCollapsed={false}
              defaultOpenKeys={["xxzx"]}
              selectedKeys={[location.pathname.replace(`${match.path}/`, '')]}
              mode="inline"
            >
              {this.buildMenu(jsonTree, count)}
            </Menu>
          </Sider>
          <Content>
            {children}
          </Content>
        </Layout>
      </PageHeaderWrapper>
    )
  }
}
