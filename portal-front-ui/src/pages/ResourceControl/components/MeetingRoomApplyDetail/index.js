import React, { Component } from 'react';
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

export default class MeetingRoomApplyDetail extends Component {

  state = {
    meetingStartTime: null,
    meetingEndTime: null,
    tempSTime: null,
    tempETime: null,
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
      weekDays: []
    })
  };

  onApplyTypeChange = (e) => {
    const { meetDate, mtRoom: { applyDetail: { currentDateTime }} } = this.props;
    if(e.target.value === 1){
      this.getApplyListByDate(currentDateTime.split(" ")[0], moment(currentDateTime).add(6,'day').format('YYYY-MM-DD'));
      this.setState({
        cyclicity: true,
      })
    }else{
      this.getApplyListByDate(meetDate, meetDate);
      this.setState({
        cyclicity: false,
        weekDays: [],
        meetingStartTime: null,
        meetingEndTime: null,
        tempSTime: null,
        tempETime: null,
      });
    }
  };

  getApplyListByDate = (sdate, edate) => {
    const { dispatch, mtRoom: {applyDetail: { meetingroom }} } = this.props;
    dispatch({
      type: 'mtRoom/queryApplyList',
      payload: {
        meetingroomId: meetingroom.id,
        startDateStr: sdate,
        endDateStr: edate,
      }
    });
  };

  renderMeetingTime = (date) => {
    const { applyVo, disabled } = this.props;
    const { meetingStartTime, meetingEndTime } = this.state;
    let disableList = [], origList = [], columns = [];
    if(date && !disabled){
      disableList = this.getDisabledTimeLine(date);
    }
    if(applyVo && applyVo.applyNo){
      let origStart = this.turnMiniuteToNum(applyVo.startTimeStr, true), origEnd = this.turnMiniuteToNum(applyVo.endTimeStr);
      origList = Array.from({length: origEnd-origStart+1},(v,k)=>origStart+k);
    }
    for(let i=1; i<=48; i++){
      let cls = origList.indexOf(i) > -1 ? 'occupy ' : '';
      cls += disableList.indexOf(i) > -1 ? 'used' : (meetingStartTime<=i && i<=meetingEndTime ? 'selected' : '');
      columns.push(
        <li key={i} className={'item ' + cls} />
      )
    }
    return (
      <ul className={`apply-time${disabled ? '' : ' can-update'}`} onMouseDown={this.onSelApplyTime}>
        {columns}
      </ul>
    )
  };

  getDisabledTimeLine = (date) => {
    const { mtRoom: { applyList, applyDetail: { currentDateTime } } } = this.props;
    const { weekDays, cyclicity } = this.state;
    let disableList = [], disableNum = 0;
    applyList && applyList.length && applyList.map(dateapply => {//已被申请时间段
      if(cyclicity){
        const weekday = ''+moment(dateapply.applyDateStr).day();
        weekDays.indexOf(weekday) > -1 && (disableList = disableList.concat(this.getUsedTimeByDate(dateapply)));
      }else if (dateapply.applyDateStr === date) {
        disableList = this.getUsedTimeByDate(dateapply);
      }
    });
    if (!cyclicity && moment(currentDateTime, "YYYY-MM-DD").valueOf() === moment(date).valueOf()) {//小于当前时间不可选
      disableNum = this.turnMiniuteToNum(currentDateTime.split(" ")[1]);
      disableList = disableList.concat(Array.from({length: disableNum},(v,k)=>k+1))
    }
    return disableList;
  };

  turnMiniuteToNum = (timeStr, isContain) => {
    let mm = timeStr.split(":"), disableNum = parseInt(mm[0])*2;
    if(mm[1]>0){
      disableNum += parseInt(mm[1])>30 ? 2 : 1;
    }
    return isContain ? disableNum+1 : disableNum
  };

  getUsedTimeByDate = (dateapply) => {
    let disableList = [];
    const applyList = dateapply.applyItemVo;
    applyList && applyList.length && applyList.map(apply=>{
      const start = apply.startTimeStr.split(":"), end = apply.endTimeStr.split(":");
      let sNum = start[1] === '30' ? parseInt(start[0])*2+1 : parseInt(start[0])*2,
        eNum = end[1] === '30' ? parseInt(end[0])*2+1 : parseInt(end[0])*2;
      disableList = disableList.concat(Array.from({length: eNum-sNum},(v,k)=>sNum+k+1));
    });
    return disableList;
  };

  onSelApplyTime = (e) => {
    if(this.props.disabled)return;
    const wrapperX = e.currentTarget.getBoundingClientRect().x;
    let target = e.target, add = true, startNum = Math.min(Math.ceil((e.clientX - wrapperX)/17), 48), endNum = null, step = true;
    const { meetingStartTime, meetingEndTime } = this.state;
    if(target.classList.contains("used")) return;
    if(meetingStartTime && meetingEndTime && ((meetingStartTime<startNum && startNum<meetingEndTime) || meetingEndTime+1<startNum || meetingStartTime-1>startNum)) return false;
    if(target.classList.contains("selected")){
      add = false
    }
    const onUpdateSelTime = e => {
      const tar = e.target, isSel = tar.classList.contains("selected"), idx = Math.ceil((e.clientX - wrapperX)/17);
      if(!tar.classList.contains("item") || tar.classList.contains("used")){
        step = false;
      }
      if(step){
        if(add && !isSel){
          endNum = idx;
          tar.classList.add("selected");
        }else if(!add && isSel){
          endNum = idx;
          tar.classList.remove("selected");
        }
        this.updateApplyTime(startNum, endNum, add);
      }
    };
    const onSelTimeEnd = (e) =>{
      if(!endNum)endNum = Math.min(Math.ceil((e.clientX - wrapperX)/17), 48);
      const timeArr = this.updateApplyTime(startNum, endNum, add);
      this.setState({
        meetingStartTime: timeArr[0],
        meetingEndTime: timeArr[1]
      });
      document.removeEventListener("mouseup", onSelTimeEnd, false);
      document.removeEventListener("mousemove", onUpdateSelTime, false);
    };
    document.addEventListener("mouseup", onSelTimeEnd, false);
    document.addEventListener("mousemove", onUpdateSelTime, false);
  };

  updateApplyTime = (startNum, endNum, add) => {
    const { meetingStartTime, meetingEndTime } = this.state;
    if(!startNum || !endNum) return false;
    if(startNum > endNum){
      const temp = startNum;
      startNum = endNum; endNum = temp;
    }
    if(meetingStartTime && meetingEndTime){
      if(add){
        startNum = Math.min(startNum, meetingStartTime);
        endNum = Math.max(endNum, meetingEndTime);
      }else{
        if(startNum === meetingStartTime){
          startNum = endNum + 1;
          endNum = meetingEndTime;
        }else if(endNum === meetingEndTime){
          endNum = startNum-1;
          startNum = meetingStartTime;
        }
        startNum>endNum && (startNum = null, endNum = null);
      }
    }
    this.setState({
      tempSTime: startNum,
      tempETime: endNum,
    });
    return [startNum, endNum]
  };

  onWeekDayChange = values =>{
    this.setState({
      weekDays: values,
    });
  };

  saveApply = () => {
    const { onSave, applyVo, mtRoom: {applyDetail: { meetingroom }}, meetDate, form, dispatch } = this.props;
    const { meetingStartTime, meetingEndTime, weekDays } = this.state;
    if(!meetingStartTime || !meetingEndTime){
      message.error("请选择会议时间"); return false;
    }
    const formData = form.getFieldsValue();
    const saveObj = {
      ...applyVo,
      ...formData,
      meetingroomId: meetingroom.id,
      meetingroomName: meetingroom.name,
    };
    if(formData.applyType === 0){
      saveObj.startDateStr = meetDate;
      saveObj.endDateStr = meetDate;
      saveObj.weekDays = moment(meetDate).day();
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
          onSave && onSave(saveObj);
        }else{
          message.error(res.msg);
        }
      }
    });
  };

  disabledDate = (current) =>{
    const { mtRoom: { applyDetail } } = this.props;
    return current && current < moment(applyDetail.currentDateTime).startOf('day');
  };

  render() {
    const {
      form: { getFieldDecorator },
      mtRoom: { applyList, applyDetail: {
        currentDateTime,
        loginUser,
        meetingroom,
        meetingroomAddr,
      } },
      applyVo = {},
      onCancel,
      visible,
      meetDate,
      disabled,
      loading,
    } = this.props;
    const { cyclicity, weekDays, confirmLoading, tempSTime, tempETime } = this.state;
    const isCyc = disabled ? applyVo.applyType : cyclicity;
    return (
      <Modal
        destroyOnClose={true}
        visible={visible || false}
        title={applyVo.applyNo ? '查看申请' : '申请会议室'}
        width={900}
        footer={disabled ? '' :
          <div>
            <Button loading={confirmLoading} onClick={this.saveApply} type="primary">确定</Button>
            <Button onClick={()=> onCancel && onCancel()}>取消</Button>
          </div>
        }
        onCancel={()=> onCancel && onCancel()}
        loading={loading}
        afterClose={this.clearFormValues}
      >
        <Form layout="inline">
          <Row gutter={{ md: 8, lg: 16}}>
            <Col span={8}>
              <FormItem label="申请人">
                {getFieldDecorator('proposerName', {
                  initialValue: applyVo.applyUser || loginUser.name
                })(
                  <Input disabled={true} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="申请部门">
                {getFieldDecorator('deptName', {
                  initialValue: applyVo.applyDept || loginUser.depName
                })(
                  <Input disabled={true} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="联系电话">
                {getFieldDecorator('mobile', {
                  initialValue: applyVo.mobile || loginUser.mobile
                })(
                  <Input disabled={disabled} />
                )}
              </FormItem>
            </Col>
          </Row>
          <div className="mtroom-apply-container">
            <div className="select-room">
              <span>地点：<b>{meetingroomAddr.address}{meetingroom.name}{meetingroom.needApproval === 1? '（需审批）': ''}</b></span>
              <FormItem>
                {getFieldDecorator('applyType',{
                  initialValue: applyVo.applyType || 0,
                })(
                  <Radio.Group style={{marginLeft: 50}} onChange={this.onApplyTypeChange} disabled={disabled}>
                    <Radio value={0}>单次</Radio>
                    {meetingroom.isCyclicity && meetingroom.isCyclicity === 1 ? <Radio value={1}>周期性</Radio> : ''}
                  </Radio.Group>
                )}
              </FormItem>
            </div>
            {isCyc ? (
              <div>
                <div style={{ lineHeight: '40px'}}>
                  <Col span={17}>
                    日期：
                    <FormItem>
                      {getFieldDecorator('applyDate',{
                        initialValue: [
                          applyVo.startDateStr ? moment(applyVo.startDateStr) : moment(currentDateTime),
                          applyVo.endDateStr ? moment(applyVo.endDateStr) : moment(currentDateTime).add(6,'day')
                        ]
                      })(
                        <DatePicker.RangePicker disabledDate={this.disabledDate} disabled={disabled} />
                      )}
                    </FormItem>
                    {
                      applyVo.startTimeStr ?
                        <span style={{paddingLeft: 20}}>{`${applyVo.startTimeStr} - ${applyVo.endTimeStr}`}</span>
                        : <span style={{paddingLeft: 20}}>{tempSTime && tempETime ? `${Math.floor((tempSTime-1)/2)}:${(tempSTime-1)%2===0 ? '00' : '30'} - ${Math.floor(tempETime/2)}:${tempETime%2===0 ? '00' : '30'}` : ""}</span>
                    }
                  </Col>
                  <Col span={7}>
                    <ul className="tip-list">
                      {applyVo.applyNo && !disabled ? <li className="occupy"><i />原预定</li> : ''}
                      <li className="enable"><i />空闲</li>
                      <li className="used"><i />已预定</li>
                    </ul>
                  </Col>
                </div>
                <Checkbox.Group className="ck-range" onChange={this.onWeekDayChange} defaultValue={applyVo.weekDays ? applyVo.weekDays.split(",") : weekDays} disabled={disabled}>
                  <Checkbox value="1">星期一</Checkbox>
                  <Checkbox value="2">星期二</Checkbox>
                  <Checkbox value="3">星期三</Checkbox>
                  <Checkbox value="4">星期四</Checkbox>
                  <Checkbox value="5">星期五</Checkbox>
                  <Checkbox value="6">星期六</Checkbox>
                  <Checkbox value="7">星期日</Checkbox>
                </Checkbox.Group>
              </div>
            ) : (
              <Row style={{ lineHeight: '40px'}}>
                <Col span={17}>
                  日期：{applyVo.startDateStr || meetDate}
                  {
                    applyVo.startTimeStr ?
                      <span style={{paddingLeft: 20}}>{`${applyVo.startTimeStr} - ${applyVo.endTimeStr}`}</span>
                      : <span style={{paddingLeft: 20}}>{tempSTime && tempETime ? `${Math.floor((tempSTime-1)/2)}:${(tempSTime-1)%2===0 ? '00' : '30'} - ${Math.floor(tempETime/2)}:${tempETime%2===0 ? '00' : '30'}` : ""}</span>
                  }
                  </Col>
                <Col span={7}>
                  <ul className="tip-list">
                    {applyVo.applyNo && !disabled ? <li className="occupy"><i />原预定</li> : ''}
                    <li className="enable"><i />空闲</li>
                    <li className="used"><i />已预定</li>
                  </ul>
                </Col>
              </Row>
            )}
            <div>
              <ul className="apply-time-title">
                <li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>10</li><li>11</li><li>12</li>
                <li>13</li><li>14</li><li>15</li><li>16</li><li>17</li><li>18</li><li>19</li><li>20</li><li>21</li><li>22</li><li>23</li><li>24</li>
              </ul>
              {this.renderMeetingTime(applyVo.startDateStr || meetDate)}
            </div>
            <div>
              <div>用途与备注</div>
              <FormItem style={{ width: '100%' }} wrapperCol={{span: 24}}>
                {getFieldDecorator('remark',{
                  initialValue: applyVo.remark
                })(
                  <Input.TextArea disabled={disabled} rows={5} />
                )}
              </FormItem>
            </div>
          </div>
        </Form>
      </Modal>
    )
  }
}
