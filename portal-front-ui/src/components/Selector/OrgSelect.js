import React, { Component, Fragment } from 'react';
import {
  Modal,
  Button,
  Row,
  Col,
  Layout,
  Input,
  Icon,
  Tag,
  Card,
  Tree,
  message
} from 'antd';
import { connect } from 'dva/index';
const Search = Input.Search;
const { Header, Content } = Layout;
const { TreeNode } = Tree;
const dataList = [];
const dataMap = {};
const getParentKey = (pId, arr) => {
  const parentKey = dataMap[pId];
  if(parentKey){
    const newArr = arr.includes(pId) ? arr : [...arr, parentKey.id];
    return parentKey.pId ? getParentKey(parentKey.pId, newArr) : newArr;
  }
  return arr;
};


@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
class OrgSelect extends Component {
  state = {
    filterIds: [],
    selectedOrgs: [],
    expandedKeys: [],
    oldSelected: [],
    checkedKeys: [],
    visible: false,
  };

  static defaultProps = {
    multiple: true,
    disabled: false,
    value: [],
    required: false,
    onChange: null,
    width: 200,
    selType: "all",
  };

  componentDidMount(){
    const { value, dispatch } = this.props;
    this.setState({
      selectedOrgs: value,
      oldSelected: value,
    });
    dispatch({
      type: 'user/getAllDept',
    });
  }

  onSearchChange = (value) => {
    this.setState({
      expandedKeys: [],
      filterIds: []
    },()=>{
      let expandedIds = [];
      if(value){
        dataList.map((item) => {
          if (item.text && item.text.indexOf(value) > -1) {
            if(!expandedIds.includes(item.id))expandedIds.push(item.id);
            if(item.pId && item.pId !== '0'){
              expandedIds = getParentKey(item.pId, expandedIds);
            }
          }
        });
        this.setState({
          filterIds: expandedIds,
          autoExpandParent: true
        })
      }
    });
  };

  handleCancel = () => {
    const { oldSelected } = this.state;
    const keys = [];
    oldSelected.map((org)=>keys.push(org.id));
    this.setState({
      visible: false,
      selectedOrgs: oldSelected,
      checkedKeys: keys,
    })
  };

  handleOk = () => {
    const { selectedOrgs, oldSelected } = this.state;
    const{ onChange, required } = this.props;
    if(required && selectedOrgs.length <= 0) {
      message.error('请选择部门!');
      return false
    }
    onChange && onChange(selectedOrgs, oldSelected);
    this.setState({
      visible: false,
      oldSelected: selectedOrgs
    })

  };

  openOrgWindow = () => {
    const { disabled } = this.props;
    if(disabled) return false;
    this.setState({
      visible: true,
    })
  };

  getOrgTextList = (orgs) => orgs.map((org) => (
    <Tag key={org.id} closable onClose={()=>this.handleDelOrg(org)}>{org.text}</Tag>
  ));

  handleDelOrg = (org, isControl) => {
    const { selectedOrgs, oldSelected } = this.state;
    const { onChange } = this.props;
    const orgs = selectedOrgs.filter((p)=>org.id.indexOf(p.id) === -1);
    const keys = [];
    orgs.map((o)=>keys.push(o.id));
    if(isControl){
      this.setState({
        selectedOrgs: orgs,
        oldSelected: orgs,
        checkedKeys: keys
      });
      onChange && onChange(orgs, oldSelected)
    }else {
      this.setState({
        selectedOrgs: orgs,
        checkedKeys: keys
      });
    }
  };

  updateCheckedOrgs = (checkedKeys, e) => {
    const org = e.node.props;
    const { selectedOrgs } = this.state;
    if(e.checked){
      this.setState({
        checkedKeys,
        selectedOrgs: [...selectedOrgs, {id: org.eventKey, text: org.title}]
      });
    }else{
      const orgs = selectedOrgs.filter((p)=>org.eventKey.indexOf(p.id) === -1);
      this.setState({
        checkedKeys,
        selectedOrgs: orgs
      });
    }
  };

