import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Row, Col } from 'antd';
import SalaryView from "../commponents/salary/SalaryView";
import styles from './index.less';
// import formBg from '../../../assets/pwd-input.png';

const FormItem = Form.Item;

@connect(({ salary, loading }) => ({
  salary,
  loading: loading.models.salary,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class Salary extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      error: false,
      errorText: null,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salary/disabled',
      payload: {},
    });
  }
  handleSubmit = (e) =>{
    e.preventDefault();
    this.setState({
      error: false,
      errorText: "",
    });
    const { dispatch ,form} = this.props;
    const pwd = form.getFieldValue('pwd');
    dispatch({
      type: 'salary/checkPwd',
      payload: {pwd:pwd},
      callback: (data)=>{
        if(!data.enabled){
          this.setState({
            error: true,
            errorText: data.msg,
          })
        }
      }
    });
  };


  render() {
    const { salary:{enabled} } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {error, errorText} = this.state;

    return (
      <div className="ucenter-box">
        <div className={styles.container} style={{background: '#fff', display: enabled ? "none" : "block"}}>
          <Card className={styles.searchBox} bordered={false}>
            <Form onSubmit={this.handleSubmit} className={styles.searchForm}>
              <Row>
                <Col offset={4} span={12}>
                  <FormItem
                    validateStatus={error ? 'error' : ''}
                    help={errorText}
                  >
                    {getFieldDecorator('pwd',{
                      rules: [{
                        required: true,
                        message: "查询密码不能为空",
                      }],
                    })(<Input type="password" placeholder='请输入' />)}
                  </FormItem>
                </Col>
              </Row>
              <FormItem style={{ marginTop: 150}}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Button block type="default" >
                      取消
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button block type="primary" htmlType="submit" >
                      确定
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </Card>
        </div>
        {enabled && (<SalaryView />)}
      </div>
    );
  }
}

