import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Row, Col, Card, Menu, Input, Dropdown, List, Radio, Tree, Popconfirm, Button  } from 'antd';
import { Link } from 'dva/router';
import styles from '../List/BasicList.less';
import processStyle from './Process.less';
import TreeMenu from '../../components/TreeMenu';
import {stringify} from "qs";

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
    if (e.selected) {
      this.searchFormObj.categoryId = selectedKeys[0];
      this.props.dispatch({
        type: 'process/getModelList',
        payload: { categoryId: selectedKeys[0] },
      });

      this.props.dispatch({
        type: 'process/setSelectedNode',
        payload: {
          selectedNode:e.node.props
        },
      });
    }
  }
  doSearch(modelName) {
    this.searchFormObj.name = modelName;
    const {process:{selectedNode}} = this.props;
    const categoryId = selectedNode.eventKey == "myDraft" ?selectedNode.eventKey:"";
    //如果右侧点击我的草稿，则搜索我的草稿，其他则搜索全部流程模板，

    this.props.dispatch({
      type: 'process/getModelList',
      payload: {
        name: modelName,
        categoryId:categoryId,
      },
    });
  }

  handleDel(businessKey) {
    this.props.dispatch({
      type: 'process/delDraft',
      payload: {
        businessKey: businessKey,
      },
    });
  }
  linkUrl = (item) => {
    return  `/process/form/launch/${nullToZero(item.processDefinitionKey)}/${nullToZero(item.processInstanceId)}/${nullToZero(item.businessKey)}/${nullToZero(item.taskId)}/0`;
  };

  export=()=>{

    var url = '/rest/process/list/exportProcessModel';
    location.href = url;

  }

  render() {
    const {process: { list,selectedNode }, loading} = this.props;
    const selectedKey = selectedNode.eventKey?selectedNode.eventKey:"";

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
          <Row gutter={16}>
            <Col span={18} push={6}>
              <Row>
                <Col span={16}>
                  <h3>
                    流程名称（共
                    {paginationProps.total}
                    条）
                  </h3>
                </Col>
                <Col span={8}>
                  <Search
                    placeholder={
                      selectedKey == 'myDraft' ? '搜索我的草稿' : '搜索流程模板'
                    }
                    onSearch={this.doSearch.bind(this)}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
              { selectedKey == 'myDraft' ? (
                <List
                  size="large"
                  rowKey="id"
                  loading={loading}
                  pagination={paginationProps}
                  dataSource={list}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Popconfirm
                          title="是否要删除此行？"
                          onConfirm={() => {
                            this.handleDel(item.businessKey);
                          }}
                        >
                          <a>
                            <Icon type={'delete'} />
                          </a>
                        </Popconfirm>,
                      ]}
                    >
                      <div className="ant-list-item-content">
                        <Link to={this.linkUrl(item)} target="_blank">{item.name}</Link>
                        <span style={{ marginLeft: 20, color: '#A5A5A5' }}>{item.createTime}</span>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <List
                  size="large"
                  rowKey="id"
                  loading={loading}
                  pagination={paginationProps}
                  dataSource={list}
                  renderItem={item => (
                    <List.Item>
                      <Link target="_blank" to={item.url}>{item.modelName}</Link>
                      <span style={{ marginLeft: 20, color: '#A5A5A5' }}>
                        {item.belongCategoryStr}
                      </span>
                    </List.Item>
                  )}
                />
              )}
            </Col>
            <Col span={6} pull={18}>
              <Button style={{marginBottom: 8}} type="primary" icon="download" onClick={this.export}>流程汇总清单</Button>
              <TreeMenu selectedNode={selectedNode} onSelect={this.selectNode.bind(this)} />
            </Col>
          </Row>
        </Card>
      </Fragment>
    );
  }
}