  updateSelectedOrg = (selectedKeys, e) => {
    const { multiple } = this.props;
    if(multiple) return false;
    const text = e.node.props.title;
    if(e.selected){
      this.setState({
        selectedOrgs: [{id: selectedKeys[0], text}]
      });
    }else{
      this.setState({
        selectedOrgs: []
      });
    }
  };

  createOrgList = list => {
    const { disabled } = this.props;
    return list.map((org) => (
      <Tag key={org.id} closable={!disabled} onClose={()=>this.handleDelOrg(org, true)}>{org.text}</Tag>
    ))
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  render() {
    const {
      user: {
        currentUser,
        orgTree
      },
      disabled,
      value,
      multiple,
      required,
      onChange,
      className,
      type,
      showText="选择部门",
      styles,
      width = 200,
    } = this.props;
    const { visible, filterIds, selectedOrgs, expandedKeys, autoExpandParent, oldSelected,checkedKeys } = this.state;
    const loop = (data, isRoot) =>{
      if(isRoot)dataList.length = 0;
      return data.map(item => {
        dataList.push(item);
        dataMap[item.id] = {...item, orgTreeApiVos: []};
        if(filterIds.length<=0 || filterIds.includes(item.id)){
          if (item.orgTreeApiVos && item.orgTreeApiVos.length) {
            return (
              <TreeNode key={item.id} title={item.text}>
                {loop(item.orgTreeApiVos)}
              </TreeNode>
            );
          }
          return <TreeNode key={item.id} title={item.text} />;
        }
      });
    };

    return (
      <Fragment>
        <Modal
          title="选择部门"
          width="65%"
          height="500px"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText=""
          className="user-select-container"
          bodyStyle={{padding: 10}}
        >
          <Layout>
            <Header style={{ height: 40, borderBottom: '1px solid #e5e5e5' }}>
              <Row>
                <Col span={8}>
                  <Search
                    placeholder="输入部门名称"
                    onSearch={this.onSearchChange}
                    enterButton
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </Header>
            <Content>
              <Row>
                <Col span={12}>
                  <Card
                    title="组织架构"
                    bordered={false}
                    headStyle={{ borderLeft: '1px solid #e5e5e5', borderRight: '1px solid #e5e5e5' }}
                    bodyStyle={{ padding: '0' }}
                  >
                    <div style={{overflow: 'auto', height: '510px', border: '1px solid #e9e9e9'}}>
                      <Tree
                        checkable={multiple}
                        checkStrictly
                        checkedKeys={checkedKeys}
                        expandedKeys={expandedKeys.length ? expandedKeys : filterIds}
                        autoExpandParent={autoExpandParent}
                        onExpand={this.onExpand}
                        onCheck={this.updateCheckedOrgs}
                        onSelect={this.updateSelectedOrg}
                        defaultExpandedKeys={currentUser.deptId}
                      >
                        {loop(orgTree, true)}
                      </Tree>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    title="已选列表"
                    style={{marginTop: -1}}
                    bodyStyle={{ padding: 0, height: 510 }}
                  >
                    <div style={{height:'100%', overflow: 'auto'}}>
                      {this.getOrgTextList(selectedOrgs)}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Content>
          </Layout>
        </Modal>
        {type === 'button' ? (
          <Button onClick={this.openUserWindow} type="primary" className={className||''} style={{ width, ...styles }}>{showText}</Button>
        ) : (
          <div className={`user-sel-view ${className||''}`} style={{ width, ...styles }}>
            <div className="person-list">
              {this.createOrgList(oldSelected)}
            </div>
            <a className="addon" onClick={this.openOrgWindow}>
              <Icon type="deployment-unit" />
            </a>
          </div>
        )}
      </Fragment>
    );
  }
}

export default OrgSelect;
