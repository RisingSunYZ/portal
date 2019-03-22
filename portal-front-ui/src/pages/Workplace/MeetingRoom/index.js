import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Tabs, Icon, Row, Col,Input, Card, Modal } from 'antd';
import styles from './index.less'
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
  searchFormObj = {};

  state = {
    selectedKey: '',
    visibleId:'',
    visibleModal:false,
    type:1,
    modelId:"",
    cardType:1
  };

  callback=(key)=> {
    console.log(key);
    this.setState({
      cardType:key,
    })
  }

  // 加载会议页面内容
  componentDidMount(){
    const {dispatch} =this.props;

    //加载 历史会议 数据
    dispatch({
      type: 'meetingRoom/getHistoryData',
      payload:{}
    });

    //加载 待开会议 数据
    dispatch({
      type: 'meetingRoom/getWaitStartData',
      payload:{}
    });

    // 加载 我的草稿会议 数据

    dispatch({
      type: 'meetingRoom/getDraftData',
      payload:{}
    });

    // 加载 我的邀请会议 数据
    dispatch({
      type: 'meetingRoom/getMyInviteData',
      payload:{}
    })
  }

  selectNode(selectedKeys, e) {
    if (e.selected) {
      this.searchFormObj.categoryId = selectedKeys[0];
      this.props.dispatch({
        type: 'meetingRoom/getModelList',
        payload: { categoryId: selectedKeys[0] },
      });
      this.setState({
        selectedKey: selectedKeys[0],
      });
    }
  }
  doSearch(modelName) {
    this.searchFormObj.name = modelName;
    //如果右侧点击我的草稿，则搜索我的草稿，其他则搜索全部流程模板，
    this.props.dispatch({
      type: 'meetingRoom/getModelList',
      payload: {
        name: modelName,
        categoryId: this.state.selectedKey == 'myDraft' ? this.state.selectedKey : '',
      },
    });
  }

  handleDel(businessKey) {
    this.props.dispatch({
      type: 'meetingRoom/delDraft',
      payload: {
        businessKey: businessKey,
      },
    });
  }

  selectCallback = (datas,id) => {
   const {dispatch} =this.props;
   debugger;
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
    // debugger;
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
      debugger;
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
  }

  /**
   * 点击 查看 显示内容
   */
  handleView = (id) =>{
    let visibleIdStr = this.state.visibleId;
    const index = visibleIdStr.indexOf(id);
    if(index!=-1){//如果包含id，则删除id
      visibleIdStr = visibleIdStr.substr(0,index) + visibleIdStr.substr(index+id.length+1,visibleIdStr.length);
    }else{//不包含，则添加
      visibleIdStr+=id+","
    }

    this.setState({
      visibleId:visibleIdStr,
    });
  };

  formatterGetTime=(createTime,endTime)=>{
    const d1= new Date(createTime).getTime();
    const d2= new Date().getTime();
    return (d2-d1)>0
  }

  render() {
    const {
      meetingRoom: { draftData: { listDraft }, waitData:{ listWait } ,historyData:{listHistory } ,inviteData:{ listInvita }},
      loading,
      match
    } = this.props;
    const { visible ,visibleModal,type}=this.state;
    const tab = match.params.tab ? match.params.tab:1;
    console.log(2222222222)

    const a=(cardType)=>{
      if(this.state.cardType==2){

      }
    }
    const cardData=(item,cardType)=>{
      return (
        <div>
          <div className={styles.img}>
            <img src="http://pic31.nipic.com/20130802/13163193_145819676170_2.jpg" style={{width:'100%' ,height: '100%'}}/>
          </div>
          <ul className={styles.descLeft}>
            <li className={styles.liTitle}>{item.theme}</li>
            <li className={styles.liTop}>{item.creatorName}  &nbsp;{(item.creatorDept)}</li>
            <li className={styles.liBot}>
              <span className={styles.liDate}>{simpleFormatDate(item.createTime)}</span>&nbsp;&nbsp;&nbsp;
              <span className={styles.liTime}>{simpleFormatTime(item.startTime)}-{simpleFormatTime(item.endTime)}</span>&nbsp;&nbsp;
              { (this.state.cardType == 1 ||this.state.cardType == 2||this.state.cardType == 3 ) ?
                (
                  <span style={{color:'#FF3D00',fontSize:12}}>
                    <Icon type="clock-circle" theme="filled" />
                    <span>会议正在进行中...</span>
                  </span>
                ):
                (<Icon type="delete" theme="twoTone" className={styles.del} onClick={()=>this.showDeleteConfirm(1,item.id)}/>)}

              {/*<Icon type="delete" theme="twoTone" className={styles.del} onClick={()=>this.showDeleteConfirm(1,item.id)}/>*/}
            </li>
          </ul>
          <div className={styles.descRight}>
            <ul style={{padding:0}}>
              { item.recordPersonName==null ?
                (<li style={{color:"#2596FF"}} >
                  <Icon type="setting" theme="filled" />
                  <UserSelect
                    type="button"
                    width='80px'
                    multiple={false}
                    showText="设置记录人"
                    style={{paddingLeft:0}}
                    onChange={(a)=>{this.selectCallback(a,item.id)}}
                  />
                </li>)
                : (<li>
                  记录人：{item.recordPersonName}&nbsp;&nbsp;
                  <Icon type="delete" className={styles.icon} onClick={()=>this.showDeleteConfirm(2,item.id)}/>
                </li>)
              }
              <li>
                <a href={"/portal-ui/workplace/meeting-room/meeting-input/:id"}>
                  <Icon type="edit" theme="filled" className={styles.icon}/>&nbsp;&nbsp;
                  <span>编辑</span>
                </a>
                <Modal
                  title="信息"
                  centered
                  visible={this.state.visibleModal}
                  onOk={()=>this.handleOk(this.state.modelId,type)}
                  onCancel={this.handleCancel}
                  width={356}
                >
                  {this.state.type==1?(<p>确定删除会议?</p>):(<p>确定删除记录人吗?</p>)}
                </Modal>
              </li>
            </ul>
            <div className={styles.view} onClick={()=>this.handleView(item.id)}>
              {this.state.visibleId.indexOf(item.id)!=-1 ?
                (<Icon type="double-left" className={styles.iconViewTop}/>)
                : (<Icon type="double-left" className={styles.iconViewBot}/>)
              }
              &nbsp;&nbsp;<span>{this.state.visibleId.indexOf(item.id)!=-1 ? '收起':'查看'}</span>
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
                <div className={styles.cardBot} style={{display:this.state.visibleId.indexOf(item.id)!=-1 ? '':'none'}}>
                  <Row className={styles.rows}>
                    <Col span={2} className={styles.col1}>参会人员：</Col>
                    <Col span={20}>{item.personList}</Col>
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
                    <Col span={2} className={styles.col1}>会议纪要：</Col>
                    <Col span={20}>{item.summaryContent }</Col>
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
            <a href={"/portal-ui/workplace/meeting-room/:tab/meeting-input"}>
              <Icon type="plus" className={styles.icon}/>
              <span className={styles.text}>新建会议</span>
            </a>
          </Col>
          <Col span={5}>
            <Search placeholder="请搜索" onSearch={value => console.log(value)} style={{position:'relative',top: -8}}/>
          </Col>
        </Row>
        <Tabs defaultActiveKey={tab} onChange={this.callback} type="card">
          <TabPane tab="待开会议" key="1">
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
          </TabPane>
          <TabPane tab="历史会议" key="3">
            {
              listHistory!==undefined && listHistory.length>0 ?
                loopCard(listHistory,3):
                (<BlankList emptyText="暂无数据" />)
            }
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
