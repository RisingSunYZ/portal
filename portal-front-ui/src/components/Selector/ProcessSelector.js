import React, { Component } from 'react';
import classNames from 'classnames';
import { Modal, Tabs } from 'antd';
import Link from "umi/link";
import ProcessTable from '@/components/StandardTable/ProcessTable';
import { connect } from 'dva/index';
import styles from './index.less';
import { getFormType, nullToZero } from '@/utils/utils';

const TabPane = Tabs.TabPane;

@connect(({ process, loading }) => ({
  process,
  loading: loading.models.process,
}))
class ProcessSelector extends Component {
  state = {
    visible: this.props.visible,
    selectedRows: [],
    disabled: true,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.visible, disabled: nextProps.process.disabled });
  }

  componentDidMount() {
    const { dispatch } = this.props;
  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'process/queryTodo',
        payload: values,
      });
    });
  };

  handleCancel = (value, checked) => {
    this.props.onSelect({});
  };

  handleOk = () => {
    this.props.onSelect(this.state.selectedRows);
  };

  formatterNameToDo(val, row, index) {
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
    var formType=getFormType(row.businessUrl);
    if (row.processStatusName != '' && row.processStatusName != '审批中') {
      preMsg = '【' + row.processStatusName + '】';
    }
    var html = (
      <Link
        target="_blank"
        to={
          '/process/form/approve/' +
          nullToZero(row.processDefinitionKey) +
          '/' +
          nullToZero(row.processInstanceId) +
          '/' +
          nullToZero(row.businessKey) +
          '/' +
          nullToZero(row.taskId) +'/0'
        }
      >
        {preMsg + val}
      </Link>
    );
    if (row.processDefinitionKey == 'turn_read') {
      //如果是知会和转阅跳转查看页面
      html = (
        <Link
          target="_blank"
          to={
            '/process/form/view/' +
            nullToZero(row.processDefinitionKey) +
            '/' +
            nullToZero(row.processInstanceId) +
            '/' +
            nullToZero(row.businessKey) +
            '/' +
            nullToZero(row.taskId) +
            '/' +
            nullToZero(row.taskType)
          }
        >
          {preMsg + val}
        </Link>
      );
    } else if (row.taskType == BSP) {
      html = <span>{val}</span>;
    } else {
      if (row.processDefinitionType == YWXTMH) {
        if (row.processStatus=='CH'||row.processStatus=='BH') {
          html = (
            <Link
              target="_blank"
              to={
                '/process/form/launch/' +
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
            </Link>
          );
        } else {
          html = (
            <Link
              target="_blank"
              to={
                '/process/form/approve/' +
                nullToZero(row.processDefinitionKey) +
                '/' +
                nullToZero(row.processInstanceId) +
                '/' +
                nullToZero(row.businessKey) +
                '/' +
                nullToZero(row.taskId)+'/0'
              }
            >
              {preMsg + val}
            </Link>
          );
        }
      } else if (row.processDefinitionType == YWXTYW) {
        if (row.processStatus=='CH'||row.processStatus=='BH') {
          html = <span>{preMsg + val}</span>;
        } else {
          html = (
            <Link
              target="_blank"
              to={
                '/process/form/approve/' +
                nullToZero(row.processDefinitionKey) +
                '/' +
                nullToZero(row.processInstanceId) +
                '/' +
                nullToZero(row.businessKey) +
                '/' +
                nullToZero(row.taskId)+'/0'
              }
            >
              {preMsg + val}
            </Link>
          );
        }
      } else if (row.processDefinitionType == ZDYBD || row.processDefinitionType == ZDYBDYW) {
        if (row.processStatus=='CH'||row.processStatus=='BH') {
          html = (
            <Link
              target="_blank"
              to={
                '/process/form/launch/' +
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
            </Link>
          );
        } else {
          html = (
            <Link
              target="_blank"
              to={
                '/process/form/approve/' +
                nullToZero(row.processDefinitionKey) +
                '/' +
                nullToZero(row.processInstanceId) +
                '/' +
                nullToZero(row.businessKey) +
                '/' +
                nullToZero(row.taskId)+'/0'
              }
            >
              {preMsg + val}
            </Link>
          );
        }
      }
    }
    return html;
  }

  formatterNameAlreadyDo(val, row, index) {
    var html = (
      <Link
        target="_blank"
        to={
          '/process/form/view/' +
          nullToZero(row.processDefinitionKey) +
          '/' +
          nullToZero(row.procInstId) +
          '/' +
          nullToZero(row.businessKey) +
          '/' +
          nullToZero(row.taskId)+ '/0'
        }
      >
        {val}
      </Link>
    );
    return html;
  }

  formatterNameAlreadySend(val, row, index) {
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
    var formType=getFormType(row.businessUrl);
    var preMsg = '';
    if (row.status != '' && row.status != '审批中') {
      preMsg = '【' + row.status + '】';
    }
    var html = (
      <Link
        target="_blank"
        to={
          '/process/form/view/' +
          nullToZero(row.processDefinitionKey) +
          '/' +
          nullToZero(row.procInstId) +
          '/' +
          nullToZero(row.businessKey) +
          '/' +
          nullToZero(row.taskId) + '/0'

        }
      >
        {preMsg + val}
      </Link>
    );
    return html;
  }

  handleStandardTableChangeToDo = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'process/queryTodo',
      payload: params,
    });
  };

  handleStandardTableChangeAlreadyDo = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'process/queryAlreadyDo',
      payload: params,
    });
  };

  handleStandardTableChangeToAlreadySend = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'process/queryAlreadySend',
      payload: params,
    });
  };

  changeTab =(key)=> {

    const { dispatch } = this.props;
    //点击tab切换时禁用tab等数据加载完毕启用tab切换
    dispatch({type: 'process/disabledTab'});
    switch (key) {
      case 'queryTodo':
        dispatch({type: 'process/queryTodo'});
        break;
      case 'queryAlreadyDo':
        dispatch({type: 'process/queryAlreadyDo'});
        break;
      case 'queryAlreadySend':
        dispatch({type: 'process/queryAlreadySend'});
        break;
      default:
        break;
    }

  };

  render() {
    // const { value, expand } = this.state;
    const { process: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columnsTodo = [
      {
        title: '序号',
        dataIndex: 'num',
        key: 'processInstanceId',
        width: 60,
        render: (text, r, i) => <span>{i + 1}</span>,
      },
      {
        title: '状态',
        dataIndex: 'processStatusName',
        key: 'processStatusName',
        width: 100,
      },

      {
        title: '流程标题',
        dataIndex: 'formName',
        key: 'formName',
        render: this.formatterNameToDo,
      },
      {
        title: '提交人',
        dataIndex: 'startPersonName',
        key: 'startPersonName',
        width: 100,
      },
      {
        title: '提交时间',
        sorter: true,
        dataIndex: 'startTime',
        key: 'startTime',
        width: 140,
      },
    ];

    const columnsAlreadyDo = [
      {
        title: '序号',
        dataIndex: 'num',
        key: 'taskId',
        render: (text, r, i) => <span>{i + 1}</span>,
        width: 60,
      },
      {
        title: '状态',
        dataIndex: 'processStatusName',
        key: 'processStatusName',
        width: 100,
      },
      {
        title: '流程标题',
        dataIndex: 'procInstName',
        key: 'procInstName',
        render: this.formatterNameAlreadyDo,
      },
      {
        title: '提交人',
        dataIndex: 'creatorName',
        key: 'creatorName',
        width: 100,
      },
      {
        title: '审批时间',
        sorter: true,
        dataIndex: 'endTime',
        key: 'endTime',
        width: 140,
      },
      {
        title: '总耗时',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 100,
      },
      {
        title: '所属系统',
        dataIndex: 'systemName',
        key: 'systemName',
        width: 100,
      },
    ];

    const columnsAlreadySend = [
      {
        title: '序号',
        dataIndex: 'num',
        key: 'procInstId',
        render: (text, r, i) => <span>{i + 1}</span>,
        width: 60,
      },
      {
        title: '状态',
        dataIndex: 'processStatusName',
        key: 'processStatusName',
        width: 100,
      },
      {
        title: '流程标题',
        dataIndex: 'name',
        key: 'name',
        render: this.formatterNameAlreadySend,
      },
      {
        title: '待办人',
        dataIndex: 'approver',
        key: 'approver',
        width: 100,
      },
      {
        title: '提交时间',
        sorter: true,
        dataIndex: 'startTime',
        key: 'startTime',
        width: 140,
      },
      {
        title: '流程耗时',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 100,
      },
      {
        title: '所属系统',
        dataIndex: 'systemName',
        key: 'systemName',
        width: 100,
      },
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectedRows:selectedRows});
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <Modal
        className={styles.userSelectorModal}
        title="选择流程"
        width="60%"
        height="500px"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        cancelText=""
        bodyStyle={{ padding:'4px 24px 0' }}
        zIndex={10000}
      >
        <Tabs defaultActiveKey="queryTodo" onChange={this.changeTab.bind(this)}>
          <TabPane tab="未处理"  disabled={this.state.disabled} key="queryTodo">
            <div style={{height:'500px'}} >
              <ProcessTable
                loading={loading}
                data={data}
                columns={columnsTodo}
                showPagination={true}
                scroll={{y: 300 }}
                rowSelection={rowSelection}
                onChange={this.handleStandardTableChangeToDo}
              />
            </div>
          </TabPane>
          <TabPane tab="已处理" disabled={this.state.disabled} key="queryAlreadyDo">
            <div style={{height:'500px'}}>
              <ProcessTable
                loading={loading}
                data={data}
                columns={columnsAlreadyDo}
                showPagination={true}
                scroll={{y: 300 }}
                rowSelection={rowSelection}
                onChange={this.handleStandardTableChangeAlreadyDo}
              />
            </div>
          </TabPane>
          <TabPane tab="我发起的" disabled={this.state.disabled} key="queryAlreadySend">
            <div style={{height:'500px'}}>
              <ProcessTable
                loading={loading}
                data={data}
                columns={columnsAlreadySend}
                showPagination={true}
                scroll={{y: 300 }}
                rowSelection={rowSelection}
                onChange={this.handleStandardTableChangeToAlreadySend}
              />
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

// ProcessSelector.Option = TagSelectOption;

export default ProcessSelector;
