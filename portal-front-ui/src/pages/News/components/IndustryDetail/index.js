import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import {getConfig} from "@/utils/utils";
import Link from 'umi/link';
import './index.less';

const { Header, Content, Sider } = Layout;

@connect(({ newsInfo, loading }) => ({
  newsInfo,
  loading: loading.models.newsInfo,
}))

export default class IndustryDetail extends PureComponent {

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
    dispatch({
      type: 'newsInfo/queryIndustryDetail',
      payload: {
        id: params.id,
      }
    });
  }

  createRelateNewsList = (list) => {

    const { match: { params }} = this.props;

    let lis = [];
    if(list && list.length>0){
      list.map((item)=> {
        lis.push(
          <li>
            <Link to={`/news-notice/${params.typeSn}/${item.id}`} target="_blank">
              {item.title}
            </Link>
          </li>);
      });
    }
    return <ul>{lis}</ul>
  };

  render() {

    const {
      newsInfo:{ industryDetail: { news, hotter } }
    } = this.props;

    return (
        <div className="news-detail-container">
          <Layout>
            <Header>
              <div className="content-title">
                <p>{news.title}</p>
                <ul>
                  <li>{news.publishTime}</li>
                  <li>来源：<span title={news.sourceTitle}>{news.sourceTitle} </span></li>
                  <li>访问量：<span>{news.visitCount}</span></li>
                </ul>
              </div>
            </Header>
            <Layout>
              <Content>
                <div className="article-text">
                  <div dangerouslySetInnerHTML={{ __html: news.content}} />
                </div>
              </Content>
              <Sider width={240}>
                <div className="hot-articles">
                  <p>热门文章</p>
                  {this.createRelateNewsList(hotter || [])}
                </div>
              </Sider>
            </Layout>
          </Layout>
        </div>
    );
  }
}
