import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import { Card, Breadcrumb, Row, Col, Select, Input, Icon, List } from 'antd';
import OrgSelect from '../commponents/common/OrgSelect';
import { getConfig } from '@/utils/utils';
import styles from './index.less';
import { connect } from 'dva';
import { Base64 } from 'js-base64';
import head from '../../../assets/public/head.png';
import Link from "umi/link";
const Option = Select.Option;
const Search = Input.Search;
@connect(({ hrService, loading }) => ({
  hrService,
  loading: loading.models.hrService,
}))
export default class Framework extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      openedLevel: 2,
      openedOrg: null,
      deptIds:"",
      topDeptsShow: true,
    };
    this.selectedOrg = [];
    this.orgSwiper = [];
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'hrService/getTopDept',
      callback:(orgs)=>{
       orgs && dispatch({
          type:'hrService/getAllPerson',
          payload:{deptId:orgs[0].id},
        })
      }
    })
  }

  createOrgList = org => {
    this.orgList = org;
    const lv = this.state.openedLevel, orgArr = [];
    for(let i=0; i<lv; i++){
      if(i === 0){
        orgArr.push(this.getOrgBox('company',org, 1));
        !this.selectedOrg[0] && org.children && (this.selectedOrg[0] = org.id);
      }else{
        const subOrg = this.getSubOrgByIndex(org, i-1, 0);
        orgArr.push(this.createSubOrgList(subOrg, i));
      }
    }
    this.createOrgSwiper();
    return orgArr;
  };

  getSubOrgByIndex = (org, lv, oLv) => {
    let tarOrg = {}, selectedOrg = this.selectedOrg;
    const _this = this;
    if(oLv < lv){
      const subCompanys = org && org.companyChildren ? org.companyChildren : [];
      const subOrgs = org && org.children ? org.children.concat(subCompanys) : subCompanys;
      subOrgs.map((subOrg, index) => {
        if(subOrg.children){
          if(selectedOrg[oLv+1] && subOrg.id === selectedOrg[oLv+1]){
            tarOrg = _this.getSubOrgByIndex(subOrg, lv, oLv+1);
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
    members && members.map((member,index)=>{
      list.push( this.getMemberBox(member) );
    });
    return list.length>0 ? (
      <div>
        {dept && (
          <div className="deptTitle">
            <h5>{dept.name}</h5>
            <p>{dept.code}</p>
          </div>
        )}
        <div className="mmList">
          <List
            itemLayout="vertical"
            grid={{ gutter: 32, column: 4 }}
            pagination={{
              pageSize: 12,
            }}
            dataSource={members}
            renderItem={member => (
              <List.Item
                key={member.no}
              >
                {this.getMemberBox(member)}
              </List.Item>
            )}
          />
        </div>
      </div>
    ) : ''
  };

  createSubOrgList = (org, lv) => {
    const subOrgs = org.children, subArr = [];
    const subCompanys = org.companyChildren, comArr = [];
    subOrgs && subOrgs.map((subOrg, idx) => {
      subArr.push(this.getOrgBox('dept',subOrg, lv+1));
    });
    subCompanys && subCompanys.map((subComp) => {
      comArr.push(this.getOrgBox('company',subComp, lv+1));
    });
    if(!this.state.topDeptsShow && subCompanys){
      subArr.length = 0;
    }
    const subOrgHtml = subArr.length>0 ? (
      <div id={"swiper" + lv} className="subOrgContainer">
        <Icon type="left" style={{color: '#CFCFCF', fontSize: 30}} onClick={()=>{this.swipeToPrev(lv)}} />
        <div className="subOrgBox">
          <div className="subOrgList">
            {subArr}
          </div>
        </div>
        <Icon type="right" style={{color: '#CFCFCF', fontSize: 30}} onClick={()=>{this.swipeToNext(lv)}} />
      </div>
    ) : '';
    const subCompanyHtml = comArr.length>0 ? (
      <div className="subOrgContainer">
        <Icon type="left" style={{color: '#CFCFCF', fontSize: 30}} onClick={()=>{this.swipeToPrev('subCompanySwipe')}} />
        <div className="subOrgBox" id="subCompanySwipe">
          <div className="subOrgList">
            {comArr}
          </div>
        </div>
        <Icon type="right" style={{color: '#CFCFCF', fontSize: 30}} onClick={()=>{this.swipeToNext('subCompanySwipe')}} />
      </div>
    ) : ''
    return (
      <div>
        {subCompanyHtml}
        {subOrgHtml}
      </div>
    )
  };

  swipeToPrev = (lv) => {
    if(this.orgSwiper[lv]){
        this.orgSwiper[lv].swipePrev();
    }else if(this.subCompanySwiper){
      this.subCompanySwiper.swipePrev();
    }
  };

  swipeToNext = (lv) => {
    if(this.orgSwiper[lv]){
      this.orgSwiper[lv].swipeNext();
    }else if(this.subCompanySwiper){
      this.subCompanySwiper.swipeNext();
    }
  };

  getOrgBox = (type, org, lv) => {
    const leader = org.leader, id = this.selectedOrg[lv-1];
    const leaderBox = leader ? (
      <div className="adminBox" onClick={this.showDetail.bind(this,leader.no)}>
        <img src={getConfig().ftpHost+leader.userImgUrl} alt="" onError={this.onHeadImgError.bind(this) }/>
        <div className="msg">
          <p>
            {leader.name}
            {leader.userPost && <span title={leader.userPost} className="levelTip">{leader.userPost}</span>}
          </p>
          <p className={styles.ellipsis} title={leader.jobStation}>{leader.jobStation}</p>
        </div>
      </div>
    ) : '';
    return (
      <div className={"orgContainer " + (org.id===id ? 'active' : '')}>
        <div className="orgBox" id={org.id} onClick={()=>{this.handleClickOrg(type, org, lv)}}>
          <div className="headBox">
            <h5 className="title ellipsis" title={org.name}>{org.name}</h5>
            <p className="number"><a  onClick={this.showPostDetail.bind(this,org.id)}>{org.postNumber}</a></p>
          </div>
          {leaderBox}
        </div>
      </div>
    )
  };

  showDetail =(no) =>{
    window.open(`/ys/user-team/userPandectForTeam/`+Base64.encode(no));
    // router.push(`/ys/user-team/userPandectForTeam/`+Base64.encode(no));
  };
  showPostDetail =(deptId) =>{
    window.open(`/ys/user-team/authorized?deptId=`+Base64.encode(deptId));
    // router.push(`/ys/user-team/userPandectForTeam/`+Base64.encode(no));
  };
  onHeadImgError=(tar)=>{
    var img=tar.currentTarget;
    img.src=head;
    img.onerror=null;
  }
  getMemberBox = (member) => {
    return (
      <div className="memberBox" key={member.no}>
        <div className="adminBox" onClick={this.showDetail.bind(this,member.no)}>
          <img src={getConfig().ftpHost+member.headImage} alt="" onError={this.onHeadImgError.bind(this) } />
          <div className="msg">
            <p>
              {member.name}
              {member.positionName && <span title={member.positionName} className="levelTip">{member.positionName}</span>}
            </p>
            <p>{member.no}</p>
            <p className={styles.ellipsis} title={member.postname}>{member.postname}</p>
          </div>
        </div>
      </div>
    )
  };

  handleClickOrg = (type, org, lv) => {
    this.selectedOrg.length = lv-1;
    const { dispatch } = this.props, _this=this;
    const deptShow = lv>1 && type==='company' ? false : (lv==1 ? true : this.state.topDeptsShow);
    dispatch({
      type:'hrService/getAllPerson',
      payload:{deptId:org.id},
    });
    if(org.children){
      this.setState({
        openedLevel: lv+1,
        openedOrg: org,
        topDeptsShow: deptShow,
      },()=>{
        this.createOrgSwiper(lv);
      });
      this.selectedOrg[lv-1] = org.id;
    }else {
      dispatch({
        type:'hrService/getDeptList',
        payload:{deptId:org.id},
        callback:function (children) {
          if(children){
            org.children=children;
            _this.setState({
              openedLevel: lv+1,
              openedOrg: org,
              topDeptsShow: deptShow,
            },()=>{
              _this.selectedOrg[lv-1] = org.id;
              _this.createOrgSwiper(lv);
            });
          }else {
            _this.setState({
              openedLevel: lv+1,
              openedOrg: org,
              topDeptsShow: deptShow,
            });
          }
        }
      })
    }
  };

  createOrgSwiper = (lv) => {
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
          const perWidth = swiper.width / swiper.params.slidesPerGroup * 2;
          swiper.setWrapperTransition(500);
          swiper.setWrapperTranslate(perWidth-swiper.slidesGrid[swiper.clickedSlideIndex]);
        },
        onSwiperCreated: (s)=>{
          if(lv && i===this.state.openedLevel-1){
            s.setWrapperTranslate(0);
          }
        }
      });
    }
    if($('#subCompanySwipe')[0]){
      this.subCompanySwiper = new Swiper('#subCompanySwipe', {
        wrapperClass : 'subOrgList',
        slideClass : 'orgContainer',
        slidesPerView : 5,
        slidesPerGroup : 5,
        speed : 500,
        simulateTouch : false,
        watchActiveIndex: true,
        onSlideClick: (swiper)=>{
          const perWidth = swiper.width / swiper.params.slidesPerGroup * 2;
          swiper.setWrapperTransition(500);
          swiper.setWrapperTranslate(perWidth-swiper.slidesGrid[swiper.clickedSlideIndex]);
        }
      });
    }
  };
  onOrgChange(deptMap){
    const { dispatch } = this.props;
    this.selectedOrg=[];
    dispatch({
      type:'hrService/getTopDept',
      payload:{deptId:deptMap.currentDeptId}
    });
    dispatch({
      type:'hrService/getAllPerson',
      payload:{deptId:deptMap.currentDeptId},
    })
  }
 //页面初始化方法，组织选择器
  initPage(deptIdArray){
   this.setState({deptIds:deptIdArray.join(",")});
  }
 //页面初始化方法，组织选择器
  queryPerson(value){
    if(value){
      this.selectedOrg = [];
      this.setState({
        openedLevel: 2,
        openedOrg: null
      });
      this.props.dispatch({
        type:'hrService/getAllPerson',
        payload:{departmentIds:this.state.deptIds,keyword:encodeURIComponent(value)},
      })
    }
  }
  render() {
   const {
     hrService:{deptTree,personList},
   } = this.props;
  const topOrg=deptTree[0]||{};
    const members = personList;
    const { openedLevel, openedOrg } = this.state;

    return (
      <div className="ucenter-box">
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className="title-box">
            <Breadcrumb>
              <Breadcrumb.Item>您所在的位置：<Link to={"/main/hr-service"}>HR服务</Link></Breadcrumb.Item>
              <Breadcrumb.Item><Link to={"/user-team"}>团队总览</Link></Breadcrumb.Item>
              <Breadcrumb.Item>我的团队</Breadcrumb.Item>
            </Breadcrumb>
            <div className="page-title">我的团队</div>
          </div>
        </Card>
        <Card bordered={false} bodyStyle={{ padding: '16px 24px', marginTop: 16 }}>
          <Row>
            <Col span={8}>
              <OrgSelect onOrgChange={this.onOrgChange.bind(this)} initPage={this.initPage.bind(this)} />
            </Col>
            <Col span={4} offset={12}>
              <Search
                placeholder="请输入姓名/工号"
                style={{ width: 200 }}
                onSearch={this.queryPerson.bind(this)}
              />
            </Col>
          </Row>
          <div className="fwContainer">
            <div className="fwFirstLevel">
              {this.createOrgList(topOrg, openedLevel)}
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
