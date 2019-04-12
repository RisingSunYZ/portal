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
  state = { pageSize: 10,current:1 };
  selectNode(selectedKeys, e) {
    if (e.selected) {
      this.searchFormObj.categoryId = selectedKeys[0];
      // if(selectedKeys[0] == "myRegular"){
      //   const data = [{"modelName":"技术资料章押金退还申请单","modelKey":"MQGG0001","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1},{"modelName":"技术资料章押金退还申请单-复制1","modelKey":"MQGG0027","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1},{"modelName":"技术资料章押金退还申请单-复制1的复制1","modelKey":"MQGG0028","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1},{"modelName":"技术资料章押金退还申请单-复制1的复制2","modelKey":"MQGG0029","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1},{"modelName":"考核项目集采下单审批流程","modelKey":"MQGG0002","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1},{"modelName":"考核项目集采下单审批流程 - 副本33333333","modelKey":"MQGG0021","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1},{"modelName":"幕墙施工图审图及盖章审批流程","modelKey":"MQGG0003","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1},{"modelName":"并行分支嵌套条件分支审批测试","modelKey":"MQGG0030","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1},{"modelName":"幕墙施工图审图及盖章审批流程-复制2","modelKey":"MQGG0031","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1},{"modelName":"幕墙施工现场废料处理审批单","modelKey":"MQGG0004","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1},{"modelName":"完工项目技术资料专用章盖章审批流程","modelKey":"MQGG0007","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1},{"modelName":"在建工程进度款付款异常预警审批流程","modelKey":"MQGG0010","appliedRange":1,"belongCategoryStr":"(亚厦幕墙-工程管理)","pid":"8a8a94aa5e145290015e16dbe15b0044","delFlag":1}]
      //   console.log(data)
      //   return
      // }
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
      this.setState({
        current:1
      })

      // localStorage.setItem(key,imgAsDataUrl);
      // console.log(e.node.props)
      // sessionStorage.setItem("selectedNode",JSON.stringify(e.node.props));

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
        keyWord:modelName,
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

  saveItem = (item) =>{
    // console.log(item)
  }

  export=()=>{

    var url = '/rest/process/list/exportProcessModel';
    location.href = url;

  }

  render() {
    const {process: { list,selectedNode }, loading} = this.props;

    // console.log(JSON.parse(sessionStorage.getItem("selectedNode")))

    // const selectedNodeObj = selectedNode.eventKey? selectedNode:JSON.parse( sessionStorage.getItem("selectedNode"));
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
      current:this.state.current,
      total: list.length,
      onChange:(page,pageSize) => {
        this.setState({
          current:page
        })
      },
      onShowSizeChange: (current,size) => {
        this.setState({
          pageSize:size,
          current:1
        })
      },
      pageSize: this.state.pageSize,
      defaultPageSize:10
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
                        <Link onClick={this.saveItem} to={this.linkUrl(item)} target="_blank">{item.name}</Link>
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
                      <Link onClick={this.saveItem} target="_blank" to={item.url}>{item.modelName}</Link>
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
