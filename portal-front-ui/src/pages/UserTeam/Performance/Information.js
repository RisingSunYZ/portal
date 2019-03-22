/**
 * 团队绩效信息
 */
import React, { Component, Fragment } from 'react';
import { Table, Row, Col, Input,Select } from 'antd';
import 'antd/dist/antd.css';
import OrgSelect from '../commponents/common/OrgSelect';
import YearSelect from '../commponents/common/YearSelect';
import { connect } from 'dva';

const columns = [
  {
    title: '部门',
    dataIndex: 'deptName',
    key: 'deptName',
  },
  {
    title: '工号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '半年度绩效等级',
    dataIndex: 'halfYearPer',
    key: 'halfYearPer',
  },
  {
    title: '年度绩效等级',
    dataIndex: 'yearPer',
    key: 'yearPer',
  },
];
const Option = Select.Option;

@connect(({ teamPerformance, loading }) => ({
  teamPerformance,
  loading: loading.models.teamPerformance,
}))
export default class Information extends Component {
  state = {
    year: new Date().getFullYear()-1,
    queryDeptIds: '',
    page: 1,
    rows: 10,
    pageSize: 10,
    current: 1,
    level:'',
  };

  componentDidMount() {

  }

  //YearSelect改变时子组件触发
  yearChange = planYear => {
    this.setState(
      {
        year: planYear,
      },
      () => {
        this.reqData(this.state);
      }
    );
  };

  //绩效等级
  // levelChange =  (value)=> {
  //   console.log(value);
  // };

  //部门选择器初始化执行
  initPage = deptArray => {
    let deptStr = deptArray.toString();
    let level = this.state.level;
    if(this.props.location.query.level){
      level = this.props.location.query.level;
    }
    this.setState(
      {
        queryDeptIds: deptStr,
        level:level,
      },
      () => {
        this.reqData(this.state)
      }
    );
  };

  //搜索筛选
  orgChange = org => {
    console.log(org);
    const childStr = org.childrenDeptId.toString();
    let orgStr = '';
    if (!!childStr) {
      orgStr = childStr + ',' + org.currentDeptId;
    } else {
      orgStr = org.currentDeptId;
    }
    this.setState(
      {
        queryDeptIds: orgStr,
      },
      () => {
        this.reqData(this.state);
      }
    );
  };

  //判断搜索框内容种类（name;no）
  searchReq = value => {
    let reg = /^\d+$/;
    let val = '';
    //修改参数字段
    if (reg.test(value)) {
      val = {
        ...this.state,
        no: value,
      };
    } else {
      val = {
        ...this.state,
        name: encodeURIComponent(value),
      };
    }
    this.reqData(val);
  };

  //页面变化时执行
  handleStandardTableChange = (pagination, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    this.setState(
      {
        current: pagination,
        page: pagination,
        rows: filtersArg,
        pageSize: filtersArg,
      },
      () => {
        this.reqData(this.state);
      }
    );
  };

  //pageSize 变化的回调
  showSizeChange = (current, size) => {
    this.setState(
      {
        current: 1,
        page: 1,
        rows: size,
        pageSize: size,
      },
      () => {
        this.reqData(this.state);
      }
    );
  };

  //数据请求
  reqData = val => {
    this.props.dispatch({
      type: 'teamPerformance/fetchTeamPerfInfo',
      payload: val,
    });
  };

  render() {
    const {
      teamPerformance: { teamPerfInfoTbl },
    } = this.props;
    const children = ['S','A'];

    const paginationSet = {
      current: this.state.current,
      pageSizeOptions: ['5', '10', '15'],
      showQuickJumper: true,
      showSizeChanger: true,
      total: teamPerfInfoTbl.total,
      onChange: this.handleStandardTableChange,
      onShowSizeChange: this.showSizeChange,
      showTotal: function() {
        //设置显示一共几条数据
        return <div style={{ marginLeft: 0 }}>共 {teamPerfInfoTbl.total} 条数据</div>;
      },
    };

    return (
      <div>
        <Row style={{ margin: '16px 24px 0' }}>
          <Col span={3}>
            <YearSelect onInit={planYear => {this.state.planYear = planYear;}} yearChange={this.yearChange} defaultVal={this.state.year}/>
          </Col>
          <Col style={{marginLeft: -2}} span={7}>
            <OrgSelect initPage={this.initPage} onOrgChange={this.orgChange} />{' '}
          </Col>
          {/*<Col>*/}
          {/*<Select style={{ width: 80 }} placeholder="请选择" onChange={this.levelChange}>*/}
          {/*<Option value="S">S</Option>*/}
          {/*<Option value="A">A</Option>*/}
          {/*<Option value="B">B</Option>*/}
          {/*<Option value="C">C</Option>*/}
          {/*<Option value="D">D</Option>*/}
          {/*<Option value="E">E</Option>*/}
          {/*</Select>*/}
          {/*</Col>*/}
          <Col span={4} offset={10}>
            <Input.Search
              placeholder="搜索工号/姓名"
              onSearch={this.searchReq}
              style={{ width: 150, float: 'right' }}
            />
          </Col>
        </Row>
        <Row style={{ margin: '0 24px' }}>
          <Col>
            <Table
              columns={columns}
              rowKey={record => record.code}
              pagination={paginationSet}
              dataSource={teamPerfInfoTbl.data}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
