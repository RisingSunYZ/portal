/**
 *培训课程
 */
import React, { Component } from 'react';
import { Card, Table} from 'antd';
import styles from './index.less';
import { connect } from 'dva/index';

const TrainingCourseColumns = [
  {
    title: '计划培训课程（门）',
    dataIndex: 'planTrainCourse',
    key: 'planTrainCourse',
    width: 312,
  },
  {
    title: '完成培训课程（门）',
    dataIndex: 'completeTrainCourse',
    key: 'completeTrainCourse',
    width: 320,
  },
  {
    title: '完成率',
    dataIndex: 'completionRate',
    key: 'completionRate',
    width: 280,
  },
  {
    title: '计划外完成课程（门）',
    dataIndex: 'completeTrainOutCourse',
    key: 'completeTrainOutCourse',
  },
];

const CourseDevelopColumns = [
  {
    title: '计划开发课程（门）',
    dataIndex: 'quarterPlanNum',
    key: 'quarterPlanNum',
    width: 312,
  },
  {
    title: '实际开发课程（门）',
    dataIndex: 'actualQuarterNum',
    key: 'actualQuarterNum',
    width: 320,
  },
  {
    title: '完成率',
    dataIndex: 'completionRate',
    key: 3,
  }
];

const CompleteColumns = [
  {
    title: '年度计划人均学时（小时）',
    dataIndex: 'averageHours',
    key: 'averageHours',
  },
  {
    title: '必修学时（小时）',
    dataIndex: 'averageFinishClassHours',
    key: 'averageFinishClassHours',
  },
  {
    title: '选修学时（小时）',
    dataIndex: 'averageFinishElectiveHours',
    key: 'averageFinishElectiveHours',
  },
  {
    title: '分享学时（小时）',
    dataIndex: 'averageFinishShareHours',
    key: 'averageFinishShareHours',
  },
  {
    title: '完成学时（小时）',
    dataIndex: 'averageFinishTotalHours',
    key: 'averageFinishTotalHours',
  },
  {
    title: '完成率',
    dataIndex: 'completionRate',
    key: 'completionRate',
  }
];

@connect(({ teamTrain, loading }) => ({
  teamTrain,
  loading: loading.models.teamTrain,
}))
export default class TrainingCourse extends Component {

  state = {};

  componentDidMount() {};

  render() {
    const {
      teamTrain: { trainingCourse, courseDevelop, complete },
    } = this.props;

    return (
      <div>
        <Card bordered={false}  bodyStyle={{padding: "0 0 16px"}}>
          <p className="cardTitle"><i></i>培训课程</p>
          <Table columns={TrainingCourseColumns} dataSource={trainingCourse} pagination={false} rowKey={record => record.planTrainCourse}/>
        </Card>
        <Card bordered={false}  bodyStyle={{padding: "0 0 16px"}}>
          <p className="cardTitle"><i></i>课程开发</p>
          <Table columns={CourseDevelopColumns} dataSource={courseDevelop} pagination={false} rowKey={record => record.quarterPlanNum} />
        </Card>
        <Card bordered={false}  bodyStyle={{padding: "0 0 16px"}}>
          <p className="cardTitle"><i></i>人均完成</p>
          <Table columns={CompleteColumns} dataSource={complete} pagination={false} rowKey={record => record.AverageHours}/>
        </Card>
      </div>
    );
  }
}
