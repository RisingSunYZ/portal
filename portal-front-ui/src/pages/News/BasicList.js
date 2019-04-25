import React, { PureComponent } from 'react';
import { List, Avatar, Card, Row, Col, Input } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import Link from 'umi/link';
import { getConfig } from '../../utils/utils';
import styles from './News.less';

@connect(({ newsNotice, loading }) => ({
  newsNotice,
  loading: loading.models.newsNotice,
}))

export default class BasicList extends PureComponent {

  state = {
    searchText: ''
  };

  componentDidMount () {
    const { match: { params }, dispatch } = this.props;
    dispatch({
      type: 'newsNotice/queryCompanyNewsList',
      payload: {
        typeSn: params.typeSn,
        pageSize: 15,
        pageNum: 1,
      }
    });
  }

  searchHandle = (value) => {
    const { match: { params }, dispatch } = this.props;
    this.setState({
      searchText: value
    });
    dispatch({
      type: 'newsNotice/queryCompanyNewsList',
      payload: {
        typeSn: params.typeSn,
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
      type: 'newsNotice/queryCompanyNewsList',
      payload: {
        typeSn: params.typeSn,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        title: searchText,
      },
    });
  };

  render() {

    const {
      newsNotice:{ companyNewsList }
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false} bodyStyle={{padding: '16px 24px'}}>
          <Row style={{marginBottom: 16}}>
            <Col offset={19} span={5}>
              <Input.Search placeholder="新闻/公告" onSearch={this.searchHandle} onPressEnter={(e)=>this.searchHandle(e.currentTarget.value)} />
            </Col>
          </Row>
          <List
            size="large"
            dataSource={companyNewsList.data}
            pagination={{
              pageSize: 15,
              total: companyNewsList.total,
              onChange: this.updateNewsTable
            }}
            renderItem={item => (
              <List.Item
                key={item.id}
              >
                <div className={styles.newsBox}>
                  <div className={styles.imgBox}>
                    <Link to={`/news/news-detail/${item.id}`} target="_blank">
                      <img width={194} height={120} src={ getConfig().ftpHost + item.thumbImg } alt=""/>
                    </Link>
                  </div>
                  <div className={styles.textBox}>
                    <h5>
                      <Link to={`/news/news-detail/${item.id}`} target="_blank">
                        <span>{item.title}</span>
                      </Link>
                    </h5>
                    <p className={styles.content}>{item.remark}</p>
                    <p className={styles.info}>
                      <span className={styles.date}>{item.publishTime}</span>
                      访问量：<span>{item.visitCount}</span>
                    </p>
                  </div>
                </div>
              </List.Item>
            )}
           />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
