import React, { PureComponent, Fragment } from 'react';
import { Table, Card, Input, Breadcrumb, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import styles from './UserPandect.less';
import { connect } from 'dva/index';

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    render: (text, record) => {
      let url = '/ys/user-team/userPandectForTeam/' + Base64.encode(record.no);
      return (
        <span>
          <a href={url} target="_blank">
            {text}
          </a>
        </span>
      );
    },
  },
  {
    title: '公司',
    dataIndex: 'cname',
  },
  {
    title: '部门',
    dataIndex: 'dname',
  },
  {
    title: '岗位',
    dataIndex: 'postname',
  },
  {
    title: '职级',
    dataIndex: 'positionName',
  },
];

@connect(({ authorizedStrength, loading }) => ({
  authorizedStrength,
  loading: loading.models.authorizedStrength,
}))
export default class AuthorizedStrengthDetails extends PureComponent {
  state = {
    deptId: '',
    postName: '',
    keyWord: '',
    page: '1',
    rows: '10',
  };
  componentDidMount() {
    this.setState(
      {
        deptId: this.props.location.query.deptId,
        postName: this.props.location.query.postName,
      },
      function() {
        if (this.state.postName) {
          const { dispatch } = this.props;
          dispatch({
            type: 'authorizedStrength/getAuthorizedStrengthDetails',
            payload: {
              deptId: this.state.deptId,
              postName: encodeURIComponent(this.state.postName),
              keyWord: encodeURIComponent(this.state.keyWord),
              page: this.state.page,
              rows: this.state.rows,
            },
          });
        }
      }
    );
  }

  pageNumberChange = (pagination, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    this.setState(
      {
        page: pagination,
        rows: filtersArg,
      },
      function() {
        this.searchList();
      }
    );
  };

  pageSizeChange = (pagination, filtersArg) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    this.setState(
      {
        page: 1,
        rows: filtersArg,
      },
      function() {
        this.searchList();
      }
    );
  };

  handleGetValue = event => {
    this.setState({
      keyWord: event.target.value,
    });
  };

  onValueChange = () => {
    this.searchList();
  };

  searchList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authorizedStrength/getAuthorizedStrengthDetails',
      payload: {
        deptId: this.state.deptId,
        postName: encodeURIComponent(this.state.postName),
        keyWord: encodeURIComponent(this.state.keyWord),
        page: this.state.page,
        rows: this.state.rows,
      },
    });
  };

  render() {
    const {
      authorizedStrength: { details },
    } = this.props;
    const Search = Input.Search;
    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{ padding: '16px 24px', marginBottom: 16 }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              您所在的位置：
              <a href="/ys/main/hr-service">HR服务</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/ys/user-team">团队总览</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/ys/user-team/authorized">团队编制</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>编制详情</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card bordered={false} bodyStyle={{ padding: '16px 24px' }}>
          <Row span={12}>
            <Col span={21} />
            <Col span={3}>
              <Search
                placeholder="请输入姓名/岗位"
                value={this.state.keyWord}
                onChange={this.handleGetValue}
                onSearch={this.onValueChange}
                className={styles.inputcss}
              />
            </Col>
          </Row>
          <Table
            className={styles.smMarginTop}
            columns={columns}
            dataSource={details.list}
            pagination={{
              current: details.pagination.current + 1,
              pageSize: details.pagination.pageSize,
              pageSizeOptions: ['10', '20', '50'],
              showQuickJumper: true,
              showSizeChanger: true,
              total: details.pagination.total,
              onChange: this.pageNumberChange,
              onShowSizeChange: this.pageSizeChange,
              showTotal: function() {
                //设置显示一共几条数据
                return '共 ' + details.pagination.total + ' 条数据';
              },
            }}
          />
        </Card>
      </div>
    );
  }
}
