import React, { Component, Fragment } from 'react';
import {Popover, Icon } from 'antd';
import styles from './index.less';
import {UserHeadBox} from '../User';
import {connect} from "dva/index";

@connect(({ userInfo, loading }) => ({
  userInfo,
  loading: loading.models.userInfo,
}))
export default class OwnerInfo extends Component {
  state = {
    visible: false,
  }

  openUserInfo(){
    this.props.dispatch({
      type: 'userInfo/openUserInfo',
      payload: {userNo:this.props.userNo,currentKey:this.props.id},
    })
  }
  render() {
    const { ownerDept, userNo , userName,id,bizId,modelId} = this.props;
    return (
      <Fragment >
        <ul className={styles.ownerInfo} >
          {/*{*/}
            {/*bizId==0? <li>模板编号：{modelId}</li>: <li>表单编号：{bizId}</li>*/}
          {/*}*/}
          <li>归属部门：{ownerDept}</li>
          <li>
            流程BP：
            <UserHeadBox userNo={userNo} textRender={()=><span>{userName}</span>}/>
          </li>
        </ul>
      </Fragment>
    );
  }
}
