import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col, Card,Button, Input,Modal, Table, Form, DatePicker, Select } from 'antd';
import styles from './index.less';
import { message } from 'antd';

const { RangePicker } = DatePicker;

@connect(({ msg, loading }) => ({
  msg,
  loading: loading.models.msg,
}))
@Form.create()

export default class SysMsg extends PureComponent {
  state={
    searchParam: {
      messageType: "3,4",
    },
    selectedIds: '',
    pagination: {
      current: 1,
      pageSize: 10,
    },
    visible: false,
  };

  componentDidMount(){
    const { dispatch }=this.props;
    const { pagination, searchParam } = this.state;
    dispatch({
      type: 'msg/getNoticeType',
      payload: searchParam
    });
    dispatch({
      type: 'msg/getAllSystem',
      payload: searchParam
    });
    dispatch({
      type: 'msg/getMsgList',
      payload: {
        pageSize: pagination.pageSize,
        pageIndex: 0,
        ...searchParam
      }
    });
  }

  reloadFlowMsg = () => {
    const { dispatch }=this.props;
    const { pagination, searchParam } = this.state;
    this.state.pagination.current = 1;
    dispatch({
      type: 'msg/getMsgList',
      payload: {
        pageSize: pagination.pageSize,
        pageIndex: 0,
        ...searchParam
      }
    });
  };

  handleTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { searchParam } = this.state;
    const params={
      pageIndex:pagination.current-1,
      pageSize:pagination.pageSize,
    };
    this.setState({
      pagination:{
        current: pagination.current,
        pageSize: pagination.pageSize
      }
    });
    dispatch({
      type: 'msg/getMsgList',
      payload: {
        ...params,
        ...searchParam,
      },
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pagination, searchParam } = this.state;
    form.validateFields((err, values) => {
      if(err) return false;
      const params = {
        systemSn: values.systemSn,
        title: values.title,
        noticeType: values.noticeType,
        startTime: values.rangeTime ? values.rangeTime[0].format('YYYY-MM-DD') : null,
        endTime: values.rangeTime ? values.rangeTime[1].format('YYYY-MM-DD') : null,
      };
      this.setState({
        searchParam: {
          ...searchParam,
          ...params
        },
        pagination: {
          ...pagination,
          current: 1,
        },
      });
      dispatch({
        type: 'msg/getMsgList',
        payload: {
          ...searchParam,
          ...params,
          pageSize: pagination.pageSize,
          pageIndex: 0,
        },
      });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      searchParam: {
        messageType: "3,4",
      }
    },()=>{
      this.reloadFlowMsg();
    })
  };

  doReadMsg = (record) => {
    if(record.status === 0)this.doRead(record.id);
    if(record.noticeType === 3){
      const { dispatch } = this.props;
      dispatch({
        type: 'msg/getMsgDetail',
        payload: {
          id: record.id
        }
      });
      this.setState({
        visible: true
      });
    }else{
      const url = `/portal/process/view.jhtml?url=${record.url || ""}&bizId=${record.bizId || ""}&processInstId=${record.processInstId || ""}`;
      window.open(url, "_blank");
    }
  };

