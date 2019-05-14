import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, List } from 'antd';
import Link from 'umi/link';
import { getConfig, FormatDates } from '../../utils/utils';
import StaffDetail from './components/StaffDetail';
import styles from './News.less';

@connect(({ user,newsInfo, loading }) => ({
  user,
  newsInfo,
  loading: loading.models.newsInfo,
}))

export default class TableList extends PureComponent {
  state = {
    visible:false,
    action: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取专题活动列表
    dispatch({
      type: 'newsInfo/queryActivityList',
      payload: {
        typeSn: 'special_events',
        pageIndex: 0,
        pageSize: 5,
      },
    });

    // 获取公司动态列表
    dispatch({
      type: 'newsInfo/queryCompanyList',
      payload: {
        typeSn: 'company_news',
        pageIndex: 0,
        pageSize: 7,
      },
    });

    // 获取行业动态列表
    dispatch({
      type: 'newsInfo/queryIndustryList',
      payload: {
        typeSn: 'industry_news',
        pageIndex: 0,
        pageSize: 4,
      },
    });

    // 获取员工风采列表
    dispatch({
      type: 'newsInfo/getListMedia',
      payload: {
        typeSn: 'staff_presence',
        pageIndex: 0,
        pageSize: 4,
      },
    });
  }

  showStaffPhoto = (id, index)=> {
    // 查看员工风采相册详情
    this.setState({
      staffId: id,
      staffIndex: index,
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { newsInfo:{activity, company, industry, staffAllData }} = this.props;
    const { staffId, visible, staffIndex } = this.state;
    const ftpHost = getConfig().ftpHost;

    return (
      <Fragment>
        <Row gutter={16}>
          <Col span={5}>
            <Card
              title="专题活动"
              bordered={false}
              extra={<Link to={ "/news-notice/news-list/special_events"} target="_blank" className={styles.more}> 更多&gt;</Link>}
              bodyStyle={{padding:14}}
            >
              <List
                itemLayout="vertical"
                size="large"
                dataSource={activity.list}
                split={false}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.id}
                    style={{ padding:0 }}
                  >
                    {
                      index > 1 ?
                        ( <Link to={`/news-notice/special_events/${item.id}`} target="_blank" className={styles.links}><i className={styles.itemTip} />{item.title}</Link> ) :
                        (<div className={styles.listTop}>
                          <Link to={ftpHost + item.thumbImg} target="_blank">
                            <img src={ftpHost + item.thumbImg} className={styles.moveImg}/>
                          </Link>
                          <span className={styles.moveTitle}>
                            <Link to={`/news-notice/special_events/${item.id}`}  target="_blank">{item.title}</Link>
                          </span>
                          <p className={styles.descTitle}>
                            <span>{item.remark.substr(0, 28) + "..."}</span>
                            <span><Link to={`/news-notice/special_events/${item.id}`}>【详情】</Link></span>
                          </p>
                        </div>)
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
              extra={<Link to={"/news-notice/notice-table/company_news"} target="_blank" className={styles.more}> 更多&gt; </Link>}
              bodyStyle={{padding:'10px 14px'}}>
              <List
                itemLayout="vertical"
                dataSource={company.list}
                split={false}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.id}
                    style={{ padding:'4px' }}
                  >
                    {
                      index > 1 ?
                        ( <Link to={`/news-notice/company_news/${item.id}`}  target="_blank" className={styles.links}><i className={styles.itemTip} />{item.title}</Link> ) :
                        (<List.Item.Meta
                             avatar={
                               <Link to={ftpHost + item.thumbImg} target="_blank">
                                 <img src={ftpHost + item.thumbImg} className={styles.thumbImg}/>
                               </Link>
                             }
                             title={
                               <span className={styles.linkTitle}>
                                 <Link to={`/news-notice/company_news/${item.id}`}  target="_blank" >{item.title}</Link>
                               </span>
                             }
                             description={
                               <p className={styles.descTitle}>
                                 <span>{item.remark.substr(0, 100) + "..."}</span>
                                 <Link to={`/news-notice/company_news/${item.id}`} target="_blank">【详情】</Link>
                               </p>
                             }
                           />)
                    }
                  </List.Item>
                )}
              />
            </Card>
            <Card
              title="行业动态"
              bordered={false}
              extra={<Link to={"/news-notice/news-list/industry_news"} target="_blank" className={styles.more}> 更多&gt; </Link>}
              bodyStyle={{padding:14}}
              style={{marginTop: 18}}
            >
              <List
                itemLayout="vertical"
                dataSource={industry.list}
                split={false}
                renderItem={ item => (
                  <List.Item
                    key={item.id}
                    style={{padding:0}}
                  >
                    <Link to={`/news-notice/industry_news/${item.id}`} target="_blank" className={styles.links}><i className={styles.itemTip} />{item.title}</Link>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card
              title="员工风采"
              bordered={false}
              extra={<Link to={"/news-notice/staff-list"} target="_blank"  className={styles.more}> 更多&gt; </Link>}
              bodyStyle={{padding:'8px 16px 0px 16px'}}
            >
              <List
                itemLayout="vertical"
                dataSource={ staffAllData ? staffAllData.slice(0, 4) : [] }
                split={false}
                renderItem={ (item, index) => (
                  <List.Item
                    key={item.id}
                    style={{padding:'6px 0 6px 0'}}
                  >
                    <span className={styles.linkImg} onClick={()=>this.showStaffPhoto(item.id, index)}>
                      <img src={ftpHost + item.photo} className={styles.windImg} />
                      <div className={styles.maskImg}>
                        <span>{item.title}</span>
                      </div>
                    </span>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
        {staffId && visible?<StaffDetail currentIndex={staffIndex} staffId={staffId} visible={visible} onCancel={()=>this.setState({visible:false})} />:''}
      </Fragment>
    );
  }
}
