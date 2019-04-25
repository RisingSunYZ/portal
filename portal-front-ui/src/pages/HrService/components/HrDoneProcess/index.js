import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { nullToZero } from '@/utils/utils';
import styles from './index.less';
import Link from "umi/link";

@connect(({ hrService, loading }) => ({
  hrService,
  loading: loading.models.hrService,
}))

export default class HrDoneProcess extends Component {

  componentDidMount () {
    this.props.dispatch({
      type: 'hrService/queryDone',
      payload: { page: 1, rows: 5 },
    });
  }
  handleStandardTableChange = (pagination, filtersArg) => {
    const { dispatch } = this.props;
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
    dispatch({
      type: 'hrService/queryDone',
      payload: params,
    });
  };
formatterName(val, row, index) {
  const html = (<div
  style={{
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '180px',
      overflow: 'hidden',
  }}
>
    <Link target="_blank"
      to={
          '/process/form/view/' +
            nullToZero(row.processDefinitionKey) +
          '/' +
          nullToZero(row.procInstId) +
          '/' +
          nullToZero(row.businessKey) +
          '/' +
          nullToZero(row.taskId) +
          '/0'
        }
    >
    {val}
    </Link></div>
);
  return html;
}
  render() {
    const {
      hrService: { DoneData }} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'num',
        width: 40,
        key: 'processInstanceId',
        render: (text, r, i) => <span>{i + 1}</span>,
      },
      {
        title: '状态',
        dataIndex: 'processStatusName',
        width: 35,
        key: 'processStatusName',
        render: (text, r, i) => {
          let colour = '';
          if(text=='审批中'){
            colour = '#1890FF';
          }else if(text=='办结'){
            colour = '#52C41A';
          }else if(text=='撤回'){
            colour = '#F5222D';
          }else if(text=='驳回'){
            colour = '#FAAD14'
          }else if(text=='终止'){
            colour = '#000000';
          }
          return (
            <span style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '35px',
              overflow: 'hidden',
            }}>
              <span className={styles.point} style={{backgroundColor:colour}}></span>
              <span className={styles.status}>{text}</span>
          </span>
          )
        }
      },
      {
        title: '已办事项',
        dataIndex: 'procInstName',
        width: 130,
        key: 'procInstName',
        render: this.formatterName,
      },
      {
        title: '审批时间',
        dataIndex: 'endTime',
        width: 100,
        key: 'endTime',
        onCell: this.cellFormat,
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100px',
              overflow: 'hidden',
            }}
          >
            {text}
          </div>
        ),
      },
      {
        title: '提交人',
        width: 50,
        dataIndex: 'creatorName',
        key: 'creatorName',
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '50px',
              overflow: 'hidden',
            }}
          >
            {text}
          </div>
        ),
      },
    ];
    return (
      <div className="hrMainTable">
        <Table
          columns={columns}
          dataSource={DoneData.list}
          onChange={this.handleStandardTableChange}
          pagination={{pageSize:5,total:DoneData.pagination.total,showQuickJumper:true}}
        />
      </div>
    );
  }
}
