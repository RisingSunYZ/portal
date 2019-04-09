import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Calendar, Select, Row, Col, Radio, Popover, Card, Modal } from 'antd';
import ScheduleGrant from './ScheduleGrant';
import ScheduleEventDetail from './ScheduleEventDetail';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './index.less';
const localizer = BigCalendar.momentLocalizer(moment);
const meetingList = [], list = [];
@connect(({ schedule, user, loading }) => ({
  schedule,
  user,
  loading: loading.models.schedule,
}))

export default class Schedule extends PureComponent {

  state = {
    currDate: moment(),
    view: 'month',
    selEvent: '',
    start: moment().startOf('month'),
    end: moment().endOf('month'),
    graPersonNo: null,
    graType: 1,
    eventType: 0,
  };

  componentDidMount() {
    const { dispatch, user: { currentUser } } = this.props;
    dispatch({
      type: 'schedule/queryScheduleGrantedByNo',
    });
    this.setState({
      graPersonNo: currentUser.no
    });
    this.queryEventByDate();
  }

  queryEventByDate = () => {
    const { dispatch } = this.props;
    const { currDate, graPersonNo } = this.state;
    dispatch({
      type: 'schedule/queryScheduleList',
      payload: {
        receiveNo: graPersonNo,
        start: moment(currDate).startOf('month').format('YYYY-MM-DD')+" 00:00",
        end: moment(currDate).endOf('month').format('YYYY-MM-DD')+" 23:59",
      }
    });
  };

  onViewChange = view => {
    this.setState({
      view,
    });
    this.getRangeByView(view);
  };

  getRangeByView = view => {
    const { currDate } = this.state;
    let start, end;
    if(view === 'month'){
      start = moment(currDate).startOf('month');
      end = moment(currDate).endOf('month');
    }else if(view === 'week'){
      start = moment(currDate).startOf('isoWeek');
      end = moment(currDate).endOf('isoWeek');
    }else if(view === 'day'){
      start = moment(currDate).startOf('day');
      end = moment(currDate).endOf('day');
    }
    this.setState({
      start,
      end,
    })
  };

  renderEvent = (tar) => {
    if(!tar) return <div></div>;
    const { event, style } = tar;
    const { graType, eventType } = this.state;
    let cls = 'note';
    if(event.type ===2){
      cls = 'meeting';
    }
    return eventType ===0 ||event.type === eventType ?(
      <ScheduleEventDetail
        title="查看详情"
        eventId={event.id}
        disabled={graType===0}
        showRender={()=>{
          return <div className={`event-box ${cls}`} style={style ? {top: `${style.top}%`,left: `${style.left}%`,width: `${style.width}%`,height: `${style.height}%`} : {}}>
            <div>
              <span>{event.title}</span>
            </div>
          </div>
        }}
        onChange={this.queryEventByDate}
      />
    ) : ''
  };

  dateCellRender = (date) => {
    const { start, end } = this.state;
    const ms = date.startOf('date').valueOf();
    let cls = '', selected = false;
    if(meetingList.filter(d=>moment(d,'YYYY-MM-DD').valueOf() === ms).length>0){
      cls += ' tipType_2';
    }
    if(list.filter(d=>moment(d,'YYYY-MM-DD').valueOf() === ms).length>0){
      cls += ' tipType_1';
    }
    if(ms >= start.valueOf() && ms <= end.valueOf()){
      selected = true;
    }
    return (
      <div className={`left-date-box ${selected ? 'selected' : ''}`}>
        <div className="date-number"><i className={`tip${cls}`} />{date.date()}</div>
      </div>
    )
  };

  onDateChange = date => {
    this.setState({
      currDate: date
    },()=>{
      this.getRangeByView(this.state.view);
      this.queryEventByDate();
    });
  };

  updateEventsByNo = (no, opt) => {
    this.setState({
      graPersonNo: no,
      graType: opt.props.gratype
    },()=>{
      this.queryEventByDate();
    });
  };

  onEventTypeChange = e => {
    this.setState({
      eventType: e.target.value
    });
  };

  render() {
    const {
      schedule: { scheduleList, scheduleEventGrantList },
      user: { currentUser },
    } = this.props;
    const { currDate, view, selEvent, graType } = this.state;
    meetingList.length = 0; list.length = 0;
    scheduleList.map((event)=>{
      if(event.type === 2){
        meetingList.push(event.startTime.split(" ")[0]);
      }else{
        list.push(event.startTime.split(" ")[0]);
      }
    });
    return (
      <Fragment>
        <Card bordered={false} bodyStyle={{padding: 16}}>
          <Row style={{marginBottom: 10}}>
            <Col offset={10} span={6}>
              <Radio.Group name="eventType" defaultValue={0} onChange={this.onEventTypeChange}>
                <Radio value={0}>全部</Radio>
                <Radio value={1}>事项</Radio>
                <Radio value={2}>会议</Radio>
              </Radio.Group>
            </Col>
            <Col span={4}>
              <Select style={{width: 150}} defaultValue={currentUser.no} onChange={this.updateEventsByNo}>
                <Select.Option key={currentUser.no} gratype={1}>我的日程</Select.Option>
                {scheduleEventGrantList.length>0 ? scheduleEventGrantList.map(grant => (
                  <Select.Option key={grant.grantPersonNo} gratype={grant.grantType}>{`${grant.grantPersonName}(${grant.grantTypeStr})`}</Select.Option>
                )) : ''}
              </Select>
            </Col>
            <Col span={2}>
              <ScheduleEventDetail
                eventId={selEvent}
                disabled={graType===0}
                onChange={this.queryEventByDate}
              />
            </Col>
            <Col span={2}>
              <ScheduleGrant enable={graType !== 0} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Calendar
                className={styles.leftCalendar}
                fullscreen={false}
                value={ currDate }
                dateFullCellRender={this.dateCellRender}
                onChange={this.onDateChange}
              />
            </Col>
            <Col span={18}>
              <div style={{height: 600}}>
                <BigCalendar
                  popup
                  className="schedule-container"
                  date={currDate.toDate()}
                  localizer={localizer}
                  culture="ZN-CH"
                  view={view}
                  onView={this.onViewChange}
                  events={scheduleList}
                  startAccessor={e=>new Date(e.startTime)}
                  endAccessor={e=>new Date(e.endTime)}
                  views={['month', 'week', 'day']}
                  onNavigate={(d)=>this.onDateChange(moment(d))}
                  messages= {{
                    allDay: "全天",
                    date: "Date",
                    day: "日",
                    month: "月",
                    next: "后一天",
                    previous: "前一天",
                    today: "今天",
                    tomorrow: "明天",
                    week: "周",
                    yesterday: "昨天",
                  }}
                  components={{
                    eventWrapper: this.renderEvent
                  }}
                />
              </div>
            </Col>
          </Row>
        </Card>
      </Fragment>
    )
  }
}
