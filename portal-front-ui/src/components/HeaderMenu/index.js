import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import router from 'umi/router';
import PropTypes from 'prop-types';
import styles from './index.less';
import {getConfig} from "@/utils/utils";

const menuData = [
  { key: 'workplace', title: '工作台',url:"/main/workplace" },
  { key: 'hr-service', title: 'HR服务',url:"/mian/hr-service" },
  { key: 'infor-tech', title: 'IT服务',url:"/main/infor-tech" },
  { key: 'fnc-service', title: '财务服务' ,url:"/main/fnc-service"},
  { key: 'news', title: '新闻资讯' ,url:"/mian/news"}
];

// const menuData = [
//   { key: 'workplace', title: '工作台',url:getConfig().domain+"/main.jhtml#channel=work" },
//   { key: 'hr-service', title: 'HR服务',url:"/ys/main/hr-service" },
//   { key: 'infor-tech', title: 'IT服务',url:getConfig().domain+"/main.jhtml#channel=it" },
//   { key: 'fnc-service', title: '财务服务' ,url:getConfig().domain+"/main.jhtml#channel=fnc"},
//   { key: 'news', title: '新闻资讯' ,url:getConfig().domain+"/main.jhtml#channel=news"},
// ];
export default class HeaderMenu extends PureComponent {
  static childContextTypes = {
    match: PropTypes.object,
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { match, location } = props;
    const key = location.pathname.replace(`${match.path}/`, '');
    this.state = {
      current: key || 'workplace',
    };
  }

  getChildContext() {
    const { match, location } = this.props;
    return {
      match,
      location,
    };
  };

  componentDidMount(){
    const { match, location } = this.props;
    const key = location.pathname.replace(`${match.path}/`, '');
    this.setState({
      current: key || 'workplace',
    });
  }

  getMenu = menuList => {
    return menuList.map((menu, index) => {
      return <Menu.Item key={menu.key}>{menu.title}</Menu.Item>;
    });
  };

  handleClick = e => {
    if(e.key){
      router.push(`/main/${e.key}`);
      this.setState({
        current: e.key,
      });
    }
    // else if(e.key === 'hr-service'){
    //   window.location.href=getConfig().domain+"/ys/main/hr-service";
    // }else{
    //   window.location.href=getConfig().domain+"/main.jhtml#channel="+e.key;
    // }

  };
  render() {
    return (
      <div className={styles.headerMenuBox}>
        <Menu
          theme="ysHead"
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          {this.getMenu(menuData)}
        </Menu>
      </div>
    );
  }
}
