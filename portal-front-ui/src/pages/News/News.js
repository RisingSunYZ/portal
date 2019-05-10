import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, List, Modal,Comment,Input,Avatar,Icon,Button, Form } from 'antd';
import Link from 'umi/link';
import { getConfig , simpleFormatDate, FormatDates } from '../../utils/utils';
import StaffPhoto from '@/components/StaffPhoto';
import moment from 'moment';
import styles from './News.less';

const TextArea = Input.TextArea;


const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div className={styles.commentArea}>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} placeholder={'请输入最多155字的评论'}/>
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        onClick={onSubmit}
        type="primary"
      >
        提交
      </Button>
    </Form.Item>
  </div>
);

@connect(({ user,newsInfo, loading }) => ({
  user,
  newsInfo,
  loading: loading.models.newsInfo,
}))

export default class TableList extends PureComponent {
  state = {
    visible:false,
    staffSwiper:null,
    likes: 0,
    action: null,
    comments: [],
    submitting: false,
    value: '',
  };

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

  phoSwipeToPrev = () =>{
    const { staffSwiper }=this.state;
    if(staffSwiper){
      staffSwiper.swipePrev()
    } else {
      const mySwiper = new Swiper(".photo-view", {
        wrapperClass: 'photo-list',
        slideClass: 'photo-item',
        slidesPerView: 6,
        slidesPerGroup: 6,
        speed: 500,
        simulateTouch: false,
        onFirstInit: (staffSwiper) => {
          staffSwiper.swipePrev();
        }
      });
      this.setState({
        staffSwiper: mySwiper
      });
    }
  };

  phoSwipeToNext = () =>{
    const { staffSwiper }=this.state;
    if(staffSwiper){
      staffSwiper.swipeNext()
    }else{
      const mySwiper = new Swiper(".photo-view",{
        wrapperClass : 'photo-list',
        slideClass : 'photo-item',
        slidesPerView : 6,
        slidesPerGroup : 6,
        speed : 500,
        simulateTouch : false,
        onFirstInit: (staffSwiper)=>{
          staffSwiper.swipeNext();
        }
      });
      this.setState({
        staffSwiper: mySwiper
      });
    }
  };

  getPhotoList = pholist => {

    return pholist.map((item, index)=>{
      return (
        <li key={index} className="photo-item">
          <img width="56" height="56" src={getConfig().ftpHost+item.sysIcon} alt=""/>
        </li>
      )
    });
  };

  showStaffPhoto = (id)=> {
  // 查询员工风采相册详情
    const { dispatch }=this.props;
    dispatch({
      type: 'newsInfo/queryStaffPhotoDetail',
      payload: { id:id },
    });
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  like = () => {
    this.setState({
      likes: 1,
      action: 'liked',
    });
  };

  handleSubmits = (item) => {
    const { user:{ currentUser } }=this.props;
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true,
    });

