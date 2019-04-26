import React, { PureComponent } from 'react';
import {  Card, List, Icon, Form, Input, Modal, Upload ,message} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import { getConfig } from '../../utils/utils';
import styles from './News.less';

const FormItem = Form.Item;

@connect(({ newsInfo, loading }) => ({
  newsInfo,
  loading: loading.models.newsInfo,
}))

@Form.create()
class StaffList extends PureComponent {

  state = {
    visible: false, //我要秀 弹框
    uploadVisible: true, //上传部分
    fileList: [{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };


  componentDidMount () {
    const { dispatch }=this.props;
    dispatch({
      type: 'newsInfo/getListMedia',
      payload:{
        typeSn: 'staff_presence',
        pageNumber: 1,
        pageSize: 12
      }
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };


  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  }


  handleUpDown = () => {
    this.setState({
      uploadVisible: !this.state.uploadVisible
    })
  };

  sendPublic = () => {
    const {dispatch ,form }=this.props;
    // debugger;
    form.validateFields((err, fieldsValue)=>{
      console.log(fieldsValue);
      if(err) return;
      if(fieldsValue.title === ""){
        message.error('标题不能为空')
      }else if(fieldsValue.remark === ""){
        message.error('简介不能为空')
      }
      dispatch({
        type:'newsInfo/addNewsStaffPre',
        payload:{...fieldsValue },
        // callback: res => {
        //   if (res.code === '100') {
        //       message.success(res.msg)
        //   }
        // },
      });
    })
  };

  render() {
    const { newsInfo:{ staffLists },form }=this.props;
    const { fileList,uploadVisible } = this.state;
    const ftpHost = getConfig().ftpHost;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <PageHeaderWrapper>
        <Card className={styles.imgCard}>
          <div onClick={this.showModal} className={styles.btn}>我要秀</div>
          <Modal
            title="一起来秀吧!"
            centered
            footer={null}
            width={768}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Form>
              <FormItem>
                {form.getFieldDecorator('title', {
                  initialValue: "",
                })
                (<Input className={styles.inputSty} placeholder="请输入标题" />)}
              </FormItem>
              <FormItem>
                {form.getFieldDecorator('remark', {
                  initialValue: "",
                })
                (<textarea name="remark" className={styles.textDesc} /> )}
              </FormItem>
            </Form>
            <div className={styles.optArea}>
              <span onClick={this.handleUpDown}>
                <Icon type="picture" className={styles.iconPic}/>&nbsp;&nbsp;
                <span className={styles.textSpan}>图片</span>
              </span>
              <span className={styles.optRt}>
                <span className={styles.textSpan}>随意秀</span>
                <Icon type="down"/>
                <span className={styles.btnPublic} onClick={this.sendPublic}>发布</span>
              </span>
            </div>

            <div className={styles.uploadBtn} style={{display: uploadVisible ? '': 'none'}}>
              <h4 className={styles.upText}>本地上传</h4>
              <span className={styles.photoCount}>共0张，还能上传9张</span>
              <div>
                <Upload
                  action="//jsonplaceholder.typicode.com/posts/"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={this.handleChange}
                >
                  {fileList.length >= 9 ? null : uploadButton}
                </Upload>
              </div>
            </div>
          </Modal>
          <List
            dataSource={ staffLists }
            split={false}
            grid={{ gutter: 16, column: 4 }}
            renderItem={ item => (
              <List.Item
                key={item.id}
                className={styles.picImg}
              >
                <div className={styles.imgContent}>
                  <img src={ftpHost + item.photo} className={styles.picItem} alt=""/>
                  <div className={styles.infoDesc}>
                    <span className={styles.infoTitle}>{item.title}</span>
                    <div>
                      <Icon type="eye" />&nbsp;&nbsp;
                      <span>{item.visitCount}</span>
                      <span className={styles.infoRight}>
                        <Icon type="message" />&nbsp;&nbsp;
                        <span>{item.commentCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default StaffList
