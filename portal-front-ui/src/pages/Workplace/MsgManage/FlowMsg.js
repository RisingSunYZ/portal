import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col, Card,Button, Input,Tree, Table, Form, DatePicker, Select } from 'antd';
import styles from './index.less';
import Link from 'umi/link';
import { message } from 'antd';

const { RangePicker } = DatePicker;

@connect(({ bizSys, msg, loading }) => ({
  bizSys,
  msg,
  loading: loading.models.msg,
}))
@Form.create()

export default class FlowMsg extends PureComponent {
  state={
    searchParam: {
      messageType: "1,2",
    },
    selectedIds: '',
    pagination: {
      current: 1,
      pageSize: 10,
    }
  };

  componentDidMount(){
    const { dispatch }=this.props;
    const { pagination, searchParam } = this.state;
    dispatch({
      type: 'msg/getNoticeType',
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
        keyWord: values.keyWord,
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
        messageType: "1,2",
      }
    },()=>{
      this.reloadFlowMsg();
    })
  };

  doReadMsg = (record) => {
    if(record.status === 0)this.doRead(record.id);
    const url = `/process/form/view/0/${record.processInstId || 0}/${record.businessKey || 0}/0/0`;
    window.open(url,"_blank");
  };

  updateMsgCount  = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bizSys/getMsgCount',
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
            message.success(res.msg);
            this.reloadFlowMsg();
          }else{
            message.error(res.msg);
          }
        }
      })
    }
  };

  render() {
    const {
      msg: {  msgList, noticeType },
      form: { getFieldDecorator },
      loading
    } = this.props;
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
          if (record.noticeType === 1) {
            return "流程知会";
          } else if (record.noticeType === 2) {
            return "办结提醒";
          }
          return text;
        }
      },
      {
        title: '流程名称 ',
        dataIndex: 'title',
        width: 500,
        render: (text, record) => {
          return <a style={record.status === 1 ? {color: '#333'} : {}} onClick={()=>this.doReadMsg(record)}>{record.title}</a>
        }
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
        <Card bordered={false} bodyStyle={{padding: '16px', borderLeft: '1px solid #e8e8e8'}}>
          <div className={styles.msgOpt}>
            <Button onClick={this.reloadFlowMsg}><Icon type="reload" style={{color: '#0e65af'}} />刷新</Button>
            <Button onClick={()=>this.doRead()}><Icon type="file-protect" style={{color: '#0e65af'}} />设为已读</Button>
          </div>
          <Form className={styles.searchMsgForm} {...formItemLayout} onSubmit={this.handleSearch}>
            <Row>
              <Col span={5}>
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
              <Col span={8}>
                <Form.Item label="起止日期">
                  {getFieldDecorator('rangeTime')(
                    <RangePicker />
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="关键字" labelCol={{span: 9}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('keyWord')(
                    <Input placeholder="流程名称/发送人" />
                  )}
                </Form.Item>
              </Col>
              <Col span={5} style={{paddingTop: 4}}>
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
              ...this.state.pagination,
              showSizeChanger: true,
              total: msgList.total,
            }}
            onChange={this.handleTableChange}
          />
        </Card>
    );
  }
}
