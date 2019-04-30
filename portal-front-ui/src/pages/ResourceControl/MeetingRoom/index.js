import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Popover, Icon, Row, Col, Input, InputNumber, Card, Modal, Select, Button, Table  } from 'antd';
import styles from './index.less';
import Link from 'umi/link';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import MeetingRoomApplyDetail from '../components/MeetingRoomApplyDetail';
import { UserHeadBox } from '@/components/User';
import { getConfig } from '../../../utils/utils.js';
import moment from 'moment';

const FormItem = Form.Item;
const applyMap = {};
const SearchMtRoomForm = Form.create({
  onValuesChange: (props, changedValues, allValues)=>{
    const confToolsStr = allValues['confToolsStr'] ? allValues['confToolsStr'].join(',') : undefined;
    const meetingRoomQuery = {
      ...allValues,
      confToolsStr
    };
    props.onFieldsChange && props.onFieldsChange(meetingRoomQuery);
  }
})((props) => {
  const { form: { getFieldDecorator }, meetingroomAddrs, meetingroomTools } = props;
  return (
    <Form layout="inline">
      <FormItem label="地点">
        {getFieldDecorator('meetingroomAddrId')(
          <Select placeholder="请选择" style={{ width: 120 }}>
            {meetingroomAddrs.map(addr => (
              <Select.Option key={addr.id}>{addr.address}</Select.Option>
            ))}
          </Select>
        )}
      </FormItem>
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
      <FormItem label="设备">
        {getFieldDecorator('confToolsStr')(
          <Select mode="multiple" style={{ width: 180 }}>
            {meetingroomTools.map(tool => (
              <Select.Option key={tool.id}>{tool.name}</Select.Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem label="会议室名称">
        {getFieldDecorator('meetingroomName')(
          <Input />
        )}
      </FormItem>
    </Form>
  );
});

@connect(({ mtRoom, loading }) => ({
  mtRoom,
  loading: loading.models.mtRoom,
}))

export default class MeetingRoom extends Component {

  state = {
    currDate: moment(),
    pagination: { pageIndex: 1, pageSize: 10 },
    query: {},
    applyMap: {},
    selMtRoomId: "",
    detailVisible: false,
  };

  componentDidMount(){
    const { dispatch } =this.props;
    dispatch({
      type: 'mtRoom/getMeetingAddrsTools',
    });
    this.queryRoomList();
  }

  queryRoomList = () => {
    const { dispatch } =this.props;
    const { pagination, query } = this.state;
    dispatch({
      type: 'mtRoom/querymRoomList',
      payload: {
        query: pagination,
        meetingroomViewVo: query,
      },
      callback: (res)=>{
        this.loadApplyList(res.data);
      }
    });
  };

  loadApplyList = (data) => {
    const { applyMap } = this.state;
    if(data && data.length){
      const { dispatch } = this.props;
      const { currDate } = this.state;
      const start = moment(currDate).startOf('week').format('YYYY-MM-DD'), end = moment(currDate).endOf('week').format('YYYY-MM-DD');
      data.map((room, index)=>{
        applyMap[room.meetingroomId] = room;
        dispatch({
          type: 'mtRoom/queryApplyList',
          payload: {
            startDateStr: start,
            endDateStr: end,
            meetingroomId: room.meetingroomId
          },
          callback: (res)=>{
            if(res && res.length){
              res.map((apply)=>{
                applyMap[room.meetingroomId][apply.applyDateStr] = apply.applyItemVo || [];
              });
            }
          }
        })
      })
    }
  };
  //日期切换
  goToCurrent = () => {
    this.setState({
      currDate: moment()
    }, ()=>{
      this.loadApplyList();
    })
  };
  goPrevWeek = () => {
    const { currDate } = this.state;
    this.setState({
      currDate: moment(currDate).subtract(7, 'day')
    }, ()=>{
      this.loadApplyList();
    })
  };
  goNextWeek = () => {
    const { currDate } = this.state;
    this.setState({
      currDate: moment(currDate).add(7, 'day')
    }, ()=>{
      this.loadApplyList();
    })
  };

  onSearchMtRoom = (query) => {
    this.setState({
      query
    },()=>{
      this.queryRoomList();
    });
  };

  renderRoomColumn = (record) => {
    return (
      <Popover placement="right" content={
        <Row className={styles.meetingroomDetail}>
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

  renderApplyList = (date, record) => {
    const { applyMap } = this.state;
    const list = applyMap[record.meetingroomId] ? applyMap[record.meetingroomId][date.format("YYYY-MM-DD")] : [];
    const arr = [];
    const canApply = date.valueOf() >= moment().startOf('date').valueOf();
    if(canApply){
      arr.push(<Icon key={date.format()} onClick={()=>this.applyRoom(date, record)} className={styles.applyBtn} type="plus" />);
    }
    list && list.length && list.map((item, index) => {
      arr.push(<div className="record-box" key={index+1}>
        {item.status === 1 ? <Icon type="check-circle" theme="filled" className="ok" /> : <Icon type="info-circle" theme="filled" className="in-approve" />}
        <span className="time-range">{item.startTimeStr}-{item.endTimeStr}</span>
        <UserHeadBox userNo={item.applyPersonNo} textRender={()=><span className="apply-user">{item.applyPersonName}</span>} />
      </div>)
    });
    return (
      <div className={`${styles.applyContainer} ${canApply ? styles.canApply : ''}`}>
        {arr}
      </div>
    )
  };

  applyRoom = (date, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mtRoom/getmRoomDetail',
      payload: {
        mrId: record.meetingroomId
      }
    });
    dispatch({
      type: 'mtRoom/queryApplyList',
      payload: {
        meetingroomId: record.meetingroomId,
        startDateStr: date.format("YYYY-MM-DD"),
        endDateStr: date.format("YYYY-MM-DD"),
      }
    });
    this.setState({
      selMtRoomId: record.meetingroomId,
      applyDate: date.format("YYYY-MM-DD"),
      detailVisible: true
    });
  };

  handleRoomChange = (pagination) => {
    this.setState({
      pagination: {
        pageSize: pagination.pageSize,
        pageIndex: pagination.current
      }
    }, ()=>{
      this.queryRoomList()
    });
  };

  reloadMeetRoomList = (applyVo) => {
    const { applyMap } = this.state;
    this.props.dispatch({
      type: 'mtRoom/queryApplyList',
      payload: {
        meetingroomId: applyVo.meetingroomId,
        startDateStr: applyVo.startDateStr,
        endDateStr: applyVo.endDateStr,
      },
      callback: (res)=>{
        res && res.length && res.map(dateapply => {
          applyMap[applyVo.meetingroomId][dateapply.applyDateStr] = dateapply.applyItemVo;
        });console.log(applyMap);
        this.setState({
          applyMap,
          detailVisible: false
        });
      }
    });
  };

  render() {
    const {
      mtRoom: { roomList, meetingroomAddrs, meetingroomTools },
      loading,
    } = this.props;
    const { currDate, pagination, detailVisible, applyDate } = this.state;
    const columns = [{
      dataIndex: 'meetingRoom',
      title: '会议室',
      render: (text,  record)=> this.renderRoomColumn(record)
    }];
    for(let i=0; i<7; i++){
      const str = moment(currDate).startOf('week').add(i, 'day');
      columns.push({
        dataIndex: str.format("YYYY-MM-DD"),
        title: `${moment.weekdays(i+1)}(${str.format("MM月DD日")})`,
        render: (text, record) => this.renderApplyList(str, record)
      })
    }
    return (
      <PageHeaderWrapper>
        <Card>
          <Row style={{lineHeight: '40px', marginBottom: 10}}>
            <Col md={6} sm={12}>
              <Button onClick={this.goToCurrent} type="primary">本周</Button>
              <Button className={styles.weekBtn} onClick={this.goPrevWeek}><Icon type="left" /></Button>
              <span>{moment(currDate).startOf('week').format('YYYY-MM-DD')}日 - {moment(currDate).endOf('week').format('YYYY-MM-DD')}日 {moment(currDate).week()}周</span>
              <Button className={styles.weekBtn} onClick={this.goNextWeek}><Icon type="right" /></Button>
            </Col>
            <Col md={14} sm={20}>
              <SearchMtRoomForm
                meetingroomAddrs={meetingroomAddrs}
                meetingroomTools={meetingroomTools}
                onFieldsChange={this.onSearchMtRoom}
              />
            </Col>
            <Col span={4}>
              <Link to={`/biz-sys/zygl/hys/my-apply`}><Icon style={{color: '#0e65af', fontSize: 16, marginRight: 3}} type="profile" />我的申请</Link>
            </Col>
          </Row>
          <Table
            bordered
            rowKey="meetingroomId"
            className={styles.mtApplyList}
            loading={loading}
            columns={columns}
            dataSource={roomList.data || []}
            pagination={{
              ...pagination,
              total: roomList.total,
            }}
            onChange={this.handleRoomChange}
          />
        </Card>
        {detailVisible ? <MeetingRoomApplyDetail
          visible={detailVisible}
          meetDate={applyDate}
          onCancel={()=>this.setState({detailVisible: false })}
          onSave={this.reloadMeetRoomList}
        /> : ''}
      </PageHeaderWrapper>
    )
  }
}
