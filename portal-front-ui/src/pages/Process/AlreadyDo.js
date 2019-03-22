import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Tag,
} from 'antd';
import ProcessTable from '@/components/StandardTable/ProcessTable';
import { Link } from 'dva/router';
import {genProcessViewUrl, genSearchDateBox} from '../../utils/utils';
import processStyles from './Process.less';


const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
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
class AlreadyDo extends PureComponent {
  state = {
    modalVisible: false,
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
        type: 'process/queryAlreadyDo',
        payload: values,
      });
    });

    // dispatch({
    //   type: 'process/fetchAllSystems',
    // });
  }

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
      type: 'process/queryAlreadyDo',
      payload: params,
    });
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
      type: 'process/queryAlreadyDo',
      // payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'process/queryAlreadyDo',
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
        type: 'process/queryAlreadyDo',
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
              {/*<Col span={8}>*/}
                {/*<FormItem label="所属系统" {...formItemLayout}>*/}
                  {/*{getFieldDecorator(`systemSn`, {*/}
                    {/*rules: [*/}
                      {/*{*/}
                        {/*required: false,*/}
                        {/*message: 'Input something!',*/}
                      {/*},*/}
                    {/*],*/}
                  {/*})(<Select placeholder="请选择系统">{systemOpts}</Select>)}*/}
                {/*</FormItem>*/}
              {/*</Col>*/}
              <Col span={8}>
                <FormItem label="状态" {...formItemLayout}>
                  {getFieldDecorator(`processStatus`, {
                    rules: [
                      {
                        required: false,
                        message: 'Input something!',
                      },
                    ],
                  })(
                    <Select placeholder="请选择状态">
                      <option value="">所有</option>
                      <option value="SPZ">审批中</option>
                      <option value="BH">驳回</option>
                      <option value="CH">撤回</option>
                      <option value="ZC">暂存</option>
                      <option value="JQ">加签</option>
                      <option value="BJ">办结</option>
                      <option value="ZZ">终止</option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="关键字" {...formItemLayout}>
                  {getFieldDecorator(`executionName`, {
                    initialValue: '',
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<Search placeholder="标题/流程编号/提交人" onSearch={this.handleSearch2} />)}
                </FormItem>
              </Col>
              {/*<Col span={8}>*/}
                {/*<FormItem label="提交人" {...formItemLayout}>*/}
                  {/*{getFieldDecorator(`createName`, {*/}
                    {/*initialValue: '',*/}
                    {/*rules: [*/}
                      {/*{*/}
                        {/*required: false,*/}
                      {/*},*/}
                    {/*],*/}
                  {/*})(<Search placeholder="提交人" onSearch={this.handleSearch2} />)}*/}
                {/*</FormItem>*/}
              {/*</Col>*/}
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


  formatterName (val, row) {
    const url = genProcessViewUrl(row.processDefinitionKey, row.procInstId, row.businessKey, row.taskId);
    return <Link target="_blank" to={url}>{val}</Link>;
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      process: { alreadyDoData },
      loading,
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'num',
        width: 60,
        key: 'taskId',
        render: (text, r, i) => <span>{i + 1}</span>,
      },
      {
        title: '状态',
        dataIndex: 'processStatusName',
        width: 80,
        key: 'processStatusName',
        render: text =>
          text === '办结' || text === '终止' ? (
            <Tag style={{ width: 50, textAlign: 'center' }} color="green">
              {text}
            </Tag>
          ) : (
            <Tag style={{ width: 50, textAlign: 'center' }} color="volcano">
              {text}
            </Tag>
          ),
      },
      {
        title: '流程标题',
        dataIndex: 'procInstName',
        key: 'procInstName',
        render: this.formatterName,
      },
      {
        title: '提交人',
        dataIndex: 'creatorName',
        key: 'creatorName',
        width: 80,
      },
      {
        title: '审批时间',
        sorter: true,
        dataIndex: 'endTime',
        width: 180,
        key: 'endTime',
      },
      {
        title: '总耗时',
        dataIndex: 'startTime',
        width: 120,
        key: 'startTime',
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
            rowKey="id"
            loading={loading}
            data={alreadyDoData}
            columns={columns}
            showPagination={true}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </Fragment>
    );
  }
}
export default AlreadyDo
