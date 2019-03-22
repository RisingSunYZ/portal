import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import { Card, Breadcrumb, Row, Col, Select, Input, Icon } from 'antd';
import Ellipsis from '@/components/Ellipsis'
import styles from './index.less';
const Option = Select.Option;
const Search = Input.Search;

const orgList = [{
  "id": "1001K310000000027A0J", "code": "200001", "text": "亚厦集团", level: 0, children: [
    {"id": "1001K3100000000276VQ", "code": "12", "text": "团委", level: 1},
    {"id": "1001K3100000000276TC", "code": "13", "text": "人力资源部", level: 1},
    {"id": "1001K3100000000276TV", "code": "17", "text": "信息部", level: 1, children: [
        {"id": "1001K31000000002GLC1", "code": "1701", "text": "规划与管理部", level: 2},
        {"id": "1001K31000000002GLCM", "code": "1702", "text": "基础架构与服务部", level: 2},
        {"id": "1001K31000000002GLCT", "code": "1703", "text": "技术开发部", level: 2},
        {"id": "1001K31000000002GLNQ", "code": "1704", "text": "产品规划部", level: 2},
        {"id": "8a8a94aa616e41ec0161db7f35b3002d", "code": "1705", "text": "测试部门", level: 2},
      ]},
    {"id": "1001K3100000000276ZP", "code": "18", "text": "证券部", level: 1},
    {"id": "1001K3100000000276VC", "code": "19", "text": "秘书处", level: 1},
    {"id": "1001F21000000002TMCO", "code": "21", "text": "行政综合部", level: 1, children: [
        {"id": "1001F21000000002TMCX", "code": "2101", "text": "行政管理部", level: 2},
        {"id": "1001F21000000002TMD4", "code": "2102", "text": "企划部", level: 2},

      ]},
  ],
}];
const members = [{"id":"000000005bc78f77015bc78f7c990019","name":"贺学亮","gender":1,"no":"00007002","email":"hexueliang@chinayasha.net","companyId":"0001K310000000008TK6","pType":0,"companyName":"亚厦集团","deptId":"1001K31000000002GLNQ","deptName":"产品规划部","jobStation":"数据分析师","shortPhone":"665921","levelId":"P-09","workAddress":"","companyMobile":" ","mobile":"13817314317","phone":"","mobilePhone":"13817314317","weixinNo":"","qqNo":"","weiBlog":"","showContact":1,"isPublic":1,"interests":"","headImg":"/p-head/2017/12/20/8a8a94aa6059716b0160720a1c5307b7.jpg","sortNo":1009,"idcard":"34120319870908253X"},{"id":"8a8a8c395de9105b015e0343257d77ef","name":"王伟辰","gender":1,"no":"00008106","companyId":"0001K310000000008TK6","pType":0,"companyName":"亚厦集团","deptId":"1001K31000000002GLNQ","deptName":"产品规划部","jobStation":"产品工程师","levelId":"P-08","workAddress":"","companyMobile":" ","mobile":"18627839550","mobilePhone":"18268178809","showContact":1,"isPublic":1,"headImg":"/p-head/2017/12/20/8a8a94aa6059716b016072129ac00a87.jpg","sortNo":1008,"idcard":"350702199012130817"},{"id":"000000005d4f0dcd015d88682c310b8a","name":"邵斐","gender":2,"no":"00007957","companyId":"0001K310000000008TK6","pType":0,"companyName":"亚厦集团","deptId":"1001K31000000002GLNQ","deptName":"产品规划部","jobStation":"产品工程师","workAddress":"","companyMobile":" ","mobile":"17826810941","phone":"","mobilePhone":"17826810941","qqNo":"","showContact":1,"isPublic":1,"sortNo":1006,"idcard":"330822199601176327"},{"id":"000000005d4f0dcd015d88682c310b8b","name":"张子剑","gender":1,"no":"00007956","companyId":"0001K310000000008TK6","pType":0,"companyName":"亚厦集团","deptId":"1001K31000000002GLNQ","deptName":"产品规划部","jobStation":"产品工程师","levelId":"P-04","workAddress":"","companyMobile":" ","mobile":"15658538159","mobilePhone":"15658538159","weixinNo":"up-B-god","qqNo":"195372109","weiBlog":"","showContact":1,"isPublic":1,"interests":"","headImg":"/p-head/2017/12/20/8a8a94aa6059716b0160720e4fef090e.jpg","sortNo":1004,"idcard":"510302199312300513"},{"id":"8a8a8c396569c4f101657ee3cebe15f0","name":"范赵龙","gender":1,"no":"00010407","companyId":"0001K310000000008TK6","pType":0,"companyName":"亚厦集团","deptId":"1001K31000000002GLNQ","deptName":"产品规划部","jobStation":"产品工程师","workAddress":"","companyMobile":" ","mobile":"18989465097","mobilePhone":"18989465097","showContact":1,"isPublic":1,"sortNo":1001,"idcard":"622825199201133010"},{"id":"8a8a8c396569c4f101657ee4766120c4","name":"初明鑫","gender":2,"no":"00010469","companyId":"0001K310000000008TK6","pType":0,"companyName":"亚厦集团","deptId":"1001K31000000002GLNQ","deptName":"产品规划部","jobStation":"产品工程师","workAddress":"","companyMobile":" ","mobile":"18217282726","mobilePhone":"18217282726","showContact":1,"isPublic":1,"sortNo":1001,"idcard":"210602199208243526"},{"id":"8a8a8c396569c4f101657ee51e5b2e61","name":"赵阳","gender":2,"no":"00011112","companyId":"0001K310000000008TK6","pType":0,"companyName":"亚厦集团","deptId":"1001K31000000002GLNQ","deptName":"产品规划部","jobStation":"产品工程师","workAddress":"","companyMobile":" ","mobile":"15716368351","mobilePhone":"15716368351","showContact":1,"isPublic":1,"sortNo":1001,"idcard":"410184199410241828"},{"id":"8a8a8c396569c4f101657ee476612147","name":"吕晓通","gender":1,"no":"00011257","companyId":"0001K310000000008TK6","pType":0,"companyName":"亚厦集团","deptId":"1001K31000000002GLNQ","deptName":"产品规划部","jobStation":"产品工程师","workAddress":"","companyMobile":" ","mobile":"13759756635","mobilePhone":"13759756635","showContact":1,"isPublic":1,"sortNo":1001,"idcard":"610302199601244515"},{"id":"8a8a8c396569c4f101657ee476612148","name":"王全","gender":1,"no":"00011258","companyId":"0001K310000000008TK6","pType":0,"companyName":"亚厦集团","deptId":"1001K31000000002GLNQ","deptName":"产品规划部","jobStation":"产品工程师","workAddress":"","companyMobile":" ","mobile":"18770813461","mobilePhone":"17679013461","showContact":1,"isPublic":1,"sortNo":1001,"idcard":"36040219940226527X"},{"id":"8a8a94aa65d2015c0165d201668d0008","name":"22","gender":2,"no":"00000286","companyId":"0001K310000000008TK6","pType":0,"companyName":"亚厦集团","deptId":"1001K31000000002GLNQ","deptName":"产品规划部","jobStation":"用户体验师","workAddress":"","companyMobile":" ","mobile":"17654321456","mobilePhone":"17654321456","showContact":1,"isPublic":1,"sortNo":1000,"idcard":"1111111222"}];

