import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Row, Col,Input, Card, Modal,Badge,Pagination  } from 'antd';
import styles from './index.less';
import Link from 'umi/link';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import { getConfig, simpleFormatDate ,simpleFormatTime} from '../../../utils/utils';
import { UserSelect } from '../../../components/Selector';
import BlankList from '@/components/BlankList';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const { Meta } = Card;


@connect(({ meetingRoom, loading }) => ({
  meetingRoom,
  loading: loading.models.meetingRoom,
}))

export default class MeetingRoom extends PureComponent {

  state = {
    selectedKey: '',
    visibleId:'',
    visibleModal:false,
    type:1,
    modelId:"",
    cardType:1,
    pagination: { pageIndex: 0, pageSize: 10 },
    query:{},
    tab:1
  };

  callback=(key)=> {
    console.log(key);
    this.setState({
      cardType:key,
    });

  }

  // 加载会议页面内容
  componentDidMount(){
    const {dispatch} =this.props;
    const params={
      pageIndex:this.state.pagination.pageIndex,
      pageSize:this.state.pagination.pageSize
    };
    //加载 历史会议 数据
    dispatch({
      type: 'meetingRoom/getHistoryData',
      payload:params
    });

    //加载 待开会议 数据
    dispatch({
      type: 'meetingRoom/getWaitStartData',
      payload:params
    });

    // 加载 我的草稿会议 数据
    dispatch({
      type: 'meetingRoom/getDraftData',
      payload:params
    });

    // 加载 我的邀请会议 数据
    dispatch({
      type: 'meetingRoom/getMyInviteData',
      payload:params
    });

    this.setState({
      query:params
    })
  }

  // 历史会议数据分页查询
  onHistoryChange=(pageNumber)=>{
    const { dispatch }=this.props;
    dispatch({
      type: 'meetingRoom/getHistoryData',
      payload:{
        pageIndex:pageNumber,
        pageSize:this.state.pagination.pageSize
      }
    });
  };

  // 我的邀请数据分页查询
  onInviteChange=(pageNumber)=>{
    const { dispatch }=this.props;
    dispatch({
      type: 'meetingRoom/getMyInviteData',
      payload:{
        pageIndex:pageNumber-1,
        pageSize:this.state.pagination.pageSize
      }
    });
    // console.log('Page: ', pageNumber);
  };

  // 搜索会议
  doSearchMeeting=(value)=> {
    const { dispatch }=this.props;
    const cardType=this.state.cardType;
    const params={
      theme:value,
      pageIndex:this.state.pagination.pageIndex,
      pageSize:this.state.pagination.pageSize
    };

    if(cardType==1){
      dispatch({
        type: 'meetingRoom/getWaitStartData',
        payload: params
      });
      this.setState({
        query:params
      })
    }else if(cardType==2){
      dispatch({
        type: 'meetingRoom/getMyInviteData',
        payload:params
      });
      this.setState({
        query:params
      })
    }else if(cardType==3){
      dispatch({
        type: 'meetingRoom/getHistoryData',
        payload:params
      });
      this.setState({
        query:params
      })
    }else{
      dispatch({
        type: 'meetingRoom/getDraftData',
        payload:params
      });
      this.setState({
        query:params
      })
    }
  };


  selectCallback = (datas,id) => {
   const {dispatch} =this.props;
   dispatch({
     type: 'meetingRoom/saveRecordPer',
     payload:{
       personName:datas[0].name,
       personNo:datas[0].no,
       meetingId:id,
     }
   });
  };

  /**
   * 点击删除 有弹窗
   */
  showDeleteConfirm = (type,id) => {
    this.setState({
      visibleModal: true,
      type:type,
      modelId:id,
    });
  };



