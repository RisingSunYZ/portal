import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon } from 'antd';
import { connect } from 'dva/index';
import {getConfig} from "@/utils/utils";
import sysDefault from '../../../../assets/workplace/sys-default.png';

@connect(({ user, workplace , loading }) => ({
  user,
  workplace,
  loading: loading.models.user,
}))
export default class SysList extends PureComponent {
  state = {
    sysSwiper: null,
  };

  serSwipeToPrev = () =>{
    const swiper = this.state.sysSwiper;
    if(swiper){
      swiper.swipePrev()
    } else {
      const sswiper = new Swiper(".sys-view", {
        wrapperClass: 'sys-list',
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
        sysSwiper: sswiper
      });
    }
  };

  serSwipeToNext = () =>{
    const swiper = this.state.sysSwiper;
    if(swiper){
      swiper.swipeNext()
    }else{
      const sswiper = new Swiper(".sys-view",{
        wrapperClass : 'sys-list',
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
        sysSwiper: sswiper
      });
    }
  };

  initSwiper = () => {
    this.state && (this.sysSwiper=new Swiper(".sys-view",{
      wrapperClass : 'sys-list',
      slideClass : 's-item',
      slidesPerView : 6,
      slidesPerGroup : 6,
      speed : 500,
      simulateTouch : false
    }));
  };

  onSysImgError = tar => {
    var img=tar.currentTarget;
    img.src=sysDefault;
    img.onerror=null;
  };

  getServicesList = slist => {

    return slist.map((sys, index)=>{
      return (
        <li key={index} className="s-item">
          <a href={sys.linkUrl} target="_blank">
            <img width="56" height="56" onError={this.onSysImgError.bind(this)} src={getConfig().ftpHost+sys.sysIcon} alt=""/>
          </a>
          <p>{sys.sysName}</p>
        </li>
      )
    });
  };
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'workplace/getSysData',
    });
  }

  render() {
    const {
      workplace: { sysData },
      style,
    } = this.props;
    return (
      <Card
        style={style}
        bordered={false}
        bodyStyle={{padding: 0}}
        title="常用系统"
        extra={ <a href={ getConfig().domain + "/portal/workplat/system/customize" } target="_blank" >添加更多 &gt;</a>}
      >
        <Row>
          <Col span={24}>
            <div id="sysBox" className="wp-sys-banner">
              <Icon type="left" style={{color: '#CFCFCF', fontSize: 24}} onClick={this.serSwipeToPrev} />
              <div className="sys-view">
                <ul className="sys-list">
                  {this.getServicesList(sysData || [])}
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
