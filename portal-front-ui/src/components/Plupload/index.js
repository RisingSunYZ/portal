import React, { PureComponent } from 'react';
import { Button, Icon,Row,Col, Modal, Popover, message } from 'antd';
import plupload from 'plupload';
import { connect } from 'dva';

/**
 * 上传组件
 */

@connect(({ processForm, loading }) => ({
  processForm,
  loading: loading.models.processForm,
}))

export default class Plupload extends PureComponent{

  /**
   * 上传组件属性 icon mime_types可不必传 children 为双标签内文本或dom元素
   */
  state = {
    url: "",
    icon:"",
    children:"",
    saveDataCall:"",
    idName:"",
    mime_types:[],
    plUploader:null
  };

  componentDidMount() {
    this.initPlUploader()
    const idName = this.props.idName;

    // 解决 plUploader 初始化多次生成多个 plUploader元素的bug
    setTimeout(() => {
      if($("#"+idName+"").siblings().length>1){
        const Dom = $("#"+idName+"").siblings()[0];
        $("#"+idName+"").siblings(".moxie-shim").remove();
        $("#"+idName+"").parent().append(Dom);
      }
    }, 1000)

  }

  componentWillUnmount(){
    this.plUploader.destroy()
  }

  initPlUploader=()=> {

    const _this = this;

    const default_mime_types = [
      { title: 'Image files', extensions: 'gif,png,jpg,jpeg,image/jpg,image/jpeg,image/png' },
      { title: 'Office files', extensions: 'pdf,txt,doc,docx,ppt,pptx,xls,xlsx' },
      { title: 'Zip files', extensions: 'zip,rar' },
      { title: 'Cad files', extensions: 'dwg' },
      { title: 'Msg files', extensions: 'msg' }
    ];
    const mime_types =this.props.mime_types?this.props.mime_types:default_mime_types;

      setTimeout(function(){

        _this.plUploader = new plupload.Uploader({
          runtimes: 'html5,flash,silverlight,html4',
          browse_button: _this.props.idName,
          url: "/rest/portal/file-operation/uploadFile",
          // url: _this.props.url,
          multipart: true,
          unique_names: true,
          chunk_size: '1024M',
          urlstream_upload: true,
          multiple_queues: false,
          multipart_params: { JSESSID: $('#btn'+ _this.props.idName) },
          // flash_swf_url: basePath + "/assets/js/libs/plupload/Moxie.swf",
          // silverlight_xap_url: basePath + "/assets/js/libs/plupload/Moxie.xap",
          max_file_size: '500MB',
          file_data_name: 'file',
          filters: {
            mime_types: mime_types,
          },
          init: {
            // 上传文件加入待传队列
            FilesAdded: function(up, files) {
              _this.plUploader.start();
            },
            // 上传之前调用的方法
            BeforeUpload: function(uploader, file) {
              message.loading('文件上传中...', 0);
            },
            // 上传完成后执行的方法
            UploadComplete: function(uploader, files) {
              message.destroy()
            },
            FileUploaded: function(up, file, info) {
              if (info.response && typeof info.response != 'undefined' && "101" === JSON.parse(info.response).code) {
                message.error(`文件上传失败`);
              } else if ( info.response && typeof info.response != 'undefined' && "100" === JSON.parse(info.response).code ) {
                const { dispatch } = _this.props;
                file.response = {};
                file.response.responseCode = JSON.parse(info.response).code;
                file.response.responseMsg = JSON.parse(info.response).msg;
                setTimeout(function() {
                  dispatch({
                    type: _this.props.saveDataCall,
                    payload: file,
                  });
                });
                message.success(`文件上传成功`);
              }
            },
            Error: function(up, err) {
              if (err.code == '-600') {
                message.error(err.file.name + '文件太大,无法上传！请上传500MB之内的文件。', 3);
              }
              if (err.code == '-601') {
                var fileTypes = [];
                mime_types.forEach(function (value,index) {
                  fileTypes.push(value.extensions);
                });
                message.error('【' + err.file.name + '】文件类型不符合，无法上传！请上传后缀为【' + fileTypes.join(' | ') + '】类型的文件', 3);
              }
              if (err.code == '-200') {
                message.error('服务器异常，请稍后重试！', 3);
              }
            },
          },
        });
        _this.plUploader.init();

      },600)

  }

  componentWillUnmount(){

    // if(this.plUploader){
    //   setTimeout(function(){
    //     console.log(this.plUploader)
    //     this.plUploader.Destroy();
    //   },600)
    //
    // }
  }

  render(){
    const {children,icon,idName} = this.props;

    return  (
        <Button icon={icon?icon:"upload"} id={idName}>{children}</Button>
      );
  }
}
