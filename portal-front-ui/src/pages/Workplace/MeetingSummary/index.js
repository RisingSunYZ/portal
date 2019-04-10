import React, { Component, PureComponent, Fragment } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState ,convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { connect } from 'dva';
import { Row, Col,Form, Button,Input } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less'
import Plupload from "@/components/Plupload";


const FormItem = Form.Item;

@connect(({ meetingRoom, loading }) => ({
  meetingRoom,
  loading: loading.models.meetingRoom,
}))

@Form.create()
export default class MeetingSummary extends PureComponent {

  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  // 加载会议页面内容
  componentDidMount(){
    const { dispatch ,match } =this.props;
    // 加载 会议纪要和附件 数据
    dispatch({
      type: 'meetingRoom/getSummaryMeetingData',
      payload:{ id: match.params.id }
    })
  }

  // 保存会议纪要和上传的文件
  saveUpload = ()=>{
    const { dispatch ,form ,match,meetingRoom:{ meetingFileList } }=this.props;
    form.validateFields((err, fieldsValue)=>{
      if(err) return;
      console.log(fieldsValue);
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
        delete fieldsValue.meetingSummaryFiles
      }
      // debugger;
      dispatch({
        type: 'meetingRoom/saveUploadSummary',
        payload:{...fieldsValue},
        callback:res=>{
          if(res.code=='100'){
            window.location.href='/workplace/meeting-room/'+ match.params.tab
          }
        }
      })

    })
  };

  render() {
    const {
      meetingRoom: { meetingSummary, meetingFileList },
      files,
      loading,
      match,
      dispatch,
      form,
    } = this.props;
    const {  editorState }=this.state;
console.log(meetingSummary);
console.log(meetingSummary.meetingId)
    // 上传组件相关属性配置
    const mime_types = [
      { title: 'Image files', extensions: 'png,jpg,jpeg,image/jpg,image/jpeg,image/png' },
      { title: 'Office files', extensions: 'pdf,txt,doc,docx,ppt,pptx,xls,xlsx' },
      { title: 'Zip files', extensions: 'zip,rar' },
      { title: 'Cad files', extensions: 'dwg' },
    ];

    return (
      <PageHeaderWrapper>
        <div style={{background: '#fff'}}>
          <div className={styles.meetingTitle}>
            <span className={styles.titleSpan}>会议纪要</span>
          </div>
          <Form layout="inline" hideRequiredMark className={styles.form}>
            <Row className={styles.rows}>
              <Col span={24}>
                <FormItem label='id' colon={false} style={{display:'none'}} >
                  {form.getFieldDecorator('meetingId', {
                    initialValue: meetingSummary.meetingId,
                  })
                  (<Input type={'hidden'} style={{width:"100%"}} placeholder="请输入" />)}
                </FormItem>
                <Form.Item label='会议内容' colon={false} labelCol={{ span: 2 }} wrapperCol={{ span:22 }}>
                  {form.getFieldDecorator('content', {
                    initialValue: draftToHtml(convertToRaw(editorState.getCurrentContent())).slice(3,-5),
                  })(
                    <div style={{width:1100,height:600}}>
                      <Editor
                        editorState={editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={this.onEditorStateChange}
                      />
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{marginLeft:61,top: -46}}>
              <Col span={6}>
                <Form.Item>
                  {form.getFieldDecorator('meetingSummaryFiles', {
                    initialValue:meetingSummary.fileName
                  })(
                    <Plupload url={"/rest/portal/rscmgmt/meeting/uploadImage"} saveDataCall={"meetingRoom/addFiles"} idName={"summaryBtn"} mime_types={mime_types}>上传文件</Plupload>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={styles.rows} style={{left:'550px'}}>
              <Col span={3}>
                <Button type="primary" onClick={this.saveUpload}>保存</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </PageHeaderWrapper>
    )
  }
}
