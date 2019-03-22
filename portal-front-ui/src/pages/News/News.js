import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  List,
  Icon,
  Button,
  InputNumber,
  DatePicker,
  message,
  Badge,
} from 'antd';
import Calendar from '@/components/Calendar';
import WorkMenus from '@/components/WorkMenus';
// import Searcher from '../components/Searcher';
import NewsBanner from '@/components/NewsBanner';

import {nullToZero, getFormType, getConfig} from '../../utils/utils';
import SysList from "../Workplace/components/SysList";


const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ newsInfo, loading }) => ({
  newsInfo,
  loading: loading.models.newsInfo,
}))

export default class TableList extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;

    // 获取专题活动列表
    dispatch({
      type: 'newsInfo/queryActivityList',
      payload: {
        typeSn: 'special_events',
        pageNumber: 1,
        pageSize: 5,
      },
    });

    // 获取公司动态列表
    dispatch({
      type: 'newsInfo/queryCompanyList',
      payload: {
        typeSn: 'company_news',
        pageNumber: 1,
        pageSize: 7,
      },
    });

    // 获取行业动态列表
    dispatch({
      type: 'newsInfo/queryIndustryList',
      payload: {
        typeSn: 'industry_news',
        pageNumber: 1,
        pageSize: 4,
      },
    });

    // 获取员工风采列表
    dispatch({
      type: 'newsInfo/queryStaffPresenceList',
      payload: {
        typeSn: 'staff_presence',
        pageNumber: 1,
        pageSize: 4,
      },
    });

  }

  render() {

    const ftpHost = getConfig().ftpHost;
    const domain = getConfig().domain;
    // const newsBannerStyle = {
    //   imgHeight: 160,
    //   iconTop: 90,
    //   iconLeftCurrent: 2,
    //   iconRightCurrent: 375,
    // };

    const {
      newsInfo:{activity, company, industry, staffPresence}
    } = this.props;


    return (
      <Fragment>
        <Row gutter={16}>
          <Col span={5}>
            <Card title="专题活动" bordered={false} extra={<a href={ "/news/table-list/special_events"}>更多</a>}
                  bodyStyle={{padding:"14px",paddingTop:"1px",paddingBottom:"1px"}}>
              <List
                itemLayout="vertical"
                size="large"
                dataSource={activity.list}
                split={false}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.id}
                  >
                    {
                      index > 1 ?
                        <span><p style={{fontWeight:"bold" }}><a href="#"  target="_blank">{item.title}</a></p></span>
                        :
                        <span>
                          <a href={ftpHost + item.thumbImg} target="_blank">
                            <img src={ftpHost + item.thumbImg} width="100%" height="130px"/>
                          </a>
                          <p style={{fontWeight:"bold" }}><a href="#"  target="_blank">{item.title}</a></p>
                          <p style={{fontSize:"12px"}}>
                            <span>{item.remark.substr(0, 28) + "..."}</span>
                            <span><a href="#">【详情】</a></span>
                          </p>
                        </span>
                    }
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={15}>
            <Card title="公司动态" bordered={false} extra={<a href={ "/news/table-list/company_news"}>更多</a>}
                  bodyStyle={{padding:"14px",paddingTop:"1px",paddingBottom:"1px"}}>
              <List
                itemLayout="vertical"
                size="large"
                dataSource={company.list}
                split={false}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.id}
                  >
                    {
                      index > 1 ?
                        <span><p style={{fontWeight:"bold" }}><a href={"/news/table-list/" + item.id}  target="_blank">{item.title}</a></p></span>
                        :
                        <span>
                           <List.Item.Meta
                             avatar={
                               <a href={ftpHost + item.thumbImg} target="_blank">
                                 <img src={ftpHost + item.thumbImg} width="160px" height="120px"/>
                               </a>}
                             title={
                               <p style={{fontWeight:"bold" }}><a href={"/news/table-list/" + item.id}  target="_blank">{item.title}</a></p>
                             }
                             description={
                               <p style={{fontSize:"12px"}}>
                                 <span>{item.remark.substr(0, 100) + "..."}</span>
                                 <span><a href={"/news/table-list/" + item.id}>【详情】</a></span>
                               </p>}
                           />
                        </span>
                    }
                  </List.Item>
                )}
              />
            </Card>
            <Card title="行业动态" bordered={false} extra={<a href={ "/news/table-list/industry_news"}>更多</a>}
                  bodyStyle={{padding:"14px",paddingTop:"6px",paddingBottom:"2px"}}>
              <List
                itemLayout="vertical"
                size="large"
                dataSource={industry.list}
                split={false}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    style={{padding:"0px",paddingTop:"0px",paddingBottom:"0px"}}
                  >
                    <span><p style={{fontWeight:"bold" }}><a href="#"  target="_blank">{item.title}</a></p></span>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card title="员工风采" bordered={false} extra={<a href="#">更多</a>}
                  bodyStyle={{padding:"14px",paddingTop:"8px",paddingBottom:"0px"}}>
              <List
                itemLayout="vertical"
                size="large"
                dataSource={staffPresence.list}
                split={false}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    style={{padding:"0px",paddingTop:"px",paddingBottom:"0px"}}
                  >
                    <List.Item.Meta
                      avatar={
                        <a href={ftpHost + item.thumbImg} target="_blank">
                          <img src={ftpHost + item.thumbImg} width="160px" height="120px" alt={item.title} align="center"/>
                        </a>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
