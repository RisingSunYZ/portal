import React, { Component, Fragment } from 'react';
import { Calendar, Popover, DatePicker, Row, Col, Button, Switch, Table } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva/index';
import ycApply from '@/assets/userCenter/yc-apply.png';
import ycResult from '@/assets/userCenter/yc-result.png';
import workOut from '@/assets/userCenter/work-out.png';
import hrCheckOut from '@/assets/userCenter/hr-check.png';
import styles from './index.less';
import moment from 'moment';
import router from 'umi/router';
import {getConfig} from "@/utils/utils";
const { MonthPicker } = DatePicker;

const typeMap = {'zc': 10, 'lcsj': 20, 'dkyc': 30, 'xx': 40, 'yc': 50, 'hrclh': 60, 'hrclyc': 70};
const fDataTypeMap = {10:'请假', 20: '出差', 30: '因公外出', 40: '加班', 50: '忘记打卡', 60: '其他'};
const staticDayTypeMap = {10: '正常', 20: '请假', 40: '出差', 50: '因公外出', 60: '加班',70: '迟到', 80: '早退', 90: '打卡异常', 110: '旷工',300: '休息', 500: '异常'};
const staticDayTypeMapSn = {'zc': 10, 'qj': 20, 'cc': 40, 'ygwc': 50, 'jb': 60, 'cd': 70, 'zt': 80, 'dkyc': 90, 'kg': 110, 'xx': 300, 'yc': 500, 'swwdk': 140, 'xwwdk': 150};

@connect(({ user,attendance, loading }) => ({
  user,
  attendance,
  loading: loading.models.attendance,
}))

export default class AttendanceRecord extends Component {
  constructor(props){
    super(props);
    this.recordMap = {};
    this.state = {
      month: moment(),
      detailView: false,
      switchOpen: false,
      firstJustify: true,
      date:{},
    }
  }
  componentDidMount() {
    let currentMoment = this.state.month;
    let year=this.props.location.query.year?this.props.location.query.year:currentMoment.year();
    let month= this.props.location.query.month?this.props.location.query.month:currentMoment.month()+1;
    let detailView = this.props.location.query.detailView?this.props.location.query.detailView:false;
    const value = {
      month: currentMoment.month()+1,
      year: currentMoment.year(),
      userNo:this.props.location.query.userNo,
    };
    if(month && year){
      currentMoment=moment(year+"-"+month, "YYYY-MM");
    }
    this.setState({
      month:currentMoment,
      detailView: detailView,
      switchOpen:detailView,
    })
    this.attendanceReq(value);
    const _this=this;
    $('.jsUnusualDealWith').die().live('click',function(){
      var id = $(this).attr('dataid');
      var type = $(this).attr('datatype');
      var sdate = $(this).attr('datasdate');
      var typeTime = $(this).attr('datatypetime');
      var stateDate = _this.state.date;
      _this.unusualDeal(id,type,sdate,typeTime,stateDate);
    });
  }

