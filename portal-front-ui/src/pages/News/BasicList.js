//实际效果详见  财经服务--财经资讯--更多（链接）
import React, { PureComponent } from 'react';
import { List, Card, Row, Col, Input } from 'antd';
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
    const { location: { query }, dispatch } = this.props;
    dispatch({
      type: 'newsNotice/queryCompanyNewsList',
      payload: {
        typeSn: query.typeSn,
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
      type: 'newsNotice/queryCompanyNewsList',
      payload: {
        typeSn: query.typeSn,
        pageNum: 1,
        pageSize: 15,
        title: value,
      },
    });
  };

  updateNewsTable = (pagination) =>{
    const { location: { query }, dispatch } = this.props;
    const { searchText } = this.state;

    dispatch({
      type: 'newsNotice/queryCompanyNewsList',
      payload: {
        typeSn: query.typeSn,
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

    const tableList = tblist.data ? (tblist.data.data ? tblist.data.data : []) : [];

    return (
      <PageHeaderWrapper>
        <Row style={{marginTop: -60}}>
          <Col offset={19} span={5}>
            <Input.Search placeholder="新闻/公告" onSearch={this.searchHandle} onPressEnter={(e)=>this.searchHandle(e.currentTarget.value)} />
          </Col>
        </Row>
        <Card bordered={false} bodyStyle={{padding: '16px 24px'}} style={{marginTop: 18}}>
          <List
            size="large"
            dataSource={tableList}
            pagination={{
              pageSize: 15,
              total: tableList.total,
              onChange: this.updateNewsTable
            }}
            renderItem={item => (
              <List.Item
                key={item.id}
              >
                <div className={styles.newsBox}>
                  <div className={styles.imgBox}>
                    <Link target="_blank" href={`/news/basic-list/detail/${item.id}`}>
                      <img width={194} height={120} src={ getConfig().ftpHost + item.thumbImg } alt=""/>
                    </Link>
                  </div>
                  <div className={styles.textBox}>
                    <h5>
                      <Link target="_blank" href={`/news/basic-list/detail/${item.id}`}>
                        {item.title}
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
