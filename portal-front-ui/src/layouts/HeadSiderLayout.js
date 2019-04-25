import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Menu, Badge, Layout  } from 'antd';
import CommonHeader from '../components/CommonHeader';
import './HeadSiderLayout.less';
import Link from 'umi/link';
import { message } from 'antd';
let nodeChildrenMaps = {};

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

@connect(({ bizSys, loading }) => ({
  bizSys,
  loading: loading.models.bizSys,
}))

export default class HeadSiderLayout extends PureComponent {
  constructor(props){
    super(props);
  }
  state = {
    visible:false,
  };

  componentDidMount(){
    const { match: { params }, dispatch }=this.props;
    if(params.systemSn === 'xxzx'){
      dispatch({
        type: 'bizSys/getMsgCount',
      });
    }
    dispatch({
      type: 'bizSys/getMenuTree',
      payload:{
        sys: params.systemSn
      }
    });
  }

  loop = data => {
    const { match: { params }, bizSys } = this.props;
    return data.map(item => {
      if (nodeChildrenMaps[item.id] && nodeChildrenMaps[item.id].length) {
        return (
          <SubMenu key={item.sn} title={<span>{item.name}</span>}>
            {this.loop(nodeChildrenMaps[item.id])}
          </SubMenu>
        );
      }
      return <Menu.Item key={item.sn}><Link to={`/biz-sys/${params.systemSn}/${item.sn}`}>{item.name}{bizSys && bizSys.msgCount ? <Badge style={{marginTop: -3, marginLeft: 3}} count={bizSys.msgCount[item.sn]} /> : ''}</Link></Menu.Item>;
    })
  };

  render() {
    const {
      bizSys: { menu },
      match: { params },
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
      <Layout>
        <Header style={{height: 50, padding: 0}}>
          <CommonHeader />
        </Header>
        <Content>
          <Layout>
            <Sider width={200} style={{background: '#fff'}}>
              <Menu
                className="msg-tree"
                inlineCollapsed={false}
                defaultOpenKeys={[params.systemSn]}
                selectedKeys={[params.sn]}
                mode="inline"
              >
                {this.loop(jsonTree)}
              </Menu>
            </Sider>
            <Content>
              {children}
            </Content>
          </Layout>
        </Content>
      </Layout>
    )
  }
}
