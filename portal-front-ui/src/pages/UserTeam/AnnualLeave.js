import React, { PureComponent, Fragment } from 'react';
import { Table,Card, Input, Breadcrumb, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';
import YearSelect from './commponents/common/YearSelect';
import OrgSelect from './commponents/common/OrgSelect';

const columns = [
  {
    title: '入职人员姓名',
    dataIndex: 'name',
  },
  {
    title: '工号',
    dataIndex: 'no',
  },
  {
    title: '岗位',
    dataIndex: 'postname',
  },
  {
    title: '离职时间',
    dataIndex: 'leaveTimeStr',
  },
];

@connect(({ annual, loading }) => ({
  annual,
  loading: loading.models.annual,
}))
export default class AnnualLeave extends PureComponent {
  state = {
    leaveYear:(new Date()).getFullYear(),
    deptIds:[],
    keyWord:'',
    page:'1',
    rows:'10',
  };
  componentDidMount(deptIdArray) {
    let ids = '';
    if(deptIdArray){
      for (let i = 0; i < deptIdArray.length; i++) {
        ids = ids + deptIdArray[i]+',';
      }
    }
    this.setState({
      deptIds:ids.substr(0,ids.length-1),
    }, function() {
      if(this.state.deptIds){
        const { dispatch } = this.props;
        dispatch({
          type: 'annual/getAnnualLeaveList',
          payload:this.state,
        });
      }
    });
  }

  dateChange = value => {
    this.setState({
      leaveYear: value,
      page:'1',
      rows:'10',
    },function(){
      this.searchList();
    });
  };

  orgChange = value => {
    let ids = '';
    if(value){
      ids = ids + value.currentDeptId + ',';
      for (let i = 0; i < value.childrenDeptId.length; i++) {
        ids = ids + value.childrenDeptId[i]+',';
      }
    }
    this.setState({
      deptIds:ids.substr(0,ids.length-1),
      page:'1',
      rows:'10',
    }, function() {
      this.searchList();
    });
  };

  handleGetValue = event => {
    this.setState({
      keyWord: event.target.value,
    });
  };

  onValueChange = () => {
    this.searchList();
  };

  pageNumberChange = (pagination, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    this.setState({
      page:pagination,
      rows:filtersArg,
    }, function() {
      this.searchList();
    });
  };

  pageSizeChange = (pagination, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    this.setState({
      page:1,
      rows:filtersArg,
    }, function() {
      this.searchList();
    });
  };

  searchList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'annual/getAnnualLeaveList',
      payload: {
        leaveYear:this.state.leaveYear,
        deptIds:this.state.deptIds,
        keyWord:encodeURIComponent(this.state.keyWord),
        page:this.state.page,
        rows:this.state.rows,
      },
    });
  };
  render() {
    const {
      annual: { leave },
    } = this.props;
    const Search = Input.Search;
    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{padding: '16px 24px', marginBottom: 16}}>
          <Breadcrumb>
            <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
            <Breadcrumb.Item><a href="/ys/user-team">团队总览</a></Breadcrumb.Item>
            <Breadcrumb.Item>年度离职</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card bordered={false} bodyStyle={{padding: '16px 24px'}}>
          <Row>
            <Col span={3}>
              <YearSelect yearChange={this.dateChange} />
            </Col>
            <Col span={5}>
              <OrgSelect onOrgChange={this.orgChange} initPage={this.componentDidMount.bind(this)}/>
            </Col>
            <Col offset={12} span={4}>
              <Search
                placeholder="姓名/岗位"
                value={this.state.keyWord}
                onChange={this.handleGetValue}
                onSearch={this.onValueChange}
              />
            </Col>
          </Row>
          <Table columns={columns} dataSource={leave.list}
                 pagination={{
                   pageSize: leave.pagination.pageSize,
                   current:leave.pagination.current+1,
                   pageSizeOptions: ['5', '10', '20'],
                   showQuickJumper: true,
                   showSizeChanger: true,
                   total:leave.pagination.total,
                   onChange:this.pageNumberChange,
                   onShowSizeChange:this.pageSizeChange,
                   showTotal: function () {  //设置显示一共几条数据
                     return '共 ' + leave.pagination.total + ' 条数据';
                   }
                 }} />
        </Card>
      </div>
    );
  }
}
