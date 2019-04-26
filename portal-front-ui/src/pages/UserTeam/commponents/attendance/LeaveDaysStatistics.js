import React, {PureComponent, Fragment} from 'react';
import {Table, Input, DatePicker, Select, Row, Col,Tooltip} from 'antd';
import 'antd/dist/antd.css';
import {connect} from 'dva/index';
import styles from './index.less';
import {getConfig} from "@/utils/utils";

const Search = Input.Search;
const {RangePicker} = DatePicker;
@connect(({teamAttendance, loading}) => ({
  teamAttendance,
  loading: loading.models.teamAttendance,
}))
export default class LeaveDaysStatistics extends PureComponent {
  state = {
    pageSize:5,
    pageNumber:1,
    keyWord:'',
  };
  componentDidMount() {

  }

  handleStandardTableChange = (pagination, filtersArg) => {
    /*const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});*/
    this.setState({
      pageNumber: pagination,
      pageSize: filtersArg,
    }, function () {
      this.teamHandlePost();
    });
  };

  handleShowSizeChange =(current, pageSize)=>{
    this.setState({
      pageNumber: current,
      pageSize: pageSize,
    }, function () {
      this.teamHandlePost();
    });

  };

  onChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      qStartTime: dateString[0],
      qEndTime: dateString[1]
    }, function () {
      this.teamHandlePost();
    })
  };
  handleChange = (value) => {
    this.setState({
      subType: value,
      pageNumber:1
    }, function () {
      this.teamHandlePost();
    });
  };
  handleGetValue = (event) => {
    this.setState({
      pageNumber:1,
      keyWord : event.target.value,
    })
  };

  teamHandlePost = () => {
    this.props.teamHandlelPost(this.state);

    /*const { dispatch } = this.props;
    console.log(this.state);
    dispatch({
      type: 'teamAttendance/getUserTeamLeaveDetails',
      payload: this.state,
    });*/
    /*this.setState({
      pageNumber: '',
      pageSize: '',
    })*/
  };

  render() {
    const {
      teamAttendance: {qjlist},
    } = this.props;
    const {
      teamAttendance: {a},
    } = this.props;

    const children = [];
    children.push(<Select.Option key={0}>{'全部'}</Select.Option>);
    if (a.alist){
      for (const key in a.alist) {
        children.push(<Select.Option key={a.alist[key]}>{key}</Select.Option>);
      }
    }
    const coulmns2 = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '请假类型',
        dataIndex: 'type',
        render: (text, record) => {
          if (record.subType == 10) {
            return ("事假");
          } else if (record.subType == 20) {
            return ("病假")
          } else if (record.subType == 30) {
            return ("婚假")
          } else if (record.subType == 40) {
            return ("产假")
          } else if (record.subType == 50) {
            return ("哺乳假")
          } else if (record.subType == 60) {
            return ("陪护假")
          } else if (record.subType == 70) {
            return ("丧假")
          } else if (record.subType == 80) {
            return ("工伤假")
          } else if (record.subType == 90) {
            return ("调休")
          } else if (record.subType == 100) {
            return ("其他")
          }
        },
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
      },
      {
        title: '时长',
        dataIndex: 'day',
      },
      {
        title: '事由',
        dataIndex: 'remark',
        width:400,
        render:(text,record) =>(
          <div style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '400px',
            overflow: 'hidden',
          }}>
            <p placement="topLeft" title={text}>
              {text}
            </p>
          </div>
        )
      },
      {
        title: '详情',
        dataIndex: 'billCode',
        render: (text, record) => {
          let url = getConfig().domain+'/ys/process/form/view/'+record.proDefKey+'/'+record.procInstId+'/'+record.billCode+'/0/0';
          return (
            <span>
              <a href={url} target="_blank">
                查看
              </a>
            </span>
          );
        },
      },
    ];

    return (
      <div>
        <Row>
          <Col span={2}>
            <Select
              className={styles.selectcss}
              onChange={this.handleChange}
              placeholder="全部"
            >
              {children}
            </Select>
          </Col>
          <Col offset={3} span={5}>
            <RangePicker onChange={this.onChange} placeholder={['开始时间','结束时间']}/>
          </Col>
          <Col offset={9} span={3}>
            <Search
              style={{width: 224}}
              placeholder="请输入姓名/工号"
              value={this.state.keyWord}
              onChange={this.handleGetValue}
              onSearch={this.teamHandlePost}
            />
          </Col>
        </Row>
        <div style={{marginTop: 8}}>
          <Table columns={coulmns2} dataSource={a.qxlist} pagination={{
            defaultPageSize:5,
            pageSizeOptions: ['5', '10', '20'],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: function () {
              return '共 ' + a.pfNumber + ' 条数据';
            },
            onChange:this.handleStandardTableChange,
            onShowSizeChange: this.handleShowSizeChange,
            total:a.pfNumber,
          }}/>
        </div>
      </div>
    );
  }
}
