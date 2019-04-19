import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Tabs, Icon } from 'antd';
import NewsBanner from '@/components/NewsBanner';
import HrBaseInfo from './components/HrBaseInfo/index';
import HrDoneProcess from './components/HrDoneProcess/index';
import NewsNotice from '@/components/NewsNotice';
import SelfService from './components/SelfService/index';
import HrTrain from './components/HrTrain/index';
import HrToDoProcess from './HrTodoProcess/index';
import {getConfig} from "../../utils/utils";
import styles from './HrService.less';

const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;

@connect(({ loading,hrService }) => ({
  hrService,
  loading: loading.models.hrService,
}))
class HrService extends PureComponent {
  state = {
    sysTrainEnter: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hrService/checkLeader',
      payload:{}
    });
    (function (w, d, n, a, j) {
      w[n] = w[n] || function () {
        (w[n].a = w[n].a || []).push(arguments);
      };
      j = d.createElement('script');
      j.async = true;
      j.src ='https://qiyukf.com/script/22e71348aa1e281e94ce61c493e891c8.js';
      d.body.appendChild(j);
    })(window, document, 'ysf');
  }
  callback(key) {
    console.log(key);
  }
  changeSysEnter = (key) => {
    const isShow = (key == 1 ? true : false);
    this.setState({
      sysTrainEnter: isShow,
    })
  };
  render() {
    const newsBannerStyle = {
      imgHeight: 200,
      iconTop: 85,
      iconLeftCurrent: 2,
      iconRightCurrent: 436,
    };
    const { sysTrainEnter } = this.state;
    const { hrService } = this.props;
    return (
      <Fragment>
        <Row>
          <Col span={24}>
            <HrBaseInfo isLeader={hrService.isLeader} />
            <span style={{margin:'0 15px',}}><NewsBanner newsBannerStyle={newsBannerStyle} /></span>
            <Card
              className={styles.newsNoticeBox}
              title="人力公告"
              bodyStyle={{ padding: '9px 0 0 ' }}
              extra={<a className="moreNews" href={getConfig().domain +'/portal/newsNotice/homeNoticeList.jhtml?typeSn=hr_notice'} target="_blank">更多 <Icon type="ellipsis" /></a>}
              bordered={false}
            >
              <NewsNotice  typeSn="hr_notice" pageSize={4} />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}> <SelfService /> </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card bordered={false} style={{ marginTop: 16 }} bodyStyle={{ padding: 0 }}>
              <Tabs defaultActiveKey="1" onChange={this.callback} style={{ height: 460 }}>
                <TabPane tab="待办" key="1">
                  <div style={{ padding: '0 16px 16px' }}>
                    <HrToDoProcess />
                  </div>
                </TabPane>
                <TabPane tab="已办" key="2">
                  <div style={{ padding: '0 16px 16px' }}>
                    <HrDoneProcess />
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} style={{ marginTop: 16 }} bodyStyle={{ padding: 0 }}>
              {sysTrainEnter ? (<a href={getConfig().trainSysPath} className={styles.linkToSys} target="_blank">点击进入培训系统！</a>) : (<a href={getConfig().recruitSysPath} className={styles.linkToSys} target="_blank">点击进入招聘系统！</a>)}
              <Tabs defaultActiveKey="1" onChange={this.changeSysEnter} style={{ height: 460 }}>
                <TabPane tab="培训" key="1">
                  <div style={{ padding: '0 16px 16px' }}>
                    <HrTrain />
                  </div>
                </TabPane>
                <TabPane tab="招聘" key="2" />
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default HrService;
