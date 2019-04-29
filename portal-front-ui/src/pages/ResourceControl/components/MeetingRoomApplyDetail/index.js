import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Radio, Checkbox, Icon, Row, Col, Input, Card, Modal, DatePicker, Button, message } from 'antd';
import styles from './index.less';
import moment from 'moment';

const FormItem = Form.Item;

@connect(({ user, mtRoom, loading }) => ({
  user,
  mtRoom,
  loading: loading.models.mtRoom,
}))
@Form.create()

export default class MeetingRoomApplyDetail extends PureComponent {

  state = {
    meetingStartTime: null,
    meetingEndTime: null,
    cyclicity: false,
    confirmLoading: false,
    weekDays: [],
  };

  componentDidMount(){
    document.body.onselectstart=function(){
      return false;
    };
  }

  clearFormValues = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      meetingStartTime: null,
      meetingEndTime: null,
      cyclicity: false,
    })
  };

  onApplyTypeChange = (e) => {
    if(e.target.value === 1){
      this.setState({
        cyclicity: true,
      })
    }else{
      this.setState({
        cyclicity: false,
        weekDays: [],
      });
    }
  };

  renderMeetingTime = (date, applies) => {
    const { mtRoom: { roomDetail: { currentDateTime } } } = this.props;
    const { meetingStartTime, meetingEndTime } = this.state;
    let disableList = [], disableNum = 0, columns = [];
    applies && applies.length && applies.map(apply=>{
      const start = apply.startTimeStr.split(":"), end = apply.endTimeStr.split(":");
      let sNum = start[1] === '30' ? parseInt(start[0])*2+1 : parseInt(start[0])*2,
        eNum = end[1] === '30' ? parseInt(end[0])*2+1 : parseInt(end[0])*2;
      disableList = disableList.concat(Array.from({length: eNum-sNum},(v,k)=>sNum+k+1));
    });
    if(moment(currentDateTime, "YYYY-MM-DD").valueOf() === moment(date).valueOf()){
      disableNum = moment(currentDateTime).hours()*2;
      if(moment(currentDateTime).minutes()>0){
        disableNum += moment(currentDateTime).minutes()> 30 ? 2 : 1;
      }
    }
    for(let i=1; i<=48; i++){
      columns.push(
        <li key={i} className={'item '+ ((i<=disableNum || disableList.indexOf(i) > -1) ? 'used' : (meetingStartTime<=i && i<=meetingEndTime ? 'selected' : ''))} />
      )
    }
    return (
      <ul className="apply-time" onMouseDown={this.onSelApplyTime} onDragStart={()=>{return false}}>
        {columns}
      </ul>
    )
  };

  onSelApplyTime = (e) => {
    const wrapperX = e.currentTarget.getBoundingClientRect().x;
    let target = e.target, add = true, startNum = Math.min(Math.ceil((e.clientX - wrapperX)/17), 48), endNum = null, step = true;
    const { meetingStartTime, meetingEndTime } = this.state;
    if(target.classList.contains("used")) return;
    if(meetingStartTime && meetingEndTime && ((meetingStartTime<startNum && startNum<meetingEndTime) || meetingEndTime+1<startNum || meetingStartTime-1>startNum)) return false;
    if(target.classList.contains("selected")){add = false}
    const onUpdateSelTime = e => {
      const tar = e.target, isSel = tar.classList.contains("selected"), idx = Math.ceil((e.clientX - wrapperX)/17);
      if(!tar.classList.contains("item") || tar.classList.contains("used")){
        step = false;
      }
      if(step){
        endNum = idx;
        if(add && !isSel){
          tar.classList.add("selected");
        }else if(!add && isSel){
          tar.classList.remove("selected");
        }
      }
    };
    const onSelTimeEnd = (e) =>{
      const tar = e.target;
      if(!endNum)endNum = Math.min(Math.ceil((e.clientX - wrapperX)/17), 48);
      if(meetingStartTime && meetingEndTime){
        if(add){
          startNum = startNum > meetingStartTime ? meetingStartTime : startNum;
          endNum = endNum > meetingEndTime ? endNum : meetingEndTime;
        }else{
          if(startNum === meetingStartTime){
            startNum = endNum + 1;
            endNum = meetingEndTime;
          }else if(startNum === meetingEndTime){
            startNum = meetingStartTime;
            endNum = endNum - 1;
          }
          startNum>endNum && (startNum = null, endNum = null);
        }
      }
      this.setState({
        meetingStartTime: Math.min(startNum, endNum),
        meetingEndTime: Math.max(startNum, endNum),
      });
      document.removeEventListener("mouseup", onSelTimeEnd, false);
      document.removeEventListener("mousemove", onUpdateSelTime, false);
    };
    document.addEventListener("mouseup", onSelTimeEnd, false);
    document.addEventListener("mousemove", onUpdateSelTime, false);
  };

  onWeekDayChange = values =>{
    this.setState({
      weekDays: values,
    })
  };

  saveApply = () => {
    const { onSave, mtRoom: {roomDetail}, applyDate, applyData, form, dispatch } = this.props;
    const { meetingStartTime, meetingEndTime, weekDays } = this.state;
    if(!meetingStartTime || !meetingEndTime){
      message.error("请选择会议时间"); return false;
    }
    const formData = form.getFieldsValue();
    const saveObj = {
      ...applyData,
      ...formData,
      meetingroomId: roomDetail.meetingroom.id,
      meetingroomName: roomDetail.meetingroom.name,
    };
    if(formData.applyType === 0){
      saveObj.startDateStr = applyDate;
      saveObj.endDateStr = applyDate;
      saveObj.weekDays = moment(applyDate).day();
    }else{
      if(weekDays.length === 0){
        message.error('请选择星期'); return false;
      }
      if(formData['applyDate'].length<2){
        message.error('请选择时间范围'); return false;
      }else if(moment(formData['applyDate'][0]).add(6,'day').valueOf() > formData['applyDate'][1].valueOf()){
        message.error('日期范围至少为一周，请重新选择日期'); return false;
      }
      saveObj.startDateStr = formData['applyDate'][0].format("YYYY-MM-DD");
      saveObj.endDateStr = formData['applyDate'][1].format("YYYY-MM-DD");
      saveObj.weekDays = weekDays.join(",");
    }
    this.setState({
      confirmLoading: true,
    });
    saveObj.startTimeStr = `${Math.floor((meetingStartTime-1)/2)}:${(meetingStartTime-1)%2===0 ? '00' : '30'}`;
    saveObj.endTimeStr = `${Math.floor(meetingEndTime/2)}:${meetingEndTime%2===0 ? '00' : '30'}`;
    dispatch({
      type: "mtRoom/saveMtRoomMsg",
      payload: saveObj,
      callback: (res)=>{
        this.setState({
          confirmLoading: false,
        });
        if(res.code === '100'){
          message.success(res.msg);
          onSave && onSave(res);
        }else{
          message.error(res.msg);
        }
      }
    });
  };

  disabledDate = (current) =>{
    const { mtRoom: { roomDetail } } = this.props;
    return current && current < moment(roomDetail.currentDateTime).startOf('day');
  };

  render() {
    const {
      form: { getFieldDecorator },
      mtRoom: { roomDetail: {
        currentDateTime,
        loginUser,
        meetingroom,
        meetingroomAddr,
      } },
      onCancel,
      visible,
      applyId,
      applyDate,
      applyData,
      loading,
    } = this.props;
    const { cyclicity, weekDays, confirmLoading } = this.state;
    return (
      <Modal
        visible={visible || false}
        title={applyId ? '查看申请' : '申请会议室'}
        width={900}
        footer={<div>
          <Button loading={confirmLoading} onClick={this.saveApply} type="primary">确定</Button>
          <Button onClick={()=> onCancel && onCancel()}>取消</Button>
        </div>}
        onCancel={()=> onCancel && onCancel()}
        loading={loading}
      >
        <Form layout="inline">
          <Row gutter={{ md: 8, lg: 16}}>
            <Col span={8}>
              <FormItem label="申请人">
                {getFieldDecorator('proposerName', {
                  initialValue: loginUser.name
                })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="申请部门">
                {getFieldDecorator('deptName', {
                  initialValue: loginUser.depName
                })(
                  <Input disabled />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="联系电话">
                {getFieldDecorator('mobile', {
                  initialValue: loginUser.mobile
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <div className="mtroom-apply-container">
            <div className="select-room">
              <span>地点：<b>{meetingroomAddr.address}{meetingroom.name}{meetingroom.needApproval === 1? '（需审批）': ''}</b></span>
              <FormItem>
                {getFieldDecorator('applyType',{
                  initialValue: 0,
                })(
                  <Radio.Group style={{marginLeft: 50}} onChange={this.onApplyTypeChange}>
                    <Radio value={0}>单次</Radio>
                    {meetingroom.isCyclicity && meetingroom.isCyclicity === 1 ? <Radio value={1}>周期性</Radio> : ''}
                  </Radio.Group>
                )}
              </FormItem>
            </div>
            {cyclicity ? (
              <div>
                <div style={{paddingTop: 10}}>日期：
                  <FormItem>
                    {getFieldDecorator('applyDate',{
                      initialValue: [moment(currentDateTime), moment(currentDateTime).add(6,'day')]
                    })(
                      <DatePicker.RangePicker disabledDate={this.disabledDate} />
                    )}
                  </FormItem>
                </div>
                <Checkbox.Group className="ck-range" onChange={this.onWeekDayChange} value={weekDays}>
                  <Checkbox value={1}>星期一</Checkbox>
                  <Checkbox value={2}>星期二</Checkbox>
                  <Checkbox value={3}>星期三</Checkbox>
                  <Checkbox value={4}>星期四</Checkbox>
                  <Checkbox value={5}>星期五</Checkbox>
                  <Checkbox value={6}>星期六</Checkbox>
                  <Checkbox value={7}>星期日</Checkbox>
                </Checkbox.Group>
              </div>
            ) : (
              <div style={{paddingTop: 10}}>日期：{applyDate}</div>
            )}
            <div>
              <ul className="apply-time-title">
                <li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>10</li><li>11</li><li>12</li>
                <li>13</li><li>14</li><li>15</li><li>16</li><li>17</li><li>18</li><li>19</li><li>20</li><li>21</li><li>22</li><li>23</li><li>24</li>
              </ul>
              {this.renderMeetingTime(applyDate, applyData)}
            </div>
            <div>
              <div>用途与备注</div>
              <FormItem style={{ width: '100%' }} wrapperCol={{span: 24}}>
                {getFieldDecorator('remark')(
                  <Input.TextArea rows={5} />
                )}
              </FormItem>
            </div>
          </div>
        </Form>
      </Modal>
    )
  }
}
