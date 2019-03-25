//YS首页——财务服务
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs, Icon} from 'antd';
import NewsBanner from '@/components/NewsBanner';
import NewsNotice from '@/components/NewsNotice';
import FileList from '@/components/FileList'
import styles from './FncService.less';

@connect(({ fncService, loading }) => ({
  fncService,
  loading: loading.models.fncService,
}))
export default class TableList extends PureComponent {

  state = {

  };

  componentDidMount() {
    this.downloadFile();
  }

  downloadFile = (activeKey) => {
    this.props.dispatch({
      type: 'fncService/fetchMaterialFiles',
      payload: {
        typeId: activeKey || '8a8a8c3a5ec10cf2015f04049ce9033d',
        page: 1,
        rows: 10,
      },
    });
  };

  tabsChange = (activeKey) => {
    this.downloadFile(activeKey);
  };

  render() {
    const newsBannerStyle = {
      imgHeight: 224,
      iconTop: 90,
      iconLeftCurrent: 2,
      iconRightCurrent: 375,
    };

    const {fncService: {materialFiles}} = this.props;

    const files = materialFiles.data ? materialFiles.data : [];

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
          <Row style={{paddingTop: 20}}>
            <Tabs>
              <Tabs.TabPane tab="资料下载" key="download" >
                <Tabs onChange={this.tabsChange} tabBarExtraContent={<a> 更多> </a>}>
                  <Tabs.TabPane tab="管理制度" key="8a8a8c3a5ec10cf2015f04049ce9033d" >
                    <FileList files={files}/>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="项目核算" key="8a8a8c3a5ec10cf2015ec2907a59000e" >
                    <FileList files={files}/>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="费用报销" key="8a8a8c3a5ec10cf2015ec2901e94000d" >
                    <FileList files={files}/>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="财务报告" key="8a8a8c3a5f04d252015f4d14027f0048" >
                    <FileList files={files}/>
                  </Tabs.TabPane>
                </Tabs>
              </Tabs.TabPane>
              <Tabs.TabPane tab="其他" key="other" >
                <Tabs >
                  <Tabs.TabPane tab="联系我们" key="othera">
                    <Icon type="calendar" theme="filled" /> <span>  部门：幕墙财务部</span>
                    <Icon type="calendar" theme="filled" style={{marginLeft: 40}}/> <span>  联系人：谢静文</span>
                    <Icon type="phone" theme="filled" style={{marginLeft: 40}}/> <span>  电话：0571-86413630</span>
                    <Icon type="phone" theme="filled" style={{marginLeft: 40}}/> <span>  邮箱：xiejingwen@chinayasha.com</span>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="意见与建议" key="otherb">
                  </Tabs.TabPane>
                </Tabs>
              </Tabs.TabPane>
            </Tabs>
          </Row>
        </Card>
      </div>
    );
  }
}
