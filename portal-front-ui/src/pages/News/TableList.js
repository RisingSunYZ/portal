//实际效果详见  财经服务--财务公告--更多（链接）
import React, { PureComponent } from 'react';
import { Table, Card, Row, Col, Input,Breadcrumb } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getNewsBreadCrumb} from "@/utils/utils";

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
      match: { params }
    } = this.props;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 700,
        render: (text, record) => (
          <Link to={`/news-notice/${params.typeSn}/${record.id}`} title={text} target="_blank">{text}</Link>
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
        <PageHeaderWrapper diyBreadCrumb={getNewsBreadCrumb(params,false)}>
          <Row style={{marginTop: -60,marginLeft:500}}>
            <Col offset={18} span={5}>
              <Input.Search placeholder="新闻/公告" onSearch={this.searchHandle} onPressEnter={(e)=>this.searchHandle(e.currentTarget.value)} />
            </Col>
          </Row>
          <Card bordered={false} bodyStyle={{padding: '16px '}} style={{marginTop:20}}>
            <Table
              bordered
              columns={columns}
              rowKey="id"
              dataSource={tblist.data}
              pagination={{
                pageSize: 10,
                total: tblist.total,
                onChange: this.updateNewsTable
              }}
            />
          </Card>
        </PageHeaderWrapper>
    );
  }
}
