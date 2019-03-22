import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button, Row, Col , Icon } from 'antd';
import styles from './ForgetPW.less';
import { message } from 'antd/lib/index';


const InputGroup = Input.Group;
const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

@connect(({ login, loading }) => ({
  login,
  // submitting: loading.effects['findPW/submit'],
}))
@Form.create()
class ForgetPW extends Component {
  state = {
    count: 0,
  };



  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // 获取验证码事件
  onGetCaptcha = () => {
    const {form, dispatch} = this.props;

    form.validateFields((err, values) => {
      console.log(values)
      var userNo=values.userNo;

      if (!err && userNo) {

        // 如果工号存在，发送验证码
        dispatch({
          type: 'login/checkAccount',
          payload: {
            "userNo": userNo
          },
          callback: res => {
            if (res && res.code == '100') {
              const phone = res.data!=undefined?res.data.mobile:"";
              message.success('验证码已发送到手机：'+phone+'，请注意查收！');

              // 定时
              let count = 29;
              this.setState({ count });
              this.interval = setInterval(() => {
                count -= 1;
                this.setState({ count });
                if (count === 0) {
                  clearInterval(this.interval);
                }
              }, 500);
            }else{
              message.error(res.msg);
            }
          },

        })
      }
    });
  };

  // 提交按钮事件
  handleSubmit = () => {
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err && values.userNo && values.captcha) {
        dispatch({
          type: 'login/checkCaptchaCode',
          payload: {
            ...values,
          },
          callback: res => {
            if (res && res.code == 100) {
              message.success(res.msg)
              const userNo = values.userNo;
              router.push({
                pathname:'/user/reset-pw',
                query:{userNo : userNo},
                });
            } else {
              message.error(res.msg);
            }
          },
        });
      } else {
        message.error('请正确填写信息！');
      }
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { count } = this.state;

    return (
      <div className={styles.divMain}>
        <div className={styles.pageHeader}></div>
        <div className={styles.breadCrumb}>
          <Icon type="home" theme="twoTone" />
          <span className={styles.navSpan}>您所在的位置：</span>
          <a href="/user/login" className={styles.navA}>登录</a>
          <span> >> </span>
          <span>忘记密码</span>
        </div>
        <div className={styles.main}>
          <p className={styles.title}>请按照以下方式重置密码</p>
          <Form layout="vertical" hideRequiredMark className={styles.formContent}>
            <FormItem label="您的工号：" labelCol={{ span: 6 }} wrapperCol={{ span: 14}}>
              <Row gutter={4}>
                <Col span={15}>
                  {getFieldDecorator('userNo', {
                    rules: [
                      { required: true, message: '请输入您的工号' },
                      {
                        pattern: /^\d{8}$/g,
                        message: '请输入正确的8位数字'
                      }
                    ],
                  })(
                    <Input placeholder="请输入您的工号" />
                  )}
                </Col>
                <Col span={8}>
                  <Button disabled={count} onClick={this.onGetCaptcha} style={{ background: '#1890FF',color: '#fff'}}>
                    {count
                      ? `${count} s`
                      : formatMessage({ id: 'app.register.get-verification-code' })}
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="短信验证码：" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }}>
              <Row gutter={4}>
                <Col span={24}>
                  <InputGroup compact>
                    {getFieldDecorator('captcha', {
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                      //   },
                      // ],
                    })(<Input placeholder="请输入短信验证码" style={{textAlign:'left'}} />)}
                  </InputGroup>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="手机号：" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} style={{display:'none'}}>
              <Row gutter={4}>
                <Col span={24}>
                  <InputGroup compact>
                    {getFieldDecorator('mobile', {
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                      //   },
                      // ],
                    })(<Input type={'hidden'} />)}
                  </InputGroup>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Row className={styles.btns}>
                <Col span={5}>
                  <Button type="primary" onClick={this.handleSubmit}>
                    提交
                  </Button>
                </Col>
                <Col span={5}>
                  <Button onClick={this.handleReset}>
                    重置
                  </Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default ForgetPW;
