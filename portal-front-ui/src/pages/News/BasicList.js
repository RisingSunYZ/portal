import React, { PureComponent } from 'react';
import { List, Avatar, Card, Row, Col, Input } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
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
      newsNotice:{ tblist }
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
            dataSource={tblist.data}
            pagination={{
              pageSize: 15,
              total: tblist.total,
              onChange: this.updateNewsTable
            }}
            renderItem={item => (
              <List.Item
                key={item.id}
              >
                <div className={styles.newsBox}>
                  <div className={styles.imgBox}>
                    <a target="_blank" href={`/portal/news/basic-list/detail/${item.id}`}>
                      <img width={194} height={120} src={ getConfig().ftpHost + item.thumbImg } alt=""/>
                    </a>
                  </div>
                  <div className={styles.textBox}>
                    <h5><a target="_blank" href={`/portal/news/basic-list/detail/${item.id}`}>{item.title}</a>
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