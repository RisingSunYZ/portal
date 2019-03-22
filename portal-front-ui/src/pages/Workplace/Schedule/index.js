import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Calendar, Icon, Row, Col, Menu, Dropdown, Table, Input, Card, Modal } from 'antd';
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
  };

  componentDidMount() {
    const { dispatch, user: { currentUser } } = this.props;
    const { currDate } = this.state;
    const start = new Date(currDate.year(), currDate.month(), 1);
    const end = new Date(currDate.year(), currDate.month(), currDate.daysInMonth());
    dispatch({
      type: 'schedule/queryScheduleList',
      payload: {
        receiveNo: currentUser.no,
        start,
        end,
      }
    });
  }

  render() {
    const {
      schedule: { scheduleList }
    } = this.props;
    const { currDate } = this.state;

    return (
      <Fragment>
        <Card bordered={false} bodyStyle={{padding: 16}}>
          <Row gutter={16}>
            <Col span={6} style={{paddingTop: 40}}>
              <Calendar fullscreen={false} value={ currDate } />
            </Col>
            <Col span={18}>
              <div style={{height: 600}}>
                <BigCalendar
                  className="schedule-container"
                  localizer={localizer}
                  events={scheduleList}
                  startAccessor="start"
                  endAccessor="end"
                  views={['month', 'week', 'day']}
                />
              </div>
            </Col>
          </Row>
        </Card>
      </Fragment>
    )
  }
}
