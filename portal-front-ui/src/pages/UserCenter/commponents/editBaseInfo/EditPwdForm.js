import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Popover, Icon, Progress } from 'antd';
import styles from '../../EditBaseInfo/index.less';

const FormItem = Form.Item;
const passwordStatusMap = {
  ok: <div className={styles.success}>强</div>,
  pass: <div className={styles.warning}>中</div>,
  poor: <div className={styles.error}>弱</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
@connect(({ baseInfo, loading }) => ({
  baseInfo,
  loading: loading.models.baseInfo,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class EditPwdForm extends PureComponent {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  containsAlpha = str => {
    return new RegExp(/[a-z]/).test(str) ? 1 : 0;
  };
  containsNumeric = str => {
    return new RegExp(/[0-9]/).test(str) ? 1 : 0;
  };

  containsUpperCase = str => {
    return new RegExp(/[A-Z]/).test(str) ? 1 : 0;
  };

  containsSpecialCharacter = str => {
    return new RegExp(/[\W]/).test(str) ? 1 : 0;
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPwd')) {
      callback('您两次输入的密码不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { confirmDirty } = this.state;
    const form = this.props.form;
    const alpha = this.containsAlpha(value);
    const number = this.containsNumeric(value);
    const upper = this.containsUpperCase(value);
    const special = this.containsSpecialCharacter(value);
    const result = alpha + number + upper + special;
    if (value.length < 8) {
      callback('密码长度最小位8位');
    } else if (result < 3) {
      callback('至少包含3种字符');
    } else if (value.length > 14) {
      callback('密码长度最大14位');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirmPwd'], { force: true });
    }
    callback();
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPwd');
    const passwordStatus = this.getPasswordStatus();
    const percent = value && value.length ? (value.length * 10 > 100 ? 100 : value.length * 10) : 0;
    return (
      <div style={{ lineHeight: 1 }} className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          strokeWidth={6}
          percent={percent}
          showInfo={false}
        />
      </div>
    );
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newPwd');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
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
      console.log(values);

      dispatch({
        type: 'baseInfo/saveUserPwd',
        payload: values,
      });
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const pwdTips = (
      <div>
        <p>密码注意事项</p>
        <p>1.密码长度8-14位</p>
        <p>2.至少含3种字符，如字母、数字、符号等；</p>
        <p>3.不允许包含&lt;&gt;、姓名全拼等特殊字符；</p>
        <p>4.不能使用强度太弱的密码；</p>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 7 },
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
          <FormItem {...formItemLayout} label="输入原密码">
            {getFieldDecorator('oldPwd', {
              rules: [
                {
                  required: true,
                  message: '原密码不能为空',
                },
              ],
            })(<Input type="password" placeholder="请输入原密码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="输入新密码">
            {getFieldDecorator('newPwd', {
              rules: [
                {
                  required: true,
                  message: '新密码不能为空',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(
              <div style={{ position: 'relative' }}>
                <Input type="password" placeholder="请输入新密码" />
                {this.renderPasswordProgress()}
                <Popover placement="right" content={pwdTips}>
                  <Icon
                    theme="filled"
                    style={{ color: '#F5A623', position: 'absolute', right: '-24px', top: '12px' }}
                    type="question-circle"
                  />
                </Popover>
              </div>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="新密码确认">
            {getFieldDecorator('confirmPwd', {
              rules: [
                {
                  required: true,
                  message: '新密码不能为空',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} placeholder="请输入新密码" />
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 80 }}>
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

export default EditPwdForm;
