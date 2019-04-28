import React, { Component, Fragment } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import Link from "umi/link";
import { nullToZero,getFormType } from '@/utils/utils';
import styles from './index.less';
import {genProcessApproveUrl, genProcessLaunchUrl, genProcessViewUrl} from "../../../../utils/utils";

@connect(({ hrService, loading }) => ({
  hrService,
  loading: loading.models.hrService,
}))

export default class HrToDoProcess extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'hrService/queryTodo',
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
      type: 'hrService/queryTodo',
      payload: params,
    });
  };

  formatterName(val, row, index) {
    const ZDYBD = 1; // 自定义表单
    const YWXTMH = 2; // 业务表单门户发起
    const YWXTYW = 3; // 业务表单业务发起
    const ZDYBDYW = 5;  // 自定义表单业务发起

    let preMsg = '';
    const formType = getFormType(row.businessUrl);
    if (row.processStatusName !== '' && row.processStatusName !== '审批中') {
      preMsg = `【${row.processStatusName}】`;
    }
    let url = genProcessApproveUrl(row.processDefinitionKey, row.processInstanceId, row.businessKey, row.taskId);
    let html = <Link target="_blank" to={url}>{preMsg + val}</Link>;

    if (row.processDefinitionKey === 'turn_read') {
      url = genProcessViewUrl(row.processDefinitionKey, row.processInstanceId, row.businessKey, row.taskId);
      // 如果是知会和转阅跳转查看页面
      html = <Link target="_blank" to={url}>{preMsg + val}</Link>;
    }else {
      if (row.processDefinitionType === YWXTMH) {
        if (row.name=='提交人') {
          url = genProcessLaunchUrl(row.processDefinitionKey, row.processInstanceId, row.businessKey, row.taskId, formType);
          html = <Link target="_blank" to={url}>{preMsg + val}</Link>;
        } else {
          url = genProcessApproveUrl(row.processDefinitionKey, row.processInstanceId, row.businessKey, row.taskId);
          html = <Link target="_blank" to={url}>{preMsg + val}</Link>;
        }
      } else if (row.processDefinitionType === YWXTYW) {
        if (row.name === '提交人') {
          html = <Tooltip title="请在业务系统编辑表单！"><span onClick={this.showTitleInfo}>{preMsg + val}</span></Tooltip>;
        } else {
          url = genProcessApproveUrl(row.processDefinitionKey, row.processInstanceId, row.businessKey, row.taskId);
          html = <Link target="_blank" to={url}>{preMsg + val}</Link>;
        }
      } else if (row.processDefinitionType === ZDYBD || row.processDefinitionType === ZDYBDYW) {
        if (row.name==='提交人') {
          url = genProcessLaunchUrl(row.processDefinitionKey, row.processInstanceId, row.businessKey, row.taskId, formType);
          html = <Link target="_blank" to={url}>{preMsg + val}</Link>;
        } else {
          url = genProcessApproveUrl(row.processDefinitionKey, row.processInstanceId, row.businessKey, row.taskId);
          html = <Link target="_blank" to={url}>{preMsg + val}</Link>;
        }
      }
    }
    return (<div style={{
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '180px',
      overflow: 'hidden',
    }}> {html}</div>);
  }

  render() {
    const {hrService: { todoData ,pagination}} = this.props;
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
          dataSource={todoData.list}
          onChange={this.handleStandardTableChange}
          pagination={{pageSize:5,total:todoData.pagination.total,showQuickJumper:true}}
        />
      </div>
    );
  }
}
