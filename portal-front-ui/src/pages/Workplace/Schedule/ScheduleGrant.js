import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Modal, Input, Select, Icon, Button, message } from 'antd';
import { UserSelect } from '@/components/Selector';
import styles from './index.less';
import {getConfig} from "../../../utils/utils";

@connect(({ schedule,loading }) => ({
  schedule,
  loading: loading.models.schedule,
}))
export default class ScheduleGrant extends PureComponent {
  state = {
    visible: false,
  };

  componentDidMount() {
  }

  createGrantList = scheduleEventGrantList => {
    if(scheduleEventGrantList.length > 0){
      return scheduleEventGrantList.map((item)=>{
        return (
          <Row key={item.id} className={styles.grantList}>
            <Col offset={1} span={4}>{item.grantedPersonName}</Col>
            <Col span={5}>
              <label><input name={item.grantedPersonNo} type="radio" checked={item.grantType === 0 ? true : false} />查阅</label>
            </Col>
            <Col span={5}>
              <label><input name={item.grantedPersonNo} type="radio" checked={item.grantType === 1 ? true : false}/>修改</label>
            </Col>
            <Col offset={5} span={4}>
              <Button type="danger" ghost>删除</Button>
            </Col>
          </Row>
        )
      });
    }
  };

  grantModelShow = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: true
    });
    dispatch({
      type: 'schedule/queryScheduleGrant',
    });
  };

  updateGrantPerson = (persons) => {
    console.log(persons);
  };

  render() {
    const { visible } = this.state;
    const { schedule: { scheduleGrant: { scheduleEventGrantList } } } = this.props;
    const selPersons = [];
    scheduleEventGrantList.map(per=>{
      selPersons.push({no: per.grantedPersonNo, name: per.grantedPersonName});
    });
    return (
      <Fragment>
        <Modal
          bodyStyle={{padding: 12}}
          visible={visible}
          title="授权"
          onCancel={()=>this.setState({visible: false})}
        >
          <Row style={{marginBottom: 10}}>
            <Col span={20}>
              <UserSelect
                type="button"
                showText="选择人员"
                value={selPersons}
                onChange={this.updateGrantPerson}
              />
            </Col>
            <Col>
              <Button type="primary" ghost>授权</Button>
            </Col>
          </Row>
          {this.createGrantList(scheduleEventGrantList)}
        </Modal>
        <Button onClick={this.grantModelShow}><Icon type="add" />授权</Button>
      </Fragment>
    );
  }
}
