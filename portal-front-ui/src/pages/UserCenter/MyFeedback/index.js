import React, { Component } from 'react';
import styles from './index.less';
import { Row, Breadcrumb, Form, Input,Select,Col,Card,Radio,Upload,Icon,Button } from 'antd';
import { connect } from 'dva/index';
import { getConfig } from '../../../utils/utils';

@connect(({ myFeedback,user, loading }) => ({
  myFeedback,
  user,
  loading: loading.models.myFeedback,
}))

 @Form.create()
 class MyFeedback extends Component {

  state = {
    attachments:{}
  };

  componentWillMount() {

  }

  componentDidMount() {
    this.props.dispatch({
      type: 'myFeedback/receiveFeedback',
    });
  }

  company = (feedbackObj) => {
    var  companyOption = '';
    if ( feedbackObj["所属公司"] ) {
      const arr = JSON.parse(feedbackObj["所属公司"].content);
      companyOption = arr.map((item, index) => {
        const  option = item.text;
        return( <Select.Option key={index} value={option}>{option}</Select.Option> );
      });
    }
    return companyOption;
  };

  profession = (feedbackObj) => {
    var  professionOption = '';
    if ( feedbackObj["所属业务"] ) {
      const arr = JSON.parse(feedbackObj["所属业务"].content);
      professionOption = arr.map((item, index) => {
        const  option = item.text;
        return( <Select.Option key={index} value={option}>{option}</Select.Option> );
      });
    }
    return professionOption;
  };

  feedOption = (feedbackObj) => {
    if(feedbackObj["反馈类型"]){
      var feedbackRadio = '';
      const arr = JSON.parse(feedbackObj["反馈类型"].content);
      feedbackRadio = arr.map((item, index) => {
        const  option = item.text;
        return( <Radio key={index} value={option}>{option}</Radio> );
      });
    }
    return feedbackRadio;
  };

  handCancel = (e) =>{
    let userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
      window.location.href="about:blank";
    } else {
      window.opener = null;
      window.open("", "_self");
    }
    window.close()
  };


  render() {
    const {
      myFeedback: { feedbackObj },
      user:{currentUser},
    } = this.props;
    //此处变量需要一任意字符串填充，否则报错
    let [ companyId, professionId, feedbacdId ] = [ 'z', 'x', 'c' ];
    const _this = this;
    if ((typeof feedbackObj["所属公司"]) != 'undefined') {
      companyId = feedbackObj["所属公司"].fieldId;
      professionId = feedbackObj["所属业务"].fieldId;
      feedbacdId = feedbackObj["反馈类型"].fieldId;
    }
    const [ FormItem, RadioGroup ] = [ Form.Item, Radio.Group ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator } = this.props.form;

    // 上传组件相关属性配置
    const uploadProps = {
      name: 'file',
      action: getConfig().domain + '/website/tools/fileUpload/uploadFile.jhtml?filePath=form',
      multiple: true,
      accept: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.pdf,image/jpg,image/jpeg,image/png,image/bmp',
      showUploadList: true,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          let attachments=_this.state.attachments;
          if(info.file.status=='removed'){
            delete attachments[info.file.uid];
            _this.setState({
              attachments:attachments,
            })
          }else{
            attachments[info.file.uid]={fileName:info.file.name,type:1,payload:""};
            var reader = new FileReader();
            reader.readAsDataURL(info.file.originFileObj);
            reader.onload = function (e) {
              var base64 = e.target.result.split('base64,')[1];
              attachments[info.file.uid].payload=base64;
              _this.setState({
                attachments:attachments,
              })
            };
          }
        }
      },
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const { dispatch, form } = this.props;
      const state=this.state;
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        let customFields = [
          {
            id:companyId,
            value:fieldsValue[companyId]
          },
          {
            id:professionId,
            value:fieldsValue[professionId],
          },
          {
            id:feedbacdId,
            value:fieldsValue[feedbacdId]
          }
        ];
        let company=fieldsValue[companyId];
        delete fieldsValue[companyId];
        delete fieldsValue[professionId];
        delete fieldsValue[feedbacdId];
        fieldsValue.customFields = customFields;
        const values = {
          ...fieldsValue,
          title : '问题反馈',
          templateId : getConfig.qiyuTemplateId,
          targetGroupId : company==="亚厦幕墙"?getConfig().mqTargetGroupId:getConfig().zsTargetGroupId ,
          staffId :company==="亚厦幕墙"?getConfig().mqStaffId:getConfig().zsStaffId,
          uid:currentUser.no,
          attachments:Object.values(state.attachments),
          typeId:0,
        };
        const valueStr = JSON.stringify(values);
        this.props.dispatch({
          type: 'myFeedback/submitFeedback',
          payload: {content: encodeURIComponent(valueStr)}
        })
      });
    };

    return (
      <div>
        <Card>
          <Breadcrumb>
            <Breadcrumb.Item>
              您所在的位置：
              <a href="/ys/main/hr-service">HR服务</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>HR自助</Breadcrumb.Item>
            <Breadcrumb.Item>我的反馈</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card style={{marginTop: 20}}>
          <div className={styles.hrSelfHelpTitle}>问题反馈</div>
          <Form onSubmit={handleSubmit} style={{marginTop: 40}} hideRequiredMark={true}>
            <Row>
              <Col span={9} offset={2}>
                <FormItem {...formItemLayout} label="账户名">
                  {getFieldDecorator('userName', {
                    rules: [{
                      required: true,
                      message: '请填写您的账户名',
                    }],
                  })(
                    <Input placeholder="姓名"/>
                  )}
                </FormItem>
              </Col>
              <Col span={9}>
                <FormItem {...formItemLayout} label="联系方式">
                  {getFieldDecorator('userMobile', {
                    rules: [{
                      required: true,
                      message: '请填写您的联系方式',
                    }],
                  })(
                    <Input placeholder="+86 138 0068 8830"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col style={{marginLeft: -213}}>
                <FormItem {...formItemLayout} label="所属公司">
                  {getFieldDecorator(companyId, {
                    rules: [{
                      required: true,
                      message: '请填写您的所属公司',
                    }],
                  })(
                    <Select style={{width: 710}}>
                      {this.company(feedbackObj)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col style={{marginLeft: -213}}>
                <FormItem {...formItemLayout} label="所属业务">
                  {getFieldDecorator(professionId, {
                    rules: [{
                      required: true,
                      message: '请填写您的所述业务',
                    }],
                  })(
                    <Select style={{width: 710}}>
                      {this.profession(feedbackObj)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col style={{marginLeft: -213}}>
                <FormItem {...formItemLayout} label="反馈类型">
                  {getFieldDecorator(feedbacdId,
                    {
                    rules: [{
                      required: true,
                      message: '请选择您的反馈类型',
                    }],
                  })(
                    <RadioGroup>
                      {this.feedOption(feedbackObj)}
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col style={{marginLeft: -213}}>
                <FormItem {...formItemLayout} label="内容说明">
                  {getFieldDecorator("content", {
                    rules: [{
                      required: true,
                      message: '请填写您的所属业务',
                    }],
                  })(
                    <Input.TextArea style={{width: 500,height:70}} placeholder="请输入内容">
                    </Input.TextArea>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col style={{marginLeft: -213}}>
                <FormItem
                  {...formItemLayout}
                  label="上传附件" extra="可以上传多个材料，每个材料不能超过1M"
                >
                  <Upload name="logo" {...uploadProps}>
                    <Button>
                      <Icon type="upload"/>选择上传文件
                    </Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col offset={11}>
                <FormItem>
                  <Button style={{width: 250}} type="primary" htmlType="submit">提交</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col style={{marginTop:-59}} span={5}>
              <Button style={{width: 250,marginLeft:236}} onClick={this.handCancel}>取消</Button>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
export default MyFeedback;