export default class Framework extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      openedLevel: 2,
      openedOrg: null,
    };
    this.selectedOrg = [];
  }
  componentDidMount() {
    this.createOrgSwiper();
  }

  createOrgList = list => {
    const level = this.state.openedLevel, orgArr = [];
    for(let i=0; i<level; i++){
      if(i === 0){
        list.map((org, j)=>{
          org.level === 0 && orgArr.push(this.getOrgBox(org));
          !this.selectedOrg[0] && org.children && (this.selectedOrg[0] = org.code);
        })
      }else{
        const subOrg = this.getSubOrgByIndex(list[0], i-1);
        orgArr.push(this.createSubOrgList(subOrg));
      }
    }
    return orgArr;
  };

  getSubOrgByIndex = (org, level) => {
    let tarOrg = {}, selectedOrg = this.selectedOrg;
    if(org.level < level){
      const subOrgs = org && org.children ? org.children : [];
      subOrgs.map((subOrg, index) => {
        if(subOrg.children){
          if(selectedOrg[subOrg.level] && subOrg.code === selectedOrg[subOrg.level]){
            tarOrg = this.getSubOrgByIndex(subOrg, level);
          }else if(!selectedOrg[subOrg.level]){
            selectedOrg[subOrg.level] = subOrg.code;
            tarOrg = this.getSubOrgByIndex(subOrg, level);
          }
        }
      });
    }else{
      tarOrg = org;
    }
    return tarOrg;
  };

  createMemberList = (dept, members) => {
    const list = [];
    members.map((member,index)=>{
      list.push( this.getMemberBox(member) );
    });
    return dept && list.length>0 ? (
      <div>
        <div className="deptTitle">
          <h5>{dept.text}</h5>
          <p>{dept.code}</p>
        </div>
        <div className="mmList">
          {list}
        </div>
      </div>
    ) : ''
  };

  createSubOrgList = (org) => {
    const subOrgs = org.children, subArr = [];
    subOrgs.map((subOrg, idx) => {
      subArr.push(this.getOrgBox(subOrg));
    });
    return (
      <div id={"swiper" + org.level} className="subOrgContainer">
        <Icon type="left" style={{color: '#CFCFCF', fontSize: 30}} onClick={()=>{this.swipeToPrev(org.level)}} />
        <div className="subOrgBox">
          <div className="subOrgList">
            {subArr}
          </div>
        </div>
        <Icon type="right" style={{color: '#CFCFCF', fontSize: 30}} onClick={()=>{this.swipeToNext(org.level)}} />
      </div>
    )
  };

  swipeToPrev = (level) => {
    this.orgSwiper && this.orgSwiper[level] && this.orgSwiper[level].swipePrev();
  };

  swipeToNext = (level) => {
    this.orgSwiper && this.orgSwiper[level] && this.orgSwiper[level].swipeNext();
  };

  getOrgBox = (org) => {
    return (
      <div className="orgContainer">
        <div className="orgBox" onClick={()=>{this.handleClickOrg(org)}}>
          <div className="headBox">
            <h5 className="title">{org.text}</h5>
            <p className="number">{org.code}</p>
          </div>
          <div className="adminBox">
            <img src={org.adminHead} alt="" />
            <div className="msg">
              <p>
                {org.adminName}
                {org.levelId && <span className="levelTip">{org.levelId}</span>}
              </p>
              <p title={org.adminPost}><Ellipsis style={{verticalAlign: 'middle'}} length={8}>{org.adminPost}</Ellipsis></p>
            </div>
          </div>
        </div>
      </div>
    )
  };

  getMemberBox = (member) => {
    return (
      <div className="memberBox">
        <div className="adminBox">
          <img src={member.head} alt="" />
          <div className="msg">
            <p>
              {member.name}
              {member.levelId && <span className="levelTip">{member.levelId}</span>}
            </p>
            <p>{member.no}</p>
            <p title={member.jobStation}><Ellipsis style={{verticalAlign: 'middle'}} length={10}>{member.jobStation}</Ellipsis></p>
          </div>
        </div>
      </div>
    )
  };

  handleClickOrg = (org) => {
    if(org.children){
      this.setState({
        openedLevel: org.level+1,
        openedOrg: org,
      },()=>{
        this.createOrgSwiper();
      });
      this.selectedOrg[org.level] = org.code;
    }else {
      this.setState({
        openedLevel: org.level,
        openedOrg: org,
      });
    }
  };

  createOrgSwiper = () => {
    this.orgSwiper = [];
    for(let i=0; i<this.state.openedLevel; i++){
      const _id = "#swiper"+i+" .subOrgBox";
      this.orgSwiper[i] = new Swiper( _id, {
        wrapperClass : 'subOrgList',
        slideClass : 'orgContainer',
        slidesPerView : 5,
        slidesPerGroup : 5,
        speed : 500,
        simulateTouch : false,
        watchActiveIndex: true,
        onSlideClick: (swiper)=>{
          for(let j=i; j<this.state.openedLevel; j++){
            this.orgSwiper[j] && this.orgSwiper[j].slides.map((slider, index) => {
              slider.classList.remove("active");
            });
          }
          const perWidth = swiper.width / swiper.params.slidesPerGroup * 2;
          swiper.setWrapperTransition(500);
          swiper.setWrapperTranslate(perWidth-swiper.slidesGrid[swiper.clickedSlideIndex]);
          swiper.clickedSlide.classList.add("active");
        },
      });
    }

  };

  render() {
    const { openedLevel, openedOrg } = this.state;

    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<a href="/ys/main/hr-service">HR服务</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="/ys/user-team">团队总览</a></Breadcrumb.Item>
              <Breadcrumb.Item>我的团队</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">我的团队</div>
          </div>
        </Card>
        <Card bordered={false} bodyStyle={{ padding: '16px 24px', marginTop: 16 }}>
          <Row>
            <Col span={8}>
              <Select style={{ width: 130 }}>
                <Option value="ys">亚厦集团</Option>
              </Select>
              <Select style={{ width: 130, marginLeft: 16 }}>
                <Option value="xx">信息部</Option>
              </Select>
            </Col>
            <Col span={4} offset={12}>
              <Search
                placeholder="请输入姓名/工号"
                style={{ width: 200 }}
              />
            </Col>
          </Row>
          <div className="fwContainer">
            <div className="fwFirstLevel">
              {this.createOrgList(orgList, openedLevel)}
            </div>
            <div className="memberContainer">
              {this.createMemberList(openedOrg, members)}
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
