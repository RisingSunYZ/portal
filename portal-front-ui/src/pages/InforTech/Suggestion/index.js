import React, { Fragment, PureComponent } from 'react';
import { Card, Button, Modal, Form, Input, Select, Radio, Row, Col } from 'antd';
import { connect } from 'dva';
import { UserSelect } from '@/components/Selector';
import { Link } from 'dva/router';
import styles from './index.less';
import {getConfig} from "../../../utils/utils";
import {message} from "antd/lib/index";

@connect(({ user, inforTech, loading }) => ({
  user,
  inforTech,
  loading: loading.models.inforTech,
}))
@Form.create({
  onValuesChange: (props, changedValues)=>{
    if(changedValues['case_person']){
      props.form.setFieldsValue({'telephone': changedValues['case_person'][0].mobile});
    }
  }
})

export default class Suggestion extends PureComponent {
  state = {
    visible: false,
    sysFirst: [],
    sysSecond: [],
    sysType: [],
    saveLoading: false,
  };

  componentDidMount() {

  }

  openSuggestWin = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: true
    });
    dispatch({
      type: 'inforTech/queryTSCategory',
      callback: (res)=>{
        if(res && res.code === '100'){
          this.setState({
            sysFirst: res.data || []
          });
        }
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleSysFirst = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'inforTech/queryTSCategory',
      payload: {
        classCode: value
      },
      callback: (res)=>{
        if(res && res.code === '100'){
          this.setState({
            sysSecond: res.data || []
          });
        }
      }
    });
  };

  handleSysSecond = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'inforTech/queryTSCategory',
      payload: {
        classCode: value,
      },
      callback: (res)=>{
        if(res && res.code === '100'){
          this.setState({
            sysType: res.data || []
          });
        }
      }
    });
  };

  handleSysType = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'inforTech/queryTSType',
      payload: {
        classCode: value
      },
      callback: (res)=>{
        if(res && res.code === '100'){
          this.setState({
            others: res.data
          })
        }
      }
    });
  };

  handleOk = () => {
    this.setState({
      saveBtnLoading: true,
    });
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        this.setState({
          saveBtnLoading: false,
        });
        return;
      }
      const values = {
        creatorByMobilePhone : fieldsValue['mobile'],
        categoryCode : fieldsValue['categoryCode'],
        categoryName : fieldsValue['categoryName'],
        businessAddress : fieldsValue['address'],
        description : fieldsValue['description'],
        createUserid: fieldsValue['case_person'][0].no,
        creatorRealName: fieldsValue['case_person'][0].name,
      };
      console.log(values);
    });
  };

  render() {
    const {
      user: { currentUser },
      form: { getFieldDecorator },
      inforTech: { questionRemark },
    } = this.props;
    const { sysFirst, sysSecond, visible, sysType, others} = this.state;
    return (
      <Fragment>
        <Modal
          width={650}
          title="问题反馈"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{padding: 0}}
        >
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} colon={false} className={styles.suggestion}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="故障用户">
                  {getFieldDecorator('case_person',{
                    initialValue: [currentUser],
                    rules: [{
                      required: true,
                    }]
                  })(
                    <UserSelect multiple={false} />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系方式">
                  {getFieldDecorator('mobile',{
                    initialValue: currentUser.mobile,
                    rules: [{
                      required: true,
                    }]
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="办公地点">
              {getFieldDecorator('address',{
                rules: [{
                  required: true,
                }]
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="所属业务">
              {getFieldDecorator('sysFirstId',{
                rules: [{
                  required: true,
                }]
              })(
                <Select onChange={this.handleSysFirst}>
                  {sysFirst.map((item)=>(
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="所属系统">
              {getFieldDecorator('sysScdId',{
                rules: [{
                  required: true,
                }]
              })(
                <Select onChange={this.handleSysSecond}>
                  {sysSecond.map((item)=>(
                    <Select.Option key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="问题分类">
              {getFieldDecorator('sysType',{
                rules: [{
                  required: true,
                }]
              })(
                <Select onChange={this.handleSysType}>
                  {sysType.map((item)=>(
                    <Select.Option key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            {others && others.length>0 ? (
              <Form.Item label="问题说明">
                {getFieldDecorator('checkQuestion',{
                  rules: [{
                    required: true,
                  }]
                })(
                  <Radio.Group>
                    {others.map(ques=>(
                      <Radio value={ques.typename}>{ques.typename}</Radio>
                    ))}
                  </Radio.Group>
                )}
              </Form.Item>
            ) : (
              <Form.Item label="问题说明">
                {getFieldDecorator('description',{
                  rules: [{
                    required: true,
                  }]
                })(
                  <Input.TextArea rows={4} />
                )}
              </Form.Item>
            )}
          </Form>
        </Modal>
        <Card bordered={false} style={{marginTop: 16}}>
          <Button size="large" block onClick={this.openSuggestWin} type="primary" style={{marginBottom: 16}}>问题反馈</Button>
          <Link target="_blank" to=""><Button size="large" block type="default">我的问题</Button></Link>
        </Card>
      </Fragment>
    );
  }
}
