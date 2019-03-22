import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button, Row, Col,Icon, Popover, Progress } from 'antd';
import styles from './FindPW.less';
import { message } from 'antd/lib/index';
import md5 from 'md5';


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

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ login, loading }) => ({
  login,
  // submitting: loading.effects['findPW/submit'],
}))
@Form.create()
class ResetPW extends Component {
  state = {
    mobile: this.props.location.query.mobile,
    confirmDirty: false,
    visible: false,
    help: '',
  };

  componentWillUnmount() {}

  //
  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPassword');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  //
  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPassword');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  // 密码校验
  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  // 确认密码输入框内容校验
  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  // 重置密码按钮事件
  handlerSubmit = e => {
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err && values.newPassword && values.confirm) {
        // const { mobile } = this.state;
        // const password= md5(values.newPassword);
        dispatch({
          type: 'login/findPW',
          payload: {
            password:values.newPassword
          },
          callback: res => {
            if (res && res.code == '100') {
              message.success(res.msg);
              router.push({
                pathname:'/user/login',
              });

            } else {
              message.error(res.msg);
            }
          },
        });
      }
    });
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { help, visible } = this.state;

    return (
      <div className={styles.divMain}>
        <div className={styles.pageHeader}></div>
        <div className={styles.breadCrumb}>
          <Icon type="home" theme="twoTone" />
          <span className={styles.navSpan}>您所在的位置：</span>
          <a href="/user/login" className={styles.navA}>门户</a>
          <span> >> </span>
          <span>重置密码</span>
        </div>
        <div className={styles.main}>
          <div style={{ width: '100%', display: 'inline-block' }}>
            <p className={styles.title}>请输入新密码</p>
            <Form layout="vertical" hideRequiredMark className={styles.formContent}>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} help={help} label="请输入新密码：">
                <Popover
                  getPopupContainer={node => node.parentNode}
                  content={
                    <div style={{ padding: '4px 0' }}>
                      {passwordStatusMap[this.getPasswordStatus()]}
                      {this.renderPasswordProgress()}
                      <div style={{ marginTop: 10 }}>
                        <FormattedMessage id="validation.password.strength.msg" />
                      </div>
                    </div>
                  }
                  overlayStyle={{ width: 220 }}
                  placement="right"
                  visible={visible}
                >
                  {getFieldDecorator('newPassword', {
                    rules: [
                      {
                        validator: this.checkPassword,
                      },
                    ],
                  })(
                    <Input
                      style={{ width: '100%' }}
                      type="password"
                      placeholder={formatMessage({ id: 'form.password.placeholder' })}
                    />
                  )}
                </Popover>
              </FormItem>
              <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="请确认新密码：">
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.confirm-password.required' }),
                    },
                    {
                      validator: this.checkConfirm,
                    },
                  ],
                })(
                  <Input
                    style={{ width: '100%' }}
                    type="password"
                    placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
                  />
                )}
              </FormItem>
              <FormItem>
                <Row className={styles.btns}>
                  <Col span={5}>
                    <Button type="primary" loading={submitting} onClick={this.handlerSubmit}>
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
      </div>
    );
  }
}

export default ResetPW;
