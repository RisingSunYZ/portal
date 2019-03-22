/**
 **异常处理页面
 */
import React, { Component } from 'react';
import { Form, Input,Row, Col,Button,Table,Modal,Radio,Upload,Icon,Card,DatePicker } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import { connect } from 'dva/index';
import { Base64 } from 'js-base64';
import { getConfig } from '../../../utils/utils';
@connect(({ user,attendance, loading }) => ({
  user,
  attendance,
  loading: loading.models.attendance,
}))

export default class ExceptionHandle extends Component {
  state = {
    month: moment(),
    date:{},
  };

  componentDidMount() {
    const _this=this;
    this.defaultReq();
    $('.jsUnusualDealWith').die().live('click',function(){
      var id = $(this).attr('dataid');
      var type = $(this).attr('datatype');
      var sdate = $(this).attr('datasdate');
      var typeTime = $(this).attr('datatypetime');
      var date = _this.state.date;
      _this.unusualDeal(id,type,sdate,typeTime,date);
    });
  }

  onMonthChange = (date, dateStr) => {
    this.setState({month: date});
    const dateArr = dateStr.split("-");
    let val = {
      year : dateArr[0],
      month :dateArr[1],
      userNo:this.props.location.query.userNo,
    };
    this.setState({
      date:val
    }, function() {
      this.props.dispatch({
        type: 'attendance/getException',
        payload: val,
      });
    });

  };

  goToCurrMonth = () => {
    this.setState({month: moment(),});
    this.defaultReq()
  };

  defaultReq = () =>{
    let val = {
      year : (new Date()).getFullYear().toString(),
      month : ((new Date()).getMonth()+1).toString(),
      userNo:this.props.location.query.userNo,
    };
    console.log(val)
    this.setState({
      date:val
    }, function() {
      this.props.dispatch({
        type: 'attendance/getException',
        payload: {year : (new Date()).getFullYear().toString(),
          month : ((new Date()).getMonth()+1).toString(),
          userNo:this.props.location.query.userNo,}
      });
    });
  };

  //对日期选择进行限制，只允许选择本年本月之前
  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };
  optRender = (val, row, index) => {
    var start=(<div></div>);
    var id = row.id;
    if(row.opration==1){
      start= (<a dataid = {row.id} datatype={row.type} datasdate={row.sdate} datatypetime={row.typeTime} class="jsUnusualDealWith ">申诉</a>);
    }
    return start ;
  }
  unusualDeal =(id,type,sdate,time,date)=>{
    const _this = this;
    const dispatch=this.props.dispatch
    if(id == null || id==''){
      return;
    }

    var sdate = sdate,staticDaytype=type,typeTime = time;
    typeTime = typeTime==undefined?0:typeTime;
    var url = getConfig().domain +'/hrService/atds/addFlowDataUI.jhtml?sdate='+sdate+'&staticDaytype='+staticDaytype+'&typeTime='+typeTime;
    //$.post(url, {"sdate":row.sdate,"staticDaytype":row.type,"typeTime":row.typeTime}, function(str){
    layer.open({
      type: 2,
      title : "打卡异常申诉",
      skin: 'min-height',
      area : ['600px','60%'],
      scrollbar: false,
      content: url,
      btn: ['保存', '取消'],
      yes: function(index, layero){
        var loadFrame = layer.load(1, {
          shade: [0.3,'#fff'] //0.1透明度的白色背景
        });
        var iframe = layero.find('iframe').contents();
        var formData = iframe.find('#addFlowDataForm').serialize();
        var _url = getConfig().domain +'/hrService/atds/addFlowData.jhtml';
        $.ajax({
          type : 'POST',
          dataType : 'JSON',
          url : _url,
          data : formData,
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(loadFrame);
            layer.msg('添加失败,请联系系统管理员',{time:500});
          },
          success : function(data) {
            layer.close(loadFrame);
            if(data != null && data.responseCode == 1){
              layer.close(index);
              dispatch({
                type: 'attendance/getException',
                payload: {date,userNo:_this.props.location.query.userNo,
            }
              });
            }else{
              layer.msg(data.responseMsg,{time:700});
            }
          }
        });
      },btn2: function(index){
        //layer.close(index);
      }
    });
    //});
  }
  render() {
    const {
      attendance: { exceptionList: list },
      user:{currentUser},
    } = this.props;



    const info = () => {
      Modal.info({
        title: '异常处理说明',
        maskClosable: true,
        content: (
          <div>
            <p>异常考勤是指正常出勤但无考勤记录、或考勤流程多条的情况，需要申报处理</p>
            <p>1.因请假、出差等流程未发起、审批末结束导致的异常，需在流程中心处理；</p>
            <p>2.因忘记打卡导致的异常考勤，需要在门户处理，申请每月不得超过三次；</p>
            <p>3.因同一时间发起多个流程时，会显示流程冲突，需要在门户处理并确定；</p>
            <p>4.异常处理的截至日期为次月3号。</p>
          </div>
        ),
        onOk() {},
      });
    };
    const columns = [
      {
        title: '日期',
        dataIndex: 'dateStr',
        key: 'dateStr',
      },
      {
        title: '星期',
        dataIndex: 'weekStr',
        key: 'weekStr',
      },
      {
        title: '异常类型',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '异常内容',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '异常卡点',
        dataIndex: 'punchPoint',
        key: 'punchPoint',
      },
      {
        title: '处理状态',
        dataIndex: 'status',
        key: 'status',
      }

    ];

    if(typeof this.props.location.query.userNo == 'undefined' || Base64.encode(currentUser.no) == this.props.location.query.userNo){
       columns.push( {
          title: '操作',
            key: 'look',
            render: this.optRender,
        });
    }
    return (
      <div>
        <Card bordered={false} bodyStyle={{padding: '0 24px'}}>
            <Row style={{padding: '16px 0'}}>
              <Col span={6}>
                <DatePicker.MonthPicker value={this.state.month} onChange={this.onMonthChange} disabledDate={this.disabledDate} allowClear={false}>
                </DatePicker.MonthPicker>
                <Button type="primary" style={{marginLeft: 16}} onClick={this.goToCurrMonth}>本月</Button>
              </Col>
              <Col span={1} offset={17}>
                <Icon className="btnWarning" type="exclamation-circle" theme="filled" onClick={info} />
              </Col>
            </Row>
            <Row>
              <Table columns={columns} dataSource={list} />
            </Row>
        </Card>
      </div>
    );
  }
}



