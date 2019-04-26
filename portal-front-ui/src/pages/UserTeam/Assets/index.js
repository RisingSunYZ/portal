import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Tabs, Breadcrumb } from 'antd';
import MonthSelect from '../commponents/common/MonthSelect';
import DeptAssetsList from '../commponents/assets/DeptAssetsList';
import DeptUseAssetsTotal from '../commponents/assets/DeptUseAssetsTotal';
import DeptChargeAssetsTotal from '../commponents/assets/DeptChargeAssetsTotal';
import SearchBar from '../commponents/assets/SearchBar';
import styles from './index.less';
import OrgSelect from '../commponents/common/OrgSelect';

const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;
@connect(({ teamAssets, loading }) => ({
  teamAssets,
  loading: loading.models.teamAssets,
}))
export default class AssetsProfile extends Component {
  state = {
    deptIds:[],
    cateName:encodeURIComponent('全部资产'),
    assetsType:encodeURIComponent('个人资产'),
    keyWord:'',
    page:'1',
    rows:'10',
  };

  componentDidMount() {}

  orgInitPage = (deptIdArray) => {
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
          if (this.state.deptIds) {
            dispatch({
              type: 'teamAssets/getDeptAssets',
              payload:{deptIds:this.state.deptIds}
            });
            dispatch({
              type: 'teamAssets/getDeptAssetsList',
              payload: this.state,
            });
          }
        }
      );
  }

  searchChange = value => {
    this.setState({
      cateName:encodeURIComponent(value.cateName),
      assetsType:encodeURIComponent(value.assetsType),
      keyWord:encodeURIComponent(value.keyWord),
      page:'1',
      rows:'10',
    }, function() {
      this.searchList();
    });
  };

  pageChange = value => {
    this.setState({
      page:value.page,
      rows:value.rows,
    }, function() {
      this.searchList();
    });
  };


  orgChange = value => {
    let ids = '';
    if(value){
      ids = ids + value.currentDeptId + ',';
      for (let i = 0; i < value.childrenDeptId.length; i++) {
        ids = ids + value.childrenDeptId[i]+',';
      }
    }
    this.setState({
      deptIds:ids.substr(0,ids.length-1),
      cateName:encodeURIComponent('全部资产'),
      assetsType:encodeURIComponent('个人资产'),
      keyWord:'',
      page:'1',
      rows:'10',
    }, function() {
      this.searchList();
      this.totalList();
      this.refs.searchBar.clear();
    });
  };

  searchList = () => {
    const { dispatch } = this.props;
    dispatch({
      type:  'teamAssets/getDeptAssetsList',
      payload: this.state,
    });
  };

  totalList = () =>{
    const { dispatch } = this.props;
    const params = {
      deptIds: this.state.deptIds,
    };
    dispatch({
      type:  'teamAssets/getDeptAssets',
      payload: params,
    });
  };

  render() {
    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>
                您所在的位置：
                <a href="/ys/main/hr-service">HR服务</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a href="/ys/user-team">团队总览</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>部门资产</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">部门资产</div>
          </div>
        </Card>
        <Card bordered={false} bodyStyle={{ padding: '16px 24px', marginTop: 16 }}>
          <Row span={12}>
            {/*<Col span={6}>*/}
              {/*<MonthSelect defaultDate=""  onDateChange={this.dateChange} />*/}
            {/*</Col>*/}
            <Col span={3}>
              <OrgSelect onOrgChange={this.orgChange} initPage={this.orgInitPage.bind(this)} />
            </Col>
          </Row>
          <p className="cardTitle">个人资产</p>
          <Row className={styles.marginTop}>
            <DeptUseAssetsTotal />
          </Row>
          <p className="cardTitle">责任资产</p>
          <Row className={styles.marginTop}>
            <DeptChargeAssetsTotal />
          </Row>
          <p className="cardTitle">资产详情</p>
          <Row>
            <SearchBar ref="searchBar" onSearchChange={this.searchChange} />
          </Row>
          <Row>
            <DeptAssetsList onPageChange={this.pageChange} />
          </Row>
        </Card>
      </div>
    );
  }
}
