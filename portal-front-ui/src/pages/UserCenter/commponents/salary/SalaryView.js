import React, { Component, Fragment } from 'react';
import { Table, Card, Input, Breadcrumb } from 'antd';
import { connect } from 'dva/index';
import styles from '../../Salary/index.less';

const { TextArea } = Input;
const baseColumns = [
  {
    title: '工资发放月份',
    dataIndex: 'smonth',
  },
  {
    title: '工资发放部门',
    dataIndex: 'deptName',
  },
  {
    title: '月基本工资',
    dataIndex: 'mbasePay',
  },
  {
    title: '月绩效工资',
    dataIndex: 'mperfPay',
  }];
const salaryColumns = [
  {
    title: '基本工资',
    dataIndex: 'basePay',
  },
  {
    title: '绩效工资',
    dataIndex: 'perfPay',
  },
  {
    title: '加班工资',
    dataIndex: 'otPay',
  },
  {
    title: '奖金',
    dataIndex: 'bonus',
  },{
    title: '合计',
    dataIndex: 'shTotal',
  }];
const subsidyColumns = [
  {
    title: '餐补',
    dataIndex: 'mealAllowance',
  },
  {
    title: '住房补助',
    dataIndex: 'housingSubsidy',
  },
  {
    title: '通讯补贴',
    dataIndex: 'comtSubsidy',
  },
  {
    title: '交通补贴',
    dataIndex: 'trafficSubsidy',
  },{
    title: '高温补贴',
    dataIndex: 'highTemSubsidy',
  },{
    title: '其他补贴',
    dataIndex: 'otherSubsidy',
  },{
    title: '补贴/补扣',
    dataIndex: 'reissueBuckle',
  },{
    title: '合计',
    dataIndex: 'subTotal',
  }];
const deductColumns = [
  {
    title: '社保',
    dataIndex: 'socialSecurity',
  },
  {
    title: '公积金',
    dataIndex: 'acctFund',
  },
  {
    title: '其他',
    dataIndex: 'otherBuckle',
  },
  {
    title: '个税',
    dataIndex: 'pit',
  },{
    title: '合计',
    dataIndex: 'pitTotal',
  }];

const specialDeductColumns = [
  {
    title: '累积子女教育',
    dataIndex: 'cumulativeChildEducation',
  },
  {
    title: '累积住房贷款利息',
    dataIndex: 'cumulativeInterestOnHousingLoans',
  },
  {
    title: '累积住房租金',
    dataIndex: 'cumulativeHousingRent',
  },
  {
    title: '累积赡养老人',
    dataIndex: 'cumulativeSupportForTheElderly',
  },{
    title: '累积继续教育',
    dataIndex: 'cumulativeContinuingEducation',
  }];

@connect(({ salary, loading }) => ({
  salary,
  loading: loading.models.salary,
}))
export default class SalaryView extends Component {
  constructor(props){
    super(props);
    this.state = {
      enabled: props.enabled
    }
  }
  state = {};
  componentDidMount() {
  }

  render() {
    const {salary:{data}} = this.props;
    console.log(data);
    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{padding: 0}} style={{marginBottom: 16}}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="/ys/user-center">个人总览</a></Breadcrumb.Item>
              <Breadcrumb.Item>薪资条</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">薪资条</div>
          </div>
        </Card>
        <Card bordered={false} bodyStyle={{padding: '0 24px 40px'}}>
          <div style={{marginBottom: 16}}>
            <p className="cardTitle"><i></i>基本信息</p>
            <Table columns={baseColumns} pagination={false} dataSource={data} />
          </div>
          <div style={{marginBottom: 16}}>
            <p className="cardTitle"><i></i>应发工资（元）</p>
            <Table columns={salaryColumns} pagination={false} dataSource={data}/>
          </div>
          <div style={{marginBottom: 16}}>
            <p className="cardTitle"><i></i>应发福利（元）</p>
            <Table columns={subsidyColumns} pagination={false} dataSource={data} />
          </div>
          <p className={styles.totalBox}>
            <span className={styles.forceText}>工资总额（元）</span> = 应发工资 + 应发福利
            <span className={styles.forceNumber}>{data[0].grossPay}</span>
          </p>
          <div style={{marginBottom: 16}}>
            <p className="cardTitle"><i></i>代扣项目（元）</p>
            <Table columns={deductColumns} pagination={false} dataSource={data} />
          </div>
          <p className={styles.totalBox}>
            <span className={styles.forceText}>实发合计（元）</span> = 工资总额 - 代扣项目
            <span className={styles.forceNumber}>{data[0].payTotal}</span>
          </p>
          <div style={{marginBottom: 16}}>
            <p className="cardTitle"><i></i>专项附加扣除额度（元）</p>
            <Table columns={specialDeductColumns} pagination={false} dataSource={data} />
          </div>
          <p>备注</p>
          <TextArea disabled rows={4} defaultValue={data[0].remark} />
          <div style={{fontWeight:"bold",color:"rgba(0,0,0,0.85)",fontSize:"11px",marginTop:"5px"}}>
            说明:2019年一月一日起实行综合所得计税,月度个税=累积应税收入-累积免税额度-累积已扣个税，其中免税额度包含社保公积金
            、专项附加扣除等；专项附加扣除额度以每月税务系统数据为准，如有数据延迟的顺延至下月补扣。
          </div>
        </Card>
      </div>
    );
  }
}
