import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, DatePicker, Checkbox, Modal, Form, Input, Icon, Button, message } from 'antd';
import { UserSelect } from '@/components/Selector';
import styles from './index.less';
import moment from 'moment';
import {getConfig} from "../../../utils/utils";

@connect(({ schedule,loading }) => ({
  schedule,
  loading: loading.models.schedule,
}))

@Form.create()
export default class ScheduleEventDetail extends Component {
  state = {
    visible: false,
    event: {},
    startValue: moment(),
    endValue: moment().add(30, 'minutes'),
  };

  componentDidMount() {

  }

  grantModelShow = () => {
    this.setState({
      visible: true
    });
    const { eventId, dispatch } = this.props;
    if(eventId){
      dispatch({
        type: 'schedule/queryScheduleInfo',
        payload: eventId,
        callback: (res)=>{
          this.setState({
            event: res,
          })
        }
      })
    }
  };
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > moment(endValue.subtract(30, 'minutes')).valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= moment(startValue.add(30, 'minutes')).valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);
  };

  saveGrantPersons = () => {
    const { selPersons } = this.state;
    const { form, dispatch } = this.props;
    const values = form.getFieldsValue();
    let grantedPersonNos = "", autoType = "";
    selPersons.map((person,index)=>{
      grantedPersonNos += `${index>0 ? ',' : ''}${person.no}_${person.name}_${person.grandId || 0}_${values["no_"+person.no]}`;
      autoType += `${index>0 ? ',' : ''}${person.no}_${values["no_"+person.no]}`;
    });
    dispatch({
      type: 'schedule/saveGrant',
      payload: {
        grantedPersonNo: grantedPersonNos,
        autoType
      },
      callback: (res)=>{
        message.success(res.msg);
        this.setState({
          visible: false
        })
      }
    })
  };

  render() {
    const { visible, event, startValue, endValue } = this.state;
    const {
      form: {getFieldDecorator},
      schedule: {scheduleEvent},
      showRender,
    } = this.props;
    return (
      <Fragment>
        <Modal
          bodyStyle={{padding: 18}}
          visible={visible}
          title="新建事项"
          onCancel={()=>this.setState({visible: false})}
        >
          <Form
            className={styles.addScheduleForm}
            action=""
          >
            <Form.Item style={{margin: 0}}>
              {getFieldDecorator('title',{
                initialValue: event.title,
                rules: [
                  {required: true},
                ],
              })(
                <Input placeholder="主题" />
              )}
            </Form.Item>
            <Form.Item style={{margin: 0}}>
              {getFieldDecorator('address',{
                initialValue: event.address,
                rules: [
                  {required: true},
                ],
              })(
                <Input placeholder="地点" />
              )}
            </Form.Item>
            <Form.Item style={{margin: 1}}>
              {getFieldDecorator('content',{
                initialValue: event.content,
                rules: [
                  {required: true},
                ],
              })(
                <Input.TextArea placeholder="事件详情" />
              )}
            </Form.Item>
            <Form.Item style={{margin: 0}}>
              {getFieldDecorator('allDay',{
                initialValue: event.allDay === 1 ? true : false,
              })(
                <Checkbox />
              )}全天
            </Form.Item>
            <Form.Item labelCol={4} label="开始时间" style={{margin: 0}}>
              {getFieldDecorator('startTime',{
                initialValue: event.startTime ? moment(event.startTime, 'YYYY-MM-DD hh:mm:ss') : startValue
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  // disabledDate={this.disabledStartDate}
                  onChange={this.onStartChange}
                />
              )}
            </Form.Item>
            <Form.Item label="结束时间" style={{margin: 0}}>
              {getFieldDecorator('endTime',{
                initialValue: event.endTime ? moment(event.endTime, 'YYYY-MM-DD hh:mm:ss') : endValue
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  // disabledDate={this.disabledEndDate}
                  onChange={this.onEndChange}
                />
              )}
            </Form.Item>
          </Form>
        </Modal>
        {typeof showRender === 'function'
          ? <div onClick={this.grantModelShow}>{showRender()}</div>
          : <Button onClick={this.grantModelShow}><Icon type="plus" />新建</Button>
        }
      </Fragment>
    );
  }
}
