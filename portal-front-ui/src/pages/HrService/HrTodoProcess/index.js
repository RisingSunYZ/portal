import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { nullToZero,getFormType } from '../../../utils/utils';
import ProcessTable from '@/components/StandardTable/ProcessTable';
import styles from './index.less';
@connect(({ hrProcess, loading }) => ({
  hrProcess,
  loading: loading.models.hrProcess,
}))
export default class HrToDoProcess extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'hrProcess/queryTodo',
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
      type: 'hrProcess/queryTodo',
      payload: params,
    });
  };
formatterName(val, row, index) {
  function info() {
    layer.msg('请在业务系统编辑表单！', { time: 1000 });
  }

  var ZC = '1',
    ZH = '2',
    BH = '3',
    ZY = '4',
    BSP = '5',
    XT = '6',
    PS = '7';
  var UNKNOW = -1,
    ZDYBD = 1,
    YWXTMH = 2,
    YWXTYW = 3,
    XTLC = 4,
    ZDYBDYW = 5;

  var preMsg = '';
  var formType = getFormType(row.businessUrl);

  if (row.processStatusName != '' && row.processStatusName != '审批中') {
    preMsg = '【' + row.processStatusName + '】';
  }
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
      '/ys/process/form/approve/' +
        nullToZero(row.processDefinitionKey) +
      '/' +
      nullToZero(row.processInstanceId) +
      '/' +
      nullToZero(row.businessKey) +
      '/' +
      nullToZero(row.taskId) +
      '/0'
    }
    >
    {preMsg + val}
    </a></div>
);
  if (row.processDefinitionKey == 'turn_read') {
    //如果是知会和转阅跳转查看页面
    html = (<div
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
        nullToZero(row.processInstanceId) +
        '/' +
        nullToZero(row.businessKey) +
        '/' +
        nullToZero(row.taskId) +
        '/0'
      }
      >
      {preMsg + val}
      </a></div>
  );
  } /*else if (row.taskType == BSP) {
      html = <span onClick={info}>{val}</span>;
    } */ else {
    if (row.processDefinitionType == YWXTMH) {
      if (row.processStatus == 'CH' || row.processStatus == 'BH') {
        html = (<div
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
            '/ys/process/form/launch/' +
              nullToZero(row.processDefinitionKey) +
            '/' +
            nullToZero(row.processInstanceId) +
            '/' +
            nullToZero(row.businessKey) +
            '/' +
            nullToZero(row.taskId) +
            '/' +
            formType
          }
          >
          {preMsg + val}
          </a></div>
      );
      } else {
        html = (<div
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
            '/ys/process/form/approve/' +
              nullToZero(row.processDefinitionKey) +
            '/' +
            nullToZero(row.processInstanceId) +
            '/' +
            nullToZero(row.businessKey) +
            '/' +
            nullToZero(row.taskId) +
            '/0'
          }
          >
          {preMsg + val}
          </a></div>
      );
      }
    } else if (row.processDefinitionType == YWXTYW) {
      if (row.processStatus == 'CH' || row.processStatus == 'BH') {
        html = (<div
        style={{
          textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '180px',
            overflow: 'hidden',
        }}
      ><span  onClick={info}>{preMsg + val}</span></div>);
      } else {
        html = (<div
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
            '/ys/process/form/approve/' +
              nullToZero(row.processDefinitionKey) +
            '/' +
            nullToZero(row.processInstanceId) +
            '/' +
            nullToZero(row.businessKey) +
            '/' +
            nullToZero(row.taskId) +
            '/0'
          }
          >
          {preMsg + val}
          </a></div>
      );
      }
    } else if (row.processDefinitionType == ZDYBD || row.processDefinitionType == ZDYBDYW) {
      if (row.processStatus == 'CH' || row.processStatus == 'BH') {
        html = (<div
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
            '/ys/process/form/launch/' +
              nullToZero(row.processDefinitionKey) +
            '/' +
            nullToZero(row.processInstanceId) +
            '/' +
            nullToZero(row.businessKey) +
            '/' +
            nullToZero(row.taskId) +
            '/' +
            formType
          }
          >
          {preMsg + val}
          </a></div>
      );
      } else {
        html = (<div
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
            '/ys/process/form/approve/' +
              nullToZero(row.processDefinitionKey) +
            '/' +
            nullToZero(row.processInstanceId) +
            '/' +
            nullToZero(row.businessKey) +
            '/' +
            nullToZero(row.taskId) +
            '/0'
          }
          >
          {preMsg + val}
          </a></div>
      );
      }
    }
  }
  return html;
}
  render() {
    const {
      hrProcess: { data ,pagination},
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
        title: '待办事项',
        dataIndex: 'formName',
        width: 100,
        key: 'formName',
        render: this.formatterName,
      },
      {
        title: '提交时间',
        dataIndex: 'startTime',
        width: 80,
        key: 'startTime',
        onCell: this.cellFormat,
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '80px',
              overflow: 'hidden',
            }}
          >
            {text}
          </div>
        ),
      },
      {
        title: '停留时间',
        dataIndex: 'totalTime',
        width: 60,
        key: 'totalTime',
        render: (text, r, i) => (
          <div
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '60px',
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
        dataIndex: 'startPersonName',
        key: 'startPersonName',
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
          dataSource={data.list}
          onChange={this.handleStandardTableChange}
          pagination={{pageSize:5,total:data.pagination.total,showQuickJumper:true}}
        />
      </div>
    );
  }
}
