import React, { Fragment, PureComponent } from 'react';
import FileOnlineView from '@/components/FileOnlineView';
import { connect } from 'dva/index';
import { getConfig } from '../../utils/utils';
import { styles } from './FilePreview.less';


@connect(({ loading, filePreview }) => ({
  loading: loading.models.filePreview,
  filePreview
}))
class FilePreview extends PureComponent {
  componentDidMount() {
    const { dispatch, location:{query:{filePath, fileName}} } = this.props;

    let convertType = '0';
    const decodeHtmlName = decodeURIComponent(fileName);

    let fileServerPath = decodeURIComponent(filePath);
    if(fileServerPath.indexOf('http://') !== 0 && fileServerPath.indexOf('https://') !== 0){
      fileServerPath = getConfig().ftpHost + filePath;
    }

    if(fileName){
      document.title = `亚厦股份-文档预览 - ${decodeHtmlName}`;
      const extensionType = decodeHtmlName.substring(decodeHtmlName.lastIndexOf('\\.')+1);
      if(extensionType.toLowerCase() === 'pdf'){
        convertType = '20';
      }else if(extensionType.toLowerCase() === 'zip'||extensionType.toLowerCase() === 'rar'){
        convertType = '19';
      }
    }
    // 通过文档地址获取预览地址
    dispatch({
      type: 'filePreview/queryPreviewPath',
      payload:{
        downloadUrl : fileServerPath,
        convertType : convertType,// 转化的文件类型
        htmlName : fileName// 文件名
      }
    });
  }

  render() {
    const {filePreview:{fileName, previewPath}} = this.props;
    return (
      <Fragment>
        <FileOnlineView previewPath={previewPath} fileName={fileName} />
      </Fragment>
    );
  }
}

export default FilePreview;
