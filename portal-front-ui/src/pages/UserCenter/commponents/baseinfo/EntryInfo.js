import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Table, Timeline,Button } from 'antd';
import styles from '../../Baseinfo/index.less';
import { connect } from 'dva/index';
import DescriptionList from '@/components/DescriptionList';
import {getConfig} from "../../../../utils/utils";

const { Description } = DescriptionList;
const columns = [
  {
    title: '合同类型',
    dataIndex: 'secondCateName',
  },
  {
    title: '签署时间',
    dataIndex: 'assetsNo',
  },
  {
    title: '截止时间',
    dataIndex: 'assetsStatusStr',
  },
  {
    title: '有效期',
    dataIndex: 'goodsName',
  },
];
const inerviewResultMap = [{key:1,val:'通过'},{key:2,val:'待定'},{key:3,val:'淘汰'}];
@connect(({ baseInfo, user, loading }) => ({
  user: user,
  baseInfo,
  loading: loading.models.baseInfo,
}))
export default class EntryInfo extends PureComponent {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
  }

  //翻译面试结果
  getResult = index =>{
    for(let i=0;i<inerviewResultMap.length;i++){
      if(index == inerviewResultMap[i].key){
        return inerviewResultMap[i].val;
      }
    }
  };


  getPostionSteps = posts => {
    return (
      posts &&
      posts.map((postion, index) => {
        return <Timeline.Item color="#E8E8E8" key={index + 1}>
          <span className="timeLine">{postion.begindate}</span>
          <span className="textLine">{postion.orgname}</span>
          </Timeline.Item>;
      })
    );
  };

  render() {
    const {
      baseInfo: { profile, psnorgs },
      user: { currentUser },
      user: { userInfo },
      loading,
    } = this.props;

    //查看简历
    const showView =()=>{
      let fileName = '';
      let url = '';
      if(-1 != profile.entry.viewCandidateFile.indexOf('&') && profile.entry.viewCandidateFile.split('&').length>=2){
        fileName = profile.entry.viewCandidateFile.split('&')[1];
        url = profile.entry.viewCandidateFile.split('&')[0];
        fileName = fileName.split('=')[1];
        window.open(
          getConfig().domain +
          '/common/fileOnline.jhtml?downloadUrl=' +
          encodeURIComponent(url)
          +'&htmlName='+encodeURIComponent(fileName)
        );
      }else{
        window.open(
          getConfig().domain +
          '/common/fileOnline.jhtml?downloadUrl=' +
          profile.entry.viewCandidateFile
        );
      }
    };

    return (
      <div>
        <Card bordered={false} loading={loading} bodyStyle={{padding: 0}}>
          <p className="cardTitle"><i></i>岗位详情</p>
          <Row gutter={32}>
            <Col span={4}>
              <img className={styles.headBox} src={userInfo.userHead} alt=""/>
            </Col>
            <Col span={8}>
              <DescriptionList col="1" size="large">
                <Description term="姓名" termStyle={{minWidth: 'auto'}}>{userInfo.userName}</Description>
                <Description term="性别" termStyle={{minWidth: 'auto'}}>{profile.profile.sex == 1 ? '男' : '女'}</Description>
                <Description term="工号" termStyle={{minWidth: 'auto'}}>{userInfo.userNo}</Description>
                <Description term="职级" termStyle={{minWidth: 'auto'}}>{userInfo.positionLevel}</Description>
              </DescriptionList>
            </Col>
            <Col span={12}>
              <DescriptionList col="1" size="large">
                <Description term="所属公司" termStyle={{minWidth: 'auto'}}>{userInfo.companyName}</Description>
                <Description term="所属部门" termStyle={{minWidth: 'auto'}}>{userInfo.deptName}</Description>
                <Description term="所属职位" termStyle={{minWidth: 'auto'}}>{userInfo.postname}</Description>
              </DescriptionList>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} loading={loading} bodyStyle={{padding: '16px 0'}}>
          <p className="cardTitle"><i></i>应聘渠道</p>
          <DescriptionList col="2" size="large">
            <Description term="应聘渠道" termStyle={{minWidth: 'auto'}}>{profile.entry.candidateMessage && profile.entry.candidateMessage.channel}</Description>
            <Description term="投递时间" termStyle={{minWidth: 'auto'}}>{profile.entry.candidateMessage && profile.entry.candidateMessage.createTime}</Description>
            <Description term="面试时间" termStyle={{minWidth: 'auto'}}>{profile.entry.candidateMessage && profile.entry.candidateMessage.interviewTime}</Description>
          </DescriptionList>
          <p className="cardTitle"><i></i>简历文件</p>
          <Button type={"primary"} onClick={showView}>查看简历</Button>
        </Card>
        <Card bordered={false} loading={loading} bodyStyle={{paddingBottom: '50px 0'}}>
          <p className="cardTitle" style={{marginBottom: 16}}><i></i>面试结果</p>
          <DescriptionList col="2" size="large" style={{marginBottom: 32}}>
            <Description term="人才观得分" termStyle={{minWidth: 'auto'}}>{profile.entry.inerviewResult && profile.entry.inerviewResult.score}</Description>
            <Description term="任职资格得分" termStyle={{minWidth: 'auto'}}>{profile.entry.inerviewResult && profile.entry.inerviewResult.jobScore}</Description>
            <Description term="面试结果" termStyle={{minWidth: 'auto'}}>{this.getResult(profile.entry.inerviewResult && profile.entry.inerviewResult.result)}</Description>
            <Description term="面试评价" termStyle={{minWidth: 'auto'}}>{profile.entry.inerviewResult && profile.entry.inerviewResult.evaluate}</Description>
          </DescriptionList>
        </Card>
      </div>
    )
  }
}
