import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Row, Col, Alert, Modal } from 'antd';
import saveOkIcon from '../../../assets/userCenter/edit-ok.png';
import saveErrorIcon from '../../../assets/userCenter/edit-error.png';
import styles from './index.less';

const FormItem = Form.Item;

@connect(({ baseInfo, loading }) => ({
  baseInfo,
  loading: loading.models.baseInfo,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class EditInfoForm extends PureComponent {
  state = {
    modelVisible: false,
    formValues: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/getBaseInfo',
      payload: {},
    });

  }

  saveMsg = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      console.log(values);

      dispatch({
        type: 'baseInfo/saveBaseInfo',
        payload: values,
        callback: (data)=> {
          if(data.code === 1){
            this.showOkModel();
          }else{
            this.showErrorModel(data.msg);
          }
        },
      });
    });
  };

  showErrorModel = (msg) => {
    Modal.info({
      className: 'editResultBox',
      centered: true,
      okText: '确定',
      title: false,
      content: (
        <div>
          <div style={{display: 'inline-block', paddingRight: 30}}>
            <img src={saveErrorIcon} alt="" />
          </div>
          {msg}
        </div>
      ),
      onOk() {},
    });
  };

  showOkModel = () => {
    Modal.info({
      className: 'editResultBox',
      centered: true,
      okText: '确定',
      title: false,
      content: (
        <div>
          <div style={{display: 'inline-block', paddingRight: 30}}>
            <img src={saveOkIcon} alt="" />
          </div>
          修改资料成功！
        </div>
      ),
      onOk() {},
    });
  };

  render() {
    const {
      submitting,
      baseInfo: { profile },
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 4, offset: 10 },
      },
    };

    return (
      <Card bordered={false}>
        <Form onSubmit={this.saveMsg} hideRequiredMark style={{ margin: '100px 0' }}>
          <Row>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="手机">
                {getFieldDecorator('mobilePhone', {
                  initialValue: profile.profile.workphone,
                  rules: [
                    {
                      pattern: /^\d{11}$/,
                      message: '号码格式错误',
                    },
                  ],
                })(<Input type="text" placeholder="请输入手机号码" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="座机号码">
                {getFieldDecorator('companyMobile', {
                  initialValue: profile.profile.officephone,
                  rules: [
                    {
                      pattern: /^(0[0-9]\d+-)?(\d+)?$/,
                      message: '号码格式错误',
                    },
                  ],
                })(<Input type="text" placeholder="请输入座机号码" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="短号">
                {getFieldDecorator('shortPhone', {
                  initialValue: profile.profile.worklongphone,
                  rules: [
                    {
                      pattern: /^\d{6,}$/,
                      message: '号码格式错误',
                    },
                  ],
                })(<Input type="text" placeholder="请输入短号" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="座机短号">
                {getFieldDecorator('shortWorkPhone', {
                  initialValue: profile.profile.officeshortphone,
                  rules: [
                    {
                      pattern: /^\d{6,}$/,
                      message: '号码格式错误',
                    },
                  ],
                })(<Input type="text" placeholder="请输入座机短号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <FormItem {...formItemLayout} label="QQ号">
                {getFieldDecorator('qqNo',{
                  initialValue: profile.profile.qq,
                    rules: [
                        {
                          pattern: /^[1-9][0-9]{4,9}$/,
                           message: '号码格式错误',
                        },
                    ],
                })(
                  <Input type="text" placeholder="请输入QQ号" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <p className={styles.warning} style={{textAlign: 'center'}}>说明：此处维护的“手机、“短号”、“座机号码”、“座机短号”会同步显示在门户通讯录中。</p>
            </Col>
          </Row>
          <FormItem {...submitFormLayout} style={{ marginTop: 50 }}>
            <Button>取消</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 50 }}>
              提交
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default EditInfoForm;
