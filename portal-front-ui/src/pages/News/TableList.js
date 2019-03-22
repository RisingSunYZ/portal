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
    const { match: { params }, dispatch } = this.props;
    dispatch({
      type: 'newsNotice/queryNoticeList',
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
      type: 'newsNotice/queryNoticeList',
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
      match: { params }
    } = this.props;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 700,
        render: (text, record) => (
          <a href={`/portal/news-notice/detail/notice/${params.typeSn}/${record.id}`} title={text} target="_blank">{text}</a>
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
        <Card bordered={false} bodyStyle={{padding: '16px 24px'}}>
          <Row style={{marginBottom: 16}}>
            <Col offset={19} span={5}>
              <Input.Search placeholder="新闻/公告" onSearch={this.searchHandle} onPressEnter={(e)=>this.searchHandle(e.currentTarget.value)} />
            </Col>
          </Row>
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
