import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, DatePicker, Form, Input, Popconfirm, Row, Select } from 'antd';
import ProcessTable from '@/components/StandardTable/ProcessTable';
import processStyles from './Process.less';
import {genProcessLaunchUrl, genSearchDateBox, getFormType} from '../../utils/utils';

const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

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
const dateFormat = 'YYYY-MM-DD';

@connect(({ process, loading }) => ({
  process,
  loading: loading.models.process,
}))
@Form.create()
class Draft extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
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
        type: 'process/queryDrafts',
        payload: values,
      });
    });

    // dispatch({
    //   type: 'process/fetchAllSystems',
    // });
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
        type: 'process/queryDrafts',
        payload: values,
      });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

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
      type: 'process/queryDrafts',
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
      type: 'process/queryDrafts',
      payload: {},
    });
  };


  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
    const moments = genSearchDateBox();
    const systemOpts = systems.map(system => (
      <Option key={system.sn ? system.sn : 'all'}>{system.name}</Option>
    ));

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
                        message: 'Input something!',
                      },
                    ],
                  })(<RangePicker format={dateFormat} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="所属系统" {...formItemLayout}>
                  {getFieldDecorator(`systemSn`, {
                    rules: [
                      {
                        required: false,
                        message: 'Input something!',
                      },
                    ],
                  })(<Select placeholder="请选择系统">{systemOpts}</Select>)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="关键字" {...formItemLayout}>
                  {getFieldDecorator(`keyword`, {
                    initialValue: '',
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<Search placeholder="标题/流程编号" onSearch={value => console.log(value)} />)}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <FormItem wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType="submit">
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
  handleDel(businessKey) {
    this.props.dispatch({
      type: 'process/delDraft',
      payload: {
        businessKey: businessKey,
      },
    });
  }
  //删除

  urlFormat(val, row, index) {
    var formType = getFormType(row.businessUrl);
    var processInstanceId = '';
    if (typeof row.processInstanceId != 'undefined') {
      processInstanceId = row.processInstanceId;
    }
    const url = genProcessLaunchUrl(row.processDefinitionKey, row.processInstanceId, row.businessKey, row.taskId, formType);
    return <a target="_blank" href={url}>{row.name}</a>;
  }

  render() {
    const {
      process: { draftData },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'num',
        key: 'id',
        render: (text, r, i) => <span>{i + 1}</span>,
      },
      {
        title: '流程标题',
        dataIndex: 'name',
        key: 'name',
        render: this.urlFormat,
      },
      {
        title: '保存时间',
        sorter: true,
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '所属系统',
        dataIndex: 'systemName',
        key: 'systemName',
      },
      {
        title: '操作',
        dataIndex: 'opt',
        key: 'opt',
        render: (text, record) => {
          return (
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => {
                this.handleDel(record.businessKey);
              }}
            >
              <a>删除</a>
            </Popconfirm>
          );
        },
      },
    ];

    return (
      <Fragment>
        <Card bordered={false} className={processStyles.mainBox}>
          <div>{this.renderForm()}</div>
          <ProcessTable
            rowKey="id"
            loading={loading}
            data={draftData}
            columns={columns}
            showPagination={true}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </Fragment>
    );
  }
}
export default Draft;
