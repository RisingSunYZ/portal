import React, { PureComponent, Fragment } from "react";
import { Row, Col, Card, Tabs, Icon, Button, Input, Modal, Select, message} from "antd";
import { connect } from "dva";
import NewsBanner from "@/components/NewsBanner";
import NewsNotice from "@/components/NewsNotice";
import FileList from "@/components/FileList";
import ContactAndSuggest from './ContactAndSuggest';
import Link from 'umi/link';
import styles from './FncService.less';

@connect(({ fncService, loading }) => ({
  fncService,
  loading: loading.models.fncService,
}))
export default class FncService extends PureComponent {

  state = {
    visible: false,
    typeId: '',
    downloadKey: '',
    activeKey: 'finance_expense'
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fncService/getMaterialTypeList',
      payload:{
        pageSize: 3,
        pageIndex: 0,
      },
      callback: (res)=>{
        if(res.data && res.data.length){
          this.loadFileListByType(res.data[0].id);
        }
      }
    });
  }

  loadFileListByType = (activeKey) => {
    this.props.dispatch({
      type: 'fncService/fetchMaterialFiles',
      payload: {
        typeId: activeKey,
        pageIndex: 0,
        pageSize: 10,
      },
    });
  };

  tabsChange = (activeKey) => {
    this.setState({
      downloadKey: activeKey
    });
    this.loadFileListByType(activeKey);
  };

  render() {
    const newsBannerStyle = {
      imgHeight: 224,
      iconTop: 90,
      iconLeftCurrent: 2,
      iconRightCurrent: 375,
    };
    const {fncService: { materialFiles, typeList }} = this.props;
    const { downloadKey, activeKey } = this.state;

    return (
      <Fragment>
          <Row gutter={16}>
            <Col span={10}>
              <Card bordered={false} bodyStyle={{padding: "20px 11px", minHeight: 240}} >
                <NewsBanner typeSn="finance_banner" newsBannerStyle={newsBannerStyle}/>
              </Card>
            </Col>
            <Col span={14}>
              <Card bordered={false} bodyStyle={{padding:0, minHeight: 240}} >
                <Tabs defaultActiveKey="a" tabBarExtraContent={<Link className={styles.moreList} to={"/news-notice/notice-table/finance_notice"} target="_blank"> 更多&gt; </Link>}>
                  <Tabs.TabPane tab="财务公告" key="a">
                    <NewsNotice typeSn="finance_notice" type="notice" pageSize={5}/>
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{marginTop: 16}}>
            <Col span={10}>
              <Card bordered={false} bodyStyle={{padding:0, minHeight: 312}} >
                <Tabs defaultActiveKey="b" tabBarExtraContent={<Link className={styles.moreList} to="/news-notice/news-list/finance_info" target="_blank"> 更多&gt; </Link>} >
                  <Tabs.TabPane tab="财经资讯" key="b">
                    <NewsNotice typeSn="finance_info" type="news" pageSize={7}/>
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Col>
            <Col span={14}>
              <Card bordered={false} bodyStyle={{padding:0, minHeight: 312}} >
                <Tabs
                  onChange={(activeKey)=>this.setState({activeKey})}
                  tabBarExtraContent={<Link className={styles.moreList} to={"/news-notice/news-list/"+activeKey} target="_blank"> 更多&gt; </Link>}
                >
                  <Tabs.TabPane tab="费用报销专栏" key="finance_expense">
                    <NewsNotice typeSn="finance_expense" type="news" pageSize={7}/>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="项目核算专栏" key="finance_pro">
                    <NewsNotice typeSn="finance_pro" type="news" pageSize={7}/>
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
          <Row style={{marginTop: 16}}>
            <Card bordered={false} bodyStyle={{padding:0, height: 225}} >
              <Tabs>
                <Tabs.TabPane tab="资料下载" key="download" >
                  <Card bordered={false} bodyStyle={{ padding: "0 24px 16px" }}>
                    <Tabs onChange={this.tabsChange} tabBarExtraContent={<Link className={styles.moreList} to="/fnc-service/material-filepage" target="_blank"> 更多&gt; </Link>}>
                      {typeList && typeList.length && typeList.map((type)=>(
                        <Tabs.TabPane tab={type.name} key={type.id}>
                          {!downloadKey || downloadKey === type.id ? <FileList files={materialFiles.data||[]} showDel={false}/> : ''}
                        </Tabs.TabPane>
                      ))}
                    </Tabs>
                  </Card>
                </Tabs.TabPane>
                <Tabs.TabPane tab="其他" key="other" >
                  <ContactAndSuggest />
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Row>
      </Fragment>
    );
  }
}
