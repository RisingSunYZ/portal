import React, { PureComponent } from 'react';
import {  Card, List, Icon, Form, Input, Modal, Upload ,message, Button} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StaffDetail from './components/StaffDetail';
import imgBlank from '@/assets/public/blank.gif';
import { getConfig } from '@/utils/utils';
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
    fileCount: 0,
    publishLoading: false,
  };


  componentDidMount () {
    const { dispatch }=this.props;
    dispatch({
      type: 'newsInfo/getListMedia',
      payload:{
        typeSn: 'staff_presence',
        pageIndex: 0,
        pageSize: 12
      }
    })
  }

  loadStaffMore = () => {
    this.setState({
      moreLoading: true,
    });
    const { dispatch, newsInfo: {staffPageIndex} } = this.props;
    dispatch({
      type: "newsInfo/getListMedia",
      payload: {
        typeSn: 'staff_presence',
        pageIndex: staffPageIndex+1,
        pageSize: 12,
      },
      callback: ()=>{
        this.setState({
          moreLoading: false,
        });
      }
    })
  };

  handleChange = ( { fileList } ) => {
    this.setState({ fileCount: fileList.length });
  };

  handleUpDown = () => {
    this.setState({
      uploadVisible: !this.state.uploadVisible
    })
  };

  // 发布
  sendPublic = () => {
    const { dispatch ,form } = this.props;
    form.validateFields((err, fieldsValue)=>{
      if(err) return;
      this.setState({publishLoading: true});
      const files = [];
      fieldsValue.files.forEach((file, index) => {
        const temp = {
          canDown : 1,                                            // 是否允许下载（1：是；0：否）
          sortNo  : 1000 + index * 100,                           // 排序字段 默认初始 1000 递增100 升序
          filePath: file.response.code==='100'?file.response.msg:'',   // url
          fileName: file.name,                                    // 文件名
          fileSize : file.size                                    // 文件大小
        };
        files.push(temp);
      });
      dispatch({
        type:'newsInfo/addNewsStaffPre',
        payload:{ ...fieldsValue , files },
        callback: (res)=>{
          this.setState({
            publishLoading: false
          });
          if(res.code === '100'){
            message.success(res.msg);
            this.setState({
              visible: false
            })
          }else{
            message.error(res.msg);
          }
        }
      });
    })
  };

  onImgError = (tar) => {
    const img = tar.currentTarget;
    img.src = imgBlank;
    img.classList.add("img-error");
    img.onerror = null;
  };

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  showStaffPhoto = (id, index)=> {
    // 查看员工风采相册详情
    this.setState({
      staffId: id,
      staffIndex: index,
      detailVisible: true,
    });
  };

  render() {
    const { newsInfo:{ staffList, staffAllData },form }=this.props;
    const { staffId, detailVisible, fileCount, uploadVisible, publishLoading, visible, staffIndex } = this.state;
    const ftpHost = getConfig().ftpHost;

    const uploadProps={
      action : `/rest/portal/file-operation/uploadFile`,     // 上传URL
      listType : "picture-card",                             // 上传列表的内建样式
      multiple : true,                                       // 批量上传
      accept :".jpg, .jpeg, .png",                           // 文件格式
      onChange: this.handleChange
    };

    return (
      <PageHeaderWrapper>
        <Card className={styles.imgCard} bodyStyle={{ padding: '16px  24px', background: '#000' }}>
          <div onClick={()=>this.setState({visible:true})} className={styles.btn}>我要秀</div>
          <Modal
            title="一起来秀吧!"
            centered
            footer={null}
            width={768}
            visible={visible}
            onCancel={()=>this.setState({visible:false})}
          >
            <Form>
              <FormItem>
                {form.getFieldDecorator('title', {
                  rules: [{required: true, message: "标题不能为空"}]
                })(<Input placeholder="请输入标题" />)}
              </FormItem>
              <FormItem>
                {form.getFieldDecorator('remark', {
                  rules: [{required: true, message: "简介不能为空"}]
                })
                (<Input.TextArea rows={4} /> )}
              </FormItem>
              <FormItem>
                <div className={styles.optArea}>
                 <span onClick={this.handleUpDown} style={{cursor: 'pointer'}}>
                   <Icon type="picture" className={styles.iconPic}/>&nbsp;&nbsp;
                   <span className={styles.textSpan}>图片</span>
                 </span>
                 <span className={styles.optRt}>
                  <span className={styles.textSpan}>随意秀</span>
                  <Icon type="down"/>
                  <Button type="primary" style={{marginLeft: 24}} loading={publishLoading} onClick={this.sendPublic}>发布</Button>
                 </span>
                </div>
                <div className={styles.uploadBtn} style={{display: uploadVisible ? '': 'none'}}>
                  <h4 className={styles.upText}>本地上传</h4>
                  <span className={styles.photoCount}>共{ 0 + fileCount }张，还能上传{ 9 - fileCount }张</span>
                  <div className="clearfix">
                    {form.getFieldDecorator('files',{
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                      rules: [{
                        required: true, message: '上传图片不能为空'
                      },{
                        validator: (rule, value, callback) => {
                          if(value && value.length>9){
                            callback('上传图片数量不能超过9张');
                          }else{
                            callback();
                          }
                        }
                      }]
                    })(
                      <Upload {...uploadProps}>
                        {fileCount >= 9 ? null :
                          <div>
                            <Icon type="plus" />
                            <div className="ant-upload-text" />
                          </div>
                        }
                      </Upload>
                    )}
                  </div>
                </div>
              </FormItem>
            </Form>
          </Modal>
          <List
            dataSource={ staffAllData }
            split={false}
            grid={{ gutter: 16, column: 4 }}
            renderItem={ (item, index) => (
              <List.Item
                key={item.id}
                className={styles.picImg}
              >
                <div className={styles.imgContent} onClick={()=>this.showStaffPhoto(item.id, index)}>
                  <img src={ftpHost + item.photo} className={styles.picItem} alt="" onError={this.onImgError}/>
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
          {
            staffAllData.length<staffList.total ?
              <Button loading={this.state.moreLoading} block type="primary" onClick={this.loadStaffMore}>加载更多</Button>
              : <p className={styles.noMore}>没有更多了</p>
          }
        </Card>
        {staffId && detailVisible ?<StaffDetail currentIndex={staffIndex} staffId={staffId} visible={detailVisible} onCancel={()=>this.setState({detailVisible:false})} />:''}
      </PageHeaderWrapper>
    );
  }
}
export default StaffList
