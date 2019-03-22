import React, { PureComponent } from 'react';
import { Breadcrumb, Table, Button, Card, Row, Col } from 'antd';
import styles from './UserPandect.less';
import { connect } from 'dva/index';

const performanceColumns = [
  {title: '绩效等级', dataIndex: 'level'},
  {title: 'S',
    dataIndex: 'S',
    render: (text, record) => {
      return (
          <a href={'/ys/user-team/performance/information?level=S'} target="_blank">
            {text}
          </a>
      );
    },
  },
  {title: 'A',
    dataIndex: 'A',
    render: (text, record) => {
      return (
        <a href={'/ys/user-team/performance/information?level=A'} target="_blank">
          {text}
        </a>
      );
    },
  },
  {title: 'B',
    dataIndex: 'B',
    render: (text, record) => {
      return (
        <a href={'/ys/user-team/performance/information?level=B'} target="_blank">
          {text}
        </a>
      );
    },
  },
  {title: 'C',
    dataIndex: 'C',
    render: (text, record) => {
      return (
        <a href={'/ys/user-team/performance/information?level=C'} target="_blank">
          {text}
        </a>
      );
    },
  },
  {title: 'D',
    dataIndex: 'D',
    render: (text, record) => {
      return (
        <a href={'/ys/user-team/performance/information?level=D'} target="_blank">
          {text}
        </a>
      );
    },},
  {title: 'E',
    dataIndex: 'E',
    render: (text, record) => {
      return (
        <a href={'/ys/user-team/performance/information?level=E'} target="_blank">
          {text}
        </a>
      );
    },},
];
@connect(({ user,  teamAssets, teamAttendance ,hrService,authorizedStrength,annual,teamPerformance,teamTrain, loading }) => ({
  user,
  teamAttendance,
  teamAssets,
  hrService,
  authorizedStrength,
  annual,
  teamPerformance,
  teamTrain,
  loading: loading.models.user,
}))
export default class TeamPandect extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getUserByNo',
      payload: '',
    });
    dispatch({
      type: 'hrService/getDeptIds',
      payload: '',
      callback:function (deptIds) {
        dispatch({
          type: 'teamAssets/getDeptAssets',
          payload: { deptIds: deptIds.toString() },
        });
        dispatch({
          type: 'authorizedStrength/getAuthorizedStrengthTotal',
          payload: { deptIds: deptIds.toString() },
        });
        dispatch({
          type: 'annual/getAnnualEntryList',
          payload:{ deptIds: deptIds.toString(),entryYear:(new Date()).getFullYear(),page:'1', rows:'10' },
        });
        dispatch({
          type: 'annual/getAnnualLeaveList',
          payload:{ deptIds: deptIds.toString(),leaveYear:(new Date()).getFullYear(),page:'1', rows:'10' },
        });
        dispatch({
          type: 'teamPerformance/fetchTeamPerfTotal',
          payload:{ deptIds: deptIds.toString(),year:(new Date()).getFullYear()-1 },
        });
        dispatch({
          type: 'teamAttendance/getUserTeamSummaryAttendance',
          payload: {deptIds: deptIds.join(",")},
        });
        dispatch({
          type: 'teamTrain/fetchTrainingCourse',
          payload: {deptIds: deptIds.toString(),planYear:(new Date()).getFullYear()},
        });
        dispatch({
          type: 'teamTrain/fetchCourseDevelop',
          payload: {deptIds: deptIds.toString(),planYear:(new Date()).getFullYear()},
        });
        dispatch({
          type: 'teamTrain/fetchComplete',
          payload: {deptIds: deptIds.toString(),planYear:(new Date()).getFullYear()},
        });
      }
    });

  }

  render() {
    const {
      user: { userInfo },
      teamAttendance: { aNumberData },
      teamAssets: { deptAssetsNumber },
      authorizedStrength:{totals},
      annual:{entry,leave},
      teamPerformance:{teamPerfTotal},
      teamTrain:{trainingCourse, courseDevelop, complete},
      loading,
    } = this.props;
    let [csNum, cfNum, cNum, usNum, ufNum, uNum] = [0, 0, 0, 0, 0, 0];
    if(deptAssetsNumber){
      if(deptAssetsNumber.deptUseAssets){
        if(deptAssetsNumber.deptUseAssets[0]){
          ufNum = deptAssetsNumber.deptUseAssets[0].fixedNumber;
          usNum = deptAssetsNumber.deptUseAssets[0].softWareNumber;
        }
      }
      if(deptAssetsNumber.deptChargeAssets){
        if(deptAssetsNumber.deptChargeAssets[0]){
          cfNum = deptAssetsNumber.deptChargeAssets[0].fixedNumber;
          csNum = deptAssetsNumber.deptChargeAssets[0].softWareNumber;
        }
      }
      cNum = csNum + cfNum;
      uNum = usNum + ufNum;
    }

    let [averageHours, averageFinishTotalHours, cCompletionRate] = [0, 0, 0];
    if (complete[0]) {
      averageHours = complete[0].averageHours;
      averageFinishTotalHours = complete[0].averageFinishTotalHours;
      cCompletionRate = complete[0].completionRate
    }

    let [planTrainCourse, completeTrainCourse, tCompletionRate ] = [0, 0, 0];
    if (trainingCourse[0]) {
      planTrainCourse = trainingCourse[0].planTrainCourse;
      completeTrainCourse = trainingCourse[0].completeTrainCourse;
      tCompletionRate = trainingCourse[0].completionRate
    }

    let [quarterPlanNum, actualQuarterNum, completionRate] = [0, 0, 0];
    if (courseDevelop[0]) {
      quarterPlanNum = courseDevelop[0].quarterPlanNum;
      actualQuarterNum = courseDevelop[0].actualQuarterNum;
      completionRate = courseDevelop[0].completionRate;
    }

    return (
      <div>
        <Card
          bordered={false}
          bodyStyle={{ padding: '16px 24px', boxShadow: '0 2px 4px 0 #e5e5e5' }}
        >
          <Breadcrumb>
            <Breadcrumb.Item>
              您所在的位置：
              <a href="/ys/main/hr-service">HR服务</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>团队总览</Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Card bordered={false} style={{ marginTop: 16 }} bodyStyle={{ padding: '0 75px 170px 75px' }} >
          <div className={styles.userName}>
            <span>{userInfo.userName}</span>
            你好！
          </div>
          <div className="userChannels">
            <Card bordered={false}>
              <div className="channel-bg baseinfo"> </div>
              <p>
                作为 <span className="strength text">{userInfo.deptName}</span>的<span className="strength text">{userInfo.postname}</span>，
                您的部门目前编制 <span className="strength">
                <a href={"/ys/user-team/authorized"} target="_blank">{totals.totalNum}</a></span>人，
                在岗 <span className="strength">
                <a href={"/ys/user-team/authorized"} target="_blank">{totals.countPsndoc}</a></span>人。
              </p>
              <p>
                本年度，你所在的部门共有<span className="strength">
                <a href={"/ys/user-team/entry"} target="_blank">{entry.pagination.total}</a></span>人入职，
                <span className="strength">
                  <a href={"/ys/user-team/leave"} target="_blank">{leave.pagination.total}</a></span>人离职。
              </p>
              <Button type="primary">
                <a href="framework" target="_blank">
                  详情
                </a>
              </Button>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg performance"> </div>
              <p>
                上一年度，你的部门人员的绩效分布情况如下：
              </p>
              <Row style={{marginBottom: 16}}>
                <Col span={18}>
                  <Table columns={performanceColumns} dataSource={teamPerfTotal} pagination={false} />
                </Col>
              </Row>
              <p>
                <Button type="primary">
                  <a href="performance" target="_blank">
                    详情
                  </a>
                </Button>
              </p>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg attendance"> </div>
              <p>
                截至目前，你所在的部门员工出勤率为 <span className="strength">{aNumberData.attendance}</span>%，
                平均工作时长为 <span className="strength">{aNumberData.avgWorkHour}</span>小时。
              </p>
              <p>
                你的团队成员累计出差<span className="strength">{aNumberData.travelCount}</span>次、
                累计请假<span className="strength">{aNumberData.leaveCount}</span>次。
              </p>
              <p>
                有<span className="strength">{aNumberData.goOutCount}</span>次因公外出，
                <span className="strength">{aNumberData.lateOrEarlyleave}</span>次迟到早退，
                <span className="strength">{aNumberData.absenteeismCount}</span>次旷工。
              </p>
              <Button type="primary">
                <a href="attendance" target="_blank">
                  详情
                </a>
              </Button>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg train"> </div>
              <p>
                本年度，部门计划人均培训学时为 <span className="strength">{averageHours}</span>，
                目前已完成人均学时<span className="strength">{averageFinishTotalHours}</span>，
                完成率为<span className="strength">{cCompletionRate}</span>。
              </p>
              <p>
                部门计划培训 <span className="strength">{planTrainCourse}</span>次、
                已完成<span className="strength">{completeTrainCourse}</span>次、
                完成率为<span className="strength">{tCompletionRate}</span>。
              </p>
              <p>
                计划制作培训课程为 <span className="strength">{quarterPlanNum}</span>门，
                已完成<span className="strength">{actualQuarterNum}</span>门，
                完成率为<span className="strength">{completionRate}</span>。
              </p>
              <Button type="primary">
                <a href="train" target="_blank">
                  详情
                </a>
              </Button>
            </Card>
            <Card bordered={false}>
              <div className="channel-bg asset"> </div>
              <p>你部门的资产：</p>
              <p>
                部门责任资产
                <span className="strength">{cNum}</span>
                件（其中软件资产
                <span className="strength">{csNum}</span>
                件，硬件资产
                <span className="strength">{cfNum}</span> 件）；
              </p>
              <p>
                部门个人资产
                <span className="strength">{uNum}</span>
                件（其中软件资产
                <span className="strength">{usNum}</span>
                件，硬件资产
                <span className="strength">{ufNum}</span> 件）；
              </p>
              <p>与你的团队一起妥善保管和使用资产，让它们成为我们实现我们目标的利器。</p>
              <Button type="primary">
                <a href="asset" target="_blank">
                  详情
                </a>
              </Button>
            </Card>
            <div style={{ color: '#333',marginLeft: 30 }}>
              <p>作为一名亚厦的管理者，我们期待你发挥更大的价值。</p>
              <p>请带领你的团队开疆拓土，勇往直前，真正实现“让客户的等待变成期待”！</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
