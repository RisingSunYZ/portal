import React, { PureComponent } from 'react';
import styles from './index.less';
import { Row, Breadcrumb, List, Card,Carousel,Icon } from 'antd';
import Ellipsis from '@/components/Ellipsis'
import nameIcon from '../../../assets/userCenter/name.png';
import telIcon from '../../../assets/userCenter/tel.png';
import emailIcon from '../../../assets/userCenter/email.png';
import { connect } from 'dva/index';
@connect(({ hrService, loading }) => ({
  hrService,
  loading: loading.models.hrService,
}))
export default class ContactUs extends PureComponent {
  state = {};

  componentDidMount(){
    this.props.dispatch({
      type:'hrService/getContactUs',
      payload:''
    })
  }

  getContactList = (contactList) => {
    return contactList ? contactList.map((contact, index)=>{
      return (
        <div className={styles.contactBox}>
          <p className={styles.cTitle}>{contact.typeName}</p>
          <List
            grid={{ gutter: 32, column: 3 }}
            dataSource={contact.contactUsList}
            renderItem={item => (
              <List.Item>
                {this.getContactUsPerson(item)}
              </List.Item>
            )}
          />
        </div>
      )
    }): "";
  };

  getContactUsPerson = person => {
    return (
      <Card className={styles.personBox} bordered={false}>
        <p className={styles.personTitle}>{person.deptName}</p>
        <p><img src={nameIcon} alt="" />{person.userName}</p>
        <p><img src={telIcon} alt="" />{person.tel}</p>
        <p><img src={emailIcon} alt="" /><span title={person.email} style={{width: 185,display: 'inline-block'}}><Ellipsis length={25}>{person.email}</Ellipsis></span></p>
      </Card>
    )
  };

  swipeToPrev = () => {
    this.refs.contact.prev();
  };

  swipeToNext = () => {
    this.refs.contact.next();
  };

  render() {
    const contactList = this.props.hrService.contactUs;
    return (
      <div>
        <Card bordered={false} bodyStyle={{padding: 0}}>
          <div style={{padding: '16px 24px'}}>
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
              <Breadcrumb.Item>HR自助</Breadcrumb.Item>
              <Breadcrumb.Item>联系我们</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Card>
        <Card bordered={false} style={{marginTop: 16}}>
          <h3 className={styles.pageTitle}>联系我们</h3>
          <div className="linkContainer">
            <Icon type="left" onClick={this.swipeToPrev} />
            <Carousel dots={false} ref="contact">
              {this.getContactList(contactList)}
            </Carousel>
            <Icon type="right" onClick={this.swipeToNext} />
          </div>
        </Card>
      </div>
    );
  }
}
