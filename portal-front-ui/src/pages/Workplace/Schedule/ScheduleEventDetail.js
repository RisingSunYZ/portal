import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, DatePicker, Checkbox, Modal, Form, Input, Icon, Button, message } from 'antd';
import { UserSelect } from '@/components/Selector';
import moment from 'moment';

@connect(({ schedule,loading }) => ({
  schedule,
  loading: loading.models.schedule,
}))

@Form.create()
export default class ScheduleEventDetail extends Component {
  state = {
    visible: false,
    event: {},
    startValue: null,
    endValue: null,
    isAllDay: false,
    delBtnLoading: false,
    saveBtnLoading: false,
  };

  componentDidMount() {

  }

  grantModelShow = () => {
    this.setState({
      visible: true,
      startValue: moment(),
      endValue: moment().add(30, 'minutes'),
    });
    const { eventId, dispatch, form } = this.props;
    form.resetFields();
    if(eventId){
      dispatch({
        type: 'schedule/queryScheduleInfo',
        payload: eventId,
        callback: (res)=>{
          this.setState({
            event: res,
            startValue: moment(res.startTime),
            endValue: moment(res.endTime),
            isAllDay: res.isAllDay === 1
          })
        }
      })
    }
  };
  disabledStartDate = (startValue) => {
    const {endValue, isAllDay} = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    if(isAllDay){
      return startValue.valueOf() > endValue.valueOf()
    }else{
      return startValue.valueOf() > moment(endValue).subtract(30, 'minutes').valueOf();
    }
  };

  disabledEndDate = (endValue) => {
    const {startValue, isAllDay} = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    if(isAllDay){
      return endValue.valueOf() < startValue.valueOf()
    }else{
      return endValue.valueOf() < moment(startValue).add(30, 'minutes').valueOf();
    }
  };

  onStartChange = (value) => {
    this.setState({
      startValue: value,
    });
  };

  onEndChange = (value) => {
    this.setState({
      endValue: value,
    });
  };

