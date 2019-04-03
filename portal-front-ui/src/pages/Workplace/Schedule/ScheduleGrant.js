import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Radio, Modal, Form, Select, Icon, Button, message } from 'antd';
import { UserSelect } from '@/components/Selector';
import styles from './index.less';

@connect(({ schedule,loading }) => ({
  schedule,
  loading: loading.models.schedule,
}))

@Form.create()
export default class ScheduleGrant extends Component {
  state = {
    visible: false,
    selPersons: [],
  };

  componentDidMount() {
  }

  createGrantList = () => {
    const { selPersons } = this.state;
    const { getFieldDecorator } = this.props.form;
    if(selPersons.length > 0){
      return selPersons.map((item, idx)=>{
        return (
          <Form.Item style={{margin: 0}}>
            <Row key={idx} className={styles.grantList} ref={item.no}>
              <Col offset={1} span={5}>{item.name}</Col>
              <Col span={9}>
                {getFieldDecorator(`no_${item.no}`,{
                  initialValue: item.grantType ? item.grantType : 0
                })(
                  <Radio.Group name={item.no}>
                    <Radio value={0}>查阅</Radio>
                    <Radio value={1}>修改</Radio>
                  </Radio.Group>
                )}
              </Col>
              <Col offset={5} span={4}>
                <Button type="danger" ghost onClick={()=>this.delGrantedPerson(item, idx)}>删除</Button>
              </Col>
            </Row>
          </Form.Item>
        )
      });
    }
  };

  delGrantedPerson = (person, i) => {
    const { dispatch } = this.props;
    const { selPersons } = this.state;
    if(person.grandId){
      dispatch({
        type: 'schedule/delScheduleGrant',
        payload: person.grandId,
        callback: (res) => {
          selPersons.splice(i, 1);
          message.success(res.msg);
        }
      })
    }else{
      selPersons.splice(i, 1);
      this.setState({
        selPersons
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
    }).then(()=>{
      const { scheduleEventGrantList } = this.props.schedule.scheduleGrant;
      const selPersons = [];
      scheduleEventGrantList.map(per=>{
        selPersons.push({no: per.grantedPersonNo, name: per.grantedPersonName, grandId: per.id, grantType: per.grantType});
      });
      this.setState({
        selPersons
      })
    });
  };

  saveGrantPersons = () => {
    const { selPersons } = this.state;
    const { form, dispatch } = this.props;
    const values = form.getFieldsValue();
    let grantedPersonNos = "", autoType = "";
    selPersons.map((person,index)=>{
      grantedPersonNos += `${index>0 ? ',' : ''}${person.no}_${person.name}_${person.grandId || 0}_${values["no_"+person.no]}`;
      autoType += `${index>0 ? ',' : ''}${person.no}_${values["no_"+person.no]}`;
    });
    dispatch({
      type: 'schedule/saveGrant',
      payload: {
        grantedPersonNo: grantedPersonNos,
        autoType
      },
      callback: (res)=>{
        message.success(res.msg);
        this.setState({
          visible: false
        })
      }
    })
  };

  updateGrantPerson = (persons) => {
    this.setState({
      selPersons: persons
    })
  };

  render() {
    const { visible, selPersons } = this.state;

    return (
      <Fragment>
        <Modal
          bodyStyle={{padding: 12, height: 350}}
          visible={visible}
          title="授权"
          footer={null}
          onCancel={()=>this.setState({visible: false})}
        >
          <div style={{overflow: 'auto', height: '100%'}}>
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
                <Button type="primary" ghost onClick={this.saveGrantPersons}>授权</Button>
              </Col>
            </Row>
            <Form action="">
              {this.createGrantList()}
            </Form>
          </div>
        </Modal>
        <Button onClick={this.grantModelShow}><Icon type="lock" style={{color: '#f5222d'}} />授权</Button>
      </Fragment>
    );
  }
}
