import React, { Component, PureComponent, Fragment } from 'react';
import Editor from 'react-umeditor';
import { connect } from 'dva';
import {  Form, Row, Col, DatePicker, TimePicker, Button, Input ,message } from 'antd';
import { UserSelect } from '@/components/Selector';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { simpleFormatTime} from '@/utils/utils';
import FileList from '@/components/FileList';
import Plupload from "@/components/Plupload";
import moment from 'moment';
import styles from './index.less';

const FormItem = Form.Item;


@connect(({ user, meetingRoom, loading }) => ({
  user,
  meetingRoom,
  loading: loading.models.user,
}))

@Form.create()
export default class MeetingInput extends PureComponent {
  state = {
    selectedKey: '',
    content: "",
    cardType:1
  };

  handleChange=(content)=>{
    this.setState({
      content: content
    })
  };

  getIcons=()=>{
    var icons = [
      "source | undo redo | bold italic underline strikethrough fontborder emphasis | ",
      "paragraph fontfamily fontsize | superscript subscript | ",
      "forecolor backcolor | removeformat | insertorderedlist insertunorderedlist | selectall | ",
      "cleardoc  | indent outdent | justifyleft justifycenter justifyright | touppercase tolowercase | ",
      "horizontal date time  | image emotion spechars | inserttable"
    ]
    return icons;
  };

  getPlugins=()=>{
    return {
      "toolbar":{
        "icons":[
          {
            name:'test',
            title:'aaaaaaaaaaaaaaaaaaaaaaaaaaa'
          }
        ]
      },
      "image": {
        "uploader": {
          "name":"file",
          "url": "/api/upload"
        }
      }
    }
  };

  componentDidMount(){
    const {dispatch, match }=this.props;
    if(match.params.meetId != ":meetId" && match.params.meetId != undefined){
      dispatch({
        type:'meetingRoom/loadInput',
        payload:{
          id:match.params.meetId
        }
      })
    }
  }

  selectCallback = datas => {
    const { setFieldsValue } = this.props.form;
    this.setState({ selectedPersons: datas });
    if(datas.length>0){
      setFieldsValue({ creatorName: datas[0].name });
    }
  };


  // 页面底部按钮(发送邀请 ,保存草稿)的公共方法
  commonMethod=(fieldsValue)=>{
    const { meetingRoom:{meetingFileList,meeting},user:{currentUser} }=this.props;
    // 格式化 必选人员
    let mandaPer = fieldsValue.mandatoryPersonList;
    let str="";
    let mandaNo = "";
    for(let i=0; i<mandaPer.length;i++){
      str += mandaPer[i].name+ ',';
      mandaNo+=mandaPer[i].no+ ',';
    }
    if(str.length>0) str=str.substr(0,str.length-1);
    if(mandaNo.length>0) mandaNo=mandaNo.substr(0,mandaNo.length-1);
    fieldsValue.mandatoryPersonName=str;
    fieldsValue.mandatoryPersonNo = mandaNo;

    // 格式化 可选人员
    let optionPer=fieldsValue.optionalPersonList;
    let str0="";
    let optionNo = "";
    if(fieldsValue.optionalPersonList){
      for(let i=0; i<optionPer.length;i++){
        str0 += optionPer[i].name + ',';
        optionNo+= optionPer[i].no+","
      }
    }
    if(str0.length>0) str0=str0.substr(0,str0.length-1);
    if(optionNo.length>0) optionNo=optionNo.substr(0,optionNo.length-1);
    fieldsValue.optionalPersonName =str0;
    fieldsValue.optionalPersonNo = optionNo;

    // 格式化 记录人
    let recordPer =fieldsValue.recordPersonName;
    let str1="";
    let recordNo="";
    if(fieldsValue.recordPersonName){
        str1+= recordPer[0].name = currentUser.name;
        recordNo+=recordPer[0].no = currentUser.no;
    }
    fieldsValue.recordPersonName=str1;
    fieldsValue.recordPersonNo = recordNo;

    fieldsValue.meetingTime = moment(fieldsValue.meetingTime).format('YYYY-MM-DD');
    if(fieldsValue.meetingTime ==="Invalid date") fieldsValue.meetingTime="";
    fieldsValue.start = moment(fieldsValue.start).format('HH:mm');
    if(fieldsValue.start === "Invalid date") fieldsValue.start= "";
    fieldsValue.end = moment(fieldsValue.end).format('HH:mm');
    if(fieldsValue.end === "Invalid date") fieldsValue.end= "";


    //  给表单添加 fileName，filePath
    let fileName="",filePath="";
    if (meetingFileList) {
      for (let i = 0; i < meetingFileList.length; i++) {
        filePath += meetingFileList[i].filePath+ ';';
        fileName += meetingFileList[i].name+ ';'+ ' ';
      }
      if(filePath.length>0) filePath=filePath.substr(0,filePath.length-1);
      if(fileName.length>0) fileName=fileName.substr(0,fileName.length-1);
      fieldsValue.filePath=filePath;
      fieldsValue.fileName=fileName;
      delete fieldsValue.meetingFiles
    }
    if(this.state.content === ""){
      // fieldsValue.content = meeting.content;
      fieldsValue.content = meeting.content;
    }else{
      fieldsValue.content = this.state.content
    }
  };

