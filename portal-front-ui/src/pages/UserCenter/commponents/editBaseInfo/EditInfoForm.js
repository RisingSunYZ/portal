import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Row, Col, Alert } from 'antd';
import styles from '../../EditBaseInfo/index.less';

const FormItem = Form.Item;

@connect(({ baseInfo, loading }) => ({
  baseInfo,
  loading: loading.models.baseInfo,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class EditInfoForm extends PureComponent {
  state = {
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
      });
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
        sm: { span: 10, offset: 9 },
      },
    };

    return (
      <Card bordered={false}>
        <Form onSubmit={this.saveMsg} hideRequiredMark style={{ marginTop: 8 }}>
          <Row gutter={16}>
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
              <FormItem {...formItemLayout} label="办公地址">
                {getFieldDecorator('workAddress')(
                  <Input type="text" placeholder="请输入办公地址" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={{span: 24, offset: 0}} md={{span: 17, offset: 5}}>
              <Alert message="说明：此处维护的“手机、“短号”、“座机号码”、“座机短号”会同步显示在门户通讯录中。" type="warning" showIcon />
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