  updateMsgCount  = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'msg/getMsgCount',
    });
  };

  doRead = (ids) => {
    const { dispatch } = this.props;
    const { selectedIds } = this.state;
    if(!ids && !selectedIds){
      message.warn('请选择未读消息', 1);
    }else{
      dispatch({
        type: 'msg/updateMsgStatus',
        payload: {
          ids: ids || selectedIds
        },
        callback: (res) => {
          if(res.code === '100'){
            this.updateMsgCount();
            message.success(res.msg, 1);
            this.reloadFlowMsg();
          }else{
            message.error(res.msg, 1);
          }
        }
      })
    }
  };

  render() {
    const {
      msg: {  msgList, noticeType, systemList, msgDetail },
      form: { getFieldDecorator },
      loading
    } = this.props;
    const { pagination, visible } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const columns = [
      {
        title: '消息类型',
        dataIndex: 'noticeType',
        width: 100,
        render: (text, record) => {
          if (record.noticeType === 3) {
            return "系统提醒";
          } else if (record.noticeType === 4) {
            return "系统待办";
          }
          return text;
        }
      },
      {
        title: '消息主题',
        dataIndex: 'title',
        width: 400,
        render: (text, record) => {
          return <a style={record.status === 1 ? {color: '#333'} : {}} onClick={()=>this.doReadMsg(record)}>{record.title}</a>
        }
      },
      {
        title: '所属系统',
        dataIndex: 'systemName',
      },
      {
        title: '发送人',
        dataIndex: 'sender',
        render: (text, record) => {
          if (record.noticeType === 2) {
            return "系统管理员";
          }
          return text;
        }
      },
      {
        title: '接收时间',
        dataIndex: 'sendTime',
      }];

    return (
      <Fragment>
        <Modal
          visible={visible}
          title={msgDetail.title}
          width={650}
          footer={<div><Button onClick={()=>this.setState({visible: false})}>关闭</Button></div>}
          onCancel={()=>this.setState({visible: false})}
        >
          <div className={styles.msgViewBox}>
            <Row>
              <Col span={3}>消息主题：</Col>
              <Col span={20}>{msgDetail.title}</Col>
            </Row>
            <Row>
              <Col span={3}>消息类型：</Col>
              <Col span={20}>{msgDetail.noticeType === 2 ? '流程消息' : (msgDetail.noticeType === 3 ? '系统提醒' : '')}</Col>
            </Row>
            <Row>
              <Col span={3}>发送人：</Col>
              <Col span={20}>{msgDetail.sender}</Col>
            </Row>
            <Row>
              <Col span={3}>发送时间：</Col>
              <Col span={20}>{msgDetail.sendTime}</Col>
            </Row>
            <Row>
              <Col span={3}>所属系统：</Col>
              <Col span={20}>{msgDetail.systemName}</Col>
            </Row>
            <Row>
              <Col span={3}>消息内容：</Col>
              <Col span={20}>{msgDetail.content}</Col>
            </Row>
          </div>
        </Modal>
        <Card bordered={false} bodyStyle={{padding: '16px', borderLeft: '1px solid #e8e8e8'}}>
          <div className={styles.msgOpt}>
            <Button onClick={this.reloadFlowMsg}><Icon type="reload" style={{color: '#0e65af'}} />刷新</Button>
            <Button onClick={()=>this.doRead()}><Icon type="file-protect" style={{color: '#0e65af'}} />设为已读</Button>
          </div>
          <Form className={styles.searchMsgForm} {...formItemLayout} onSubmit={this.handleSearch}>
            <Row>
              <Col span={6}>
                <Form.Item label="消息类型">
                  {getFieldDecorator('noticeType')(
                    <Select placeholder="请选择类型">
                      {noticeType && noticeType.length ? noticeType.map(item=>(
                        <Select.Option key={item.noticeType}>{item.message}</Select.Option>
                      )) : ""}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col offset={1} span={6}>
                <Form.Item label="所属系统">
                  {getFieldDecorator('systemSn')(
                    <Select placeholder="请选择">
                      {systemList && systemList.length ? systemList.map(item=>(
                        <Select.Option key={item.sn}>{item.text}</Select.Option>
                      )) : ""}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="起止日期">
                  {getFieldDecorator('rangeTime')(
                    <RangePicker />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="消息主题">
                  {getFieldDecorator('title')(
                    <Input placeholder="请输入消息主题" />
                  )}
                </Form.Item>
              </Col>
              <Col offset={10} span={5} style={{paddingTop: 4, textAlign: 'right'}}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
              </Col>
            </Row>
          </Form>
          <Table
            loading={loading}
            rowKey="id"
            rowSelection={{
              onChange: (selectedRowKeys) => {
                this.setState({
                  selectedIds: selectedRowKeys.join(','),
                })
              }
            }}
            columns={columns}
            dataSource={msgList.data}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              total: msgList.total,
            }}
            onChange={this.handleTableChange}
          />
        </Card>
      </Fragment>
    );
  }
}
