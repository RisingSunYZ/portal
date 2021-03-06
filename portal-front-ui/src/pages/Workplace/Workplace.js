import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, message } from 'antd';
import Calendar from '@/components/Calendar';
import WorkMenus from '@/components/WorkMenus';
import NewsList from '@/components/NewsList';
import Link from "umi/link";
import NewsBanner from '@/components/NewsBanner';
import Searcher from './components/Searcher';
import SysList from './components/SysList';
import styles from './Workplace.less';
import {getConfig} from "@/utils/utils";

@connect(({ global,loading }) => ({
  loading: loading.models.process,
}))
export default class TableList extends PureComponent {
  state = {};

  componentWillMount(){
    // 首页未上线，暂跳ysportal项目首页
    // location.href = getConfig().domain
  }

  componentDidMount() {

  }

  render() {
    const newsBannerStyle = {
      imgHeight: 180,
      iconTop: 90,
      iconLeftCurrent: 2,
      iconRightCurrent: 375,
    };

    return (
      <Fragment>
        <Card bordered={false} style={{marginBottom: 16}}>
          <Row>
            <Col span={4}>
              <Calendar viewRender={(today)=>(
                <div className={styles.calendarBox}>
                  <h4>{today.ncWeek}</h4>
                  <span>{today.cMonth}月{today.cDay}日 农历{today.IMonthCn}{today.IDayCn}</span>
                </div>
              )} />
            </Col>
            <Col span={16}>
              <WorkMenus />
            </Col>
            <Col span={4} style={{marginTop:"22px"}} >
              <Searcher />
            </Col>
          </Row>
        </Card>
        <Row gutter={16}>
          <Col span={14}>
            <NewsList width="100%" title="通知公告"  height="340px"  typeSn="home_notice" extra={<Link to={"/news-notice/notice-table/home_notice"} target="_blank"> 更多&gt; </Link>} />
            <SysList style={{width: '100%'}} />
          </Col>
          <Col span={10}>
            <Card className="marginBottom" bordered={false} bodyStyle={{padding:"12px 11px 0px"}}>
              <NewsBanner typeSn="home_banner" newsBannerStyle={newsBannerStyle} />
            </Card>
            <NewsList width="100%" title="公司动态" height="340px" typeSn="company_news" extra={<Link to={"/news-notice/news-list/company_news"} target="_blank"> 更多&gt; </Link>} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
