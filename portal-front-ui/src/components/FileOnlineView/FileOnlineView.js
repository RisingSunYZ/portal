import React, { PureComponent } from 'react';
import { Card } from 'antd';
import './index.less';

class FileOnlineView extends PureComponent {
  componentDidMount() {

  }

  render() {
    return (
      <Card>
        <div data-options="region:'center'">
          <iframe id="jsDocView" style="display: none"></iframe>
          <div id="nowSwitch" style="text-align:center;margin-top:20px">正在转换...</div>
        </div>
      </Card>
    );
  }
}
export default FileOnlineView;
