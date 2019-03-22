import React, { Fragment, PureComponent } from 'react';
import styles from './index.less';

class FileOnlineView extends PureComponent {
  componentDidMount() {}

  render() {
    const {fileName, previewPath} = this.props;

    const onlineContent = previewPath ?
      (
        <div style={{flexGrow: 1}}>
          <iframe title="文档预览" id="jsDocView" src={previewPath} className={styles.onlineContent} />
        </div>
      )
      :(
        <div id="nowSwitch" style={{textAlign:'center', marginTop:'20px', width:'100%'}}>正在转换...</div>
      )

    return (
      <Fragment>
        {
          onlineContent
        }
      </Fragment>
    );
  }
}
export default FileOnlineView;
