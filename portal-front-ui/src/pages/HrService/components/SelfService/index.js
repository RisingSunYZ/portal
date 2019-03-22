import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon } from 'antd';
import { connect } from 'dva/index';
import marketIcon from '../../../../assets/userCenter/market.png';
import salaryIcon from '../../../../assets/userCenter/salary.png';
import subsidyIcon from '../../../../assets/userCenter/subsidy.png';
import personalIcon from '../../../../assets/userCenter/personal.png';
import leaveIcon from '../../../../assets/userCenter/leave.png';
import dataApplyIcon from '../../../../assets/userCenter/data-apply.png';
import overtimeIcon from '../../../../assets/userCenter/overtime.png';
import askIcon from '../../../../assets/userCenter/ask.png';
import {getConfig} from "../../../../utils/utils";

const iconMap = {
  marketIcon: marketIcon,
  salaryIcon: salaryIcon,
  subsidyIcon: subsidyIcon,
  personalIcon: personalIcon,
  leaveIcon: leaveIcon,
  dataApplyIcon: dataApplyIcon,
  overtimeIcon: overtimeIcon,
  askIcon: askIcon
};

@connect(({ user,hrService, loading }) => ({
  user,
  hrService,
  loading: loading.models.user,
}))
export default class SelfService extends PureComponent {
  state = {
    serviceSwiper: null,
  };

  serSwipeToPrev = () =>{
    const swiper = this.state.serviceSwiper;
    if(swiper){
      swiper.swipePrev()
    } else {
      const sswiper = new Swiper(".service-view", {
        wrapperClass: 'service-list',
        slideClass: 's-item',
        slidesPerView: 6,
        slidesPerGroup: 6,
        speed: 500,
        simulateTouch: false,
        onFirstInit: (swiper) => {
          swiper.swipePrev();
        }
      });
      this.setState({
        serviceSwiper: sswiper
      });
    }
  };

  serSwipeToNext = () =>{
    const swiper = this.state.serviceSwiper;
    if(swiper){
      swiper.swipeNext()
    }else{
      const sswiper = new Swiper(".service-view",{
        wrapperClass : 'service-list',
        slideClass : 's-item',
        slidesPerView : 6,
        slidesPerGroup : 6,
        speed : 500,
        simulateTouch : false,
        onFirstInit: (swiper)=>{
          swiper.swipeNext();
        }
      });
      this.setState({
        serviceSwiper: sswiper
      });
    }
  };

  initSwiper = () => {
    this.state && (this.serviceSwiper=new Swiper(".service-view",{
      wrapperClass : 'service-list',
      slideClass : 's-item',
      slidesPerView : 6,
      slidesPerGroup : 6,
      speed : 500,
      simulateTouch : false
    }));
  };
  getServicesList = slist => {
    return slist.map((service, index)=>{
      return (
        <li key={index} className="s-item">
          <a href={getConfig().domain+service.linkUrl+"?dictionaryId="+service.id} target="_blank">
            <img src={iconMap[service.icon]} alt=""/>
            <span>{service.name}</span>
          </a>
        </li>
      )
    });
  };
  componentDidMount(){
    this.props.dispatch({
      type:'hrService/getQuickProcess',
    });
  }

  render() {
    const {
      hrService: {quickProcess}
    } = this.props;
    return (
      <Card
        style={{marginTop: 16}}
        bordered={false}
        bodyStyle={{padding: 0}}
      >
        <Row>
          <Col span={24}>
            <div className="self-service">自助服务</div>
            <div id="serviceBox" className="self-service-banner">
              <Icon type="left" style={{color: '#CFCFCF', fontSize: 24}} onClick={this.serSwipeToPrev} />
              <div className="service-view">
                <ul className="service-list">
                  {this.getServicesList(quickProcess)}
                </ul>
              </div>
              <Icon type="right" style={{color: '#CFCFCF', fontSize: 24}} onClick={this.serSwipeToNext} />
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}
