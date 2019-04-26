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
  Table,
  Card,
  message
} from 'antd';
import DeptTree from './Section/DeptTree';
import { connect } from 'dva/index';
const Search = Input.Search;
const { Header, Sider, Content } = Layout;
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '岗位',
    dataIndex: 'jobStation',
    width: 150,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '单位',
    dataIndex: 'companyName',
    width: 150,
  },
];
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
class UserSelect extends Component {
  state = {
    selectedUser: [],
    oldSelected: [],
    visible: false,
    keyword: "",
    deptId: "",
  };

  static defaultProps = {
    multiple: true,
    disabled: false,
    value: [],
    required: false,
    onChange: null,
    width: 200,
  };

  componentDidMount(){
    const { dispatch,user:{currentUser}, value } = this.props;
    this.setState({
      selectedUser: value || [],
      oldSelected: value || [],
    });
    if(currentUser.depId){
      this.setState({
        deptId: currentUser.depId,
      });
    }
    dispatch({
      type: 'user/getAllUser',
      payload: { deptId: currentUser.depId || ''},
    });
  }
  //
  // componentWillReceiveProps(nextProps) {
  //   if ('value' in nextProps) {
  //     console.log(nextProps.value);
  //     this.setState({
  //       selectedUser: nextProps.value
  //     });
  //   }
  // }

  selectNode = (selectedKeys) => {
    const { dispatch } = this.props;
    this.setState({
      deptId: selectedKeys[0],
      keyword: "",
    });
    dispatch({
      type: 'user/getAllUser',
      payload: { deptId: selectedKeys[0]},
    });
  };

  doSearch = keyword => {
    const { dispatch } = this.props;
    this.setState({
      keyword,
      deptId: '',
    });

    dispatch({
      type: 'user/getAllUser',
      payload: {
        keyword
      },
    });
  };

  handleCancel = () => {
    const { oldSelected } = this.state;
    this.setState({
      keyword: '',
      visible: false,
      selectedUser: oldSelected
    })
  };

  handleOk = () => {
    const { selectedUser, oldSelected } = this.state;
    const{ onChange, required } = this.props;
    if(required && selectedUser.length <= 0) {
      message.error('请选择人员!');
      return false
    }
    onChange && onChange(selectedUser, oldSelected);
    this.setState({
      visible: false,
      oldSelected: selectedUser
    })

  };

  openUserWindow = () => {
    const { disabled,value } = this.props;
    if(disabled) return false;
    this.setState({
      visible: true,
      selectedUser: value || [],
      oldSelected: value || [],
    })
  };

  getSelectedRowKeys = () => {
    const { selectedUser } = this.state;
    // debugger
    const userNos = [];
    selectedUser.map((user)=>{
      userNos.push(user.no);
    });
    return userNos;
  };

  updateSelectedRow = (record, selected) => {
    const { multiple } = this.props;
    const { selectedUser } = this.state;
    if(selected){
      multiple ? this.setState({
        selectedUser: [
          ...selectedUser,
          record,
        ]
      }) : this.setState({
        selectedUser: [record]
      })
    }else{
      const delPerson = JSON.stringify(record);
      const persons = selectedUser.filter((p)=>delPerson.indexOf(p.no) === -1);
      this.setState({
        selectedUser: persons
      });
    }
  };

  updateSelectedRows = (selected, selectedRows, changeRows) => {
    const { selectedUser } = this.state;
    if(selected){
      this.setState({
        selectedUser: [
          ...selectedUser,
          ...changeRows,
        ]
      })
    }else{
      const changeRowsStr = JSON.stringify(changeRows);
      const persons = selectedUser.filter((person)=>changeRowsStr.indexOf(person.no) === -1);
      this.setState({
        selectedUser: persons
      });
    }
  };

  getPersonNamesList = (persons) => persons.map((person) => (
    <Tag key={person.no} closable onClose={()=>this.handleDelPerson(person)}>{person.name}</Tag>
  ));

  handleDelPerson = (person, isControl) => {
    const { selectedUser, oldSelected } = this.state;
    const { onChange } = this.props;
    const delPerson = JSON.stringify(person);
    const persons = selectedUser.filter((p)=>delPerson.indexOf(p.no) === -1);
    this.setState({
      selectedUser: persons
    });
    isControl && onChange && onChange(persons, oldSelected)
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

  createPersonList = list => {
    // debugger
    const { disabled } = this.props;
    return list.map((person) => (
      <Tag key={person.no} closable={!disabled} onClose={()=>this.handleDelPerson(person, true)}>{person.name}</Tag>
    ))
  };

  render() {
    const {
      user: {
        data:{ list, pagination },
        currentUser
      },
      disabled,
      value,
      multiple,
      required,
      onChange,
      className,
      type,
      showText="选择人员",
      styles,
      id,
      width = 200,
    } = this.props;
    const { visible, deptId, selectedUser, oldSelected } = this.state;
    const rowSelection = {
      type: multiple ? 'checkbox' : 'radio',
      selectedRowKeys: this.getSelectedRowKeys(),
      onSelect: this.updateSelectedRow,
      onSelectAll: this.updateSelectedRows
    };

    return (
      <Fragment>
        <Modal
          title="选择人员"
          width="80%"
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
                    placeholder="输入工号/姓名"
                    onSearch={this.doSearch}
                    enterButton
                    style={{ width: 500, verticalAlign: 'top' }}
                  />
                </Col>
              </Row>
            </Header>
            <Layout>
              <Sider>
                <Card
                  title="组织架构"
                  bordered={false}
                  headStyle={{ borderLeft: '1px solid #e5e5e5', borderRight: '1px solid #e5e5e5' }}
                  bodyStyle={{ padding: '0' }}
                >
                  <DeptTree value={deptId} onSelect={this.selectNode} />
                </Card>
              </Sider>
              <Content>
                <Table
                  columns={columns}
                  dataSource={list}
                  pagination={{showSizeChanger: true, showQuickJumper: true,...pagination}}
                  scroll={{ y: 460 }}
                  size="middle"
                  rowKey="no"
                  rowSelection={rowSelection}
                  onChange={this.handleTableChange}
                />
              </Content>
              <Sider width={150}>
                <Card
                  title="已选择人员"
                  bodyStyle={{ padding: 0, height: 510 }}
                >
                  <div style={{height:'100%', overflow: 'auto'}}>
                    {this.getPersonNamesList(selectedUser)}
                  </div>
                </Card>
              </Sider>
            </Layout>
          </Layout>
        </Modal>
        {type === 'button' ? (
          <Button className={className||''} style={{width, ...styles}} onClick={this.openUserWindow} type="primary">{showText}</Button>
        ) : (
          <div id={id} className={`user-sel-view ${className||''}`} style={{width, ...styles}}>
            <div className="person-list">
              {oldSelected.length>0?this.createPersonList(oldSelected):this.createPersonList(value)}
            </div>
            <a className="addon" onClick={this.openUserWindow}>
              {multiple ? <Icon type="team" /> : <Icon type="user" />}
            </a>
          </div>
        )}
      </Fragment>
    );
  }
}

export default UserSelect;
