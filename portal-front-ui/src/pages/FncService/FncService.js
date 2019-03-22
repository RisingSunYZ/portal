//YS首页——财务服务
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs} from 'antd';
import NewsBanner from '@/components/NewsBanner';
import NewsNotice from '@/components/NewsNotice';
import styles from './FncService.less';

@connect(({ fncService, loading }) => ({
  fncService,
  loading: loading.models.fncService,
}))
export default class TableList extends PureComponent {

  state = {

  };

  componentDidMount() {
    this.requestData();
  }

  requestData = () => {

  };

  render() {

   const {fncService: { }} = this.props;

    const newsBannerStyle = {
      imgHeight: 224,
      iconTop: 90,
      iconLeftCurrent: 2,
      iconRightCurrent: 375,
    };

    return (
     <div>
        <Card bordered={false} bodyStyle={{padding: 0}} >
          <Row style={{height: 224}}>
            <Col span={9}>
              <Card bordered={false} bodyStyle={{paddingTop: "0px"}} style={{width: 468}}>
                <div style={{marginLeft: -31}}>
                  <NewsBanner typeSn="finance_banner" newsBannerStyle={newsBannerStyle}/>
                </div>
              </Card>
            </Col>
            <Col offset={1} span={14}>
              <Tabs defaultActiveKey="a" tabBarExtraContent={<a> 更多> </a>}>
                <Tabs.TabPane tab="财务公告" key="a">
                  <NewsNotice typeSn="finance_notice" pageSize={5}/>
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
          <Row style={{paddingTop: 30}}>
            <Col span={9}>
              <Tabs defaultActiveKey="b" tabBarExtraContent={<a> 更多> </a>} >
                <Tabs.TabPane tab="财经资讯" key="b">
                  <NewsNotice typeSn="finance_info" pageSize={7}/>
                </Tabs.TabPane>
              </Tabs>
            </Col>
            <Col offset={1} span={14}>
              <Tabs defaultActiveKey="c" tabBarExtraContent={<a> 更多> </a>} >
                <Tabs.TabPane tab="费用报销专栏" key="c">
                  <NewsNotice typeSn="finance_expense" pageSize={7}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="项目核算专栏" key="d">
                  <NewsNotice typeSn="finance_pro" pageSize={7}/>
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
          <Row>
            <Tabs defaultActiveKey="e" >
                <Tabs.TabPane tab="资料下载" key="f"  >
                  Content of Tab Pane 1
                </Tabs.TabPane>
                <Tabs.TabPane tab="其他" key="g" style={{marginLeft:200}}>
                  Content of Tab Pane 1
                </Tabs.TabPane>
            </Tabs>
          </Row>
        </Card>
     </div>
    );
  }
}
