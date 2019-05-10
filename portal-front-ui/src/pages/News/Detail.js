import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import NewsDetail from './components/NewsDetail';
import NoticeDetail from './components/NoticeDetail';
import IndustryDetail from './components/IndustryDetail';
import ActivityDetail from './components/ActivityDetail';

import {getConfig} from "@/utils/utils";
import Link from 'umi/link';
import FileList from '@/components/FileList';
import './detail.less';

const { Header, Content, Sider } = Layout;

@connect(({ newsNotice, loading }) => ({
  newsNotice,
  loading: loading.models.newsNotice,
}))

export default class Detail extends PureComponent {

  componentWillMount () {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    document.addEventListener('selectstart', function (e) {
      e.preventDefault();
    });
    document.addEventListener('copy', function (e) {
      e.preventDefault();
    });
  }


  componentDidMount () {
    const { match: { params }, dispatch } = this.props;

  }
  getDiyBreadCrumb=()=>{
    const { match: { params }, dispatch } = this.props;
    let breadRoot = { url: "/main/workplace", rootName:"工作台", key:"workplace",name:""}
    if( window.opener){
      if( window.opener.location.href.search('main') !== -1 && window.opener.location.href.split("eip")[1] ){
        switch(window.opener.location.href.split("eip")[1]){
          case "/main/workplace" : breadRoot.url="/main/workplace"; breadRoot.rootName="工作台";break;
          case "/main/hr-service" : breadRoot.url="/main/hr-service";breadRoot.rootName="HR服务";break;
          case "/main/infor-tech" : breadRoot.url="/main/infor-tech";breadRoot.rootName="IT服务";break;
          case "/main/fnc-service" : breadRoot.url="/main/fnc-service";breadRoot.rootName="财务服务";break;
          case "/main/news" : breadRoot.url="/main/news";breadRoot.rootName="新闻资讯";break;
        }
      }
    }

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
      },
      {
        url: "",
        name: "正文",
        key: '',
      }
    ]
    return  BreadCrumbData
  };

  getDetailPageBySn = (sn) => {
    const { match } = this.props;
    if(sn.indexOf("notice") > 0){
      return <NoticeDetail match={match} />;
    }else if(sn === "company_news"||sn === "itrend_news"
      ||sn === "finance_info"||sn === "finance_pro"
      ||sn === "finance_expense"|| sn === "rszd"){
      return <NewsDetail match={match} />;
    }else if(sn === "special_events"){
      return <ActivityDetail match={match} />;
    }else if(sn === "industry_news"){
      return <IndustryDetail match={match} />;
    }
  };

  render() {

    const {
      match
    } = this.props;
    const type = match.params.typeSn;
    return (
      <PageHeaderWrapper diyBreadCrumb={this.getDiyBreadCrumb()} >
        {this.getDetailPageBySn(type)}
      </PageHeaderWrapper>
    );
  }
}
