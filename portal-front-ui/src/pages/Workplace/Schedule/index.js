import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Calendar, Select, Row, Col, Radio, Popover, Card, Button, Icon } from 'antd';
import ScheduleGrant from './ScheduleGrant';
import ScheduleEventDetail from './ScheduleEventDetail';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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

  addMeeting = () => {
    window.open('/workplace/meeting-room/:tab/meeting-input/0');
  };

  render() {
    const {
      schedule: { scheduleList, scheduleEventGrantList },
      user: { currentUser },
    } = this.props;
    const { currDate, view, selEvent, graType, eventType } = this.state;
    const filterEvents = [];
    meetingList.length = 0; list.length = 0;
    scheduleList.map((event)=>{
      if(event.type === 2){
        (eventType === 2 || eventType === 0) && filterEvents.push(event);
        meetingList.push(event.startTime.split(" ")[0]);
      }else{
        (eventType === 0 || eventType === 1) && filterEvents.push(event);
        const tempS = event.startTime.split(" ")[0];
        if(moment(tempS).isBefore(event.endTime,'date')){
          const day = moment(event.endTime.split(" ")[0]).diff(moment(tempS), 'days');
          for(let i = 0; i <= day; i++){
            list.push(moment(tempS).add(i, 'days').format("YYYY-MM-DD"));
          }
        }else{
          list.push(tempS);
        }
      }
    });
    return (
      <PageHeaderWrapper>
        <Fragment>
          <Card bordered={false} bodyStyle={{padding: 16}}>
            <Row className={styles.toolbar}>
              <Col offset={10} span={6}>
                <Radio.Group name="eventType" defaultValue={0} onChange={this.onEventTypeChange} style={{marginTop: 5}}>
                  <Radio value={0}>全部</Radio>
                  <Radio value={1}>事项<i className="event-type type-1" /></Radio>
                  <Radio value={2}>会议<i className="event-type type-2" /></Radio>
                </Radio.Group>
              </Col>
              <Col span={4}>
                <Select style={{width: 150}} defaultValue={currentUser.no} onChange={this.updateEventsByNo}>
                  <Select.Option key={0} value={currentUser.no} gratype={1}>我的日程</Select.Option>
                  {scheduleEventGrantList.length>0 ? scheduleEventGrantList.map((grant, i) => (
                    <Select.Option key={i+1} value={grant.grantPersonNo} gratype={grant.grantType}>{`${grant.grantPersonName}(${grant.grantTypeStr})`}</Select.Option>
                  )) : ''}
                </Select>
              </Col>
              <Col span={2}>
                {eventType === 2 ? (
                  <Button disabled={graType===0} onClick={this.addMeeting}><Icon type="plus" style={{color: '#1890FF'}} />新建</Button>
                ) : (
                  <ScheduleEventDetail
                    eventId={selEvent}
                    disabled={graType===0}
                    onChange={this.queryEventByDate}
                  />
                )}
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
                    view={view}
                    onView={this.onViewChange}
                    events={filterEvents}
                    startAccessor={e=>new Date(e.startTime)}
                    endAccessor={e=>new Date(e.endTime)}
                    views={['month', 'week', 'day']}
                    onNavigate={(d)=>this.onDateChange(moment(d))}
                    messages= {{
                      allDay: "全天",
                      day: "日",
                      month: "月",
                      next: view === 'month' ? "下月" : (view === 'week' ? '下周' : '明天'),
                      previous:  view === 'month' ? "上月" : (view === 'week' ? '上周' : '昨天'),
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

      </PageHeaderWrapper>
    )
  }
}