  saveEvent = () => {
    const { event } = this.state;
    const { form, dispatch, onChange } = this.props;
    if(event.id && event.type === 2){
      this.setState({visible: false});
      return;
    }
    this.setState({
      saveBtnLoading: true,
    });
    event.type = 1;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        this.setState({
          saveBtnLoading: false,
        });
        return;
      }
      if(!fieldsValue.isAllDay && fieldsValue['startTime'].valueOf() >= fieldsValue['endTime'].valueOf()){
        this.setState({
          saveBtnLoading: false,
        });
        message.error('结束时间需大于开始时间');
        return;
      }
      const values = {
        ...event,
        ...fieldsValue,
        isAllDay: fieldsValue.isAllDay===true ? 1 : 0,
        'startTime': fieldsValue['startTime'].format("YYYY-MM-DD HH:mm:ss"),
        'endTime': fieldsValue['endTime'].format("YYYY-MM-DD HH:mm:ss"),
      };
      dispatch({
        type: 'schedule/doSaveSchedule',
        payload: values,
        callback: (res)=>{
          if(res.code === '100'){
            message.success(res.msg);
            this.setState({
              saveBtnLoading: false,
              visible: false
            });
            onChange && onChange();
          } else {
            this.setState({
              saveBtnLoading: false,
            });
            message.error(res.msg);
          }
        }
      })
    });

  };

  delEvent = (id) => {
    this.setState({
      delBtnLoading: true,
    });
    const { dispatch, onChange } = this.props;
    dispatch({
      type: 'schedule/delEvent',
      payload: id,
      callback: (res)=>{
        if(res.code === '100'){
          message.success(res.msg);
          this.setState({
            delBtnLoading: false,
            visible: false
          });
          onChange && onChange()
        }else {
          message.error(res.msg);
          this.setState({
            delBtnLoading: false,
          });
        }
      }
    })
  };

  updateEventTime = (e) => {
    const isAllDay = e.target.checked;
    const { startValue, endValue } = this.state;
    this.setState({
      isAllDay,
      startValue: moment(startValue).startOf('day'),
      endValue: moment(endValue).startOf('day'),
    });
  };

  getFooter = () => {
    const { eventId } = this.props;
    const { event,saveBtnLoading, delBtnLoading } = this.state;
    if(eventId){
      if(event.type === 1){
        return (
          <div>
            <Button onClick={()=>this.delEvent(event.id)} loading={delBtnLoading}>删除</Button>
            <Button type="primary" onClick={this.saveEvent} loading={saveBtnLoading}>保存</Button>
            <Button onClick={()=>this.setState({visible: false})}>取消</Button>
          </div>
        )
      }
      return (
        <div>
          <Button onClick={()=>this.setState({visible: false})}>关闭</Button>
        </div>
      )
    }
    return (
      <div>
        <Button type="primary" onClick={this.saveEvent} loading={saveBtnLoading}>确定</Button>
        <Button onClick={()=>this.setState({visible: false})}>取消</Button>
      </div>
    )
  };

  render() {
    const { visible, event, startValue, endValue, isAllDay } = this.state;
    const {
      disabled,
      form: {getFieldDecorator},
      showRender,
      title,
    } = this.props;
    const itemDisabled = disabled || event.type === 2;
    return (
      <Fragment>
        <Modal
          bodyStyle={{padding: 18}}
          visible={visible}
          title={title || '新建事项'}
          footer={<Fragment>{this.getFooter()}</Fragment>}
          onCancel={()=>this.setState({visible: false})}
        >
          <Form action="">
            <Form.Item style={{margin: 0}}>
              {getFieldDecorator('title',{
                initialValue: event.title,
                rules: [
                  {required: true},
                ],
              })(
                <Input disabled={itemDisabled} placeholder="主题" />
              )}
            </Form.Item>
            <Form.Item style={{margin: 0}}>
              {getFieldDecorator('address',{
                initialValue: event.address,
                rules: [
                  {required: true},
                ],
              })(
                <Input disabled={itemDisabled} placeholder="地点" />
              )}
            </Form.Item>
            <Form.Item style={{margin: 0}}>
              {getFieldDecorator('content',{
                initialValue: event.content,
                rules: [
                  {required: true},
                ],
              })(
                <Input.TextArea disabled={itemDisabled} rows={4} placeholder="事件详情" />
              )}
            </Form.Item>
            <Form.Item style={{margin: 0}}>
              {getFieldDecorator('isAllDay',{
                valuePropName: 'checked',
                initialValue: event.isAllDay === 1,
              })(
                <Checkbox disabled={itemDisabled} onChange={this.updateEventTime}>全天</Checkbox>
              )}
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item labelCol={{span: 7}} wrapperCol={{span: 17}} label="开始时间" style={{margin: 0}}>
                  {getFieldDecorator('startTime',{
                    required: true,
                    initialValue: event.startTime ? moment(event.startTime, 'YYYY-MM-DD HH:mm:ss') : startValue,
                  })(
                    <DatePicker
                      disabled={itemDisabled}
                      style={{minWidth: 165}}
                      showTime={isAllDay ? false :{ format: 'HH:mm', minuteStep: 5 }}
                      format={isAllDay ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                      disabledDate={this.disabledStartDate}
                      onChange={this.onStartChange}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item labelCol={{span: 7}} wrapperCol={{span: 17}} label="结束时间" style={{margin: 0}}>
                  {getFieldDecorator('endTime',{
                    required: true,
                    initialValue: event.endTime ? moment(event.endTime, 'YYYY-MM-DD HH:mm:ss') : endValue
                  })(
                    <DatePicker
                      disabled={itemDisabled}
                      style={{minWidth: 165}}
                      showTime={isAllDay ? false :{ format: 'HH:mm', minuteStep: 5 }}
                      format={isAllDay ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                      disabledDate={this.disabledEndDate}
                      onChange={this.onEndChange}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        {typeof showRender === 'function'
          ? <div onClick={this.grantModelShow}>{showRender()}</div>
          : <Button disabled={disabled} onClick={this.grantModelShow}><Icon type="plus" style={{color: '#1890FF'}} />新建</Button>
        }
      </Fragment>
    );
  }
}
