import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Popover, Icon, Row, Col, Input, InputNumber, Card, Modal, Select, Button, Table  } from 'antd';
import styles from './index.less';
import Link from 'umi/link';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import MeetingRoomApplyDetail from '../components/MeetingRoomApplyDetail';
import { getConfig } from '../../../utils/utils.js';
import moment from 'moment';

const FormItem = Form.Item;
let applyLists = [];

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
      <Row gutter={{ md: 8, lg: 16}}>
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
  );
});

@connect(({ mtRoom, loading }) => ({
  mtRoom,
  loading: loading.models.mtRoom,
}))

export default class MeetingRoom extends PureComponent {

  state = {
    currDate: moment(),
    pagination: { pageIndex: 1, pageSize: 10 },
    query: {},
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
            meetingroomId: room.meetingroomId
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
  //日期切换
  goToCurrent = () => {
    this.setState({
      currDate: moment()
    }, ()=>{
      this.loadApplyList(applyLists);
    })
  };
  goPrevWeek = () => {
    const { currDate } = this.state;
    this.setState({
      currDate: moment(currDate).subtract(7, 'day')
    }, ()=>{
      this.loadApplyList(applyLists);
    })
  };
  goNextWeek = () => {
    const { currDate } = this.state;
    this.setState({
      currDate: moment(currDate).add(7, 'day')
    }, ()=>{
      this.loadApplyList(applyLists);
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

  renderApplyList = (date, list, record) => {
    const arr = [];
    const canApply = date.valueOf() >= moment().startOf('date').valueOf();
    if(canApply){
      arr.push(<Icon onClick={()=>this.applyRoom(date, record)} className={styles.applyBtn} type="plus" />);
    }
    list && list.length && list.map((item, index) => {

    });
    return (
      <div className={`${styles.applyContainer} ${canApply ? styles.canApply : ''}`}>
        {arr}
      </div>
    )
  };

  applyRoom = (date, record) => {
    const { dispatch } = this.props;
    this.setState({
      selMtRoomId: record.meetingroomId,
      applyDate: date.format("YYYY-MM-DD"),
      applyData: record[date.format("YYYY-MM-DD")],
      detailVisible: true
    });
    dispatch({
      type: 'mtRoom/getmRoomDetail',
      payload: {
        mrId: record.meetingroomId
      }
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

  render() {
    const {
      mtRoom: { roomList, meetingroomAddrs, meetingroomTools },
      loading,
    } = this.props;
    const { currDate, pagination, detailVisible, selMtRoomId, applyData, applyDate } = this.state;
    const columns = [{
      dataIndex: 'meetingRoom',
      title: '会议室',
      render: (text,  record)=> this.renderRoomColumn(record)
    }];
    for(let i=0; i<7; i++){
      const str = moment(currDate).day(i+1);
      columns.push({
        dataIndex: str.format("YYYY-MM-DD"),
        title: `${moment.weekdays(i+1)}(${str.format("MM月DD日")})`,
        render: (text, record) => this.renderApplyList(str, text, record)
      })
    }
    return (
      <PageHeaderWrapper>
        <Card>
          <Row>
            <Col md={9} sm={12}>
              <Button onClick={this.goToCurrent} type="primary">本周</Button>
              <Button className={styles.weekBtn} onClick={this.goPrevWeek}><Icon type="left" /></Button>
              <span>{moment(currDate).day(1).format('YYYY-MM-DD')}日 - {moment(currDate).day(7).format('YYYY-MM-DD')}日 {moment(currDate).week()}周</span>
              <Button className={styles.weekBtn} onClick={this.goNextWeek}><Icon type="right" /></Button>
            </Col>
            <Col span={15}>
            </Col>
          </Row>
          <SearchMtRoomForm
            meetingroomAddrs={meetingroomAddrs}
            meetingroomTools={meetingroomTools}
            onFieldsChange={this.onSearchMtRoom}
          />
          <Table
            bordered
            rowKey="meetingroomId"
            className={styles.mtApplyList}
            loading={loading}
            columns={columns}
            dataSource={applyLists || []}
            pagination={{
              ...pagination,
              total: roomList.total,
            }}
            onChange={this.handleRoomChange}
          />
        </Card>
        <MeetingRoomApplyDetail
          visible={detailVisible}
          roomId={selMtRoomId}
          applyDate={applyDate}
          applyData={applyData}
          onCancel={()=>this.setState({detailVisible: false })}
          onSave={()=>this.setState({detailVisible: false })}
        />
      </PageHeaderWrapper>
    )
  }
}
