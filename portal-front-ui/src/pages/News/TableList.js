import React, { PureComponent } from 'react';
import { Table, Card, Row, Col, Input } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';

@connect(({ newsNotice, loading }) => ({
  newsNotice,
  loading: loading.models.newsNotice,
}))

export default class TableList extends PureComponent {

  state = {
    searchText: ''
  };

  componentDidMount () {
    const { location: { query }, dispatch } = this.props;
    dispatch({
      type: 'newsNotice/queryNoticeList',
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

  render() {

    const {
      newsNotice:{ tblist },
      location: { query }
    } = this.props;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 700,
        render: (text, record) => (
          <a href={`/portal/news-notice/detail/notice/${query.typeSn}/${record.id}`} title={text} target="_blank">{text}</a>
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
      <PageHeaderWrapper>
        <Row style={{marginTop: -60}}>
          <Col offset={18} span={5}>
            <Input.Search placeholder="新闻/公告" onSearch={this.searchHandle} onPressEnter={(e)=>this.searchHandle(e.currentTarget.value)} />
          </Col>
        </Row>
        <Card bordered={false} bodyStyle={{padding: '16px '}} style={{marginTop:20}}>
          <Table
            bordered
            columns={columns}
            dataSource={tblist.data}
            pagination={{
              pageSize: 15,
              total: tblist.total,
              onChange: this.updateNewsTable
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
