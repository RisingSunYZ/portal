import React, {PureComponent} from 'react';
import {Card, Row, Col, Icon, Tabs, Table, Divider, Spin, Input} from 'antd';
import styles from './index.less';
import {connect} from 'dva/index';
import MonthSelect from '../commponents/common/MonthSelect';
import MSelect from '../commponents/attendance/MSelect';
import LeaveDayStatistics from '../commponents/attendance/LeaveDaysStatistics';
import WorkOvertimeDetail from '../commponents/attendance/WorkOvertimeDetail';
import BusinessTripDetail from '../commponents/attendance/BusinessTripDetail';
import LateAbsenteesim from '../commponents/attendance/LateAbsenteeism';
import Absenteeism from '../commponents/attendance/Absenteeism';
import BusinessTrip from '../commponents/attendance/BusinessTrip';
import {getConfig} from "../../../utils/utils";

const TabPane = Tabs.TabPane;

@connect(({teamAttendance, loading}) => ({
  teamAttendance,
  loading: loading.models.teamAttendance,
}))
export default class SummaryAttendance extends PureComponent {
  state = {
    deptIds: '',
  };

  componentDidMount() {
    /* const { dispatch } = this.props;

     dispatch({
       type: 'teamAttendance/getUserTeamLeaveDetails',
       payload: { pageNumber: 1, pageSize: 5 },
     });
     /!*dispatch({
       type: 'teamAttendance/getUserTeamWorkOvertimeDetail',
       payload: { pageNumber: 1, pageSize: 5 },
     });*!/
     dispatch({
       type: 'teamAttendance/getUserTeamBusinessTripDetail',
       payload: { pageNumber: 1, pageSize: 5 },
     });
     dispatch({
       type: 'teamAttendance/getUserTeamBusinessTrip',
       payload: { pageNumber: 1, pageSize: 5 },
     });
     dispatch({
       type: 'teamAttendance/getUserTeamLateAbsenteeism',
       payload: { pageNumber: 1, pageSize: 5 },
     });
     dispatch({
       type: 'teamAttendance/getUserTeamAbsenteeism',
       payload: { pageNumber: 1, pageSize: 5 },
     });


     dispatch({
       type: 'teamAttendance/getUserTeamLeaveDaysStatistic',
     });
     dispatch({
       type: 'teamAttendance/getUserTeamSummaryAttendance',
     });
 */

  }

  yChange = (value) => {
    this.setState({
      time: value,
      year:value.substring(0,4),
    }, function () {
      this.teamList();
    });
  };

  orguChange = (value) => {
    const currentDeptIdStr = value.deptMap.currentDeptId;
    let totalId ='';
    let currentDeptId = '';
    let chilId ='';
    if (currentDeptIdStr) {
      currentDeptId = currentDeptIdStr;
    }
    if(value.deptMap.childrenDeptId){
      for(let i=0;i<value.deptMap.childrenDeptId.length;i++){
        chilId += i === 0?value.deptMap.childrenDeptId[i] :(','+value.deptMap.childrenDeptId[i]);
      }
    }
    if(!currentDeptId ){
      totalId = chilId;
    }else if(!chilId){
      totalId = currentDeptId;
    }else {
      totalId = currentDeptId+','+chilId;
    }
    this.setState({
      deptIds: totalId,
      departmentId:currentDeptId,
    }, function () {
      this.teamList();
    })
  };

