import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Button, Modal, Tabs, Radio } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getConfig} from "@/utils/utils";
import sysDefault from '@/assets/workplace/sys-default.png';
import styles  from './index.less'

const TabPane = Tabs.TabPane;

@connect(({ user, workplace , loading }) => ({
  user,
  workplace,
  loading: loading.models.user,
}))

class SystemMore extends PureComponent {

  state = {
    visible: false,
    value:0,
  };

  componentDidMount(){
    const { dispatch } = this.props;
    // 加载常用系统
    dispatch({
      type:'workplace/getSysData',
    });
    // 加载二级菜单
    dispatch({
      type:"workplace/getSystemById",
      payload:{id:"8a948c155d16777c015d16792f2e0001"}
    });
    // 加载顶级系统
    dispatch({
      type:'workplace/getTopSystem',
    });

  }

  onSysImgError = tar => {
    const img=tar.currentTarget;
    img.src=sysDefault;
    img.onerror=null;
  };

  getServicesList = slist => {
    return slist.map((sys, index)=>{
      return (
        <li key={index} className={styles.sysItem}>
          <Icon type="drag" className={styles.iconDrag}/>
          <a href={sys.linkUrl} target="_blank" className={styles.imgIcons}>
            <img width="56" height="56" onError={this.onSysImgError.bind(this)} src={getConfig().ftpHost+sys.sysIcon}/>
          </a>
          <p>{sys.sysName}</p>
          {sys.isIdmSys === 0 ? (<Icon type="minus-circle" className={styles.idmSys} onClick={()=>this.modifyIdmSys(sys)}/>) : ('')}
        </li>
      );
    });
  };

  // 删除或添加菜单
  modifyIdmSys=(data)=>{
    const { dispatch } = this.props;
    dispatch({
      type:"workplace/update",
      payload:data
    });
  };


  // 保存按钮事件
  handleSave = ()=> {
    const { dispatch ,workplace: { sysData }}=this.props;
    const systemMenuUser=[];
    sysData.map( item =>{
      const obj={
        sysId:item.id,
        sortNo: item.sortNo
      };
      return systemMenuUser.push(obj)
    });

    dispatch({
      type: "workplace/saveSystemMenu",
      payload:{ systemMenuUser:systemMenuUser },
      callback: res=>{
        if(res.code === '100'){
            this.setState({
              visible: true
            });

          setTimeout(()=>{
            this.setState({
              visible: false
            })
          },500);
          return
        }
      }
    })
  };

  //重置按钮事件
  handleResets = ()=> {
    const { dispatch } = this.props;
    dispatch({
      type:'workplace/getSysData',
    });
    dispatch({
      type:'workplace/getTopSystem',
    });
    dispatch({
      type:"workplace/getSystemById",
      payload:{id:"8a948c155d16777c015d16792f2e0001"}
    });
  };


  // 点击加载二级菜单
  sysCustom = (id,index)=> {
    const { dispatch }=this.props;
    this.setState({
      value:index
    });
    dispatch({
      type:"workplace/getSystemById",
      payload:{ id:id }
    });
  };


  render() {
    const { workplace: { sysData , sysMenusDate, sysTopMenusDate} } = this.props;
    const { visible ,value}=this.state;
    const  callback= (key) =>{ console.log(key) };

    return (
      <PageHeaderWrapper>
        <div className={styles.btns}>
          <Button type="primary" onClick={this.handleSave}>保存</Button>
          <Button className={styles.resetBtn} onClick={this.handleResets}>重置</Button>
        </div>
        <Card bordered={false} bodyStyle={{padding: '16px 24px'}}>
          <Row>
            <Col span={24}>
              <div className={styles.sysView}>
                <ul className={styles.sysList} id="ulContent">
                  {this.getServicesList(sysData || [])}
                </ul>
              </div>
            </Col>
          </Row>
        </Card>
        <Modal
          visible={visible}
          footer={null}
          closable={false}
          centered
          bodyStyle={{backgroundColor:'rgba(0, 0, 0, 0.6)',filter:'alpha(opacity=60)',color:'#fff',textAlign:'center'}}
          maskStyle={{backgroundColor:'transparent'}}>
          <p>保存常用系统成功</p>
        </Modal>
        <div>
          <Radio.Group value={value} style={{ margin:'50px 0 30px 380px'}}>
            {sysTopMenusDate.map((item,index)=>{
              return <Radio.Button value={index} key={item.id} onClick={()=>this.sysCustom(item.id,index)}>{item.name}</Radio.Button>
            })}
          </Radio.Group>
          <div>
            {sysMenusDate.length===0 ? (<span>暂无数据！</span>):(
              <Tabs onChange={callback} type="card">
                <TabPane tab="ALL" key="1">
                  {sysMenusDate.map(item =>{
                    return (
                      <div>
                        <Icon type="shopping" style={{ paddingLeft:10, fontSize: 18 }}/>&nbsp;&nbsp;
                        <span>{item.name}</span>
                        <div/>
                        {item.systemMenu.map((itm)=>{
                          return (
                            <span>
                              <Button style={{margin:'40px 20px 0 34px'}} onClick={()=>this.modifyIdmSys(itm)}>{itm.sysName}</Button>
                            </span>
                          )
                        })}
                      </div>
                    )
                  })}
                </TabPane>
                <TabPane tab="办公" key="2">办公部分内容</TabPane>
              </Tabs>
            )}
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default SystemMore
