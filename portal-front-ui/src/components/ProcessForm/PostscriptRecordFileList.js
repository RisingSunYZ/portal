import React, { Component } from 'react';
import styles from './index.less';
import {Card, Timeline, Icon, Row, Col } from 'antd';
// import FileList from '../FileList';
// import DocsList from '../DocsList';
import {connect} from "dva/index";
import PostscriptFileList from "../PostscriptFileList";

@connect(({ processForm, loading }) => ({
  processForm,
  loading: loading.models.processForm,
}))
export default class PostscriptRecordFileList extends Component {
  componentDidMount(){
    const {processForm, dispatch } = this.props;

  }
  render() {
    const {processForm:{ formInfo:{postscriptsFiles} } } = this.props;
    return (
      <Card style={{ 'display':(postscriptsFiles.length>0)?'':'none' }} bordered={false} >
        <Row className={styles.rowHeight} style={{'display':(postscriptsFiles.length>0?'':'none')}}>
          <Col style={{textAlign:'right'}} span={2}>附言附件({postscriptsFiles.length})：</Col>
          <Col style={{textAlign:'left'}} span={22}>
            <PostscriptFileList postscriptsFiles={postscriptsFiles} delShow={1}/>
          </Col>
        </Row>
      </Card>
    );
  }
}