  initPageChange = (value) => {
    let ids = '';
    if (value.deptIdArray) {
      for (let i = 0; i < value.deptIdArray.length; i++) {
        ids += i === 0 ? value.deptIdArray[i] : (',' + value.deptIdArray[i]);
      }
    }
    let year = value.date.substr(0,4);
    //let aa=ids.substr(0,ids.length-1);
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamLeaveDetails',
      payload: {pageNumber: 1, pageSize: 5, deptIds: ids},
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamWorkOvertimeDetail',
      payload: { pageNumber: 1, pageSize: 5 ,deptIds:ids},
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamBusinessTripDetail',
      payload: {pageNumber: 1, pageSize: 5, deptIds: ids},
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamBusinessTrip',
      payload: {pageNumber: 1, pageSize: 5, deptIds: ids},
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamLateAbsenteeism',
      payload: {pageNumber: 1, pageSize: 5, deptIds: ids},
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamAbsenteeism',
      payload: {pageNumber: 1, pageSize: 5, deptIds: ids},
    });


    this.props.dispatch({
      type: 'teamAttendance/getUserTeamLeaveDaysStatistic',
      payload: {deptIds: ids},
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamSummaryAttendance',
      payload: {deptIds: ids,time: value.date},
    });
    this.setState({time: value.date,year:year,deptIds:ids})

  };

  teamPostChange = value => {
    const time = this.state.time;
    const deptIds = this.state.deptIds;
    this.setState({
      teamqingjia: {
        time: time,
        deptIds: deptIds,
        pageNumber: value.pageNumber,
        pageSize: value.pageSize,
        qStartTime: value.qStartTime,
        qEndTime: value.qEndTime,
        subType: value.subType,
        keyWord: encodeURIComponent(value.keyWord),
      }
    }, function () {
      this.teamPostQjList();
    })
  };
  teamWorkPostChange = value => {
    const time = this.state.time;
    const deptIds = this.state.deptIds;
    this.setState({
      teamwork: {
        time: time,
        deptIds: deptIds,
        pageNumber: value.pageNumber,
        pageSize: value.pageSize,
        qStartTime: value.qStartTime,
        qEndTime: value.qEndTime,
        keyWord: encodeURIComponent(value.keyWord),
      }
    }, function () {
      this.teamPostWorkList();
    })
  };

  teamBusinessDetailChange = value => {
    const time = this.state.time;
    const deptIds = this.state.deptIds;
    this.setState({
      teamBusinessDetail: {
        time: time,
        deptIds: deptIds,
        pageNumber: value.pageNumber,
        pageSize: value.pageSize,
        qStartTime: value.qStartTime,
        qEndTime: value.qEndTime,
        keyWord: encodeURIComponent(value.keyWord),
      }
    }, function () {
      this.teamBusinessDetailList();
    })
  };

  teamBusinessTripChange = value => {
    const time = this.state.time;
    const deptIds = this.state.deptIds;
    this.setState({
      teamBusinessTirp: {
        time: time,
        deptIds: deptIds,
        pageNumber: value.pageNumber,
        pageSize: value.pageSize,
        qStartTime: value.qStartTime,
        qEndTime: value.qEndTime,
        keyWord: encodeURIComponent(value.keyWord),
      }
    }, function () {
      this.teamBusinessTripList();
    })
  };

  teamLateAbsenteesimChange = value => {
    const time = this.state.time;
    const deptIds = this.state.deptIds;
    this.setState({
      teamlate: {
        time: time,
        deptIds: deptIds,
        pageNumber: value.pageNumber,
        pageSize: value.pageSize,
        qStartTime: value.qStartTime,
        qEndTime: value.qEndTime,
        keyWord: encodeURIComponent(value.keyWord),
      }
    }, function () {
      this.teamLateList();
    })
  };
  teamAbsenteeismChange = value => {
    const time = this.state.time;
    const deptIds = this.state.deptIds;
    this.setState({
      teamabsenteeism: {
        time: time,
        deptIds: deptIds,
        pageNumber: value.pageNumber,
        pageSize: value.pageSize,
        qStartTime: value.qStartTime,
        qEndTime: value.qEndTime,
        keyWord: encodeURIComponent(value.keyWord),
      }
    }, function () {
      this.teamAbsenteeismList();
    })
  };

  teamAbsenteeismList = () => {
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamAbsenteeism',
      payload: this.state.teamabsenteeism,
    })
  };
  teamLateList = () => {
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamLateAbsenteeism',
      payload: this.state.teamlate,
    })
  };

  teamBusinessTripList = () => {
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamBusinessTrip',
      payload: this.state.teamBusinessTirp,
    })
  };

  teamBusinessDetailList = () => {
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamBusinessTripDetail',
      payload: this.state.teamBusinessDetail,
    })
  };

  teamPostWorkList = () => {
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamWorkOvertimeDetail',
      payload: this.state.teamwork,
    })
  };

  teamPostQjList = () => {
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamLeaveDetails',
      payload: this.state.teamqingjia,
    })
  };


  teamList = () => {

    this.props.dispatch({
      type: 'teamAttendance/getUserTeamLeaveDaysStatistic',
      payload: {time: this.state.time, deptIds: this.state.deptIds}
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamSummaryAttendance',
      payload: {time: this.state.time, deptIds: this.state.deptIds}
    });

    this.props.dispatch({
      type: 'teamAttendance/getUserTeamLeaveDetails',
      payload: {time: this.state.time, deptIds: this.state.deptIds, pageNumber: 1, pageSize: 5}
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamWorkOvertimeDetail',
      payload: {time:this.state.time,deptIds:this.state.deptIds,pageNumber:1,pageSize:5},
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamBusinessTripDetail',
      payload: {time: this.state.time, deptIds: this.state.deptIds, pageNumber: 1, pageSize: 5}
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamBusinessTrip',
      payload: {time: this.state.time, deptIds: this.state.deptIds, pageNumber: 1, pageSize: 5}
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamLateAbsenteeism',
      payload: {time: this.state.time, deptIds: this.state.deptIds, pageNumber: 1, pageSize: 5}
    });
    this.props.dispatch({
      type: 'teamAttendance/getUserTeamAbsenteeism',
      payload: {time: this.state.time, deptIds: this.state.deptIds, pageNumber: 1, pageSize: 5}
    });

  };


  render() {
    const {
      teamAttendance: {aNumberData},
      loading,
    } = this.props;

    const parameters = () => {
      let { year, departmentId } = this.state;
      let param = {};
      if (departmentId) {
        param.departId = departmentId;
      } else {
        param.departId = '';
      }
      param.year = year;
      return param;
    };

    const {
      teamAttendance: {qjlist},
    } = this.props;

    const { year, departmentId } = this.state;
    const summaryColumns = [
      {
        title: "考勤类型", dataIndex: 'type', render: (text, record) => {
          return "次数"
        }
      },
      {title: "出差",
        align: 'center',
        dataIndex: 'travelCount',
        render: (text, record) => {
          if (record.travelCount == 0) {
            return <a>--</a>;
          } else {
            return record.travelCount;
          }
        },},
      {title: "事假",
        align: 'center',
        dataIndex: 'shiJiaCount',
        render: (text, record) => {
          if (record.shiJiaCount == 0) {
            return <a>--</a>;
          }else {
            return record.shiJiaCount;
          }
        },},
      {title: "加班",
        align: 'center',
        dataIndex: 'jiaBanCount',
        render: (text, record) => {
          if (record.jiaBanCount == 0) {
            return <a>--</a>;
          }else {
            return record.jiaBanCount;
          }
        },},
      {title: "调休",
        align: 'center',
        dataIndex: 'tiaoXiuCount',
        render: (text, record) => {
          if (record.tiaoXiuCount == 0) {
            return <a>--</a>;
          }else {
            return record.tiaoXiuCount;
          }
        },},
      {title: "婚假",
        align: 'center',
        dataIndex: 'hunJiaCount',
        render: (text, record) => {
          if (record.hunJiaCount == 0) {
            return <a>--</a>;
          }else {
            return record.hunJiaCount;
          }
        },},
      {title: "产假",
        align: 'center',
        dataIndex: 'chanJiaCount',
        render: (text, record) => {
          if (record.chanJiaCount == 0) {
            return <a>--</a>;
          }else {
            return record.chanJiaCount;
          }
        },},
      {title: "病假",
        align: 'center',
        dataIndex: 'bingJiaCount',
        render: (text, record) => {
          if (record.bingJiaCount == 0) {
            return <a>--</a>;
          }else {
            return record.bingJiaCount;
          }
        },},
      {title: "因公外出",
        align: 'center',
        dataIndex: 'goOutCount',
        render: (text, record) => {
          if (record.goOutCount == 0) {
            return <a>--</a>;
          }else {
            return record.goOutCount;
          }
        },},
      {title: "丧假",
        align: 'center',
        dataIndex: 'sangJiaCount',
        render: (text, record) => {
          if (record.sangJiaCount == 0) {
            return <a>--</a>;
          }else {
            return record.sangJiaCount;
          }
        },},
      {title: "工伤假",
        align: 'center',
        dataIndex: 'gongShangJiaCount',
        render: (text, record) => {
          if (record.gongShangJiaCount == 0) {
            return <a>--</a>;
          }else {
            return record.gongShangJiaCount;
          }
        },},
    ];

    return (
      <Card bordered={false} bodyStyle={{padding: '0 24px'}}>
        <div style={{padding: '16px 0'}}>
          <MSelect onDateChange={this.yChange} onOrguChange={this.orguChange} initPage={this.initPageChange}/>
        </div>
        <p className="cardTitle">数据显示</p>
        <Row>
          <Col span={16}>
            <div className={styles.ptzt}>
              <p>
                考勤出勤率<span class="number">
                <a href={'/ys/user-team/attendanceRateChart?year='+parameters().year+'&deptId='+parameters().departId} target="_blank">
                {aNumberData.attendance}</a></span>%、
                员工平均工作时长<span className="number">
                <a href={'/ys/user-team/attendanceChart?year='+parameters().year+'&deptId='+parameters().departId} target="_blank">
                {aNumberData.avgWorkHour}</a>
              </span>小时。
              </p>
            </div>
          </Col>
        </Row>
        <p className="cardTitle">考勤统计</p>
        <div style={{marginBottom: 16}}>
          <Table columns={summaryColumns} dataSource={qjlist} pagination={false}/>
        </div>
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="请假详情" key="1">
            <LeaveDayStatistics teamHandlelPost={this.teamPostChange}/>
          </TabPane>
          <TabPane tab="加班详情" key="2">
            <WorkOvertimeDetail teamWorkPost={this.teamWorkPostChange}/>
          </TabPane>
          <TabPane tab="出差详情" key="3">
            <BusinessTripDetail teamBusinessDetails={this.teamBusinessDetailChange}/>
          </TabPane>
          <TabPane tab="因公外出" key="4">
            <BusinessTrip teamBusinessTrips={this.teamBusinessTripChange}/>
          </TabPane>
          <TabPane tab="迟到早退" key="5">
            <LateAbsenteesim teamLateAbsenteesim={this.teamLateAbsenteesimChange}/>
          </TabPane>
          <TabPane tab="旷工" key="6">
            <Absenteeism teamAbsenteeism={this.teamAbsenteeismChange}/>
          </TabPane>
        </Tabs>
      </Card>
    );
  }
}
