//实际效果详见  财经服务--财务公告--更多（链接）
import React, { PureComponent } from 'react';
import { Table, Card, Row, Col, Input,Breadcrumb } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ newsNotice, loading }) => ({
  newsNotice,
  loading: loading.models.newsNotice,
}))

export default class TableList extends PureComponent {

  state = {
    searchText: ''
  };

  componentDidMount () {
    const { match: { params }, dispatch } = this.props;
    dispatch({
      type: 'newsNotice/queryNoticeList',
      payload: {
        typeSn: params.typeSn,
        pageSize: 15,
        pageNum: 1,
      }
    });
  }

  searchHandle = (value) => {
    const { location: { query }, dispatch } = this.props;
    this.setState({
      searchText: value
    });
    dispatch({
      type: 'newsNotice/queryNoticeList',
      payload: {
        typeSn: query.typeSn,
        pageNum: 1,
        pageSize: 15,
        title: value,
      },
    });
  };

  updateNewsTable = (pagination) =>{
    const { match: { params }, dispatch } = this.props;
    const { searchText } = this.state;

    dispatch({
      type: 'newsNotice/queryNoticeList',
      payload: {
        typeSn: params.typeSn,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        title: searchText,
      },
    });
  };
  getDiyBreadCrumb=()=>{
    const { match: { params }, dispatch } = this.props;
    console.log(params)
    let url = ''
    let breadRoot = { url: "/main/workplace", rootName:"工作台", key:"workplace",name:""}



    if(window.opener && window.opener.location.href.split("eip")[1]){
      console.log(window.opener.location.href.split("eip")[1]);
      switch(window.opener.location.href.split("eip")[1]){
        case "/main/workplace" : breadRoot.url="/main/workplace"; breadRoot.rootName="工作台";break;
        case "/main/hr-service" : breadRoot.url="/main/hr-service";breadRoot.rootName="HR服务";break;
        case "/main/infor-tech" : breadRoot.url="/main/infor-tech";breadRoot.rootName="IT服务";break;
        case "/main/fnc-service" : breadRoot.url="/main/fnc-service";breadRoot.rootName="财务服务";break;
        case "/main/news" : breadRoot.url="/main/news";breadRoot.rootName="新闻资讯";break;
      }
    }

    console.log(params.typeSn)

    switch(params.typeSn){
      case "home_notice" : breadRoot.name="通知公告";break;
      case "hr_notice" : breadRoot.name="人力公告";break;
      case "msg_notice" : breadRoot.name="IT公告";break;
      case "finance_notice" : breadRoot.name="财务公告";break;

      case "company_news" :breadRoot.name="公司动态";break;
      case "itrend_news" : breadRoot.name=" IT行业资讯";break;
      case "finance_info" : breadRoot.name=" 财务资讯";break;
      case "special_events" :  breadRoot.name="专题活动";break;
      case "industry_news" :  breadRoot.name="行业动态";break;

    }


    const BreadCrumbData =[
      {
        url: breadRoot.url,
        name: breadRoot.rootName,
        key: 'workplace',
      },
      {
        url: breadRoot.url,
        name: breadRoot.name,
        key: 'notice-table',
      }
    ]
    return  BreadCrumbData
  }

  render() {

    const {
      newsNotice:{ tblist },
      match: { params }
    } = this.props;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 700,
        render: (text, record) => (
          <Link to={`/news-notice/${params.typeSn}/${record.id}`} title={text} target="_blank">{text}</Link>
        )
      },
      {
        title: '发文主体',
        dataIndex: 'ownerName',
        key: 'ownerName',
      },
      {
        title: '日期',
        dataIndex: 'publishTime',
        key: 'publishTime',
      },
      {
        title: '点击量',
        dataIndex: 'visitCount',
        key: 'visitCount',
      },
    ];

    return (
        <PageHeaderWrapper diyBreadCrumb={this.getDiyBreadCrumb()}>
          <Row style={{marginTop: -60,marginLeft:500}}>
            <Col offset={18} span={5}>
              <Input.Search placeholder="新闻/公告" onSearch={this.searchHandle} onPressEnter={(e)=>this.searchHandle(e.currentTarget.value)} />
            </Col>
          </Row>
          <Card bordered={false} bodyStyle={{padding: '16px '}} style={{marginTop:20}}>
            <Table
              bordered
              columns={columns}
              rowKey="id"
              dataSource={tblist.data}
              pagination={{
                pageSize: 10,
                total: tblist.total,
                onChange: this.updateNewsTable
              }}
            />
          </Card>
        </PageHeaderWrapper>
    );
  }
}
