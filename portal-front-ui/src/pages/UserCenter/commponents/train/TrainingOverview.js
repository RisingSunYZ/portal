import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Table, Tag, Divider, Spin, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva/index';
import YearSelect from '../performance/YearSelect'

const columns = [{
  title: '培训次数',
  dataIndex: 'trainNum',
  key:'trainNum',
},{
  title: '计划完成学时',
  dataIndex: 'planClassHours',
  key: 'planClassHours',
},{
  title: '完成学时',
  dataIndex: 'realClassHours',
  key: 'realClassHours',
},{
  title: '完成率',
  dataIndex: 'completionRate',
  key: 'completionRate',
}];

@connect(({ train, loading }) => ({
  train,
  loading: loading.models.train,
}))
export default class SummaryAttendance extends PureComponent {
  state = {
    userNo:'',
  };
  componentDidMount() {
    this.setState({
      userNo:this.props.userNo
    }, function() {
      const { dispatch } = this.props;
      dispatch({
        type: 'train/getTrainingOverview',
        payload: this.state,
      });
    });

  };

  yChange = (value) => {
    console.log(value);
    this.props.dispatch({
      type: 'train/getTrainingOverview',
      payload: {time: value,userNo:this.state.userNo}
    });
    this.props.dispatch({
      type: 'train/getTrainingDetails',
      payload: {time: value,userNo:this.state.userNo}
    });
  };


  render() {
    const {
      train: { tNumberData },
      loading,
    } = this.props;
    return (
      <Card bordered={false}  bodyStyle={{padding: "0 0 16px"}}>
        <div style={{paddingTop: 16}}>
            <YearSelect yearChange={this.yChange}/>
        </div>
        <p className="cardTitle"><i></i>培训总览</p>
        <Table columns={columns} dataSource={[tNumberData]} pagination={false} />
      </Card>
    );
  }
}
