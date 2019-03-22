import React, { PureComponent, Fragment } from 'react';
import { Table, Card, Input, Breadcrumb, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import styles from './UserPandect.less';
import { connect } from 'dva/index';
import OrgSelect from '../UserTeam/commponents/common/OrgSelect';

const columns = [
  {
    title: '公司',
    dataIndex: 'orgName',
  },
  {
    title: '部门',
    dataIndex: 'deptName',
  },
  {
    title: '岗位',
    dataIndex: 'postName',
  },
  {
    title: '编制人数',
    dataIndex: 'totalNum',
    render: (text, record) => {
      return <span>{record.totalNum ? record.totalNum : 0}</span>;
    },
  },
  {
    title: '现有人数',
    dataIndex: 'countPsndoc',
    render: (text, record) => {
      return <span>{record.countPsndoc ? record.countPsndoc : 0}</span>;
    },
  },
  {
    title: '详情',
    dataIndex: 'detail',
    render: (text, record) => {
      let url =
        '/ys/user-team/authorizedDetails?deptId=' + record.pkDept + '&postName=' + record.postName;
      return (
        <span>
          <a href={url} target="_blank">
            详情
          </a>
        </span>
      );
    },
  },
];

@connect(({ authorizedStrength, loading }) => ({
  authorizedStrength,
  loading: loading.models.authorizedStrength,
}))
export default class AuthorizedStrength extends PureComponent {
  state = {
    deptIds: [],
    keyWord: '',
    // page:'1',
    // rows:'10',
  };
  componentDidMount() {
    if(this.props.location.query.deptId){
      this.withDeptId();
    }

  }

  orgInitPage = (deptIdArray) => {
    if(!this.props.location.query.deptId){
      let ids = '';
      if (deptIdArray) {
        for (let i = 0; i < deptIdArray.length; i++) {
          ids = ids + deptIdArray[i] + ',';
        }
      }
      ids = ids.substr(0, ids.length - 1);
      this.setState({
          deptIds:ids ,
        }, function() {
          const { dispatch } = this.props;
          // console.log(this.state);
          if (this.state.deptIds) {
            dispatch({
              type: 'authorizedStrength/getAuthorizedStrengthTotal',
              payload: { deptIds: this.state.deptIds },
            });
            dispatch({
              type: 'authorizedStrength/getAuthorizedStrengthList',
              payload: {
                deptIds: this.state.deptIds,
                keyWord: encodeURIComponent(this.state.keyWord),
              },
            });
          }
        }
      );
    }
  }

  withDeptId = () => {
    const _this=this;
    let ids = '';
    ids = Base64.decode(this.props.location.query.deptId);
    const { dispatch } = this.props;
    dispatch({
      type: 'hrService/getDeptIds',
      payload: {deptId:Base64.decode(this.props.location.query.deptId)},
      callback:function (depts) {
        console.log(ids);
        console.log(depts);
        if(depts){
          ids = depts.join(",");
        }
        _this.setState({
            deptIds:ids ,
          }, function() {
            if (this.state.deptIds) {
              dispatch({
                type: 'authorizedStrength/getAuthorizedStrengthTotal',
                payload: { deptIds: this.state.deptIds },
              });
              dispatch({
                type: 'authorizedStrength/getAuthorizedStrengthList',
                payload: {deptIds: this.state.deptIds,},
              });
            }
          }
        );
      }
    });
  }
  // pageNumberChange = (pagination, filtersArg) => {
  //   const filters = Object.keys(filtersArg).reduce((obj, key) => {
  //     const newObj = { ...obj };
  //     newObj[key] = getValue(filtersArg[key]);
  //     return newObj;
  //   }, {});
  //   this.setState({
  //     page:pagination,
  //     rows:filtersArg,
  //   }, function() {
  //     this.searchList();
  //   });
  // };
  //
  // pageSizeChange = (pagination, filtersArg) => {
  //   const filters = Object.keys(filtersArg).reduce((obj, key) => {
  //     const newObj = { ...obj };
  //     newObj[key] = getValue(filtersArg[key]);
  //     return newObj;
  //   }, {});
  //   this.setState({
  //     page:1,
  //     rows:filtersArg,
  //   }, function() {
  //     this.searchList();
  //   });
  // };

  handleGetValue = event => {
    this.setState({
      keyWord: event.target.value,
    });
  };

  onValueChange = () => {
    //this.searchList();
    const { dispatch } = this.props;
    dispatch({
      type: 'authorizedStrength/getAuthorizedStrengthList',
      payload: {
        deptIds: this.state.deptIds,
        keyWord: encodeURIComponent(this.state.keyWord),
      },
    });
  };

  orgChange = value => {
    let ids = '';
    if (value) {
      ids = ids + value.currentDeptId + ',';
      for (let i = 0; i < value.childrenDeptId.length; i++) {
        ids = ids + value.childrenDeptId[i] + ',';
      }
    }
    this.setState(
      {
        deptIds: ids.substr(0, ids.length - 1),
        keyWord: '',
        // page:'1',
        // rows:'10',
      },
      function() {
        //this.searchList();
        const { dispatch } = this.props;
        dispatch({
          type: 'authorizedStrength/getAuthorizedStrengthTotal',
          payload: { deptIds: this.state.deptIds },
        });
        dispatch({
          type: 'authorizedStrength/getAuthorizedStrengthList',
          payload: {
            deptIds: this.state.deptIds,
            keyWord: encodeURIComponent(this.state.keyWord),
          },
        });
      }
    );
  };

  // searchList = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'authorizedStrength/getAuthorizedStrength',
  //     payload: this.state,
  //   });
  // };

  render() {
    const {
      authorizedStrength: { totals, data },
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
            <Breadcrumb.Item>团队编制</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card bordered={false} bodyStyle={{ padding: '16px 24px' }}>
          <Row span={12}>
            <Col span={21}>
              <OrgSelect
                onOrgChange={this.orgChange}
                initPage={this.orgInitPage.bind(this)}
              />
            </Col>
            <Col span={3}>
              <Search
                placeholder="请输入岗位名称"
                value={this.state.keyWord}
                onChange={this.handleGetValue}
                onSearch={this.onValueChange}
                className={styles.inputcss}
                ref="searchBar"
              />
            </Col>
          </Row>
          <Row className={styles.authorizedTotal}>
            <Col span={3}>
              <h5>编制人数</h5>
              <p>{totals.totalNum} </p>
            </Col>
            <Col span={3}>
              <h5>现有人数</h5>
              <p>{totals.countPsndoc} </p>
            </Col>
            <Col span={3}>
              <h5>M序列</h5>
              <p> {totals.mRank} </p>
            </Col>
            <Col span={3}>
              <h5>P序列</h5>
              <p> {totals.pRank} </p>
            </Col>
            <Col span={3}>
              <h5>A序列</h5>
              <p>{totals.aRank} </p>
            </Col>
            <Col span={3}>
              <h5>O序列</h5>
              <p>{totals.oRank} </p>
            </Col>
            <Col span={3}>
              <h5>其他</h5>
              <p>{totals.others} </p>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={data.list}
            pagination={{
              // current:authorized.data.pagination.current+1,
              //  pageSize: authorized.data.pagination.pageSize,
              pageSize: 10,
              pageSizeOptions: ['5', '10', '20', '50'],
              showQuickJumper: true,
              showSizeChanger: true,
              // total: authorized.data.total,
              // onChange: this.pageNumberChange,
              // onShowSizeChange:this.pageSizeChange,
              showTotal: function() {
                //设置显示一共几条数据
                return '共 ' + data.total + ' 条数据';
              },
            }}
          />
        </Card>
      </div>
    );
  }
}
