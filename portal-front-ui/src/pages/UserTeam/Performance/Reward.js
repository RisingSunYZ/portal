/**
 * 团队绩效奖励
 */
import React, { Component, Fragment } from 'react';
import { Table, Row, Col, Input} from 'antd';
import 'antd/dist/antd.css';
import OrgSelect from '../commponents/common/OrgSelect';
import YearSelect from '../commponents/common/YearSelect';
import { connect } from 'dva';

const columns = [
  {
    title: '序号',
    key: 'index',
    render:(text, record, index) => {return (index+1)}
  },
  {
    title: '奖励日期',
    dataIndex: 'aa',
    key: 'aa',
  },
  {
    title: '姓名',
    dataIndex: 'bb',
    key: 'bb',
  },
  {
    title: '所在部门',
    dataIndex: 'cc',
    key: 'cc',
  },
  {
    title: '奖励类型',
    dataIndex: 'dd',
    key: 'dd',
  },
  {
    title: '奖励级别',
    dataIndex: 'ee',
    key: 'ee',
  },
  {
    title: '奖励措施',
    dataIndex: 'ff',
    key: 'ff',
  },
  {
    title: '奖励事由',
    dataIndex: 'gg',
    key: 'gg',
  },
];

@connect(({ teamPerformance, loading }) => ({
  teamPerformance,
  loading: loading.models.teamPerformance,
}))
export default class Reward extends Component {

  state = {
    year: (new Date).getFullYear(),
    queryDeptIds: ''
  };

  componentDidMount() {

  }

//YearSelect改变时子组件触发
  yearChange = (planYear) =>{
    this.setState({
      year: planYear,
    },()=>{
      this.reqData(this.state)
    });
  };

  initPage = (deptArray) => {
    let deptStr = deptArray.toString();
    this.setState({
      queryDeptIds: deptStr
    },()=>{
      this.reqData(this.state);
    });
  };

  orgChange = (org)=>{
    const childStr = org.childrenDeptId.toString();
    let orgStr = '';
    if (!!childStr) {
      orgStr = childStr + ',' + org.currentDeptId;
    } else {
      orgStr = org.currentDeptId;
    }
    this.setState({
      queryDeptIds: orgStr
    },()=>{
      this.reqData(this.state);
    })
  };

  searchReq = (value) => {
    let reg = /^\d+$/;
    let val = '';
    //修改参数字段
    if ( reg.test(value)) {
      val = {
        ...this.state,
        no: value
      }
    } else {
      val = {
        ...this.state,
        name: encodeURIComponent(value),
      }
    }
    this.reqData(val);
  };

  pageChange = value => {
    let val = {
      ...this.state,
      page:value.page,
      rows:value.rows,
    };
    this.reqData(val)
  };

  handleStandardTableChange = (pagination, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      page: pagination,
      rows: filtersArg,
      ...filters,
    };
    this.pageChange(params);
  };

  reqData = (val) => {
    this.props.dispatch({
      type: 'teamPerformance/fetchTeamPerfReward',
      payload: val
    });
  };

  render() {
    const {
      teamPerformance: { teamPerfRewardTbl },
    } = this.props;

    const paginationSet = {
      pageSize: 10,
      pageSizeOptions: ['5', '10', '20'],
      showQuickJumper: true,
      showSizeChanger: true,
      total:10,
      onChange:this.handleStandardTableChange,
      showTotal: function () {  //设置显示一共几条数据
        return <div style={{marginLeft:0}}>共 10 条数据</div>;
      }
    };

    return (
      <div style={{margin: '16px 24px'}}>
        <Row>
          <Col span={3} > <YearSelect onInit={(planYear)=>{this.state.planYear=planYear}} yearChange={this.yearChange} /> </Col>
          <Col span={7} style={{marginLeft: -2}}> <OrgSelect initPage={this.initPage} onOrgChange={this.orgChange} /> </Col>
          <Col offset={10} span={4}>
            <Input.Search placeholder="搜索工号/姓名" onSearch={this.searchReq} style={{ width: 150,float: 'right' }} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Table columns={columns} dataSource={teamPerfRewardTbl.list} rowKey={record => record.bb} pagination={paginationSet}/>
          </Col>
        </Row>
      </div>
    );
  }
}
