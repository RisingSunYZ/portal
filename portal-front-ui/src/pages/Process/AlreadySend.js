import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from "umi/link";
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Tag } from 'antd';
import ProcessTable from '@/components/StandardTable/ProcessTable';

import processStyles from './Process.less';
import {genProcessViewUrl, genSearchDateBox, getFormType} from '../../utils/utils';

const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
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

@connect(({ process, loading }) => ({
  process,
  loading: loading.models.process,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    // debugger;
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
        type: 'process/queryAlreadySend',
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
      type: 'process/queryAlreadySend',
      payload: params,
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'process/queryAlreadySend',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  initDate = () => {
    // 默认时间范围
    var now = new Date();
    var endY = now.getFullYear();
    var endM = now.getMonth() + 1;
    var d = now.getDate();
    var start = endM - 12,
      startY = endY,
      startM = start;
    if (endM - 12 <= 0) {
      startM = endM + 12 - 12;
      startY = endY - 1;
    }
    if (startM < 10) {
      startM = '0' + startM;
    }
    if (endM < 10) {
      endM = '0' + endM;
    }
    if (d < 10) {
      d = '0' + d;
    }
    return [moment(startY + '-' + startM + '-' + d), moment(endY + '-' + endM + '-' + d)];
  };

  handleSearch = e => {
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
        type: 'process/queryAlreadySend',
        payload: values,
      });
    });
  };

  handleSearch2 = (val, e) => {
    e && e.preventDefault();
    this.search();
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
                      <option value="ZB">转办</option>
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
                  })(<Search placeholder="标题/流程编号" onSearch={this.handleSearch2} />)}
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

  formatterName(val, row, index) {
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
    var formType = getFormType(row.businessUrl);
    var preMsg = '';
    if (row.status != '' && row.status != '审批中') {
      preMsg = '【' + row.status + '】';
    }

    // 此参数用于后台管理的业务表单
    var bizFormSn = null;
    if (row.businessUrl && row.businessUrl.indexOf('/portal/form/biz/index-') != -1) {
      // 得到从URL中解析得到bizFormSn
      bizFormSn = row.businessUrl
        .replace(/^\/portal\/form\/biz\/index\-/gi, '')
        .replace(/\.jhtml$/gi, '');
    } else {
      bizFormSn = row.procDefId && row.procDefId.split(':')[0];
    }

    // if(bizFormSn){
    //   // 业务表单，自定义的业务表单页面内容编码 拼接
    //   row.businessUrl = this.changeParam(row.businessUrl, "bizFormSn", bizFormSn);
    // }

    const url = genProcessViewUrl(bizFormSn, row.procInstId, row.businessKey, row.taskId);
    return <Link target="_blank" to={url}>{val}</Link>;

  }
  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      process: { alreadySendData },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'num',
        width: 60,
        key: 'procInstId',
        render: (text, r, i) => <span>{i + 1}</span>,
      },
      {
        title: '状态',
        dataIndex: 'processStatusName',
        width: 80,
        align: 'center',
        key: 'processStatusName',
        render: text =>
          text === '办结' || text === '终止' ? (
            <Tag style={{ width: 60, textAlign: 'center' }} color="green">
              {text}
            </Tag>
          ) : (
            <Tag style={{ width: 60, textAlign: 'center' }} color="volcano">
              {text}
            </Tag>
          ),
      },
      {
        title: '流程标题',
        dataIndex: 'name',
        key: 'name',
        render: this.formatterName,
      },
      {
        title: '待办人',
        dataIndex: 'approver',
        width: 120,
        className: 'morePerson',
        key: 'approver',
      },
      {
        title: '提交时间',
        sorter: true,
        dataIndex: 'startTime',
        width: 165,
        align: 'center',
        key: 'startTime',
      },
      {
        title: '流程耗时',
        dataIndex: 'endTime',
        width: 120,
        key: 'endTime',
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
            data={alreadySendData}
            columns={columns}
            showPagination={true}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </Fragment>
    );
  }
}
