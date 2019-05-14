import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Input, Tabs,} from 'antd';
import Link from 'umi/link';
import HotKnowledge from './HotKnowledge';
import TrendNews from './TrendNews';
import ContactUs from './ContactUs';
import Suggestion from './Suggestion';
import NewsBanner from '@/components/NewsBanner';
import NewsNotice from '@/components/NewsNotice';
import {Base64} from "js-base64";

@connect(({ inforTech, loading }) => ({
  inforTech,
  loading: loading.models.inforTech,
}))
export default class TableList extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inforTech/getCommonDownloadList'
    })
  }

  onSearch=(value)=> {
    console.log(value)
    const keyWord = Base64.encode(value);
    if(keyWord){
      window.open(`/infor-tech/knowledge/list/${keyWord}`,"_blank")
    }else{
      window.open(`/infor-tech/knowledge/list/0`,"_blank")
    }

  }

  render() {
    const { inforTech: { downloadList },match } = this.props;
    const newsBannerStyle = {
      imgHeight: 200,
      iconTop: 90,
      iconLeftCurrent: 2,
      iconRightCurrent: 375,
    };

    return (
      <Fragment>
        <Row gutter={16}>
          <Col span={5}>
            <Card bordered={false} style={{minHeight: 250, marginBottom: 16}} bodyStyle={{padding: '8px'}} title="IT知识库" extra={<Link target="_blank" to="/infor-tech/knowledge/list/0">更多&gt;</Link>}>
              <Input.Search placeholder="请输入关键字" onSearch={this.onSearch} />
              <HotKnowledge />
            </Card>
            <Card bordered={false} title="联系我们">
              <ContactUs />
            </Card>
            <Suggestion />
          </Col>
          <Col span={19}>
            <Row gutter={16}>
              <Col span={12}>
                <NewsBanner typeSn="msg_banner"  newsBannerStyle={newsBannerStyle} />
              </Col>
              <Col span={12}>
                <Card bordered={false} bodyStyle={{padding: 0}} title="IT公告" extra={<Link target="_blank" to="/news-notice/notice-table/msg_notice">更多&gt;</Link>}>
                  <NewsNotice typeSn="msg_notice" type="notice" pageSize={5} />
                </Card>
              </Col>
              <Col span={24}>
                <Card bordered={false} style={{marginTop: 16}} title="IT行业资讯" extra={<Link target="_blank" to="/news-notice/news-list/itrend_news">更多&gt;</Link>}>
                  <TrendNews typeSn='itrend_news'/>
                </Card>
              </Col>
              <Col span={24}>
                <Card bordered={false} style={{marginTop: 16}} title="常用下载">
                  {downloadList && downloadList.length >0 ? (
                    <Tabs>
                      {downloadList.map(type=>(
                        <Tabs.TabPane tab={type.name} key={type.id} />
                      ))}
                    </Tabs>
                  ) : (<div>无</div>)}
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
