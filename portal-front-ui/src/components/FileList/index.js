import React from 'react';
import {Col, Icon, message, Modal, Popconfirm, Popover, Row} from 'antd';
import styles from './index.less';
import {convertFileSize, fileDown, filePreview, getFileExt, getFileIcon} from '../../utils/utils';
import {connect} from "dva/index";

@connect(({ processForm, loading }) => ({
  processForm,
  loading: loading.models.processForm,
}))
export default class FileList extends React.Component {
  state = {
    fileLists : this.props.files,
    visibleImgBox:false,
    imgUrl:'',
    showDel: true,
    showWidth: '33%',
  };
  confirm = (id, index) =>{
    // const newFileList = this.state.fileLists;
    // newFileList.splice(index, 1);
    // this.setState({fileLists: newFileList});
    // TODO 如果ID不为空则调用异步删除操作
    message.success('删除成功！');
    this.props.dispatch({
      type: 'processForm/delProcessFile',
      payload: {id:id},
    });
  };

  cancel = (e) =>{
  };

  componentWillReceiveProps(props){
    this.setState({fileLists:props.files})
  }
  handelPreview(name, path){
    if(!path){
      message.error("路径不存在，无法预览！")
      return;
    }
    if("JPG,JPEG,GIF,BMP,PNG".indexOf(getFileExt(path).toUpperCase()) !== -1){

      const imgs = this.state.fileLists&& this.state.fileLists.filter(function (obj) {
        return "JPG,JPEG,GIF,BMP,PNG".indexOf(getFileExt(obj.fileUrl).toUpperCase()) !== -1
      });
      const index = imgs&&imgs.findIndex(obj => obj.fileUrl=== path);
      var opt = {current: index, imgs: imgs};
      window.imgPreviewCtrl(opt);

    }else{
      filePreview(name, path);
    }
  }
  handleOk = (e) => {
    this.setState({
      visibleImgBox: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visibleImgBox: false,
    });
  }

  componentWillMount() {
    if(this.props.showDel === false){
      this.setState({
        showDel: this.props.showDel,
        showWidth: '50%'
      });
    }
    const basePath = top.window.location.pathname;
    if((basePath.indexOf("/process/form/view") != -1) || (basePath.indexOf("/process/form/approve") != -1)
      || (basePath.indexOf("/print/form/print") != -1)){
      this.setState({
        showDel: false,
        showWidth: '50%',
      });
    }
  }

  render() {
    const {
      routerData,
      match,
      files,
      visibleImgBox = false,
      imgUrl,
      showDel = true,
    } = this.props;
    // 获取文件后缀名

    const formatFileIcon = (filePath)=>{
      return getFileIcon(getFileExt(filePath));
    }

    return (
      <div className={styles.fileList}>
        {this.state.fileLists.map((post, index) =>
          <div key={post.id||index} className={styles.item} >
            <Row>
              <Col span={4}><Icon className={styles.fileIcon} type={formatFileIcon(post.fileUrl)}  /></Col>
              <Col span={20} className={styles.fileName}>
                <div style={{ textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{post.fileName}({convertFileSize(post.fileSize)})</div>
                <ul className={styles.del}>
                  <Popover content="下载"><li style={{ width:this.state.showWidth }} onClick={()=>fileDown(post.fileName, post.fileUrl)}><Icon type="download" /></li></Popover>
                  <Popover content="预览"><li style={{ width:this.state.showWidth }} onClick={()=>this.handelPreview(post.fileName, post.fileUrl)}><Icon type="search" /></li></Popover>
                  <Popover content="删除">
                    <Popconfirm title="确定要删除吗?" onConfirm={this.confirm.bind(this, post.id, index)} onCancel={this.cancel} okText="确定" cancelText="取消">
                      <li style={{ display: this.state.showDel ? 'inline-block' : 'none'}} ><Icon type="delete" /></li>
                    </Popconfirm>
                  </Popover>
                </ul>
              </Col>
            </Row>
          </div>
        )}

        <Modal
          title="图片预览"
          width="50%"
          visible={this.state.visibleImgBox}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText=""
        >
          <p>
            <a href={this.state.imgUrl} target="_blank">
              <img style={{width:'100%'}} src={this.state.imgUrl} />
            </a>
          </p>
        </Modal>
      </div>
    );
  }
}


