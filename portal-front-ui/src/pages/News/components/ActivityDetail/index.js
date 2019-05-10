import React, { PureComponent, Fragment } from 'react';
import { Layout, Button, Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';
import {getConfig} from "@/utils/utils";
import './index.less';

const { Header, Content } = Layout;

@connect(({ newsInfo, loading }) => ({
  newsInfo,
  loading: loading.models.newsInfo,
}))
@Form.create()
export default class ActivityDetail extends PureComponent {
  state={
    visible: false,
    already: false,
    submitLoading: false,
  };
  componentWillMount () {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    document.addEventListener('selectstart', function (e) {
      e.preventDefault();
    });
    document.addEventListener('copy', function (e) {
      e.preventDefault();
    });
  }

  componentDidMount () {
    const { match: { params }, dispatch } = this.props;
    dispatch({
      type: 'newsInfo/queryActivityDetail',
      payload: {
        id: params.id,
      },
      callback: (res)=>{
        if(res && res.already === 1){
          this.setState({
            already: true
          })
        }
      }
    });
  }

  joinActivity = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    const { form, dispatch,newsInfo:{ activityDetail }} = this.props;
    form.validateFields((err, values)=>{
      if(err) return false;
      this.setState({submitLoading: true});
      dispatch({
        type: "newsInfo/newsSign",
        payload: {
          id: activityDetail.news.id,
          data: {
            contactPhone: values.phoneNumber
          }
        },
        callback: (res)=>{
          this.setState({submitLoading: false});
          if(res.code === '100'){
            this.setState({already: true, visible: false});
            message.success(res.msg);
          }else{
            message.error(res.msg);
          }
        }
      })
    })
  };

  render() {
    const {
      newsInfo:{ activityDetail: { currentUser, news, available } },
      form: { getFieldDecorator }
    } = this.props;
    const { visible, submitLoading, already } = this.state;
    return (
      <Fragment>
        <div className="activity-detail-container">
          <Layout>
            <Header>
              <div className="content-title">
                <p>{news.title}</p>
                <ul>
                  <li>{news.publishTime}</li>
                  <li>发布部门：<span title={news.creatorName}>{news.creatorName} </span></li>
                </ul>
                {news && news.isSign === 1 && available===1 ? (already ? (
                  <Button type="primary" disabled>已报名</Button>
                ):(
                  <Button className="join-btn" type="primary" onClick={this.joinActivity}>报名</Button>
                )) : ''}
              </div>
            </Header>
            <Content>
              <div className="article-text">
                <div dangerouslySetInnerHTML={{ __html: news.content}} />
              </div>
            </Content>
          </Layout>
        </div>
        <Modal
          title="我要报名"
          visible={visible}
          submitLoading={submitLoading}
          okText="提交"
          onOk={this.handleOk}
          onCancel={()=>this.setState({visible: false})}
        >
          <Form labelCol={{span: 4 }} wrapperCol={{span: 19 }}>
            <Form.Item label="姓名">
              {getFieldDecorator('name',{
                initialValue: currentUser ? currentUser.name : ''
              })(
                <Input disabled/>
              )}
            </Form.Item>
            <Form.Item label="部门">
              {getFieldDecorator('depName',{
                initialValue: currentUser ? currentUser.depName : ''
              })(
                <Input disabled/>
              )}
            </Form.Item>
            <Form.Item label="电话">
              {getFieldDecorator('phoneNumber',{
                rules: [{required: true, message:'电话不能为空'}]
              })(
                <Input />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}
