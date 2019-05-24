import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Badge, Tag, Tooltip,message } from 'antd';
import Link from 'umi/link';
import ProcessTable from '@/components/StandardTable/ProcessTable';
import processStyles from './Process.less';
import {
  genProcessApproveUrl,
  genProcessLaunchUrl,
  genProcessViewUrl,
  genSearchDateBox,
  getFormType
} from '@/utils/utils';

const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error', 'warning'];
const dateFormat = 'YYYY-MM-DD';

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
  },
};

@connect(({ process,user, loading }) => ({
  process,
  user,
  loading: loading.models.process,
}))
@Form.create()
class TodoList extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {

    const { dispatch, process, form } = this.props;
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
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'process/queryTodo',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e && e.preventDefault();
    this.search();
  };

  handleSearch2 = (val, e) => {
    e && e.preventDefault();
    this.search();
  };

  search = () => {
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

  renderSimpleForm() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    const RangePicker = DatePicker.RangePicker;

    const {
      process: { systems },
      loading,
    } = this.props;

    const systemOpts = systems.map(system => (
      <Option key={system.sn ? system.sn : 'all'}>{system.name}</Option>
    ));
    const moments = genSearchDateBox();
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col span={20}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="提交日期" {...formItemLayout}>
                  {getFieldDecorator(`date`, {
                    initialValue: moments,
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<RangePicker format={dateFormat} />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="关键字" {...formItemLayout}>
                  {getFieldDecorator(`keyWords`, {
                    initialValue: '',
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<Search placeholder="标题/流程编号/提交人" onSearch={this.handleSearch2} />)}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <FormItem wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                {' '}
                重置{' '}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  showTitleInfo =() =>{
    message.warn("请在业务系统编辑表单！");
  }

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
    return html;
  }

  delayTime(val, record, index) {
    let html = '';
    let level = 0;
    if (val < 24) {
      html = val + '小时';
      level = 1;
    } else if (val >= 24 && val <= 99) {
      html = Math.floor(val / 24) + '天' + (val % 24) + '小时';
      level = 4;
    } else {
      html = Math.floor(val / 24) + '天' + (val % 24) + '小时';
      level = 3;
    }
    return <Badge status={statusMap[level]} text={html} />;
  }

  render() {
    const {
      process: { todoData },
      loading,
    } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'num',
        width: 60,
        key: 'processInstanceId',
        render: (text, r, i) => <span>{i + 1}</span>,
      },
      {
        title: '状态',
        dataIndex: 'processStatusName',
        width: 60,
        key: 'processStatusName',
        align: 'center',
        render: text => (
          <Tag style={{ width: 60, textAlign: 'center' }} color="volcano">
            {text}
          </Tag>
        ),
      },
      {
        title: '停留时间',
        dataIndex: 'stayHour',
        width: 150,
        key: 'stayHour',
        render: this.delayTime,
      },
      {
        title: '流程标题',
        dataIndex: 'formName',
        key: 'formName',
        render: this.formatterName.bind(this),
      },
      {
        title: '提交人',
        dataIndex: 'startPersonName',
        width: 80,
        key: 'startPersonName',
      },
      {
        title: '提交时间',
        sorter: true,
        align: 'center',
        dataIndex: 'startTime',
        width: 165,
        key: 'startTime',
      },
      {
        title: '总耗时',
        dataIndex: 'totalTime',
        width: 120,
        key: 'totalTime',
      },
      {
        title: '所属系统',
        dataIndex: 'systemName',
        width: 150,
        key: 'systemName',
      },
    ];
    return (
      <Fragment>
        <Card bordered={false} className={processStyles.mainBox}>
          <div>{this.renderForm()}</div>
          <ProcessTable
            rowKey="taskId"
            loading={loading}
            data={todoData}

            columns={columns}
            showPagination={true}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </Fragment>
    );
  }
}
export default TodoList