@Form.create()
class ExceptionForm extends Component{
  state = {

  }
  formLayout = {
    labelCol: { span: 6},
    wrapperCol: { span: 15 },
  };

  handleSubmit = e => {
    e.preventDefault();
    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {

    });
  };
  normFile = e => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  render() {
    const FormItem = Form.Item;
    const RadioGroup = Radio.Group;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col span={4}><FormItem label='人员信息'></FormItem></Col>
          <Col offset={6}>
            <FormItem label='组织'>
              {getFieldDecorator('companyId', {
                initialValue: '亚厦集团',
              })(<input style={{display: 'none'}}></input>)}
            </FormItem>
          </Col>
          <Col offset={9} style={{marginTop:-78}}>
            <p>亚厦集团</p>
          </Col>
        </Row>
        <Row style={{marginTop:-20}}>
          <Col offset={6}>
            <FormItem label='部门' style={{marginTop:-20}}>
              {getFieldDecorator('departmentId', {
                initialValue: '信息技术部',
              })(<input style={{display: 'none'}}></input>)}
            </FormItem>
          </Col>
          <Col offset={9} style={{marginTop:-53}}>
            <p>信息技术部</p>
          </Col>
        </Row>
        <Row style={{marginTop:-20}}>
          <Col offset={6}>
              <FormItem label='工号'>
              {getFieldDecorator('code', {
                initialValue: '00000001',
              })(<input style={{display: 'none'}}></input>)}
            </FormItem>
          </Col>
          <Col offset={9} style={{marginTop:-53}}>
            <p>00000001</p>
          </Col>
        </Row>
        <Row style={{marginTop:-24}}>
          <Col offset={6}>
            <FormItem label='姓名'>
              {getFieldDecorator('name', {
                initialValue: 'Hepburn',
              })(<input style={{display: 'none'}}></input>)}
            </FormItem>
          </Col>
          <Col offset={9} style={{marginTop:-53}}>
            <p>Hepburn</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label='考勤机记录'></FormItem>
          </Col>
          <Col offset={6}>
            <FormItem label=''>
              {getFieldDecorator('sdate', {
                initialValue: '',
              })}
            </FormItem>
          </Col>
        </Row>
            <FormItem label='申述类型' {...this.formLayout}>
              {getFieldDecorator('typeName')(
                <RadioGroup>
                  <Radio value="a">忘记打卡</Radio>
                  <Radio value="b">外出公干</Radio>
                  <Radio value="c">其他</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label='是否营销人员' {...this.formLayout}>
              {getFieldDecorator('slesman')(
                <RadioGroup>
                  <Radio value="a">是</Radio>
                  <Radio value="b">否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label='事由说明' {...this.formLayout}>
              {getFieldDecorator('title', {

              })(<Input placeholder="请输入" height={20}></Input>)}
            </FormItem>
        <Row>
          <Col>
            <FormItem {...this.formLayout} label="Upload">
              {getFieldDecorator('attachments', {
                valuePropName: "fileList",
                getValueFromEvent: this.normFile
              })(
                <Upload name="logo" action="/upload.do" listType="picture">
                  <Button>
                    <Icon type="证明材料" />选择要上传的文件
                  </Button>
                </Upload>
              )}
            </FormItem>
          </Col>
          <Col offset={5} style={{marginTop:-25}}>
            <p>可以上传多个材料，每个不能超过1M</p>
          </Col>
        </Row>
      </Form>
    )
  }

}

