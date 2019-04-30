import React, { PureComponent, Fragment } from "react";
import { Row, Col, Card, Tabs, Icon, Button, Input, Modal, Select, message} from "antd";
import { connect } from "dva";
import NewsBanner from "@/components/NewsBanner";
import NewsNotice from "@/components/NewsNotice";
import FileList from "@/components/FileList";
import styles from './FncService.less';

@connect(({ fncService, loading }) => ({
  fncService,
  loading: loading.models.fncService,
}))
export default class TableList extends PureComponent {

  state = {
    visible: false,
    typeId: '',
    activeKey: 'finance_expense'
  };

  componentDidMount() {
    this.downloadFile();
    this.getOpinion();
  }

  downloadFile = (activeKey) => {
    this.props.dispatch({
      type: 'fncService/fetchMaterialFiles',
      payload: {
        typeId: activeKey,
        page: 1,
        rows: 10,
      },
    });
  };

  getOpinion = () => {
    this.props.dispatch({
      type: 'fncService/fetchOpinion'
    })
  };

  tabsChange = (activeKey) => {
    this.downloadFile(activeKey);
  };

  expenseAndProChange = (activeKey) => {
    this.setState({
      activeKey: activeKey
    })
  };

  adviceClick = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    const val = $('#input').val();
    const typeId = this.state.typeId;
    if (null == typeId || "" === typeId) {
      message.warn("请选择意见分类");
      return
    }
    if (null == val || "" === val) {
      message.warn("请输入内容");
      return
    }
    this.props.dispatch({
      type: 'fncService/addOpinion',
      payload: {
        typeId: typeId,
        content: val
      }
    });
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  onSelect = (value) => {
    this.setState({
      typeId: value
    });
  };

  render() {
    const newsBannerStyle = {
      imgHeight: 224,
      iconTop: 90,
      iconLeftCurrent: 2,
      iconRightCurrent: 375,
    };

    const {fncService: { materialFiles, opinion }} = this.props;

    const selectOpt = opinion && opinion.map((item, index) => (
      <Select.Option key={index} value={item.id}>
        {item.name}
      </Select.Option>
    ));

    const files = materialFiles.data ? materialFiles.data : [];

    const path = "/news/basic-list/home_notice.jhtml?typeSn="+this.state.activeKey;

    return (
      <Fragment>
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
              <Tabs defaultActiveKey="a" tabBarExtraContent={<a  href="/news/table-list/home_notice.jhtml?typeSn=finance_notice"> 更多> </a>}>
                <Tabs.TabPane tab="财务公告" key="a">
                  <NewsNotice typeSn="finance_notice" pageSize={5}/>
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
          <Row style={{paddingTop: 30}}>
            <Col span={9}>
              <Tabs defaultActiveKey="b" tabBarExtraContent={<a href="/news/basic-list/home_notice.jhtml?typeSn=finance_info"> 更多> </a>} >
                <Tabs.TabPane tab="财经资讯" key="b">
                  <NewsNotice typeSn="finance_info" pageSize={7}/>
                </Tabs.TabPane>
              </Tabs>
            </Col>
            <Col offset={1} span={14}>
              <Tabs onChange={this.expenseAndProChange} tabBarExtraContent={<a href={path}> 更多> </a>} >
                <Tabs.TabPane tab="费用报销专栏" key="finance_expense">
                  <NewsNotice typeSn="finance_expense" pageSize={7}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="项目核算专栏" key="finance_pro">
                  <NewsNotice typeSn="finance_pro" pageSize={7}/>
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
          <Row style={{paddingTop: 20}}>
            <Tabs>
              <Tabs.TabPane tab="资料下载" key="download" >
                <Tabs onChange={this.tabsChange} tabBarExtraContent={<a href="/eip/fnc-service/material-filepage"> 更多> </a>}>
                  <Tabs.TabPane tab="管理制度" key="8a8a8c3a5ec10cf2015f04049ce9033d" >
                    <FileList files={files} showDel={false}/>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="项目核算" key="8a8a8c3a5ec10cf2015ec2907a59000e" >
                    <FileList files={files} showDel={false}/>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="费用报销" key="8a8a8c3a5ec10cf2015ec2901e94000d" >
                    <FileList files={files} showDel={false}/>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="财务报告" key="8a8a8c3a5f04d252015f4d14027f0048" >
                    <FileList files={files} showDel={false}/>
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
                    <Row>
                      <Col span={2}>
                        <Button type="primary" style={{height:40, width: 170}} onClick={this.adviceClick}>意见与建议</Button>
                        <Button style={{height:40, width: 170, marginTop:10}}>意见反馈</Button>
                      </Col>
                      <Col span={20} offset={2}>
                        <Input.TextArea style={{height:90}}>
                        </Input.TextArea>
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                </Tabs>
              </Tabs.TabPane>
            </Tabs>
          </Row>
          <Modal title="意见与建议" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} destroyOnClose={true}>
              <Row>
               <Col offset={2} span={4}>
                 意见分类：
               </Col>
               <Col span={10}>
                 <Select style={{ width: 300, marginTop:-10 }} defaultValue="请选择" onSelect={this.onSelect}>
                   {selectOpt}
                 </Select>
               </Col>
             </Row>
             <Row style={{marginTop: 20}}>
                <Col offset={2} span={4}>
                   问题说明：
                </Col>
                <Col span={18}>
                   <Input.TextArea style={{width: 300, height:150}}  id="input" placeholder="请给出您宝贵的意见，我们将用心处理对待:">
                   </Input.TextArea>
                 </Col>
             </Row>
          </Modal>
        </Card>
      </Fragment>
    );
  }
}
