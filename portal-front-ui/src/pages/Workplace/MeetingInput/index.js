import React, { Component, PureComponent, Fragment } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState ,convertToRaw} from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { connect } from 'dva';
import { Tabs, Form, Row, Col, Upload, message, Icon, DatePicker, TimePicker,Select, Button, Input, Card, Modal } from 'antd';
import { UserSelect } from '../../../components/Selector';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import { simpleFormatTime} from '../../../utils/utils';
import FileList from '../../../components/FileList';
import Link from 'umi/link';
import moment from 'moment';
import styles from './index.less'


const TabPane = Tabs.TabPane;
const Search = Input.Search;
const { Meta } = Card;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;


@connect(({ meetingRoom, loading }) => ({
  meetingRoom,
  loading: loading.models.meetingRoom,
}))

@Form.create()
export default class MeetingInput extends PureComponent {
  searchFormObj = {};


  state = {
    selectedKey: '',
    visible:false,
    editorState: EditorState.createEmpty(),
    ModalTextSave:'会议主题不能为空！'
  };

  componentDidMount(){
    const {dispatch, match, form }=this.props;
    // debugger
    if(match.params.meetId!="" && match.params.meetId!=undefined){
      dispatch({
        type:'meetingRoom/loadInput',
        payload:{
          id:match.params.meetId
        }
      })
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  doSearch(modelName) {
    this.searchFormObj.name = modelName;
    //如果右侧点击我的草稿，则搜索我的草稿，其他则搜索全部流程模板，
    this.props.dispatch({
      type: 'meetingRoom/getModelList',
      payload: {
        name: modelName,
        categoryId: this.state.selectedKey == 'myDraft' ? this.state.selectedKey : '',
      },
    });
  }

  handleDel(businessKey) {
    this.props.dispatch({
      type: 'meetingRoom/delDraft',
      payload: {
        businessKey: businessKey,
      },
    });
  }

  selectCallback = datas => {
    const { setFieldsValue } = this.props.form;
    this.setState({ selectedPersons: datas });
    if(datas.length>0){
      setFieldsValue({ creatorName: datas[0].name });
    }
  };


  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  // 页面底部按钮(发送邀请 ,保存草稿)的公共方法
  commonMethod=(fieldsValue)=>{
    // 格式化 必选人员
    let mandaPer=fieldsValue.mandatoryPersonList;
    let str="";
    let mandaNo = "";
    for(let i=0; i<mandaPer.length;i++){
      str += mandaPer[i].name+ ',';
      mandaNo+=mandaPer[i].no+ ',';
    }
    if(str.length>0) str=str.substr(0,str.length-1);
    if(mandaNo.length>0) mandaNo=mandaNo.substr(0,mandaNo.length-1)
    fieldsValue.mandatoryPersonName=str;
    fieldsValue.mandatoryPersonNo = mandaNo

    // 格式化 可选人员
    let optionPer=fieldsValue.optionalPersonList;
    let str0="";
    let optionNo = "";
    if(fieldsValue.optionalPersonList){
      for(let i=0; i<optionPer.length;i++){
        str0 += optionPer[i].name + ",";
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
        str1+= recordPer[0].name;
        recordNo+=recordPer[0].no;
    }
    fieldsValue.recordPersonName=str1;
    fieldsValue.recordPersonNo = recordNo;

    console.log(fieldsValue);
    console.log(6666666666666);
    fieldsValue.meetingTime = moment(fieldsValue.meetingTime).format('YYYY-MM-DD');
    if(fieldsValue.meetingTime ==="Invalid date") fieldsValue.meetingTime="";
    fieldsValue.start = moment(fieldsValue.start).format('HH:mm');
    if(fieldsValue.start === "Invalid date") fieldsValue.start= "";
    fieldsValue.end = moment(fieldsValue.end).format('HH:mm');
    if(fieldsValue.end === "Invalid date") fieldsValue.end= "";

    //  给表单添加 fileName，filePath
    let fileName="",filePath="";
    if (files) {
      for (let i = 0; i < files.length; i++) {
        fileName = files[i].response.fileName;
        filePath = files[i].response.url;
      }
      fieldsValue.filePath=filePath;
      fieldsValue.fileName=fileName;
      delete fieldsValue[files]
    }
  }


 // 发送邀请-按钮
  sendInvite =() =>{
    const {dispatch ,form, meetingRoom:{files}  }=this.props;
    form.validateFields((err, fieldsValue)=>{
      console.log(fieldsValue)
      if(err) return;
     // debugger;
      if(fieldsValue.theme==undefined || fieldsValue.mandatoryPersonName=="" || fieldsValue.meetingroomName==undefined){
        //点击显示 弹出框
        this.setState({
          visible: true,
          ModalTextSave:'会议主题、 必选人员 、会议室不能为空 ！'
        });

        //间隔一段时间，让弹出框消失
        setTimeout(() => {
          this.setState({
            visible: false,
          });
        }, 500);
        return;
      }

      // 调用公共方法
      this.commonMethod(fieldsValue);

      dispatch({

        type:'meetingRoom/sendInvites',
        payload:{...fieldsValue },
        callback: res => {
          if (res.code == '100') {
            form.resetFields();
            window.location.href = '/workplace/meeting-room/1'
          }
        },
      });
    })
  };

  // 新建会议(或 点击 编辑)-按钮-保存草稿
  saveDraft=()=>{
    const {dispatch ,form}=this.props;
    form.validateFields((err, fieldsValue) => {
      // debugger
      if (err) return;
      if(fieldsValue.theme==undefined){
        //点击显示 弹出框
        this.setState({
          visible: true,
          ModalTextSave:'会议主题不能为空！'
        });
        //间隔一段时间，让弹出框消失
        setTimeout(() => {
          this.setState({
            visible: false,
          });
        }, 500);
        return;
      }
      // console.log(fieldsValue);

      // 调用公共方法
      this.commonMethod(fieldsValue);

      dispatch({
        type:'meetingRoom/saveDrafts',
        payload:{...fieldsValue},
        callback: res => {
          // debugger
          if (res.code == '100') {
            // form.resetFields();
            window.location.href = '/workplace/meeting-room/4'
          }
        },
      });
    });
  };

  render() {
    const {
      meetingRoom: { list, data ,meeting,mandatoryPersonList,optionalPersonList ,files},
      loading,
      dispatch,
      form,
    } = this.props;
    console.log(meeting);
    console.log(88888888888);
    const { visible, editorState, ModalTextSave  }=this.state;


    // 上传组件相关属性配置
    const uploadProps = {
      name: 'file',
      action: '/rest/portal/rscmgmt/meeting/uploadImage',
      multiple: true,
      accept: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.pdf,image/jpg,image/jpeg,image/png,image/bmp',
      showUploadList: true,
      onChange(info) {

        if (info.file.status !== 'uploading') {
          dispatch({
            type: 'meetingRoom/addFiles',
            payload: info.file,
          });
        }
        if (info.file.status === 'done' && info.file.response && info.file.response.error == 0 ) {
          message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error' || (info.file.response &&info.file.response.error == 1)) {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
      defaultFileList: files,
    };
    // console.log(2222222);
    // console.log(meeting);
    console.log(mandatoryPersonList)


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
                    initialValue: [{name:meeting.recordPersonName,no:meeting.recordPersonNo}],
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
                    initialValue:moment('13:20','HH:mm')
                    // initialValue:(meeting.start==null || meeting.start=="" || meeting.start=='Invalid date')?"":moment(simpleFormatTime(meeting.start),'HH:mm')
                  })(
                    <TimePicker format="HH:mm" placeholder="请选择开始时间" style={{width: '185px'}}/>
                  )}
                </FormItem>
              </Col>
              <Col span={1}>
                <span style={{lineHeight:"38px",position:'relative',left:'23px'}}>～</span>
              </Col>
              <Col span={5}>
                <FormItem>
                  {form.getFieldDecorator('end', {
                    initialValue:moment('16:30','HH:mm')
                    // initialValue:(meeting.end==null || meeting.end=="" || meeting.end=='Invalid date') ? "" : moment(simpleFormatTime(meeting.end),'HH:mm')
                  })(
                    <TimePicker format="HH:mm" placeholder="请选择结束时间" style={{width: '185px'}} />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row className={styles.rows}>
              <Col span={24}>
                <FormItem label='会议内容' colon={false} labelCol={{ span: 2 }} wrapperCol={{ span:22 }}>
                  {form.getFieldDecorator('content', {
                    initialValue: meeting.content,
                  })(
                    <div style={{width:1100,height:600}}>
                      <Editor
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={this.onEditorStateChange}
                      />
                      {/*<textarea value={draftToHtml(convertToRaw(editorState.getCurrentContent()))} style={{width:1084}}/>*/}
                    </div>
                    )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{marginLeft:61,top: -46}}>
              <Col span={6}>
                <Form.Item>
                  {form.getFieldDecorator('files', {
                    // initialValue:files
                  })(
                    <Upload {...uploadProps}>
                      <Button>
                        <Icon type="upload" />上传文件
                      </Button>
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles.rows} style={{left:'414px'}}>
              <Col span={3}>
                <Button type="primary" onClick={this.sendInvite}>发送邀请</Button>
              </Col>
              <Col span={3}>
                <Button onClick={this.saveDraft}>保存草稿</Button>
                <Modal
                  visible={visible}
                  footer={null}
                  closable={false}
                  centered
                  bodyStyle={{backgroundColor:'#5C5C5C',color:'#fff',textAlign:'center'}}
                  maskStyle={{backgroundColor:'#E6E6E6'}}>
                  <p>{ModalTextSave}</p>
                </Modal>
              </Col>
            </Row>
          </Form>
        </div>
      </PageHeaderWrapper>
    )
  }
}
