import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Popover, Icon, Row, Col, Input, InputNumber, Card, Modal, Select, Button, Table  } from 'antd';
import styles from './index.less';
import Link from 'umi/link';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import { getConfig } from '../../../utils/utils.js';
import moment from 'moment';

const FormItem = Form.Item;
let applyLists = [];

@connect(({ mtRoom, loading }) => ({
  mtRoom,
  loading: loading.models.mtRoom,
}))
@Form.create({
  onValuesChange: (props, changedValues, allValues)=>{
    console.log(changedValues, allValues)
  }
})

export default class MeetingRoom extends PureComponent {

  state = {
    currDate: moment(),
    pagination: { pageIndex: 0, pageSize: 10 },
    query: {},
    data: [],
  };

  componentDidMount(){
    const { dispatch } =this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'mtRoom/getMeetingAddrsTools',
    });
    dispatch({
      type: 'mtRoom/querymRoomList',
      payload: pagination,
      callback: (res)=>{
        this.loadApplyList(res.data);
      }
    });
  }

  loadApplyList = (data) => {
    applyLists = data;
    if(data && data.length){
      const { dispatch } = this.props;
      const { currDate } = this.state;
      const start = moment(currDate).day(1).format('YYYY-MM-DD'), end = moment(currDate).day(7).format('YYYY-MM-DD');
      data.map((room, index)=>{
        dispatch({
          type: 'mtRoom/queryApplyList',
          payload: {
            startDateStr: start,
            endDateStr: end,
            meetingroomId: room.meetingroomAddrId
          },
          callback: (res)=>{
            if(res && res.length){
              res.map((apply)=>{
                applyLists[index][apply.applyDateStr] = apply.applyItemVo || [];
              });
            }
          }
        })
      })
    }
  };

  goToCurrent = () => {
    this.setState({
      currDate: moment()
    }, ()=>{
      this.updateRangeDate();
    })
  };
  goPrevWeek = () => {
    const { currDate } = this.state;
    this.setState({
      currDate: moment(currDate).subtract(7, 'day')
    }, ()=>{
      this.updateRangeDate();
    })
  };
  goNextWeek = () => {
    const { currDate } = this.state;
    this.setState({
      currDate: moment(currDate).add(7, 'day')
    }, ()=>{
      this.updateRangeDate();
    })
  };

  updateRangeDate = () => {
    const { currDate, query } = this.state;
    const { dispatch } = this.props;
    const start = moment(currDate).day(1), end = moment(currDate).day(7);
    // dispatch({
    //   type: 'mtRoom/'
    // })
  };

  renderRoomColumn = (record) => {
    return (
      <Popover placement="right" content={
        <Row className="meetingroom-detail">
          <Col span={11}><img src={`${getConfig().ftpHost + record.roomImg}`} alt=""/></Col>
          <Col span={13}>
            <h5>{record.meetingroomName}</h5>
            <Row>
              <Col span={12}>楼层：{record.floorNum}楼</Col>
              <Col span={12}>周期性：{record.isCyclicity === 1 ? '允许' : '不允许'}</Col>
              <Col span={12}>可容纳：{record.personNum}人</Col>
              <Col span={12}>审批人：{record.approver}</Col>
              <Col span={24}>配置信息：{record.tools}</Col>
            </Row>
          </Col>
        </Row>
      }>
        <div style={{ textAlign: 'center' }}>
          {record.meetingroomName}{record.isOpenRange && record.isOpenRange === 1 ? <span className={styles.iconVip} /> : ''}
          <p>（容纳{record.personNum}人）</p>
        </div>
      </Popover>
    )
  };

  render() {
    const {
      form: { getFieldDecorator },
      mtRoom: { roomList, meetingroomAddrs, meetingroomTools },
      loading,
    } = this.props;console.log(applyLists);
    const { currDate, pagination }=this.state;
    const columns = [{
      dataIndex: 'meetingRoom',
      title: '会议室',
      render: (text,  record)=> this.renderRoomColumn(record)
    }];
    for(let i=0; i<7; i++){
      const str = moment(currDate).day(i+1);
      columns.push({
        dataIndex: str.format("YYYY-MM-DD"),
        title: `${moment.weekdays(i+1)}(${str.format("MM月DD日")})`
      })
    }
    return (
      <PageHeaderWrapper>
        <Card>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 16}}>
              <Col md={9} sm={12}>
                <FormItem>
                  <Button onClick={this.goToCurrent} type="primary">本周</Button>
                  <Button className={styles.weekBtn} onClick={this.goPrevWeek}><Icon type="left" /></Button>
                  <span>{moment(currDate).day(1).format('YYYY-MM-DD')}日 - {moment(currDate).day(7).format('YYYY-MM-DD')}日 {moment(currDate).week()}周</span>
                  <Button className={styles.weekBtn} onClick={this.goNextWeek}><Icon type="right" /></Button>
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem label="地点">
                  {getFieldDecorator('meetingroomAddrId')(
                    <Select placeholder="请选择" style={{ width: 120 }}>
                      {meetingroomAddrs.map(addr => (
                        <Select.Option key={addr.id}>{addr.address}</Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="可容纳人数">
                  {getFieldDecorator('personNumMin')(
                    <InputNumber style={{ width: 50 }} />
                  )}&nbsp;&nbsp;&nbsp;&nbsp;—
                </FormItem>
                <FormItem>
                  {getFieldDecorator('personNumMax')(
                    <InputNumber style={{ width: 50 }} />
                  )}
                </FormItem>
              </Col>
              <Col md={5} sm={24}>
                <FormItem label="设备">
                  {getFieldDecorator('confToolsStr')(
                    <Select mode="multiple" style={{ width: 120 }}>
                      {meetingroomTools.map(tool => (
                        <Select.Option key={tool.id}>{tool.name}</Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem label="会议室名称">
                  {getFieldDecorator('meetingroomName')(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Table
            loading={loading}
            columns={columns}
            dataSource={applyLists || []}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              total: roomList.total,
            }}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}