  // 发送更新
  sendUpdate=()=>{
    const { dispatch ,form, match }=this.props;
    form.validateFields((err, fieldsValue)=>{
      if(err) return;
      // 调用公共方法
      this.commonMethod(fieldsValue);
      dispatch({
        type:'meetingRoom/sendInvites',
        payload:{...fieldsValue},
        callback: res=>{
          if(res.code === '100'){
            window.location.href='/eip/workplace/meeting-room/'+ match.params.tab
          }
        }
      })
    })
  };
 // 发送邀请-按钮
  sendInvite =() =>{
    const {dispatch ,form }=this.props;
    form.validateFields((err, fieldsValue)=>{
      if(err) return;
      if(fieldsValue.theme === undefined || fieldsValue.mandatoryPersonName === "" || fieldsValue.meetingroomName === undefined){
        message.error("会议主题、 必选人员 、会议室不能为空 ！");
        return;
      }

      // 调用公共方法
      this.commonMethod(fieldsValue);
      dispatch({
        type:'meetingRoom/sendInvites',
        payload:{...fieldsValue },
        callback: res => {
          if (res.code === '100') {
            form.resetFields();
            window.location.href = '/workplace/meeting-room/1'
          }
        },
      });
    })
  };

  // 新建会议(或 点击 编辑)-按钮-保存草稿
  saveDraft=()=>{
    const { dispatch ,form }= this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if(fieldsValue.theme === undefined){
        message.error("会议主题不能为空！");
        return;
      }
      // 调用公共方法
      this.commonMethod(fieldsValue);

      dispatch({
        type:'meetingRoom/saveDrafts',
        payload:{...fieldsValue},
        callback: res => {
          if (res.code === '100') {
            // form.resetFields();
            window.location.href = '/workplace/meeting-room/4'
          }
        },
      });
    });
  };

  render() {
    const {
      meetingRoom: { meeting, mandatoryPersonList, optionalPersonList, meetingFileList },
      user:{currentUser},
      form,
      match
    } = this.props;
console.log(meeting);
    const tab = match.params.tab ? match.params.tab:tab;

    // 上传组件相关属性配置
    const mime_types = [
      { title: 'Image files', extensions: 'png,jpg,jpeg,image/jpg,image/jpeg,image/png' },
      { title: 'Office files', extensions: 'pdf,txt,doc,docx,ppt,pptx,xls,xlsx' },
      { title: 'Zip files', extensions: 'zip,rar' },
      { title: 'Cad files', extensions: 'dwg' },
    ];

    const icons = this.getIcons();
    const plugins = this.getPlugins();
    const format = 'HH:mm';

    return (
      <PageHeaderWrapper>
        <div style={{background: '#fff'}}>
          <div className={styles.meetingTitle}>
            <span className={styles.titleSpan}>新建会议</span>
          </div>
          <Form layout="inline" hideRequiredMark className={styles.form}>
            <Row className={styles.rows}>
              <Col span={24}>
                <FormItem label='id' colon={false} style={{display:'none'}} >
                  {form.getFieldDecorator('id', {
                    initialValue: meeting.id ? meeting.id:"",
                  })
                  (<Input type={'hidden'} style={{width:"100%"}} placeholder="请输入" />)}
                </FormItem>
                <FormItem label='status' colon={false} style={{display:'none'}} >
                  {form.getFieldDecorator('status', {
                    initialValue: 1,
                  })
                  (<Input type={'hidden'} style={{width:"100%"}}  placeholder="请输入" />)}
                </FormItem>
                <FormItem label='必选人员' colon={false}>
                  {form.getFieldDecorator('mandatoryPersonList', {
                    initialValue: mandatoryPersonList,
                  })(<UserSelect
                    required={true}
                    type="input"
                    width='1080px'
                    onChange={(a)=>{this.selectCallback(a)}}
                  />)}
                </FormItem>
                <FormItem label='必选人员工号' colon={false} style={{display:'none'}}>
                  {form.getFieldDecorator('mandatoryPersonNo', {
                    initialValue: meeting.mandatoryPersonNo ,
                  })
                  (<Input type={'hidden'} style={{width:"100%"}} placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.rows}>
              <Col span={24}>
                <FormItem label='可选人员' colon={false}>
                  {form.getFieldDecorator('optionalPersonList', {
                    initialValue: optionalPersonList,
                  })
                  (<UserSelect
                    type="input"
                    width='1080px'
                    onChange={(a)=>{this.selectCallback(a)}}
                  />)}
                </FormItem>
                <FormItem label='可选人员工号' colon={false} style={{display:'none'}}>
                  {form.getFieldDecorator('optionalPersonNo', {
                    initialValue: meeting.optionalPersonNo,
                  })
                  (<Input type={'hidden'} style={{width:"100%"}} placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.rows}>
              <Col span={24}>
                <FormItem label='会议主题' colon={false}>
                  {form.getFieldDecorator('theme', {
                    initialValue: meeting.theme,
                  })(<Input placeholder="请输入会议主题" style={{width: '1081px'}}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.rows}>
              <Col span={12}>
                <FormItem label='会议室' colon={false} labelCol={{ span: 4 }} wrapperCol={{ span:16 }}>
                  {form.getFieldDecorator('meetingroomName', {
                    initialValue: meeting.meetingroomName,
                  })(<Input placeholder="请输入会议室" style={{width: '400px'}}/>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label='记录人' colon={false}>
                  {form.getFieldDecorator('recordPersonName', {
                    initialValue: [{name:meeting.recordPersonName=currentUser.name,no:meeting.recordPersonNo=currentUser.no}],
                  })
                  (<UserSelect
                    type="input"
                    multiple={false}
                    width='508px'
                    onChange={(a)=>{this.selectCallback(a)}}
                  />)}
                </FormItem>
                <FormItem label='记录人员工号' colon={false} style={{display:'none'}}>
                  {form.getFieldDecorator('recordPersonNo', {
                    initialValue: meeting.recordPersonNo ,
                  })
                  (<Input type={'hidden'} style={{width:"100%"}} placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.rows}>
              <Col span={6}>
                <FormItem label="会议时间" colon={false}>
                  {form.getFieldDecorator('meetingTime', {
                    initialValue: moment(meeting.meetingTime),
                  })(
                    <DatePicker format="YYYY-MM-DD" style={{width: '185px'}}/>
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {form.getFieldDecorator('start', {
                    // initialValue:moment(meeting.start,format)
                    initialValue:moment("10:30",format)
                  })(
                    <TimePicker format={format} placeholder="请选择开始时间" style={{width: '185px'}}/>
                  )}
                </FormItem>
              </Col>
              <Col span={1}>
                <span style={{lineHeight:"38px",position:'relative',left:'23px'}}>～</span>
              </Col>
              <Col span={5}>
                <FormItem>
                  {form.getFieldDecorator('end', {
                    initialValue:moment("11:30",format)
                  })(
                    <TimePicker format={format} placeholder="请选择结束时间" style={{width: '185px'}} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.rows}>
              <Col span={24}>
                <FormItem label='会议内容' colon={false} labelCol={{ span: 2 }} wrapperCol={{ span:22 }} style={{width:'99%'}}>
                      <Editor
                        ref="editor"
                        icons={icons}
                        value={this.state.content=="" ? meeting.content:this.state.content}
                        defaultValue="<p>请输入内容</p>"
                        onChange={this.handleChange.bind(this)}
                        plugins={plugins} />
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginLeft:61,top: -20 }}>
              <Col span={6}>
                <Form.Item>
                  {form.getFieldDecorator('meetingFiles', {
                    initialValue:meeting.meetingFiles
                  })(
                    <div>
                      <Plupload saveDataCall={"meetingRoom/addFiles"} idName={"meetingBtn"} mime_types={mime_types}>上传文件</Plupload>
                      <FileList files={meetingFileList} />
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {((tab == 1 || tab == 2) && match.params.meetId != ':meetId') ? (
              <Row className={styles.rows} style={{left:'535px'}}>
                <Col span={3}>
                  <Button type="primary" onClick={this.sendUpdate}>发送更新</Button>
                </Col>
              </Row>
            ):(
              <Row className={styles.rows} style={{left:'414px'}}>
                <Col span={3}>
                  <Button type="primary" onClick={this.sendInvite}>发送邀请</Button>
                </Col>
                <Col span={3}>
                  <Button onClick={this.saveDraft}>保存草稿</Button>
                </Col>
              </Row>
            )}
          </Form>
        </div>
      </PageHeaderWrapper>
    )
  }
}
