import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import NewsDetail from './components/NewsDetail';
import NoticeDetail from './components/NoticeDetail';
import IndustryDetail from './components/IndustryDetail';
import ActivityDetail from './components/ActivityDetail';
import {getConfig,getNewsBreadCrumb} from "@/utils/utils";
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
    const {
      match: { params },
      dispatch,
      newsNotice:{ newsDetail }} = this.props;
  }

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
      <PageHeaderWrapper diyBreadCrumb={getNewsBreadCrumb(match.params,true)} >
        {this.getDetailPageBySn(type)}
      </PageHeaderWrapper>
    );
  }
}