      this.setState({
        submitting: false,
        value: '',
        comments: [
          {
            author: <span className={styles.nameDate}>{currentUser.name}</span>,
            content: <p className={styles.valueContent}>{this.state.value}</p>,
            datetime: <span className={styles.nameDate}>{ FormatDates(item.publishTime) }</span>,
          },
          ...this.state.comments,
        ],
      });
  };

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };


  render() {
    const { newsInfo:{activity, company, industry, staffPresence:{ list }}, user:{ currentUser } } = this.props;
    const { comments, submitting, value ,action,likes } = this.state;
    const ftpHost = getConfig().ftpHost;
    const domain = getConfig().domain;

    return (
      <Fragment>
        <Row gutter={16}>
          <Col span={5}>
            <Card
              title="专题活动"
              bordered={false}
              extra={<Link to={ "/news-notice/news-list/special_events"} target="_blank" className={styles.more}> 更多> </Link>}
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
                        ( <Link to={`/news-notice/special_events/${item.id}`} target="_blank" className={styles.links}>{item.title}</Link> ) :
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
              extra={<Link to={"/news-notice/notice-table/company_news"} target="_blank" className={styles.more}> 更多> </Link>}
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
                        ( <Link to={`/news-notice/company_news/${item.id}`}  target="_blank" className={styles.links}>{item.title}</Link> ) :
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
              extra={<Link to={"/news-notice/news-list/industry_news"} target="_blank" className={styles.more}> 更多> </Link>}
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
                    <Link to={`/news-notice/industry_news/${item.id}`} target="_blank" className={styles.links}>{item.title}</Link>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card
              title="员工风采"
              bordered={false}
              extra={<Link to={"/news-notice/staff-list"} target="_blank"  className={styles.more}> 更多> </Link>}
              bodyStyle={{padding:'8px 16px 0px 16px'}}
            >
              <List
                itemLayout="vertical"
                dataSource={ list }
                split={false}
                renderItem={ item => (
                  <List.Item
                    key={item.id}
                    style={{padding:'6px 0 6px 0'}}
                  >
                    <span className={styles.linkImg} onClick={()=>this.showStaffPhoto(item.id)}>
                      <img src={ftpHost + item.photo} className={styles.windImg} />
                      <div className={styles.maskImg}>
                        <span>{item.title}</span>
                      </div>
                    </span>
                    <Modal
                      visible={this.state.visible}
                      mask={false}
                      footer={null}
                      centered
                      onCancel={this.handleCancel}
                      width={1024}
                      className={styles.modalContent}
                    >
                      <Row>
                        <Col span={17} style={{background:'#000'}}>
                          <div id="phoBox" className="photo-banner">
                            <Icon type="left" style={{color: '#CFCFCF', fontSize: 24}} onClick={this.phoSwipeToPrev} />
                            <div className="photo-view">
                              <ul className="photo-list">
                                <li style={{width:'100%'}}>
                                  <img style={{width:400,height:300}} src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556439415839&di=404e2bc873e2ecc5b00e27b23ae20312&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F5d40e86685397092cad16d5657edf9e6d96436988ab1-HyBi06_fw658" alt=""/>
                                </li>
                                {/*{this.getPhotoList(data || [])}*/}
                              </ul>
                              <ul className="photo-small">
                                <li>
                                  <img style={{width:56,height:56,textAlign:'center'}} src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556439415839&di=404e2bc873e2ecc5b00e27b23ae20312&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F5d40e86685397092cad16d5657edf9e6d96436988ab1-HyBi06_fw658" alt=""/>
                                </li>
                                {/*{this.getPhotoList(data || [])}*/}
                              </ul>
                            </div>
                            <Icon type="right" style={{color: '#CFCFCF', fontSize: 24}} onClick={this.phoSwipeToNext} />
                          </div>
                        </Col>
                        <Col span={7}>
                          <div className={styles.topArea}>
                            <h4 className={styles.topTitle}>{item.title}</h4>
                            <span className={styles.publickPer}>发布人：{currentUser.name}</span>
                            <span className={styles.spanText}>发布时间：{simpleFormatDate(item.publishTime)}</span>
                            <span className={styles.spanCount}>阅读：{item.visitCount}</span>
                            <h5 className={styles.botTitle}>{item.title}</h5>
                            <Icon
                              type="like"
                              theme={action === 'liked' ? 'filled' : 'outlined'}
                              onClick={this.like}
                            />
                            <span style={{ paddingLeft: 8, cursor: 'auto' }}>{likes}</span>
                          </div>

                          <div style={{background:'#F5F5F5'}}>
                            {comments.length > 0 && <CommentList comments={comments} />}
                            <Comment
                              content={(
                                <Editor
                                  onChange={this.handleChange}
                                  onSubmit={()=>this.handleSubmits(item)}
                                  submitting={submitting}
                                  value={value}
                                />
                              )}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Modal>
                  </List.Item>
                )}
              />
              {/*<StaffPhoto />*/}

            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
