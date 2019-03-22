import React from 'react';
import { Icon, Row, Col, Popover, Popconfirm, message } from 'antd';
import styles from './index.less';
import {connect} from "dva/index";
import {convertFileSize, fileDown, filePreview, nullToZero} from '../../utils/utils';
// import conf from '../../config';
import { routerRedux } from 'dva/router';


@connect(({ processForm, loading }) => ({
  processForm,
  loading: loading.models.processForm,
}))
export default class DocsList extends React.Component {
  state = {
    docsLists: this.props.refDocs,
  };
  confirm = (refBusinessKey, index) => {
    // const newFileList = this.state.docsLists;
    // newFileList.splice(index, 1);
    // this.setState({ docsLists: newFileList });
    // TODO 如果ID不为空则调用异步删除操作
    this.props.dispatch({
      type: 'processForm/delRefDocs',
      payload: {refBusinessKey:refBusinessKey},
    });
    message.success('删除成功！');
  };

  componentWillMount() {
    const basePath = top.window.location.pathname;
    let showDel = '';
    let showWidth = '50%';
    if((basePath.indexOf("/process/form/view") != -1) || (basePath.indexOf("/process/form/approve") != -1)
      || (basePath.indexOf("/print/form/print") != -1)){
      showDel = "none";
      showWidth = "100%";
    }
    this.setState({
      showDel:showDel,
      showWidth:showWidth,
    });
  }


  processPreview = (o) => {


    // routerRedux.push();

    window.open('/ys/process/form/view/' +
      nullToZero(o.refProcessDefinitionKey) +
      '/' +
      nullToZero(o.refProcessInstanceId) +
      '/' +
      nullToZero(o.refBusinessKey) +
      '/' +
      nullToZero(o.taskId) +'/0') ;

  };

  componentWillReceiveProps(props) {
    this.setState({ docsLists: props.refDocs });
  }

  cancel = e => {};

  render() {
    // const { routerData, match, files } = this.props;
    return (
      <div className={styles.fileList}>
        {this.state.docsLists.map((post, index) => (
          <div key={post.id || index} className={styles.item}>
            <Row>
              <Col span={4}>
                <Icon className={styles.fileIcon} type="share-alt" />
              </Col>
              <Col span={20} className={styles.fileName}>
                <div style={{ textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{post.refName}</div>
                <ul className={styles.del}>
                  <Popover content="预览">
                    <li onClick={this.processPreview.bind(this,post)} style={{ width:this.state.showWidth }}>
                      <Icon type="search" />
                    </li>
                  </Popover>
                  <Popover content="删除">
                    <Popconfirm
                      title="确定要删除吗?"
                      onConfirm={this.confirm.bind(this, post.refBusinessKey, index)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <li style={{ display:this.state.showDel,width:'50%'}}>
                        <Icon type="delete" />
                      </li>
                    </Popconfirm>
                  </Popover>
                </ul>
              </Col>
            </Row>
          </div>
        ))}
      </div>
    );
  }
}
