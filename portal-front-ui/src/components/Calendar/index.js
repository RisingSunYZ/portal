import React, { Component, Fragment } from 'react';
import { Modal, Button, Table, Select, Tooltip } from 'antd';
import  { initLCalendar, MonthLength, countLMonthDays }  from './calendar';
import styles from './index.less';

const Option = Select.Option;

export default class Calendar extends Component {

  state = {
    visible : false,
    currentYear : new Date().getFullYear(),
    currentMonth : new Date().getMonth(),
    dataSourceCld:null,
    lunarDetail:null
  }

  columns = [{
    title: '日',
    dataIndex: 'Sun',
    key: 'Sun',
    render: text => this.initCell(text)
  }, {
    title: '一',
    dataIndex: 'Mon',
    key: 'Mon',
    render: text => this.initCell(text)
  }, {
    title: '二',
    dataIndex: 'Tue',
    key: 'Tue',
    render: text => this.initCell(text)
  }, {
    title: '三',
    key: 'Wed',
    dataIndex: 'Wed',
    render: text => this.initCell(text)
  }, {
    title: '四',
    key: 'Thu',
    dataIndex: 'Thu',
    render: text => this.initCell(text)
  }, {
    title: '五',
    key: 'Fri',
    dataIndex: 'Fri',
    render: text => this.initCell(text)
  }, {
    title: '六',
    key: 'Sat',
    dataIndex: 'Sat',
    render: text => this.initCell(text)
  }]

  //初始化单元格
  initCell = (text) => {
    var detail = text.detail;
    var cell;
    if (detail){
      var tipText = <div style={{ textAlign: 'right' }}>{detail.cYear}年 {detail.cMonth}月 {detail.cDay}日<br />
        {detail.ncWeek}<br />
        农历 {detail.lMonth}月 {detail.lDay}日<br />
        {detail.gzYear}年 {detail.gzMonth}月 {detail.gzDay}日<br />
        <div style={{ textAlign: 'center', background:'#0168ea' }}>{text.fterm ? text.fterm : ''}</div> </div>;
      cell =
        <div>
          <Tooltip placement="bottom" title={tipText}>
            <span>{detail.cDay}</span><br /><div style={{ color:text.daycolor }}>{text.lDay}</div>
          </Tooltip>
        </div>;
    }
    return cell;
  }