  handleOk = (id,type) => {
    const { dispatch }=this.props;
    if(type==1){

      // 点击删除，删除草稿会议卡片
      dispatch({
        type:'meetingRoom/delDraftData',
        payload:{ id: id }
      });

      this.setState({
        visibleModal: false,
      });

      /**
       * 删除后，再次调用查询数据方法，刷新页面
       */
      setTimeout(()=>{
        dispatch({
          type: 'meetingRoom/getDraftData',
          payload:{}
        });
      },100)

    } else if(type==2) {
      // 点击删除，删除记录人
      dispatch({
        type:'meetingRoom/delRecordPerson',
        payload: {
           id: id
        }
      });

      this.setState({
        visibleModal: false,
      });
    }
  };

  handleCancel = (e) => {
    this.setState({
      visibleModal: false,
    });
  };


  //导出参会人员
  downLoadPerList = (id)=> {
    window.location.href='/rest/portal/rscmgmt/meeting/ExportParticiPants/'+id;
  };

  /**
   * 点击 查看 显示内容
   */
  handleView = (tab,id) =>{
    let visibleIdStr = this.state.visibleId;
    const index = visibleIdStr.indexOf(tab+"-"+id);
    if(index!=-1){//如果包含id，则删除id
      visibleIdStr = visibleIdStr.substr(0,index) + visibleIdStr.substr(index+(tab+"-"+id).length+1,visibleIdStr.length);
    }else{//不包含，则添加
      visibleIdStr+= tab+"-"+id+","
    }
    this.setState({
      visibleId:visibleIdStr,
    });
  };


  calculationTime=(startTime)=>{
    const d1= new Date(startTime).getTime();
    const d2= new Date().getTime();
    return d1>d2
  };

  formatterGetTime(startTime,endTime){
    const d1 = new Date(startTime).getTime();
    const d3 = new Date(endTime).getTime();
    const d2 = new Date().getTime();
    const day = Math.floor((d1 - d2) / 1000 / 3600 / 24);
    let hour = Math.floor(((d1 - d2) / 1000 / 3600) % 24);
    hour = hour < 10 ? '0' + hour : hour;
    let minute = Math.floor(((d1 - d2) / 1000 / 60) % 60);
    minute = minute < 10 ? '0' + minute : minute;
    let second = Math.floor(((d1 - d2) / 1000) % 60);
    second = second < 10 ? '0' + second : second;
    const time = day + '天' + hour + ':' + minute + ':'+ second;
    return  d1>d2 ?  (<span style={{ color:'#FF3D00',fontSize:12}}>
                        <Icon type="clock-circle" theme="filled" />&nbsp;&nbsp;
                        <span>距离开会时间还有{time}</span>
                      </span>)
                      : (d2>d1&&d3>d2)?
                            (<span style={{ color:'#FF3D00',fontSize:12}}>
                                <Icon type="clock-circle" theme="filled" />&nbsp;&nbsp;
                                <span>会议正在进行中...</span>
                            </span>)
                          :(<span>
                              <Icon type="clock-circle" theme="filled"  style={{color: '#8C8C8C',fontSize:12}}/>&nbsp;&nbsp;
                              <span style={{color:'#333',fontSize:14}}>已结束</span>
                            </span>);
  };



