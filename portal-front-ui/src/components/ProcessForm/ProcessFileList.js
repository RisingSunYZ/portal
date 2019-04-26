import React, { Component } from 'react';
import styles from './index.less';
import { Card, Timeline, Icon, Row, Col } from 'antd';
import FileList from '../FileList';
import DocsList from '../DocsList';
import {connect} from "dva/index";

@connect(({ processForm, loading }) => ({
  processForm,
  loading: loading.models.processForm,
}))
export default class ProcessFileList extends Component {
  componentDidMount(){
    const {processForm, dispatch } = this.props;

  }
  render() {
    const { processForm:{ formInfo:{files, refDocs} } } = this.props;
    return (
      <Card style={{ marginBottom: 8, 'display':(files.length>0||refDocs.length>0)?'':'none' }} bodyStyle={{padding:"12px"}} bordered={false} >
        <Row className={styles.rowHeight} style={{'display':(files.length>0?'':'none')}}>
          <Col style={{textAlign:'right',maxWidth:"138px",marginTop:"8px"}} span={3}>上传附件({files.length})：</Col>
          <Col style={{textAlign:'left'}} span={21}>
            <FileList files={files} />
          </Col>
        </Row>
        <Row className={styles.rowHeight} style={{'display':(refDocs.length>0?'':'none')}}>
          <Col style={{textAlign:'right',maxWidth:"138px",marginTop:"8px"}} span={3}>关联流程/文档({refDocs.length})：</Col>
          <Col style={{textAlign:'left'}} span={21}>
            <DocsList refDocs={refDocs} />
          </Col>
        </Row>
      </Card>
    );
  }
}
