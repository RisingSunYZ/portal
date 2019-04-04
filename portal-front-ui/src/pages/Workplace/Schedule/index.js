import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Calendar, Icon, Row, Col, Menu, Dropdown, Popover, Input, Card, Modal } from 'antd';
import ScheduleGrant from './ScheduleGrant';
import ScheduleEventDetail from './ScheduleEventDetail';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './index.less';
const localizer = BigCalendar.momentLocalizer(moment);
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
  };

  componentDidMount() {
    this.queryEventByDate();
  }

  queryEventByDate = () => {
    const { dispatch, user: { currentUser } } = this.props;
    const { view, currDate } = this.state;
    let start, end;
    if(view === 'month'){
      start = `${moment(currDate).startOf('month').format('YYYY-MM-DD')} 00:00`;
      end = `${moment(currDate).endOf('month').format('YYYY-MM-DD')} 23:59`;
    }else if(view === 'week'){
      start = `${moment(currDate).startOf('isoWeek').format('YYYY-MM-DD')} 00:00`;
      end = `${moment(currDate).endOf('isoWeek').format('YYYY-MM-DD')} 23:59`;
    }else if(view === 'day'){
      start = `${moment(currDate).startOf('day').format('YYYY-MM-DD')} 00:00`;
      end = `${moment(currDate).endOf('day').format('YYYY-MM-DD')} 23:59`;
    }
    dispatch({
      type: 'schedule/queryScheduleList',
      payload: {
        receiveNo: currentUser.no,
        start,
        end,
      }
    });
  };

  onViewChange = view => {
    this.setState({
      view,
    });
  };

  renderEvent = ({ event }) => {
    return (
      <ScheduleEventDetail eventId={event.id} showRender={()=>{
        return <div className={`${styles.event} ${event.type === 2 ? styles.note : styles.meeting}`}>
          <span>{event.title}</span>
        </div>
      }}>
      </ScheduleEventDetail>
    )
  };

  onDateChange = d => {
    const date = moment(d);
    this.setState({
      currDate: date
    },()=>{
      this.queryEventByDate();
    });
  };

  render() {
    const {
      schedule: { scheduleList }
    } = this.props;
    const { currDate, view, selEvent } = this.state;
    return (
      <Fragment>
        <Card bordered={false} bodyStyle={{padding: 16}}>
          <Row>
            <Col span={3}>
              <ScheduleEventDetail eventId={selEvent} />
            </Col>
            <Col span={3}>
              <ScheduleGrant />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6} style={{paddingTop: 10}}>
              <Calendar fullscreen={false} value={ currDate } />
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
                  events={scheduleList}
                  startAccessor={e=>new Date(e.startTime)}
                  endAccessor={e=>new Date(e.endTime)}
                  views={['month', 'week', 'day']}
                  onNavigate={this.onDateChange}
                  components={{
                    event: this.renderEvent,
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