  render() {
    const {
      meetingRoom: { draftData: { listDraft }, waitData:{ listWait } ,historyData:{listHistory ,pagination} ,inviteData:{ listInvita ,paginations}},
      loading,
      match
    } = this.props;
    const { type }=this.state;
    const tab = match.params.tab? match.params.tab:1;
    // console.log(tab);

    // 上传附件格式化
    const handleFiles=(files)=>{
      let fileName="";
      for(let i=0;i<files.length;i++){
        fileName += files[i].fileName+';'
      }
      if(fileName.length>0) fileName=fileName.substr(0,fileName.length-1);
      return fileName;
    };


    const cardData=(item,cardType)=>{
      return (
        <div className={styles.cardView}>
          <div className={styles.img}>
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553760114282&di=732bf7b82482ea4c9542111736406cd5&imgtype=0&src=http%3A%2F%2Fwww.zf3d.com%2FUpload%2Fzuopin%2Fs_QQ%25E6%2588%25AA%25E5%259B%25BE20160712094859_zf3d_201671294912428.jpg" style={{width:'100%' ,height: '100%'}}/>
          </div>
          <ul className={styles.descLeft}>
            <li className={styles.liTitle}>
              {item.theme}
              <span>{(item.meetingFiles) && handleFiles(item.meetingFiles)!==""  ? (<Icon type="paper-clip" style={{color:'#1890FF',marginLeft:20}}/>): ('') }</span>
            </li>
            <li className={styles.liTop}>{item.creatorName}  &nbsp;{(item.creatorDept)}</li>
            <li className={styles.liBot}>
              <span className={styles.liDate}>{simpleFormatDate(item.startTime)}</span>&nbsp;&nbsp;&nbsp;
              <span className={styles.liTime}>{simpleFormatTime(item.startTime)}-{simpleFormatTime(item.endTime)}</span>
              { (cardType == 1 ||cardType == 2||cardType == 3 ) ?
                <span style={{ marginLeft: 60}}>{this.formatterGetTime(item.startTime,item.endTime)}</span> :
                (<Icon type="delete" theme="twoTone" className={styles.del} onClick={()=>this.showDeleteConfirm(1,item.id)}/>)}
            </li>
          </ul>
          <div className={styles.descRight}>
            <ul style={{padding:0}}>
              { item.recordPersonName==null ?
                (<li style={{color:"#2596FF",marginRight:6}} >
                  <Icon type="setting" theme="filled" />
                  <UserSelect
                    type="button"
                    width='80px'
                    multiple={false}
                    showText="设置记录人"
                    onChange={(a)=>{this.selectCallback(a,item.id)}}
                  />
                </li>)
              :(
                <li style={{marginRight:0}}>
                  <span>记录人：{item.recordPersonName}</span>&nbsp;&nbsp;
                  <Icon type="delete" className={styles.icon} onClick={()=>this.showDeleteConfirm(2,item.id)}/>
                  <Modal
                    title="信息"
                    centered
                    maskStyle={{backgroundColor:'rgba(0,0,0,0.1)'}}
                    visible={this.state.visibleModal}
                    onOk={()=>this.handleOk(this.state.modelId,type)}
                    onCancel={this.handleCancel}
                    width={356}
                  >
                    {this.state.type==1?(<p>确定删除会议?</p>):(<p>确定删除记录人吗?</p>)}
                  </Modal>
                </li>)
              }
              {(cardType == 4||((cardType == 1 ||cardType == 2||cardType == 3) && this.calculationTime(item.startTime) )) ? (
                <li style={{marginLeft:20}}>
                  <Link to={"/workplace/meeting-room/"+cardType+"/meeting-input/"+item.id}>
                    <Icon type="edit" theme="filled" className={styles.icon}/>&nbsp;&nbsp;
                    <span>编辑</span>
                  </Link>
                </li>
              ):('') }
            </ul>
            <div className={styles.view} onClick={()=>this.handleView(tab,item.id)}>
              {this.state.visibleId.indexOf(tab+"-"+item.id)!=-1 ?
                (<Icon type="double-left" className={styles.iconViewTop}/>)
                : (<Icon type="double-left" className={styles.iconViewBot}/>)
              }
              &nbsp;&nbsp;<span>{this.state.visibleId.indexOf(tab+"-"+item.id)!=-1  ? '收起':'查看'}</span>
            </div>
          </div>
        </div>
      )
    };

    const loopCard=(list,cardType)=>{
      return (
        <div>
          {list && list.map(item=>{
            return (<div style={{marginBottom:15}}>
                <Card
                  key={item.id}
                  hoverable
                  className={styles.cards}
                >
                  <Meta
                    description={cardData(item,cardType)}
                  />
                </Card>
                <div className={styles.cardBot} style={{display:this.state.visibleId.indexOf(tab+"-"+item.id)!=-1 ? '':'none'}}>
                  <Row className={styles.rows}>
                    <Col span={2} className={styles.col1}>参会人员：</Col>
                    <Col span={20}>
                      <div>
                        {item.mandatoryPersonName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {item.optionalPersonList && item.optionalPersonList.length>0 ? (<span>可选人员 ( {item.optionalPersonName} ) </span>):('')}&nbsp;&nbsp;
                        <span style={{color:'#2596FF',fontSize:'12px',cursor:'pointer'}} onClick={()=>this.downLoadPerList(item.id)}>
                          <Icon type="file" theme="filled" />
                          <span>导出参会人员</span>
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className={styles.rows}>
                    <Col span={2} className={styles.col1}>会议室：</Col>
                    <Col span={20}>{item.meetingroomName}</Col>
                  </Row>
                  <Row className={styles.rows}>
                    <Col span={2} className={styles.col1}>会议内容：</Col>
                    <Col span={20}>{item.content}</Col>
                  </Row>
                  <Row className={styles.rows}>
                    <Col span={24} style={{left:30,fontSize:18}}>
                      <span style={{color:'#2596FF',fontSize:12,cursor:'pointer'}}>{(item.meetingFiles) && handleFiles(item.meetingFiles)}</span>
                    </Col>
                  </Row>
                  <Row className={styles.rows}>
                    <Col span={2} className={styles.col1}>会议纪要：</Col>
                    <Col span={20}>
                      <span>{item.summaryContent}</span>
                      <div style={{margin: '10px 0'}}>
                        <Link to={"/workplace/meeting-room/"+cardType+"/meeting-summary/"+item.id}>
                          <Icon type="edit" theme="filled" className={styles.icon}/>&nbsp;&nbsp;
                          <span>编辑</span>
                        </Link>
                      </div>
                      <div style={{color:'#2596FF',fontSize:12}}>{item.meetingSummaryFiles && handleFiles(item.meetingSummaryFiles)}</div>
                    </Col>
                  </Row>
                  <Row className={styles.BotCount}>
                    <Col>回执意见<span>(共{item.count}条)</span></Col>
                  </Row>
                </div>
              </div>
            )})}
        </div>
      )
    };

    return (
      <PageHeaderWrapper>
        <Row className={styles.navRight}>
          <Col span={3} className={styles.rights}>
            <Link to={"/workplace/meeting-room/:tab/meeting-input/:meetId"}>
              <Icon type="plus" className={styles.icon}/>
              <span className={styles.text}>新建会议</span>
            </Link>
          </Col>
          <Col span={5}>
            <Search placeholder="请搜索" onSearch={this.doSearchMeeting} style={{position:'relative',top: -8}}/>
          </Col>
        </Row>
        <Tabs defaultActiveKey={tab} onChange={this.callback} type="card">
          <TabPane tab={<span>待开会议<Badge count={listWait.length} style={{ backgroundColor: '#FF3D00', color: '#fff', boxShadow: '0 0 0 1px #d9d9d9 inset',left:4,top:-2 ,fontSize:16}} /></span>} key="1">
            {
              listWait!==undefined && listWait.length>0 ?
              loopCard(listWait,1):
              (<BlankList emptyText="暂无数据" />)
            }
          </TabPane>
          <TabPane tab="我邀请的" key="2">
            {
              listInvita!==undefined && listInvita.length>0 ?
                loopCard(listInvita,2):
                (<BlankList emptyText="暂无数据" />)
            }
            <Pagination showQuickJumper defaultCurrent={1} total={paginations} onChange={this.onInviteChange} style={{textAlign:'center'}} />
          </TabPane>
          <TabPane tab="历史会议" key="3">
            {
              listHistory!==undefined && listHistory.length>0 ?
                loopCard(listHistory,3):
                (<BlankList emptyText="暂无数据" />)
            }
            <Pagination showQuickJumper defaultCurrent={1} total={pagination} onChange={this.onHistoryChange} style={{textAlign:'center'}}/>
          </TabPane>
          <TabPane tab="我的草稿" key="4">
            {
              listDraft!==undefined && listDraft.length>0 ?
                loopCard(listDraft,4):
                (<BlankList emptyText="暂无数据" />) }
          </TabPane>
        </Tabs>

      </PageHeaderWrapper>
    )
  }
}