  unusualDeal =(id,type,sdate,time,stateDate)=>{
    const dispatch=this.props.dispatch
    const _this=this;
    if(id == null || id==''){
      return;
    }

    var sdate = sdate,staticDaytype=type,typeTime = time;
    typeTime = typeTime==undefined?0:typeTime;
    var url = getConfig().domain +'/hrService/atds/addFlowDataUI.jhtml?sdate='+sdate+'&staticDaytype='+staticDaytype+'&typeTime='+typeTime;
    let year = this.state.month.year();
    let month = this.state.month.month()+1;
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
                type: 'attendance/getAttendanceRecord',
                payload: {year:year,month:month,userNo:_this.props.location.query.userNo,
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
  getRecordMap = (datalist, user) => {
    const atdsRecordMap = {}, detailData = {};
    datalist.map((data, index)=>{
      const sdatalist = data.staticDayList;
      const start = sdatalist ? (sdatalist[0].startRwork ? sdatalist[0].startRwork.split(' ')[1].substring(0,5) : '--:--') : null;
      const end = sdatalist ? (sdatalist[sdatalist.length-1].endRwork ? sdatalist[sdatalist.length-1].endRwork.split(' ')[1].substring(0,5) : '--:--') : null;
      detailData[new Date(data.sdate.replace('-','/')).getDate()] = {start: start,end: end};
      atdsRecordMap[new Date(data.sdate.replace('-','/')).getDate()] = data;
    });
    detailData['name'] = user;
    return {atdsRecordMap: atdsRecordMap, detailData: [detailData]};
  };
  getListData = (value) => {
    const {month} = this.state;
    if(month.month() === value.month()){
      return this.recordMap[value.date()]
    }
  };
  getTypeNameByDic = type => {
    return (type != null && staticDayTypeMap != null) ? staticDayTypeMap[type]: ''
  };
  getAppealOpt = (sdatalist, dateType) => {
    console.log(sdatalist);
    sdatalist=sdatalist.filter(item=>{
      return item.type==70 || item.type==80 || item.type==90 ;
    })
    var data = {};
    if(dateType==0){
      data = sdatalist[0];
    }else{
      if(null!=sdatalist[1]){
        data = sdatalist[1];
      }else{
        data = sdatalist[0];
      }
    }

    let appealHtml = '';
    if(typeof this.props.location.query.userNo == 'undefined' || Base64.encode(this.props.user.currentUser.no) == this.props.location.query.userNo){
      appealHtml = (<a className="appeal-btn jsUnusualDealWith" dataid = {data.id} datatype={data.subType} datasdate={data.sdate} datatypetime={data.typeTime}>我要申诉</a>);
    }
   // const type = data.type;
    // if(type === typeMap.dkyc){
    //   appealHtml = (<span className="appeal-btn" onClick={ ()=>{this.appealForExp(data.staticDayList[dateType])} }>我要申诉</span>);

    // }
    return appealHtml;
  };
  appealForExp = (data) => {
    console.log(data);
    const { match } = this.props;
    const userNo = this.props.location.query.userNo;
    let url = match.url+'/exception';
    if(typeof userNo != 'undefined'){
      url+='?userNo='+userNo;
    }
    router.push(url);
  }
  getStaticContent = data => {
    const sdatalist = data.staticDayList, datashow = [], type = data.type;
    let hrCheck = false;
    if(sdatalist&&sdatalist.length>0){//考勤数据
      const monExp = data.lateStatus === 1?'迟到':(data.monNotPunch===1?'上班打卡异常':null);
      const aftExp = data.leaveEarlyStatus===1?'早退':(data.aftNotPunch===1?'下班打卡异常':null);
      if(monExp!=null||aftExp!=null){
        const monTime = sdatalist[0].startRwork ? sdatalist[0].startRwork.split(' ')[1] : (data.sdate.split(' ')[0]+'　——');
        const aftTime = sdatalist[0].endRwork ? sdatalist[0].endRwork.split(' ')[1] : (data.sdate.split(' ')[0]+'　——');
        monExp!=null&&(datashow.push((<li className="sdata"><p>类型：<span>{monExp}</span></p><p>时间：<span>{monTime}</span></p>{
          (data.monAbnormalFlow===0 ? (<span className="appeal-result">{data.monFlowStatus || ''}</span>): this.getAppealOpt(sdatalist,0))}</li>)));
        aftExp!=null&&(datashow.push((<li className="sdata"><p>类型：<span>{aftExp}</span></p><p>时间：<span>{aftTime}</span></p>{
          (data.aftAbnormalFlow===0 ? (<span className="appeal-result">{data.aftFlowStatus || ''}</span>):this.getAppealOpt(sdatalist,1))}</li>)));
      }else if(monExp==null&&aftExp==null){
        sdatalist.map((obj, k)=>{
          if(obj.type === staticDayTypeMapSn.kg || obj.type === staticDayTypeMapSn.yc){
            hrCheck = true;
          }else{
            const stype = this.getTypeNameByDic(obj.type);
            if(stype !== ''){
              datashow.push(<li className="sdata"><p>类型：<span>{stype}</span></p><p>时间：<span>{obj.startRwork ? obj.startRwork.split(' ')[1] : '—'}——{obj.endRwork ? obj.endRwork.split(' ')[1] : '—'}</span></p></li>);
            }
          }
        });
      }else{
        datashow.push(<li className="sdata" style={{fontSize:14}}>没有考勤数据</li>);
      }
    }
    return {dataHtml: datashow, hrCheck: hrCheck};
  };

  getFlowContent = (data) =>{
    const fdatalist = data.flowDataList;
    const datashow = [];
    if(fdatalist && fdatalist.length>0){//流程数据
      fdatalist.map((fdata, k)=>{
        const fType = fDataTypeMap[fdatalist[k].type];
        datashow.push(<li className="fdata"><p>流程类型：<span>{fType}</span></p><p>时间：<span>{(fdatalist[k].startTime ? fdatalist[k].startTime : '')}——{(fdatalist[k].endTime ? fdatalist[k].endTime : '')}</span></p></li>);
      });
    }else{
      datashow.push(<li className="fdata" style={{fontSize:14}}>没有流程数据</li>);
    }
    return datashow;
  };
  dateCellRender = (value) => {
    const data = this.getListData(value);
    return this.optCellRender(data, value);
  };
  optCellRender = (data, cellDate) => {
    let cellStyle = '', atdExcept = false;
    let list = '', img = '';
    if(data){
      const { dataHtml, hrCheck } = this.getStaticContent(data);
      const fdataHtml = this.getFlowContent(data);
      const type = data.type;
      const sdatalist = data.staticDayList;
      switch(type){
        case typeMap.zc:
          cellStyle = 'work work-normal';break;
        case typeMap.lcsj:
        case typeMap.hrclh:
          cellStyle = 'work work-out';
          atdExcept = true;
          list = (<ul className="ques-info">{dataHtml}{fdataHtml}</ul>);
          img = (<div className={styles.quesImg}>
            <img src={workOut} alt=""/>
          </div>);
          break;
        case typeMap.xx:
          cellStyle = "work work-relax";break;
        case typeMap.hrclyc:
          cellStyle = 'work work-unusual';
          atdExcept = true;
          list = (<ul className="ques-info">{dataHtml}{fdataHtml}</ul>);
          break;
        default:
          cellStyle = 'work work-unusual';
          atdExcept = true;
          img = (<div className={styles.quesImg}>
            <img src={type == typeMap.yc && hrCheck ? hrCheckOut : ((data.monAbnormalFlow==1||data.aftAbnormalFlow==1) ? ycApply : ycResult)} alt=""/>
          </div>);
          let html = dataHtml.concat(fdataHtml);
          if(type === typeMap.dkyc&&sdatalist.length>0){//考勤异常
            html = dataHtml;
          }
          list = (<ul className="ques-info">{html}</ul>);
      }
      return (
        <div className="atds-date-box">
          {atdExcept ? (
            <Popover content={<div style={{margin: -16}}>{img}{list}</div>} trigger="hover" placement="right">
              <div className="ads-cell enable-cell">
                <p className="date-number">{cellDate.date()}</p>
                <div className={cellStyle}><i className="type-tip"></i></div>
              </div>
            </Popover>
          ) : (
            <div className="atds-date-box">
              <div className="ads-cell">
                <p className="date-number">{cellDate.date()}</p>
                <div className={cellStyle}><i className="type-tip"></i></div>
              </div>
            </div>
          )}

        </div>
      );
    }else{
      return (
        <div className="atds-date-box">
          <div className="ads-cell">
            <p className="date-number">{cellDate.date()}</p>
            <div className={cellStyle}><i className="type-tip"></i></div>
          </div>
        </div>
      )
    }
  };
  getDateColumns = () =>{
    const date = this.state.month, columns = [];
    const week = ["日","一","二","三","四","五","六"];
    const month1 = date.clone();
    month1.date(1);
    columns.push({
      title:'姓名',
      dataIndex:'name',
      fixed: true
    });
    for (let i = 0; i < month1.daysInMonth(); i++) {
        let current = month1.clone();
        current.add(i, 'days');
        columns.push({
          dataIndex: current.date(),
          title: (
            <div className={styles.headBox}>
              <span>{week[current.day()]}</span>
              <span className={styles.dateHead}>{current.date()}</span>
            </div>
          ),render: text => {
            if(text){
              return text.start || text.end ? (
                <div style={{lineHeight: '14px', textAlign: 'center'}}>
                  {text.start}
                  <div>—</div>
                  {text.end}
                </div>
              ) : ''
            }else{
              return '';
            }
          }
        });
    }
    return columns;
  };
  goToCurrMonth = () => {
    /*this.setState({month: moment()});
    const value = {
      year: moment().year(),
      month: moment().month()+1,
    };
    this.attendanceReq(value);*/
    this.onMonthChange(moment());
  };
  onMonthChange = date => {
    this.refs.calendar && this.refs.calendar.setValue(date);
    this.setState({month: date});
    let value = {
      year : date.year(),
      month : date.month()+1,
      userNo:this.props.location.query.userNo,
    };
    this.attendanceReq(value);
  };

  attendanceReq = (val) => {
    this.setState({
      date:val
    }, function() {
      this.props.dispatch({
        type: 'attendance/getAttendanceRecord',
        payload: val,
      });
    });
  };

  changeCalendarView = bool => {
    this.setState({
      switchOpen: bool,
      detailView: bool
    })
  };

  //对日期选择进行限制，只允许选择本年本月之前
  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };
  justifyCalendarList = (obj) => {
    const datalist = obj.datas, name = obj.data;
    const {atdsRecordMap: recordMap, detailData: detailData} = this.getRecordMap(datalist || [], name);
    this.recordMap = recordMap;
    return this.state.detailView ? (
      <Table style={{marginTop: 16}} scroll={{x: 1000}} columns={this.getDateColumns()} dataSource={detailData} />
    ) : (
      <Calendar className="atds-calendar" ref="calendar" dateFullCellRender={this.dateCellRender}/>
    )
  };

  render() {
    const {
      attendance: { recordData },
    } = this.props;
    const detailList = this.state.detailList;
    return (
      <div style={{padding: '16px 24px'}}>
        <Row>
          <Col span={20}>
            <MonthPicker ref="monthPicker" value={this.state.month} onChange={this.onMonthChange} allowClear={false} disabledDate={this.disabledDate}/>
            <Button style={{marginLeft: 16}} onClick={this.goToCurrMonth} type="primary">本月</Button>
            <Switch checkedChildren="开" unCheckedChildren="关" style={{marginLeft: 32}} checked={this.state.switchOpen} onChange={this.changeCalendarView} />
            <span style={{display:'inline-block', verticalAlign: 'middle',marginLeft: 8}}>打卡时间</span>
            <ul style={{marginLeft: 32, display: (this.state.detailView ? 'none' : 'inline-block')}} className={styles.tipList}>
              <li><i className={styles.normal}></i>出勤</li>
              <li><i className={styles.unusual}></i>异常</li>
              <li><i className={styles.out}></i>请假</li>
            </ul>
          </Col>
        </Row>
        {this.justifyCalendarList(recordData)}
      </div>
    );
  }
}
