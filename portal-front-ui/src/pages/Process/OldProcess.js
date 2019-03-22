import React, { Component, PureComponent, Fragment } from 'react';
import { Link, routerRedux, Route, Switch } from 'umi/router';

import moment from 'moment';
import { connect } from 'dva';
import {
  Tabs,
  Button,
  Icon,
  Row,
  Col,
  Card,
  Menu,
  Input,
  Dropdown,
  List,
  Avatar,
  Radio,
  Tree,
  Progress,
} from 'antd';
import { getRoutes } from '../../utils/utils';
import styles from '../List/BasicList.less';
import processStyle from './Process.less';
import TreeMenu from '../../components/TreeMenu';

const TreeNode = Tree.TreeNode;

const TabPane = Tabs.TabPane;
const Search = Input.Search;

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
function getFormType(url) {
  var formType = '0';
  if (url) {
    var reg = new RegExp('(^|)formType=([^&]*)(|$)');
    var array = url.match(reg);
    if (array) {
      formType = array[2];
    }
  }
  return formType;
}
function nullToZero(param) {
  if (!param) {
    return '0';
  } else {
    return param;
  }
}
@connect(({ process, loading }) => ({
  process,
  loading: loading.models.process,
}))
export default class ProcessModel extends PureComponent {
  searchFormObj = {};
  selectNode(selectedKeys, e) {
    this.searchFormObj.categoryId = selectedKeys[0];
    this.props.dispatch({
      type: 'process/getModelList',
      payload: { categoryId: selectedKeys[0] },
    });
  }
  doSearch(modelName) {
    this.searchFormObj.name = modelName;
    this.props.dispatch({
      type: 'process/getModelList',
      payload: { name: modelName },
    });
  }
  render() {
    const { match, routerData } = this.props;
    const routes = getRoutes(match.path, routerData);
    const {
      process: { list },
      loading,
    } = this.props;
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="waiting">等待中</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      hideOnSinglePage: true,
      pageSize: 10,
      total: list.length,
    };
    const menu = (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a>删除</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <Fragment>
        <Card bordered={false} className={processStyle.mainBox}>
          <iframe
            id="yashaMainFrame"
            frameBorder="0"
            scrolling="none"
            src="/seeyon/yx.do?method=workFlowCenter&tabId=pending"
            style={{ border: 'none', width: '100%', height: '100%', minHeight: '600px' }}
          />
        </Card>
      </Fragment>
    );
  }
}
