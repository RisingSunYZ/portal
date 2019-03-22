import React, { PureComponent } from 'react';
import { Layout, Card, Row, Col } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import {getConfig} from "../../utils/utils";
import FileList from '@/components/FileList';
import './detail.less';

const { Header, Content, Sider } = Layout;

@connect(({ newsNotice, loading }) => ({
  newsNotice,
  loading: loading.models.newsNotice,
}))

export default class newsDetail extends PureComponent {

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
      type: 'newsNotice/queryNewsDetail',
      payload: {
        typeSn: params.typeSn,
        id: params.id,
      }
    });
  }

  createRelateNewsList = (list) => {
    let lis = [];
    if(list && list.length>0){
      list.map((item)=> {
        lis.push(
          <li>
            <a target="_blank" href={`/portal/news/detail/${item.id}`}>
              <img width={194} height={120} src={ getConfig().ftpHost + item.thumbImg } alt=""/>
            </a>
          </li>);
      });
    }
    return <ul>{lis}</ul>
  };

  render() {

    const {
      newsNotice:{ newsDetail }
    } = this.props;

    return (
      <PageHeaderWrapper>
        <div className="news-detail-container">
          <Layout>
            <Header>
              <div className="content-title">
                <p>{newsDetail.title}</p>
                <ul>
                  <li>{newsDetail.publishTime}</li>
                  <li>发布部门：<span title={newsDetail.creatorName}>{newsDetail.creatorName} </span></li>
                  <li>发布范围：<span title={newsDetail.rangeName}>{newsDetail.rangeName}</span></li>
                  <li>访问量：<span>{newsDetail.visitCount}</span></li>
                </ul>
              </div>
            </Header>
            <Layout>
              <Content>
                <div className="article-text">
                  <div> {newsDetail.content}</div>
                </div>
              </Content>
              <Sider width={240}>
                <div className="relevant-news">
                  <p>相关新闻</p>
                  {this.createRelateNewsList(newsDetail.newsByKeyword)}
                </div>
              </Sider>
            </Layout>
          </Layout>
          {newsDetail ? (
            <div className="fujian-box">
              <div className="fujian">
                <span>附件：</span>
                <div className="fujian-list">
                  <FileList showDel={false} files={[{fileName:'测试'}]} />
                </div>
              </div>
            </div>
          ) : '' }
        </div>
      </PageHeaderWrapper>
    );
  }
}
