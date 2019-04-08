import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getConfig} from "@/utils/utils";
import sysDefault from '@/assets/workplace/sys-default.png';
import styles  from './index.less'

@connect(({ user, workplace , loading }) => ({
  user,
  workplace,
  loading: loading.models.user,
}))

class SystemMore extends PureComponent {

  state = {

  };

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'workplace/getSysData',
    });
  }

  onSysImgError = tar => {
    var img=tar.currentTarget;
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
        </li>
      );


    });
  };


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
      payload:{ systemMenuUser:systemMenuUser }
    })
  };

  handleReset = ()=> {

  };

  render() {
    const { workplace: { sysData } } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false} bodyStyle={{padding: '16px 24px'}}>
          <Row>
            <Col span={24}>
              <div className={styles.sysView}>
                <ul className={styles.sysList}>
                  {this.getServicesList(sysData || [])}
                </ul>
              </div>
            </Col>
          </Row>
        </Card>
        <div className={styles.btns}>
          <Button type="primary" onClick={this.handleSave}>保存</Button>
          <Button className={styles.resetBtn} onClick={this.handleReset}>重置</Button>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default SystemMore
