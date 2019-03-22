import React from 'react';
import { Icon, Row, Col, Popover,Popconfirm, message,Modal } from 'antd';
import styles from './index.less';
import {convertFileSize, fileDown, filePreview, getFileExt, getFileIcon} from '../../utils/utils';

export default class FilePreview extends React.Component {
  state = {
    fileLists : this.props.files, visibleImgBox:false

  };
  confirm = (id, index) =>{
    const newFileList = this.state.fileLists;
    newFileList.splice(index, 1);
    this.setState({fileLists: newFileList});
    // TODO 如果ID不为空则调用异步删除操作
    message.success('删除成功！');
  };

  cancel = (e) =>{
  };

  componentWillReceiveProps(props){
    this.setState({fileLists:props.files})
  }
  handelPreview(name, path){
    if("JPG,JPEG,GIF,BMP,PNG".indexOf(getFileExt(path).toUpperCase()) !== -1){
      this.setState({visibleImgBox:true});
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

  render() {
    // const { routerData, match, files } = this.props;
    // 获取文件后缀名

    const formatFileIcon = (filePath)=>{
      return getFileIcon(getFileExt(filePath));
    }

    return (
      <div className={styles.fileList}>
        <Modal
          title="图片预览"
          width="80%"
          visible={this.state.visibleImgBox}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText=""
        >
          <p>
            <a href="http://home.chinayasha.com/portal/process/generateDiagramImg.jhtml?processInstId=31e07791778511e8933c005056baf411" target="_blank">
              <img style={{width:'100%'}} src="http://home.chinayasha.com/portal/process/generateDiagramImg.jhtml?processInstId=31e07791778511e8933c005056baf411" />
            </a>
          </p>
        </Modal>
      </div>
    );
  }
}


