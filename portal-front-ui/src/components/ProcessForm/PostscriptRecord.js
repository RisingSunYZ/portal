import React, { Component, Fragment } from 'react';
import styles from './index.less';
import { Card, Timeline, Icon, Button, Input, Upload, Collapse  } from 'antd';
import config from '../Exception/typeConfig';
import classNames from 'classnames';
import Plupload from "@/components/Plupload";
import { message } from 'antd/lib/index';
import PostscriptList from './PostscriptList';
import { connect } from 'dva/index';
// import conf from '../../config';
import PostscriptRecordFileList from './PostscriptRecordFileList';
import {getConfig} from "../../utils/utils";

const Panel = Collapse.Panel;
const { TextArea } = Input;
@connect(({ user,processForm, loading }) => ({
  user,processForm,
  loading: loading.models.processForm,
}))
export default class PostscriptRecord extends Component {
  state = {
    desc: '',
    showPost:'',
  };

  conmitPostscript() {
    if (this.state.desc == '') {
      message.warning(`请输入附言内容`);
      return;
    }
    this.props.dispatch({
      type: 'processForm/insertAttachMsg',
      payload: {
        attachMsg: encodeURIComponent(this.state.desc),
        processInstId: this.props.proInstId,
        bizId: this.props.processForm.formInfo.bizId,
        attachMsgAttAdd: encodeURIComponent(JSON.stringify(this.props.processForm.formInfo.postscriptsFiles)),
      },
    });
    this.state.desc = '';
  }

  componentWillReceiveProps(nextProps){


    const _this = this;

    setTimeout(function(){

      if((_this.props.processForm.formInfo.attachMsg && _this.props.processForm.formInfo.attachMsg!= '') ||
        (_this.props.processForm.formInfo.postscriptsFiles && _this.props.processForm.formInfo.postscriptsFiles.length > 0 )){
        return ;
      }

      // if(this.props.processForm.formInfo.postscripts.length > 0){
      //   this.setState({showPost:0});
      // }else{
      //   this.setState({showPost:1});
      // }

      _this.setState({
        showPost:nextProps.showPost
      })

    },1000)



  }

  changeKey(e){
      if(this.state.showPost>0){
        this.setState({showPost:0});
      }else{
        this.setState({showPost:1});
      }
  }

  render() {
    const { user ,processForm, processForm: { formInfo }, postscripts, proInstId, dispatch,showPost } = this.props;

    let fileLists = processForm.formInfo.postscriptsFiles;
    if (fileLists) {
      for (let i = 0; i < fileLists.length; i++) {
        fileLists[i].uid = fileLists[i].id;
        fileLists[i] = {
          uid: fileLists[i].id,
          fileName: fileLists[i].fileName,
          status: 'done',
          response: 'Server Error 500', // custom error message to show
          fileUrl: fileLists[i].fileUrl,
          ...fileLists[i],
        };
      }
    }

    // 上传组件相关属性配置
    const mime_types = [
      { title: 'Image files', extensions: 'png,jpg,jpeg,image/jpg,image/jpeg,image/png' },
      { title: 'Office files', extensions: 'pdf,txt,doc,docx,ppt,pptx,xls,xlsx' },
      { title: 'Zip files', extensions: 'zip,rar' },
      { title: 'Cad files', extensions: 'dwg' },
      { title: 'Msg files', extensions: 'msg' }
    ];

    return (
      <Collapse onChange={this.changeKey.bind(this)} className={[styles.collapse,styles.fuyan]}  style={{ border:'none',marginBottom: 8 }} activeKey={ this.state.showPost >0 ? [ '1' ]: ['']}>
        <Panel header={<Fragment>提交者附言（共{postscripts.length}条）</Fragment>} key="1" style={{ background:'#fff' }}>
          <div style={{display:user.currentUser.name === formInfo.userInfo.name || proInstId === '0' ? "" : "none"}}>
            <h4 style={{ display: this.props.print > 0 ? 'none' : '' }}>说明</h4>
            <TextArea
              style={{ display: this.props.print > 0 ? 'none' : '' }}
              placeholder="请输入附言!"
              value={this.state.desc}
              onChange={e => {
                this.setState({ desc: e.target.value });
                this.props.dispatch({
                  type: 'processForm/updateAttachMsg',
                  payload: {
                    attachMsg: e.target.value,
                  },
                });
              }}
              autosize={{ minRows: 2, maxRows: 6 }}
            />

            <div style={{ display: this.props.print > 0  ? 'none' : '',marginTop: '24px' }}>
              <Plupload saveDataCall={"processForm/addPostScriptsFiles"} idName={"addPostBtn"} mime_types={mime_types}>上传附件</Plupload>
            </div>
            <div style={{ display: this.props.print > 0 ? 'none' : '',color:'rgba(0, 0, 0, .45)', margin:'16px 0' }}>
              支持扩展名：.rar .zip .doc .docx .pdf .jpg...
            </div>
            <PostscriptRecordFileList postscriptsFiles={formInfo.postscriptsFiles} />
            {proInstId == '0' ? (
              ''
            ) : (
              <Button
                style={{
                  display: this.props.print > 0 ? 'none' : '',
                  width: '100%',
                  marginBottom: 8,
                }}
                type="dashed"
                icon="plus"
                onClick={this.conmitPostscript.bind(this)}
              >
                发布
              </Button>
            )}
          </div>
          <div
            style={{
              display:proInstId !== '0' && postscripts.length <= 0 && user.currentUser.name !== formInfo.userInfo.name ? 'block' : 'none',
              color: 'rgba(0, 0, 0, .25)',
              textAlign: 'center',
              fontSize: '14px',
              lineHeight: '24px',
            }}
          >
            <Icon style={{ fontSize: '20px', verticalAlign:'text-bottom'}} type="frown-o" />{' '}
            <span>暂无附言记录</span>
          </div>
          <PostscriptList postscripts={postscripts} />
        </Panel>
      </Collapse>
    );
  }
}
