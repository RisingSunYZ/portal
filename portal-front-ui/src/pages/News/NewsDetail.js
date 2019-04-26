import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import {getConfig} from "../../utils/utils";
import Link from 'umi/link';
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
            <Link to={`/news/news-detail/${item.id}`} target="_blank">
              <img width={194} height={120} src={ getConfig().ftpHost + item.thumbImg } alt=""/>
            </Link>
          </li>);
      });
    }
    return <ul>{lis}</ul>
  };

  render() {

    const {
      newsNotice:{ newsDetail: { news, files, newsByKeyword } }
    } = this.props;

    return (
      <PageHeaderWrapper>
        <div className="news-detail-container">
          <Layout>
            <Header>
              <div className="content-title">
                <p>{news.title}</p>
                <ul>
                  <li>{news.publishTime}</li>
                  <li>发布部门：<span title={news.creatorName}>{news.creatorName} </span></li>
                  <li>发布范围：<span title={news.rangeName}>{news.rangeName}</span></li>
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
                <div className="relevant-news">
                  <p>相关新闻</p>
                  {this.createRelateNewsList(newsByKeyword || [])}
                </div>
              </Sider>
            </Layout>
          </Layout>
          {files && files.length>0 ? (
            <div className="fujian-box">
              <div className="fujian">
                <span>附件：</span>
                <div className="fujian-list">
                  <FileList showDel={false} files={files} />
                </div>
              </div>
            </div>
          ) : '' }
        </div>
      </PageHeaderWrapper>
    );
  }
}
