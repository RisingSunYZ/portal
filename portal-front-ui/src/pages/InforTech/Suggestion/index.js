import React, { Fragment, PureComponent } from 'react';
import { Card, Button, Modal, Form, Input, Select, Row, Col } from 'antd';
import { connect } from 'dva';
import { UserSelect } from '@/components/Selector';
import { Link } from 'dva/router';
import styles from './index.less';
import {getConfig} from "../../../utils/utils";

@connect(({ user, inforTech, loading }) => ({
  user,
  inforTech,
  loading: loading.models.inforTech,
}))
@Form.create()

export default class Suggestion extends PureComponent {
  state = {
    visible: false,
    sysFirst: [],
    sysSecond: [],
    sysType: [],
  };

  componentDidMount() {
    const { dispatch, sugSysList } = this.props;
    dispatch({
      type: 'inforTech/queryTSCategory',
    });
    this.setState({
      sysFirst: sugSysList || []
    });
  }

  openSuggestWin = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleSysFirst = (value) => {
    const { dispatch, sugSysList } = this.props;
    dispatch({
      type: 'inforTech/queryTSCategory',
      payload: {
        classCode: value
      }
    });
    this.setState({
      sysSecond: sugSysList || []
    });
  };

  handleSysSecond = (value) => {
    const { dispatch, sugSysList } = this.props;
    dispatch({
      type: 'inforTech/queryTSCategory',
      payload: {
        classCode: value,
      }
    });
    this.setState({
      sysType: sugSysList || []
    });
  };

  handleSysType = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'inforTech/queryTSType',
      payload: {
        classCode: value
      }
    });
  };

  render() {
    const {
      user: { currentUser },
      form: { getFieldDecorator },
      inforTech: { questionRemark },
    } = this.props;
    const { sysFirst, sysSecond, visible, sysType} = this.state;
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
                  {getFieldDecorator('case_person')(
                    <UserSelect multiple={false} />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="联系方式">
                  {getFieldDecorator('telephone')(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="办公地点">
              {getFieldDecorator('address')(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="所属业务">
              {getFieldDecorator('sysFirstId')(
                <Select onChange={this.handleSysFirst}>
                  {sysFirst.map((item)=>(
                    <Select.Option key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="所属系统">
              {getFieldDecorator('sysScdId')(
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
              {getFieldDecorator('sysType')(
                <Select onChange={this.handleSysType}>
                  {sysType.map((item)=>(
                    <Select.Option key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="问题说明">
              {getFieldDecorator('checkQuestion')(
                <Input.TextArea />
              )}
            </Form.Item>

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
