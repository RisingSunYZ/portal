import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col, Card, Modal,Form,Upload,Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState ,convertToRaw} from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {message} from "antd/lib/index";


const { Meta } = Card;
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
    const {dispatch} =this.props;

    // 加载 我的邀请会议 数据
    dispatch({
      type: 'meetingRoom/getMyInviteData',
      payload:{}
    })
  }

  // 保存会议纪要和上传的文件
  saveUpload = ()=>{
    const { dispatch ,form }=this.props;
    form.validateFields((err, fieldsValue)=>{
      if(err) return;
      console.log(fieldsValue);
      dispatch({
        type: 'meetingRoom/getUploadSummary',
        payload:{...fieldsValue}
      })
    })

  }




  render() {
    const {
      meetingRoom: { draftData: { listDraft } },
      files,
      loading,
      match,
      dispatch,
      form,
    } = this.props;
    const {  editorState }=this.state;

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

    return (
      <PageHeaderWrapper>
        <div style={{background: '#fff'}}>
          <div className={styles.meetingTitle}>
            <span className={styles.titleSpan}>会议纪要</span>
          </div>
          <Form layout="inline" hideRequiredMark className={styles.form}>
            <Row className={styles.rows}>
              <Col span={24}>
                <FormItem label='会议内容' colon={false} labelCol={{ span: 2 }} wrapperCol={{ span:22 }}>
                  {form.getFieldDecorator('content', {
                    // initialValue: meeting.content,
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
                    initialValue:files
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
