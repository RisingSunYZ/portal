import React, { Component, Fragment } from 'react';
import styles from './index.less';
import { Card, Timeline, Icon, Collapse,Row,Col } from 'antd';
import { UserHeadBox } from '../User';

const Panel = Collapse.Panel;
export default class TransferRecord extends Component {
  state = {
    showTransfer:'',
  };

  changeKey(e){
    if(this.state.showTransfer>0){
      this.setState({showTransfer:0});
    }else{
      this.setState({showTransfer:1});
    }
  }


  componentWillReceiveProps(nextProps){

    const _this = this;

    setTimeout(function(){


      _this.setState({
        showTransfer:nextProps.showTransfer
      })

    },1000)



  }


  render() {
    const { transferRecords } = this.props;
    return (
      <Collapse onChange={this.changeKey.bind(this)} className={styles.collapse} activeKey={(this.state.showTransfer>0)?['1']:['0']} style={{ border:'none' }}>
        <Panel header={<Fragment>转阅记录（共 {transferRecords.length} 条）</Fragment>} key="1" style={{ background:'#fff',fontWeight:'600' }}>
            <Timeline className={styles.timeLineBox} style={{ display: transferRecords.length > 0 ? '' : 'block' }}>
              {transferRecords.map((post, index) => (
                <Timeline.Item
                  key={post.id || index}
                  dot={
                    <UserHeadBox
                      style={{ width: '32px', height: '32px', marginTop:'10px' }}
                      userNo={post.userId}
                      id={"transferRecord"+index}
                      src={post.userUrl}
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
                        color:'#000',
                      }}
                      span={4}
                    >
                      {post.userName}
                    </Col>
                    <Col span={4} style={{color:"#000",fontWeight:'500'}}>{post.typeName}</Col>
                    <Col span={4} style={{color:"rgba(0, 0, 0, .45)", fontSize:"12px"}}>{post.time}</Col>
                  </Row>
                  <p style={{color:"#1818FF", margin:"14px 0 0 0", fontWeight:'500'}} dangerouslySetInnerHTML={{ __html: post.message }} />
                </Timeline.Item>
              ))}
            </Timeline>
            <div
              style={{
                display: transferRecords.length <= 0 ? 'block' : 'none',
                color: 'rgba(0, 0, 0, .25)',
                textAlign: 'center',
                fontSize: '14px',
                lineHeight: '24px',
              }}
            >
              <Icon style={{ fontSize: '20px', verticalAlign:'text-bottom'}} type="frown-o" />{' '}
              <span>暂无转阅记录</span>
            </div>
        </Panel>
      </Collapse>
    );
  }
}
