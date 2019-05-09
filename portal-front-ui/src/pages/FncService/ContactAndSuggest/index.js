import React, { PureComponent, Fragment } from "react";
import { Form, Row, Col, Card, Tabs, Icon, Button, Input, Modal, Select, Carousel, Badge, message } from "antd";
import { connect } from "dva";
import styles from '../FncService.less';

@connect(({ fncService, loading }) => ({
  fncService,
  loading: loading.models.fncService,
}))
@Form.create()
export default class ContactAndSuggest extends PureComponent {

  state = {
    visible: false,
    confirmLoading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fncService/getContactList',
    });
    dispatch({
      type: 'fncService/getOpinionTypeList'
    });
    dispatch({
      type: 'fncService/getOpinionReadNum'
    });
    dispatch({
      type: 'fncService/getOpinionList'
    });
  }

  handleOk = () => {
    const { form, dispatch } = this.props;
    this.setState({confirmLoading: true});
    form.validateFields((err, values) => {
      if (err) {
        this.setState({confirmLoading: false});
        return;
      }
      dispatch({
        type: 'fncService/addOpinion',
        payload: values,
        callback: (res)=>{
          if (res.code === "100") {
            message.success(res.msg, 2);
            this.setState({
              visible: false,
              confirmLoading: false
            });
          } else {
            this.setState({confirmLoading: false});
            message.error(res.msg, 1);
          }
        }
      });
    });
  };

  viewOpinionReplyDetail = (detail) => {
    const { dispatch } = this.props;
    dispatch({
      type: "fncService/getOpinionDetail",
      payload: {
        id: detail.id,
      }
    });
    this.setState({
      detailVisible: true
    });
  };

  updateOpinionReplyRead = () => {
    const { dispatch, fncService: { opinionDetail: {opinion} } } = this.props;
    this.setState({detailVisible:false});
    if(opinion && opinion.isRead === 0 && opinion.status === 1){
      dispatch({
        type: 'fncService/updateOpinionReadById',
        payload:{id: opinion.id},
        callback: (res)=>{
          if(res && res.code === '100'){
            dispatch({
              type: 'fncService/getOpinionReadNum'
            });
          }
        }
      });
    }
  };

  turnToUnReadOpinion = ()=>{
    const { dispatch, fncService: { opinionList } } = this.props;
    let isTurned = false;
    opinionList.length && opinionList.map((opinion, index)=>{
      if(opinion.isRead === 0 && !isTurned){
        this.refs.opinionReply.goTo(index);isTurned = true;
        opinion.status === 1 && dispatch({
          type: 'fncService/updateOpinionReadById',
          payload:{id: opinion.id},
          callback: (res)=>{
            if(res && res.code === '100'){
              dispatch({
                type: 'fncService/getOpinionReadNum'
              });
            }
          }
        });
      }
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      fncService: { opinionTypeList, contactList, opinionList, opinionDetail: { opinionTypeName, opinion }, opinionCount }
    } = this.props;
    const {confirmLoading} = this.state;
    return (
      <Fragment>
        <Card bordered={false} bodyStyle={{ padding: "0 24px 16px" }}>
          <Tabs >
            <Tabs.TabPane tab="联系我们" key="othera">
              {contactList && contactList.length ? contactList.map((person, index)=>(
                <div key={index} className={styles.contactPerson}>
                  <Icon type="calendar" theme="filled" /> <span>  部门：{person.deptName}</span>
                  <Icon type="user" style={{marginLeft: 40}}/> <span>  联系人：{person.userName}</span>
                  <Icon type="phone" theme="filled" style={{marginLeft: 40}}/> <span>  电话：{person.tel}</span>
                  <Icon type="mail" theme="filled" style={{marginLeft: 40}}/> <span>  邮箱：{person.email}</span>
                </div>
              )) : ''}
            </Tabs.TabPane>
            <Tabs.TabPane tab="意见与建议" key="otherb">
              <Row>
                <Col span={2}>
                  <Button type="primary" style={{height:40, width: 170}} onClick={()=>this.setState({visible:true})}>意见与建议</Button>
                  <Button style={{height:40, width: 170, marginTop:10}} onClick={this.turnToUnReadOpinion}>
                    意见反馈
                    {opinionCount ? <Badge style={{marginTop: -2, marginLeft: 3}} count={opinionCount} /> : ''}
                  </Button>
                </Col>
                <Col span={20} offset={2}>
                  {opinionList && opinionList.length ? (
                    <div className={styles.opinionListBox}>
                      <Icon type="left" onClick={()=>this.refs.opinionReply.prev()} />
                      <Carousel dots={false} ref="opinionReply">
                        {opinionList.map((opinion, index)=>(
                          <div key={index} onClick={()=>this.viewOpinionReplyDetail(opinion)}>
                            <p><b>反馈人：</b>{opinion.updator} <b style={{paddingLeft: 60}}>时间：</b>{opinion.updateTime?opinion.updateTime.split(" ")[0]:''}</p>
                            <div><b>反馈：</b>{opinion.replyInfo}</div>
                          </div>
                        ))}
                      </Carousel>
                      <Icon type="right" onClick={()=>this.refs.opinionReply.next()} />
                    </div>
                  ) : (
                    <p>暂无意见反馈</p>
                  )}
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Card>
        <Modal
          title="意见与建议"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={()=>this.setState({visible:false})}
          confirmLoading={confirmLoading}
          destroyOnClose={true}
        >
          <Form labelCol={{span: 4 }} wrapperCol={{span: 19 }}>
            <Form.Item label="意见分类">
              {getFieldDecorator('typeId', {
                rules: [{required: true, message: "请选择意见分类"}]
              })(
                <Select>
                  {opinionTypeList && opinionTypeList.length ? opinionTypeList.map((item, index) => (
                    <Select.Option key={index} value={item.id}>
                      {item.name}
                    </Select.Option>
                  )) : ''}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="问题说明">
              {getFieldDecorator('content', {
                rules: [{required: true, message: "请输入问题说明"}]
              })(
                <Input.TextArea rows={6} placeholder="请给出您宝贵的意见，我们将用心处理对待:" />
              )}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="反馈详情"
          visible={this.state.detailVisible}
          onCancel={()=>this.updateOpinionReplyRead(opinion)}
          footer={null}
          destroyOnClose={true}
          bodyStyle={{ padding: '16px 24px', lineHeight: '32px' }}
        >
          <Row>
            <Col span={4} style={{textAlign: 'right'}}>意见分类：</Col>
            <Col span={20}>{opinionTypeName}</Col>
          </Row>
          <Row>
            <Col span={4} style={{textAlign: 'right'}}>问题说明：</Col>
            <Col span={20}>
              <Input.TextArea value={opinion.content} rows={5} disabled />
            </Col>
          </Row>
          <Row>
            <Col span={4} style={{textAlign: 'right'}}>反馈人：</Col>
            <Col span={8}>{opinion.updator}</Col>
            <Col span={4} style={{textAlign: 'right'}}>时间：</Col>
            <Col span={8}>{opinion.updateTime ? opinion.updateTime.split(" ")[0] : ''}</Col>
          </Row>
          <Row>
            <Col span={4} style={{textAlign: 'right'}}>反馈：</Col>
            <Col span={20}>
              <Input.TextArea value={opinion.replyInfo} rows={5} disabled />
            </Col>
          </Row>
        </Modal>
      </Fragment>
    );
  }
}
