import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { nullToZero } from '../../../../utils/utils';
import ProcessTable from '@/components/StandardTable/ProcessTable';
import styles from './index.less';
@connect(({ hrProcess, loading }) => ({
  hrProcess,
  loading: loading.models.hrProcess,
}))

@connect(({ hrProcess, loading }) => ({
  hrProcess,
  loading: loading.models.hrProcess,
}))

export default class HrDoneProcess extends Component {

  componentDidMount () {
    this.props.dispatch({
      type: 'hrProcess/queryDone',
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
      type: 'hrProcess/queryDone',
      payload: params,
    });
  };
formatterName(val, row, index) {
  var html = (<div
  style={{
    textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '180px',
      overflow: 'hidden',
  }}
>
    <a
  target="_blank"
  href={
      '/ys/process/form/view/' +
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
    </a></div>
);
  return html;
}
  render() {
    const {
      hrProcess: { DoneData },
    } = this.props;
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
        <Table columns={columns} dataSource={DoneData.list}  pagination={{pageSize:5,size:"small",total:DoneData.pagination.total,onChange:this.handleStandardTableChange,showQuickJumper:true}}/>
      </div>
    );
  }
}
