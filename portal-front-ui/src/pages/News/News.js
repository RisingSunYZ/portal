import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, List } from 'antd';
import Link from 'umi/link';
import { getConfig } from '../../utils/utils';
import styles from './News.less';

@connect(({ newsInfo, loading }) => ({
  newsInfo,
  loading: loading.models.newsInfo,
}))

export default class TableList extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;

    // 获取专题活动列表
    dispatch({
      type: 'newsInfo/queryActivityList',
      payload: {
        typeSn: 'special_events',
        pageNumber: 1,
        pageSize: 5,
      },
    });

    // 获取公司动态列表
    dispatch({
      type: 'newsInfo/queryCompanyList',
      payload: {
        typeSn: 'company_news',
        pageNumber: 1,
        pageSize: 7,
      },
    });

    // 获取行业动态列表
    dispatch({
      type: 'newsInfo/queryIndustryList',
      payload: {
        typeSn: 'industry_news',
        pageNumber: 1,
        pageSize: 4,
      },
    });

    // 获取员工风采列表
    dispatch({
      type: 'newsInfo/queryStaffPresenceList',
      payload: {
        typeSn: 'staff_presence',
        pageNumber: 1,
        pageSize: 4,
      },
    });

  }

  render() {
    const { newsInfo:{activity, company, industry, staffPresence:{ list }}} = this.props;
    const ftpHost = getConfig().ftpHost;
    const domain = getConfig().domain;

    return (
      <Fragment>
        <Row gutter={16}>
          <Col span={5}>
            <Card
              title="专题活动"
              bordered={false}
              extra={<Link to={ "/news/table-list/special_events"}>更多</Link>}
              bodyStyle={{padding:14,paddingTop:1,paddingBottom:1}}
            >
              <List
                itemLayout="vertical"
                size="large"
                dataSource={activity.list}
                split={false}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.id}
                  >
                    {
                      index > 1 ?
                        (<span>
                          <p style={{fontWeight:"bold" }}>
                            <Link to="#"  target="_blank">{item.title}</Link>
                          </p>
                        </span>) :
                        (<span>
                          <Link to={ftpHost + item.thumbImg} target="_blank">
                            <img src={ftpHost + item.thumbImg} width="100%" height="130px"/>
                          </Link>
                          <p style={{fontWeight:"bold" }}><Link to="#"  target="_blank">{item.title}</Link></p>
                          <p style={{fontSize:"12px"}}>
                            <span>{item.remark.substr(0, 28) + "..."}</span>
                            <span><Link to="#">【详情】</Link></span>
                          </p>
                        </span>)
                    }
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={14}>
            <Card
              title="公司动态"
              bordered={false}
              extra={<Link to={ "/news/table-list/company_news"}>更多</Link>}
              bodyStyle={{padding:'1px 14px'}}>
              <List
                itemLayout="vertical"
                size="large"
                dataSource={company.list}
                split={false}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.id}
                  >
                    {
                      index > 1 ?
                        (<span>
                          <p style={{fontWeight:"bold" }}>
                            <Link to={"/news/table-list/" + item.id}  target="_blank">{item.title}</Link>
                          </p>
                        </span>) :
                        (<span>
                           <List.Item.Meta
                             avatar={
                               <Link to={ftpHost + item.thumbImg} target="_blank">
                                 <img src={ftpHost + item.thumbImg} className={styles.dynamicImg}/>
                               </Link>}
                             title={
                               <p style={{fontWeight:"bold" }}><a href={"/news/table-list/" + item.id}  target="_blank">{item.title}</a></p>
                             }
                             description={
                               <p style={{fontSize:"12px"}}>
                                 <span>{item.remark.substr(0, 100) + "..."}</span>
                                 <span><Link to={"/news/table-list/" + item.id}>【详情】</Link></span>
                               </p>}
                           />
                        </span>)
                    }
                  </List.Item>
                )}
              />
            </Card>
            <Card
              title="行业动态"
              bordered={false}
              extra={<Link to={ "/news/table-list/industry_news"}>更多</Link>}
              bodyStyle={{padding:"14px",paddingTop:"6px",paddingBottom:"2px"}}>
              <List
                itemLayout="vertical"
                size="large"
                dataSource={industry.list}
                split={false}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    style={{padding:0}}
                  >
                      <p>
                        <Link to="#"  target="_blank" className={styles.links}>{item.title}</Link>
                      </p>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card
              title="员工风采"
              bordered={false}
              extra={<Link to="#">更多</Link>}
              bodyStyle={{padding:'8px 14px 0px 14px'}}
            >
              <List
                itemLayout="vertical"
                size="large"
                dataSource={ list }
                split={false}
                renderItem={ item => (
                  <List.Item
                    key={item.id}
                    style={{padding:'6px 0 6px 0'}}
                  >
                    <Link to='#' target="_blank" className={styles.linkImg}>
                      <img src={ftpHost + item.photo} className={styles.windImg} />
                      <div className={styles.maskImg}>
                        <span>{item.title}</span>
                      </div>
                    </Link>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
