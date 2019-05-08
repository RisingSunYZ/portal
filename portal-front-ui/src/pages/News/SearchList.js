import React, { PureComponent } from 'react';
import { List, Menu, Card, Row, Col, Input, Layout } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Link from 'umi/link';
import { getConfig } from '@/utils/utils';
import moment from 'moment';
import styles from './News.less';

const { Sider, Content } = Layout;

@connect(({ newsNotice, loading }) => ({
  newsNotice,
  loading: loading.models.newsNotice,
}))

export default class SearchList extends PureComponent {

  state = {
    title: '',
    startStr: '',
    endStr: '',
    typeSn: '',
    page: {
      pageSize: 10,
      pageIndex: 0,
    }
  };

  componentDidMount () {
    const { location:{ keyword } } = this.props;
    keyword ? this.searchHandle(keyword) : this.searchNewsList();
  }

  searchHandle = (value) => {
    this.setState({
      title: value
    },()=>{
      this.searchNewsList();
    });
  };

  searchNewsList = () => {
    const { dispatch } = this.props;
    const { title, page, startStr, endStr, typeSn } = this.state;
    dispatch({
      type: 'newsNotice/ajaxSearchNoticeList',
      payload: {
        ...page,
        title,
        startStr,
        endStr,
        typeSn,
      }
    });
  };

  updateSearchTime = ({ key }) => {
    let startStr = '', endStr = '';
    switch(key){
      case 'day':
        startStr = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
        endStr = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');break;
      case 'week':
        startStr = moment().startOf('day').subtract(7,'day').format('YYYY-MM-DD HH:mm:ss');
        endStr = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');break;
      case 'month':
        startStr = moment().startOf('day').subtract(1,'year').format('YYYY-MM-DD HH:mm:ss');
        endStr = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');break;
      default:
        startStr = null; endStr = null;
    }
    this.setState({
      startStr,
      endStr,
    },()=>{
      this.searchNewsList();
    })
  };

  updateSearchType = ({key}) => {
    let typeSn = '';
    if(key !== 'allType'){typeSn = key;}
    this.setState({
      typeSn,
    },()=>{
      this.searchNewsList();
    })
  };

  updateNewsTable = (pageIndex, pageSize) =>{
    this.setState({
      page: {
        pageIndex: pageIndex - 1,
        pageSize,
      }
    }, ()=>{
      this.searchNewsList();
    });
  };

  render() {

    const {
      newsNotice:{ searchList },
      location: { keyword },
      loading,
    } = this.props;
    const { page } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false} bodyStyle={{padding: '16px 24px'}}>
          <Row className={styles.searchHeadBox}>
            <Col span={9}><Input.Search defaultValue={keyword} onSearch={this.searchHandle} onPressEnter={(e)=>this.searchHandle(e.currentTarget.value)} /></Col>
            <Col span={10}><span className={styles.searchResultNum}>为您找到相关结果{searchList.total}个</span></Col>
          </Row>
          <Layout>
            <Sider className={styles.searchMenu}>
              <Menu key="time" defaultSelectedKeys={['allTime']} onSelect={this.updateSearchTime}>
                <Menu.Item key="allTime">全部时间</Menu.Item>
                <Menu.Item key="day">一天内</Menu.Item>
                <Menu.Item key="week">一周内</Menu.Item>
                <Menu.Item key="month">一个月内</Menu.Item>
              </Menu>
              <Menu key="type" defaultSelectedKeys={['allType']} onSelect={this.updateSearchType}>
                <Menu.Item key="allType">全部栏目</Menu.Item>
                <Menu.Item key="company_news">公司动态</Menu.Item>
                <Menu.Item key="home_notice">通知公告</Menu.Item>
              </Menu>
            </Sider>
            <Content>
              <Card bordered={false} bodyStyle={{ padding: '0 24px', minHeight: 500 }}>
                <List
                  loading={loading}
                  size="large"
                  dataSource={searchList.data}
                  pagination={{
                    pageSize: page.pageSize,
                    showSizeChanger: true,
                    total: searchList.total,
                    onChange: this.updateNewsTable,
                    onShowSizeChange: this.updateNewsTable,
                  }}
                  renderItem={item => (
                    <List.Item
                      key={item.id}
                    >
                      <div className={styles.newsBox}>
                        <div className={styles.searchContent}>
                          <a href={getConfig().domain + `/portal/news/getNewsNoticePage.jhtml?id=${item.id}`} target="_blank">
                            <span>{item.title}</span>
                          </a>
                        </div>
                        <div className={styles.searchDetail}>{item.remark}</div>
                        <div className={styles.searchExtra}>
                          <span className={styles.date}>{item.publishTime}</span>
                          访问量：<span>{item.visitCount}</span>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Content>
          </Layout>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
