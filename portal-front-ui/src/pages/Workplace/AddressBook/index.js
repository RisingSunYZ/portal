import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Row, Col, Card, Menu, Input, Dropdown, List,Layout, Radio, Tree, Table  } from 'antd';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from './index.less';
import TreeMenu from '../components/TreeMenu';
import DeptTree from '../components/DeptTree/DeptTree';

const TreeNode = Tree.TreeNode;

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const { Header, Sider, Content } = Layout;

// let nos = '';

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    width: 150
 },
  {
    title: '工号',
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
  },
  {
    title: '部门',
    dataIndex: 'department',
  },
  {
    title: '岗位',
    dataIndex: 'post',
  },
  {
    title: '短号',
    dataIndex: 'shortNum',
 }];


const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}




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
@connect(({ addressBook, loading }) => ({
  addressBook,
  loading: loading.models.addressBook,
}))

export default class AddressBook extends PureComponent {
  searchFormObj = {};
  state = {
    selectedKey: '',
    selectTableKeys: [],

  };


  selectNode(selectedKeys, e) {
    if (e.selected) {
      this.searchFormObj.categoryId = selectedKeys[0];
      this.props.dispatch({
        type: 'addressBook/getModelList',
        payload: { categoryId: selectedKeys[0] },
      });
      this.setState({
        selectedKey: selectedKeys[0],
      });
    }
  }

  getSelectedRowKeys = () => {
    const { selectedUser } = this.state;
    const userNos = [];
    selectedUser.map((user)=>{
      userNos.push(user.no);
    });
    return userNos;
  };
  doSearch(modelName) {
    this.searchFormObj.name = modelName;
    //如果右侧点击我的草稿，则搜索我的草稿，其他则搜索全部流程模板，
    this.props.dispatch({
      type: 'addressBook/getModelList',
      payload: {
        name: modelName,
        categoryId: this.state.selectedKey == 'myDraft' ? this.state.selectedKey : '',
      },
    });
  }

  handleDel(businessKey) {
    this.props.dispatch({
      type: 'addressBook/delDraft',
      payload: {
        businessKey: businessKey,
      },
    });
  }

  // 添加到常用联系人
  addContactPer = ()=>{
    const { dispatch }=this.props;
    // console.log(nos);
    debugger;
    dispatch({
      type:'addressBook/addContactPer',
      payload:this.state.selectTableKeys
    })


  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { keyword, deptId } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      keyword,
      ...filters,
      deptId,

    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'user/getAllUser',
      payload: params,
    });

  };

  render() {
    const {
      addressBook: { list, data ,pagination},
      loading,
    } = this.props;
    //  console.log(list)
    // console.log(5555555)

    // const rowSelection = {
    //   type: multiple ? 'checkbox' : 'radio',
    //   selectedRowKeys: this.getSelectedRowKeys(),
    //   onSelect: this.updateSelectedRow,
    //   onSelectAll: this.updateSelectedRows
    // };

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let nos = '';
        // nos+= selectedRowKeys+ ','
        for(let i=0;i<selectedRows.length; i++){
          nos+=selectedRows[i].no+",";
          if(nos.length>0){
            nos=nos.substr(0,nos.length-1);
          }
        }

        this.setState({
          selectTableKeys: nos
        })

        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);


      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
        <PageHeaderWrapper>
          <Layout>
            <Sider>
              <Card
                title="企业通讯录"
                bordered={false}
                headStyle={{ borderLeft: '1px solid #e5e5e5', borderRight: '1px solid #e5e5e5',borderBottom:'2px solid #0E65AF',color:'#0E65AF',fontSize:'14px' }}
                bodyStyle={{ padding: '0' }}
              >
                {/*<DeptTree onSelect={this.selectNode} />*/}
                <TreeMenu onSelect={this.selectNode.bind(this)} />
              </Card>
            </Sider>
            <Content>
              <Row style={{marginTop:'12px'}}>
                {
                 this.state.selectedKey == 'TOP-CONTACTS' ? (
                   <Col span={1} className={styles.colHeader}>
                      <Icon type="delete" className={styles.icon}/>
                      <span className={styles.text}>移除</span>
                   </Col>
                 ) : (
                  <Col span={2} className={styles.colHeader}>
                   <Icon type="plus" className={styles.icon}/>
                   <span className={styles.text} onClick={this.addContactPer}>添加到常用联系人</span>
                  </Col>
                 )
               }
                 <Col span={2} className={styles.colHeader}>
                   <Icon type="mail" className={styles.icon}/>
                   <span className={styles.text}>发邮件</span>
                 </Col>
                 <Col span={4}>
                   <Search placeholder="姓名/部门名称" onSearch={value => console.log(value)} style={{position:'relative',top: -8}}/>
                   {/*<Search*/}
                   {/*placeholder={*/}
                   {/*this.state.selectedKey == 'TOP-CONTACTS' ? '搜索我的草稿' : '搜索流程模板'*/}
                   {/*}*/}
                   {/*onSearch={this.doSearch.bind(this)}*/}
                   {/*style={{ width: '100%' }}*/}
                   {/*/>*/}
                 </Col>
              </Row>
              <Table
                columns={columns}
                dataSource={list}
                pagination={{showSizeChanger: true, showQuickJumper: true,...pagination}}
                scroll={{ y: 260 }}
                size="middle"
                rowKey="no"
                rowSelection={rowSelection}
                // onChange={this.handleTableChange}
              />
            </Content>
          </Layout>
        </PageHeaderWrapper>
    );
  }
}