  //渲染前调用
  componentWillMount(){
    // this.gainCurrentDate();
    var today = new Date();
    this.setState({
      currentYear : today.getFullYear(),
      currentMonth : today.getMonth()
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.initial();
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  // 年份下拉框选项
  gainYearOptions = () => {
    var currentYear = this.state.currentYear;
    var options = [];

    // 年份上限（2100）和下限值（1900）
    if (currentYear < 1905) {
      currentYear = 1905;
    }else if (currentYear > 2097){
      currentYear = 2097;
    }

    // 年份下拉选择项
    for (var i = currentYear - 5 ; i < currentYear + 4 ; i ++){
      options.push(<Option key={i}>{i}</Option>);
    }
    return options;
  }

  // 年份下拉框选项
  gainMonthOptions = () => {
    var options = [];
    for (var i = 0; i < 12; i ++){
      options.push(<Option key={i}>{i + 1}</Option>);
    }
    return options;
  }

  // 年份下拉框change事件
  handleYearChange = (value) => {
    // 年份最低要求逻辑
    this.setState({
      currentYear : Number(value)
    }, function () {
      this.initial();
    });
  }

  // 月份下拉框change事件
  handleMonthChange = (value) => {
    this.setState({
      currentMonth : Number(value)
    })

    this.initial();
  }

  // 获取当月事件
  gainCurrentDate = () => {
    var today = new Date();
    this.setState({
      currentYear : today.getFullYear(),
      currentMonth : today.getMonth()
    }, function () {
      this.initial();
    });
  }

  // 年份下调
  yearDown = () => {
    var currentYear = this.state.currentYear;
    var newCurrentYear = currentYear > 1900 ? currentYear - 1 : 1900;
    this.setState({
      currentYear : newCurrentYear
    }, function () {
      this.initial();
    });
  }

  // 年份上调
  yearUpper = () => {
    var currentYear = this.state.currentYear;
    var newCurrentYear = currentYear < 2100 ? currentYear + 1 : 2100;
    this.setState({
      currentYear : newCurrentYear
    }, function () {
      this.initial();
    });

  }

  // 月份下调
  monthDown = () => {
    var currentYear = this.state.currentYear;
    var currentMonth = this.state.currentMonth;
    if (currentMonth < 1) {
      if (currentYear == 1900){
        currentYear = 1900;
      }else {
        currentYear --;
      }
      currentMonth = 11;
    } else {
      currentMonth -- ;
    }
    this.setState({
      currentYear : currentYear,
      currentMonth : currentMonth
    }, function () {
      this.initial();
    });

  }

  // 月份上调
  monthUpper = () => {
    var currentYear = this.state.currentYear;
    var currentMonth = this.state.currentMonth;
    if (currentMonth > 10) {
      if (currentYear == 2100){
        currentYear = 2100;
      }else {
        currentYear ++;
      }

      currentMonth = 0;
    } else {
      currentMonth ++ ;
    }
    this.setState({
      currentYear : currentYear,
      currentMonth : currentMonth
    }, function () {
      this.initial();
    });

  }

  // 页面初始化
  initial = () => {
    this.drawCld();
  }

  // 日历
  drawCld = () => {
    var i,s,size;
    var SY = this.state.currentYear;
    var SM = this.state.currentMonth + 1;
    var cldFirstDay = initLCalendar(SY,SM, 1);
    var firstWeek = cldFirstDay.nWeek == 7 ? 0 : cldFirstDay.nWeek;
    var monthLength = MonthLength(SY,SM);

    var lunarDetail = <span>农历 {cldFirstDay.gzYear}年 <span style={{ fontSize:20 }}>{cldFirstDay.Animal}</span></span>;

    var calendarArr = new Array();
    var weekEnum = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var length = Math.ceil((monthLength + firstWeek)/7) * 7;    //向上取整
    for(i = 0; i < length; i++) {

      if (i % 7 == 0){
        var key = i/7;
        var column = {key: key, Sun: null, Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null};
      }

      var day = {
        detail : null,
        lDay:null,
        fterm:null,
        daycolor : null,

      };
      var daycolor = null;
      // sObj.style.background = '';
      // lObj.style.background = '';

      if(i >= firstWeek && i < (monthLength + firstWeek)) {
        var lCalendarDay = '';
        var SD = i - firstWeek + 1;
        var cld = initLCalendar(SY,SM, SD);
        // sObj.innerHTML = sD+1;
        if(cld.isToday){
          //设置今天的背景色
          // sObj.style.background = '#defdfd';
          // lObj.style.background = '#91dae3';
        }

        if(cld.lDay == 1){
          lCalendarDay = (cld.isLeap ? '闰': '') + cld.lMonth + '月' + (countLMonthDays(cld.lYear,cld.lMonth) == 29 ? '小': '大');
        } else{
          lCalendarDay = cld.IDayCn;
        }

        var s = cld.lunarFestival ? cld.lunarFestival : '';
        if(s.length > 0) {
          //农历节日名称大于5个字截去
          //if(s.length>5) s = s.substr(0, 3)+'…';
          if(s.length > 7) s = s.substr(0, 5) + '…';
          daycolor = '#ff5f07';
        } else {
          s=cld.solarFestival ? cld.solarFestival : '';
          if(s.length > 0) {
            //阳历节日名称截去
            //size = (s.charCodeAt(0)>0 && s.charCodeAt(0)<128)?8:4;
            size = (s.charCodeAt(0) > 0 && s.charCodeAt(0) < 128) ? 9 : 5;
            if(s.length > size + 1) s = s.substr(0, size - 1) + '…';
            daycolor = '#0168ea';
          } else {
            s=cld.Term ? cld.Term : "";
            if(s.length > 0) daycolor = '#44d7cf';
          }
        }
        if(s && s.length > 0){
          lCalendarDay = s;
          day.fterm = s;
        }

        day.detail = cld;
        day.daycolor = '';
        day.lDay = lCalendarDay;
        day.daycolor = daycolor;

      } else {
        day.detail = '';
        day.daycolor = '';
        day.lDay = '';
        day.daycolor = '';
      }

      column[weekEnum[i%7]] = day;
      if ((i + 1) % 7 == 0){
        calendarArr.push(column);
      }
    }

    this.setState({
      dataSourceCld:calendarArr,
      lunarDetail:lunarDetail
    });

  };

  createCalendarView = today => {
    const { viewRender } = this.props;
    return viewRender ? viewRender(today) : (
      <div>
        <h1>{today.ncWeek}</h1>
        <span>{today.cMonth}月{today.cDay}日 农历{today.IMonthCn}{today.IDayCn}</span>
      </div>
    )
  };

  render() {
    const monthOptions = this.gainMonthOptions();
    const yearOptions = this.gainYearOptions();
    var today = new Date();
    var todayCld = initLCalendar(today.getFullYear(), today.getMonth() + 1, today.getDate())

    return (
      <Fragment>
        <div onClick={this.showModal}>
          {this.createCalendarView(todayCld)}
        </div>

        {/*<Button type="primary" onClick={this.showModal}>*/}
        {/*Open Modal*/}
        {/*</Button>*/}

        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width={700}
        >

          <a onClick={this.gainCurrentDate}>本月</a>&nbsp;&nbsp;
          <Button icon="left" onClick={this.yearDown}/>
          &nbsp;公历
          <Select value={this.state.currentYear} style={{ width: 120 }} onChange={this.handleYearChange} >
            {yearOptions}
          </Select>
          年&nbsp;
          <Button icon="right" onClick={this.yearUpper}/>&nbsp;&nbsp;
          <Button icon="left" onClick={this.monthDown}/>&nbsp;
          <Select value={this.state.currentMonth + 1} style={{ width: 120 }} onChange={this.handleMonthChange}>
            {monthOptions}
          </Select>
          月&nbsp;
          <Button icon="right" onClick={this.monthUpper} />&nbsp;&nbsp;
          {this.state.lunarDetail}
          <Table dataSource={this.state.dataSourceCld} columns={this.columns} pagination={false} />
        </Modal>
      </Fragment>
    );
  }
}
