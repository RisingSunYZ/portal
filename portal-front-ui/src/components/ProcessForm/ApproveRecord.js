import React, { Component, Fragment } from 'react';
import { Card, Timeline, Icon, Collapse, Row, Col } from 'antd';
import { UserHeadBox } from '../User';
import styles from './index.less';
const Panel = Collapse.Panel;
import logo from '../../assets/icons/flow-end.png';
import logoEnd from '../../assets/icons/end.png';

export default class ApproveRecord extends Component {
  state = {
    showApprove:'',
  };


  componentWillReceiveProps(nextProps){

    const _this = this;

    setTimeout(function(){
      _this.setState({
        showApprove:nextProps.showApprove
      })
    },1000)



  }

  changeKey(e){
    if(this.state.showApprove>0){
      this.setState({showApprove:0});
    }else{
      this.setState({showApprove:1});
    }
  }

  render() {
    const { approveRecords, showPost,flowEnd  } = this.props;
    if(flowEnd.type){
      return (
        <Collapse onChange={this.changeKey.bind(this)} className={styles.collapse} style={{ border:'none',marginBottom: 8 }} activeKey={(this.state.showApprove>0)?['1']:['0']}>
          <Panel header={<Fragment>处理记录（共 {approveRecords.length} 条）</Fragment>} key="1" style={{ background:'#fff',fontWeight:'600' }}>
            <Timeline className={styles.timeLineBox}>
              {approveRecords.map((post, index) => (
                <Timeline.Item
                  key={post.id || index}
                  dot={
                    <UserHeadBox
                      style={{ width: '32px', height: '32px', marginTop:'10px' }}
                      userNo={post.userId}
                      id={"approveRecord"+index}
                      src={post.userUrl}
                      type={post.type}
                    />
                  }
                >
                  <Row>
                    <Col
                      style={{
                        marginLeft: '8px',
                        display: 'inline-block',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginRight: '5px',
                        color:"SPJS" == post.type?"rgb(64,216,156)":"#000",
                      }}
                      span={4}
                    >
                      {post.userName}
                    </Col>
                    <Col span={4} style={{color:"#000",fontWeight:'500'}}>{post.typeName}</Col>
                    <Col span={4} style={{color:"SPJS" == post.type?"rgb(64,216,156)":"rgba(0, 0, 0, .45)", fontSize:"12px" }}>{post.time}</Col>
                  </Row>
                  <p style={{color:"SPJS" == post.type?"rgb(64,216,156)":"#1818FF", margin:'14px 0 0 0',fontWeight:'500' }} dangerouslySetInnerHTML={{__html: post.message}}></p>
                </Timeline.Item>

              ))}
              <Timeline.Item
                key={approveRecords.length+1}
                dot={
                  <div >
                    <img src={"SPJS" == flowEnd.type?logo:logoEnd} className={styles.headImage}  />
                  </div>
                }
              >
                <Row>
                  <Col
                    style={{
                      marginLeft: '8px',
                      display: 'inline-block',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginRight: '5px',
                      color:"SPJS" == flowEnd.type?"rgb(64,216,156)":"#F5222D",
                    }}
                  >
                     {flowEnd.typeName}
                  </Col>
                </Row>
              </Timeline.Item>
            </Timeline>
          </Panel>
        </Collapse>
      );
    }else {
      return (
        <Collapse onChange={this.changeKey.bind(this)} className={styles.collapse} style={{ border:'none',marginBottom: 8 }} activeKey={ (this.state.showApprove>0) ? [ '1' ]: ['']}>
          <Panel header={<Fragment>处理记录（共 {approveRecords.length} 条）</Fragment>} key="1" style={{ background:'#fff',fontWeight:'600' }}>
            <Timeline className={styles.timeLineBox} style={{ display: approveRecords.length > 0 ? '' : 'block' }}>
              {approveRecords.map((post, index) => (
                <Timeline.Item
                  key={post.id || index}
                  dot={
                    <UserHeadBox
                      style={{ width: '32px', height: '32px', marginTop:'10px' }}
                      userNo={post.userId}
                      id={"approveRecord"+index}
                      src={post.userUrl}
                      type={post.type}
                    />
                  }
                >
                  <Row>
                    <Col
                      style={{
                        marginLeft: '8px',
                        display: 'inline-block',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginRight: '5px',
                        color:"SPJS" == post.type?"rgb(64,216,156)":"#000",
                      }}
                      span={4}
                    >
                      {post.userName}
                    </Col>
                    <Col span={4} style={{color:"#000", fontWeight:'500'}}>{post.typeName}</Col>
                    <Col span={4} style={{color:"SPJS" == post.type?"rgb(64,216,156)":"rgba(0, 0, 0, .45)", fontSize:"12px" }}>{post.time}</Col>
                  </Row>
                  <p style={{color:"SPJS" == post.type?"rgb(64,216,156)":"#1818FF", margin:'14px 0 0 0',fontWeight:'500' }} dangerouslySetInnerHTML={{__html: post.message}}></p>
                </Timeline.Item>

              ))}
            </Timeline>
            <div
              style={{
                display: approveRecords.length <= 0 ? 'block' : 'none',
                color: 'rgba(0, 0, 0, .25)',
                textAlign: 'center',
                fontSize: '14px',
                lineHeight: '24px',
              }}
            >
              <Icon style={{ fontSize: '20px', verticalAlign:'text-bottom'}} type="frown-o" />{' '}
              <span>暂无处理记录</span>
            </div>
          </Panel>
        </Collapse>
      );
    }

  }
}
