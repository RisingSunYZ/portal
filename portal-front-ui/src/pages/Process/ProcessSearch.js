import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { Button, Row, Col, Card, Input, Form, Radio, DatePicker, Tag } from 'antd';
import Link from 'umi/link';
import {genSearchDateBox, getConfig} from '@/utils/utils';
import processStyle from './Process.less';
import TreeMenuSearch from '@/components/TreeMenu/TreeMenuSearch';
import ProcessTable from '@/components/StandardTable/ProcessTable';
import { UserSelect } from '@/components/Selector';

const {Search} = Input;
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
function nullToZero(param) {
  if (!param) {
    return '0';
  } else {
    return param;
  }
}
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
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
class ProcessSearch extends PureComponent {
  searchFormObj = {};
  state = { selectedKey: '', selectedPersons: [], showPagination: false, formValues: {} };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'process/queryList',
      payload: {
        data: [],
        pagination: {},
      },
    });
  }

  selectNode(selectedKeys, e) {
    this.props.form.validateFields((err, fieldsValue) => {
       if (err) return;
       if( Array.isArray( fieldsValue.creatorName ) && fieldsValue.creatorName.length >0 ){
         const person = JSON.parse( JSON.stringify(fieldsValue.creatorName) );
         delete fieldsValue.creatorName ;// 删除属性
         fieldsValue['creatorName'] = person[0].name;
       };
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      if (e.selected) {
        this.searchFormObj.categoryId = selectedKeys[0];
        this.props.dispatch({
          type: 'process/getFormDataList',
          payload: {
            ...values,
            processDefinitionKey: selectedKeys[0],
            creator: this.state.selectedPersons.length ? this.state.selectedPersons[0].no : null,
          },
        });
        this.setState({
          selectedKey: selectedKeys[0],
          showPagination: true,
        });
      }
    });
  }

  doSearch(e) {
    e.preventDefault();
    const { dispatch, form } = this.props;
    if (this.state.selectedKey != '') {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        if( Array.isArray( fieldsValue.creatorName ) ){
          const person = JSON.parse( JSON.stringify(fieldsValue.creatorName) );
          delete fieldsValue.creatorName ;// 删除属性
          fieldsValue['creatorName'] = person[0].name;
        };
        const values = {
          ...fieldsValue,
          updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        };
        this.setState({
          formValues: values,
          showPagination: true,
        });
        this.props.dispatch({
          type: 'process/getFormDataList',
          payload: {
            ...values,
            processDefinitionKey: this.state.selectedKey,
            creator: this.state.selectedPersons.length ? this.state.selectedPersons[0].no : null,
          },
        });
      });
    } else {
      layer.msg('请先选择表单模板', { time: 1000 });
    }
  }

  changeStatus(value) {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if( Array.isArray( fieldsValue.creatorName ) ){
        const person = JSON.parse( JSON.stringify(fieldsValue.creatorName) );
        delete fieldsValue.creatorName ;// 删除属性
        fieldsValue['creatorName'] = person[0].name;
      };

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
        showPagination: true,
      });
      this.props.dispatch({
        type: 'process/getFormDataList',
        payload: {
          ...values,
          processStatus: value.target.value,
          processDefinitionKey: this.state.selectedKey,
          creator: this.state.selectedPersons.length ? this.state.selectedPersons[0].no : null,
        },
      });
    });
  }

  selectCallback = datas => {
    const { setFieldsValue } = this.props.form;
    this.setState({ selectedPersons: datas });
    if(datas.length>0){
      setFieldsValue({ creatorName: datas[0].name });
    }
  };

  handleDel(businessKey) {
    this.props.dispatch({
      type: 'process/delDraft',
      payload: {
        businessKey: businessKey,
      },
    });
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({ selectedPersons: [] });
  };
  transParams = params => {
    if (typeof params != 'undefined' && typeof params.date != 'undefined' && params.date.length) {
      params.startTime = params.date[0].format('YYYY-MM-DD') + ' 00:00:00';
      params.endTime = params.date[1].format('YYYY-MM-DD') + ' 23:59:59';
      delete params.date;
    }
  };
  export2Excel = () => {
    if (this.state.selectedKey != '') {
      var row = this.props.process.formData.list;
      if (row && row.length) {
        var code = row[0].ModelAppliedRange;
        if (code == 1 || code == 5) {
          var values = {};
          this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            if( Array.isArray( fieldsValue.creatorName ) ){
              const person = JSON.parse( JSON.stringify(fieldsValue.creatorName) );
              delete fieldsValue.creatorName ;// 删除属性
              fieldsValue['creatorName'] = person[0].name;
            };
            values = {
              ...fieldsValue,
              updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };
          });
          let formData = {
            ...values,
            processDefinitionKey: this.state.selectedKey,
            creator: this.state.selectedPersons.length ? this.state.selectedPersons[0].no : null,
          };
          this.transParams(formData);
          var url = '/rest/process/list/export2Excel?' + stringify(formData);
          location.href = url;
          return true;
        } else {
          layer.msg('业务流程不支持导出', { time: 1000 });
          return false;
        }
      } else {
        layer.msg('暂无数据', { time: 1000 });
      }
    } else {
      layer.msg('请先选择表单模板', { time: 1000 });
    }
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
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
      <Form className="ant-advanced-search-form" onSubmit={this.doSearch.bind(this)}>
        <Row gutter={24}>
          <Col span={20}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="提交人" {...formItemLayout} className={processStyle.creatorName}>
                  {getFieldDecorator(`creatorName`, {
                    initialValue: [],
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })
                  (
                    <UserSelect
                      type="input"
                      multiple={false}
                      width='100%'
                      onChange={(a)=>{this.selectCallback(a)}}
                    />
                  )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="流程编号" {...formItemLayout}>
                  {getFieldDecorator(`businessKey`, {
                    initialValue: '',
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<Input placeholder="流程编号" />)}
                </FormItem>
              </Col>
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
              <Col span={10} style={{ paddingLeft: '0' }}>
                <FormItem {...formItemLayout} label="流程状态：">
                  {getFieldDecorator('processStatus')(
                    <RadioGroup onChange={this.changeStatus.bind(this)}>
                      <RadioButton value="" defaultChecked={true}>
                        所有
                      </RadioButton>
                      <RadioButton value="BJ">已办结</RadioButton>
                      <RadioButton value="SPZ">审批中</RadioButton>
                      <RadioButton value="ZZ">终止</RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <FormItem wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType="submit" onClick={this.doSearch.bind(this)}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                重置
              </Button>
              <Button style={{ width: 136 }} onClick={this.export2Excel}>
                导出
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
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
      processDefinitionKey: this.state.selectedKey,
      creator: this.state.selectedPersons.length ? this.state.selectedPersons[0].no : null,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'process/getFormDataList',
      payload: params,
    });
  };

  formatterName(val, row, index) {
    const html = (
      <Link
        target="_blank"
        to={'/process/form/view/' + nullToZero(row.form_code) + '/' + nullToZero(row.proc_inst_id) + '/' + nullToZero(row.code) + '/0/search'}
      >
        {val}
      </Link>
    );
    return html;
  }

  render() {
    const { match, routerData } = this.props;
    const { process: { formData}, loading} = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'num',
        width: 60,
        key: 'form_id',
        render: (text, r, i) => <span>{i + 1}</span>,
      },
      {
        title: '流程编号',
        dataIndex: 'code',
        key: 'code',
        render: this.formatterName,
      },
      {
        title: '状态',
        dataIndex: 'process_type',
        width: 80,
        key: 'process_type',
        render: text => (
          <Tag style={{ width: 50, textAlign: 'center' }} color="volcano">
            {text}
          </Tag>
        ),
      },
      {
        title: '提交时间',
        dataIndex: 'launch_time',
        width: 120,
        key: 'launch_time',
        render: time => <div>{time && time.slice(0, 10)}</div>,
      },
      {
        title: '提交单位',
        dataIndex: 'launch_company',
        key: 'launch_company',
        width: 110,
      },
      {
        title: '提交部门',
        dataIndex: 'launch_department',
        width: 130,
        key: 'launch_department',
      },
      // {
      //   title: '提交部门编号',
      //   dataIndex: 'launch_department_id',
      //   width: 80,
      //   key: 'launch_department_id',
      // },
      {
        title: '提交人',
        dataIndex: 'sponsor',
        width: 80,
        key: 'sponsor',
      },
      {
        title: '工号',
        dataIndex: 'sponsor_id',
        width: 100,
        key: 'sponsor_id',
      },
    ];
    return (
      <Fragment>
        <Card bordered={false} className={processStyle.mainBox}>
          <div>{this.renderForm()}</div>
          <Row gutter={16}>
            <Col span={18} push={6}>
              <ProcessTable
                rowKey="code"
                loading={loading}
                data={formData}
                columns={columns}
                showPagination={this.state.showPagination}
                onChange={this.handleStandardTableChange}
              />
            </Col>
            <Col span={6} pull={18}>
              <Card
                className={processStyle.leftCard}
                title="流程类型"
                bordered={false}
                headStyle={{
                  minHeight: '46px',
                  background: '#fafafa',
                  paddingLeft: '10px',
                  borderRight: '1px solid #e8e8e8',
                  fontSize: '14px',
                }}
                bodyStyle={{ padding: '0' }}
              >
                <TreeMenuSearch onSelect={this.selectNode.bind(this)} />
              </Card>
            </Col>
          </Row>
        </Card>
      </Fragment>
    );
  }
}
export default ProcessSearch;
