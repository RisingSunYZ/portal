import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Col, Row, Alert } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
@connect(({ baseInfo, loading }) => ({
  baseInfo,
  loading: loading.models.baseInfo,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class EditUserMobile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      visible: false,
      noticeShow: 'hidden',
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/getBaseInfo',
      payload: {},
    });

  }
  onGetCaptcha = () => {
    const { dispatch } = this.props;
    const { noticeShow } = this.state;
    const _this=this;

    dispatch({
      type: 'baseInfo/sendUserMobileCode',
      payload: {},
      callback:(res)=>{
        _this.setState({ noticeShow: 'visible' });
        _this.runGetCaptchaCountDown();
      }
    });
  };

  runGetCaptchaCountDown = () => {
    const { countDown } = this.props;

    let count = countDown || 119;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  modifyMobile = () => {
    this.setState({ visible: true });
  };
  saveMsg = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      dispatch({
        type: 'baseInfo/saveUserMobile',
        payload: values,
      });
    });
  };
  render() {
    const { count, noticeShow, visible } = this.state;
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
        sm: { span: 12 },
        md: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    };

    return (
      <div>
        <Card bordered={false} style={{ display: visible ? 'none' : 'block' }}>
          <Form style={{ margin: '100px 0' }}>
            <Row>
              <Col span={16}>
                <FormItem {...formItemLayout} label="密保手机">
                  {getFieldDecorator('number', {
                    initialValue: profile.mobile,
                  })(<Input type="text" disabled />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <a className={styles.modify} onClick={this.modifyMobile}>
                  修改
                </a>
              </Col>
            </Row>
            <Row>
              <Col sm={{span: 24, offset: 0}} md={{span: 14, offset: 5}}>
                <p className={styles.warning}>说明：密保手机作为用户修改密码的依据，不会显示在门户通讯录中，请妥善保管。</p>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card bordered={false} style={{ margin: '50px 0', display: visible ? 'block' : 'none' }}>
          <div style={{ padding: '30px 280px', visibility: noticeShow }}>
            <Alert message={`短信验证码已发送到手机： ${profile.mobile}，请注意查收！`} type="success" showIcon />
          </div>
          <Form onSubmit={this.saveMsg}>
            <FormItem {...formItemLayout} label="短信验证码">
              <Row gutter={8}>
                <Col span={7}>{getFieldDecorator('smCode')(<Input type="text" />)}</Col>
                <Col span={8}>
                  <Button
                    disabled={count}
                    style={{ width: 102 }}
                    type="primary"
                    onClick={this.onGetCaptcha}
                  >
                    {count ? `${count} ${'秒'}` : '发送验证码'}
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem {...formItemLayout} label="密保手机">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    pattern: /^\d{11}$/,
                    message: '号码格式错误',
                  },
                ],
              })(<Input style={{ width: 249 }} type="text" />)}
            </FormItem>
            <Row>
              <Col span={8} offset={10}>
                <Button type="primary" htmlType="submit" style={{ width: 249 }}>
                  确定
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
}

export default EditUserMobile;
