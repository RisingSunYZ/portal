import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import {
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Steps,
  Card,
  Popover,
  Badge,
  Table,
  Select,
  Alert,
} from 'antd';
import classNames from 'classnames';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Index.less';
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
const FormItem = Form.Item;
const Search = Input.Search;
const action = (
  <Fragment>
    <Button type="primary">
      <Icon type="plus" />
      发起流程
    </Button>
  </Fragment>
);

const extra = (
  <Row>
    <Col xs={24} sm={12}>
      <div className={styles.textSecondary}>状态</div>
      <div className={styles.heading}>待审批</div>
    </Col>
    <Col xs={24} sm={12}>
      <div className={styles.textSecondary}>订单金额</div>
      <div className={styles.heading}>¥ 568.08</div>
    </Col>
  </Row>
);

const onClose = function(e) {
  console.log(e, 'I was closed.');
};
const tabList = [
  {
    key: 'todo',
    tab: '待办',
  },
  {
    key: 'already',
    tab: '已办',
  },
  {
    key: 'sendered',
    tab: '已发',
  },
  {
    key: 'draft',
    tab: '草稿',
  },
  {
    key: 'processModel',
    tab: '流程模板',
  },
];
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
function handleChange(value) {
  console.log(`selected ${value}`);
}

class AdvancedSearchForm extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  // To generate mock Form.Item
  getFields() {
    const count = this.state.expand ? 10 : 6;
    const { getFieldDecorator } = this.props.form;
    const children = [];
    children.push(
      <Col span={8}>
        <FormItem {...formItemLayout} label="提交日期">
          {getFieldDecorator(`date`, {
            rules: [
              {
                required: true,
                message: 'Input something!',
              },
            ],
          })(
            <RangePicker
              ranges={{
                Today: [moment(), moment()],
                'This Month': [moment(), moment().endOf('month')],
              }}
            />
          )}
        </FormItem>
      </Col>
    );

    children.push(
      <Col span={6}>
        <FormItem {...formItemLayout} label="所属系统">
          {getFieldDecorator(`system`, {
            rules: [
              {
                required: true,
                message: 'Input something!',
              },
            ],
          })(
            <Select defaultValue="lucy" style={{ width: 120 }}>
              <Option value="jack">权限系统</Option>
              <Option value="lucy">考勤系统</Option>
              <Option value="disabled">MDM</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          )}
        </FormItem>
      </Col>
    );
    children.push(
      <Col span={6}>
        <FormItem {...formItemLayout} label="">
          {getFieldDecorator(`system`, {
            rules: [
              {
                required: true,
                message: 'Input something!',
              },
            ],
          })(
            <Search
              placeholder="input search text"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
          )}
        </FormItem>
      </Col>
    );
    children.push(
      <Col span={4}>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
          {' '}
          重置{' '}
        </Button>
      </Col>
    );

    return children;
  }

  render() {
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>{this.getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }} />
        </Row>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);

const popoverContent = (
  <div style={{ width: 160 }}>
    吴加号
    <span className={styles.textSecondary} style={{ float: 'right' }}>
      <Badge status="default" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>未响应</span>} />
    </span>
    <div className={styles.textSecondary} style={{ marginTop: 4 }}>
      耗时：2小时25分钟
    </div>
  </div>
);

const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
      {dot}
    </Popover>
  ) : (
    dot
  );

const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '停留时间',
    dataIndex: 'waitTime',
    key: 'waitTime',
  },
  {
    title: '流程标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '提交人',
    dataIndex: 'creator',
    key: 'creator',
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '总耗时',
    dataIndex: 'totalTime',
    key: 'totalTime',
  },
  {
    title: '所属系统',
    dataIndex: 'systemName',
    key: 'systemName',
    render: text =>
      text === 'agree' ? (
        <Badge status="success" text="成功" />
      ) : (
        <Badge status="error" text="驳回" />
      ),
  },
  {
    title: '操作时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: '备注',
    dataIndex: 'memo',
    key: 'memo',
  },
];

@Form.create()
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class AdvancedProfile extends Component {
  state = {
    operationkey: 'tab1',
    stepDirection: 'horizontal',
    modalVisible: false,
    expandForm: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchAdvanced',
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  render() {
    const { stepDirection } = this.state;
    const { profile, loading } = this.props;
    const { advancedOperation1, advancedOperation2, advancedOperation3 } = profile;
    const contentList = {
      tab1: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation1}
          columns={columns}
        />
      ),
    };

    return (
      <Card className={styles.tabsCard} bordered={true}>
        <WrappedAdvancedSearchForm />
        <Alert message="Informational Notes" type="info" showIcon onClose={onClose} closable />
        {contentList[this.state.operationkey]}
      </Card>
    );
  }
}
