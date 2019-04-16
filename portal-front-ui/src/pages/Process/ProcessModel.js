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
  state = { pageSize: 10,current:1,regularData:[] };
  selectNode(selectedKeys, e) {
    if (e.selected) {
      this.searchFormObj.categoryId = selectedKeys[0];
      if(selectedKeys[0] == "myRegular"){
        const data = [
          {"modelName":"专项审计启动流程","modelKey":"ysportal-audit-zssj","appliedRange":2,"belongCategoryStr":"(通用类型-审计管理)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"任期经济责任审计启动流程","modelKey":"ysportal-audit-rqsj","appliedRange":2,"belongCategoryStr":"(通用类型-审计管理)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"入选劳务队申请单","modelKey":"mqpms_join_labour_team","appliedRange":2,"belongCategoryStr":"(通用类型-工管流程)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"招标需求审批","modelKey":"mqpms_tender_requirement","appliedRange":2,"belongCategoryStr":"(通用类型-工管流程)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"评标审批","modelKey":"mqpms_labour_evaluation","appliedRange":2,"belongCategoryStr":"(通用类型-工管流程)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"劳务组报价","modelKey":"mqpms_labour_quoted_price","appliedRange":2,"belongCategoryStr":"(通用类型-工管流程)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"招标公告申请单","modelKey":"mqpms_labour_tender_notice","appliedRange":2,"belongCategoryStr":"(通用类型-工管流程)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"工程量清单","modelKey":"mqpms_labour_work_amount","appliedRange":2,"belongCategoryStr":"(通用类型-工管流程)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"发文申请流程","modelKey":"ysportal_news_notice","appliedRange":2,"belongCategoryStr":"(通用类型-发文管理)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"劳务招标需求审批流程","modelKey":"mqpms_tendering_requirement","appliedRange":2,"belongCategoryStr":"(通用类型-MPMS)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"工程量清单审批流程","modelKey":"mqpms_bill_quantities","appliedRange":2,"belongCategoryStr":"(通用类型-MPMS)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"招标公告审批流程","modelKey":"mqpms_tender_notice","appliedRange":2,"belongCategoryStr":"(通用类型-MPMS)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1},
          {"modelName":"诉讼案件信息流程","modelKey":"ysportal-legal-ssxx","appliedRange":2,"belongCategoryStr":"(通用类型-法务管理)","pid":"8a948c78589a8f4101589a92c5b10001","delFlag":1}
        ]
        this.setState({regularData:data});
        this.props.dispatch({
          type: 'process/setSelectedNode',
          payload: {
            selectedNode:e.node.props
          },
        });
        return
      }
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
    console.log(item)
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
      hideOnSinglePage:list.length>0?false:true,
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
                      onClick={this.saveItem.bind(item)}
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
                  dataSource={selectedKey == 'myRegular'?this.state.regularData:list}
                  // dataSource={list}
                  renderItem={item => (
                    <List.Item onClick={this.saveItem.bind(this)}>
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
