import React, {Fragment} from 'react';
import styles from './index.less';    // 按照 CSS Modules 的方式引入样式文件。
import {Popover, Icon, Row, Col} from 'antd';
import {connect} from "dva/index";
import logo from '../../assets/icons/flow-end.png';
import defaultUser from '../../assets/icons/default-user-head.jpg';
import { getConfig } from "../../utils/utils";

@connect(({ userInfo, loading }) => ({
  userInfo,
  loading: loading.models.userInfo,
}))
export default class UserHeadBox extends React.Component {
  state = {
    userInfo: {},
    visible: false,
    src: defaultUser
  };

  openUserInfo = () => {
    const { dispatch, type, userNo, userInfo: {userInfoMap} } = this.props;
    if("FLOWEND" === type || type === "XTZX" || !userNo){
      return ;
    }
    if(!userInfoMap[userNo]){
      dispatch({
        type: 'userInfo/getUserInfo',
        payload: {userNo},
      });
    }
    this.setState({
      visible: true
    });
  };

  onHeadImgError=(tar)=>{
    var img=tar.currentTarget;
    img.src=defaultUser;
    img.onerror=null;
  };

  componentDidMount(){
    const { src } = this.props;
    src && this.setState({
      src
    });
  };

  hide = () => {
    this.refs.headImgPopover.tooltip.state.visible=false;
    this.setState({
      visible: false
    });
  };

  render(){

    const {
      textRender,
      userInfo,
      userNo,
      type
    } = this.props;
    const { userInfoMap } = userInfo;
    let user = userInfoMap[userNo] || {};
    const { src, visible } = this.state;
    const title = (
      <div className={styles.userTitle}>
        <Row>
          <Col span={10} className={styles.imageWrapper}>
            <img ref="headImage" src={user.userHead} onError={this.onHeadImgError} className={styles.headImage} />
            <h3>{user.userName}</h3>
          </Col>
          <Col offset={13} span={1}>
            <a className={styles.closeIcon} onClick={(e)=> this.hide(e)}>
              <Icon type="close" />
            </a>
          </Col>
        </Row>
      </div>
    );
    const content = (
      <div className={styles.userInfoWrap}>
        <Row className={styles.userInfo}>
          <Col span={4}>职位：</Col>
          <Col span={20}>{user.jobStation||'-'}</Col>
        </Row>
        <Row className={styles.userInfo}>
          <Col span={4}>单位：</Col>
          <Col span={20}>{user.companyName||'-'}</Col>
        </Row>
        <Row className={styles.userInfo}>
          <Col span={4}>部门：</Col>
          <Col span={20}>
            {user.parentDeptName||'-'}-{user.deptName||'-'}
          </Col>
        </Row>
        <Row className={styles.userInfo}>
          <Col span={4}>手机：</Col>
          <Col span={8}>{user.mobilePhone||'-'}</Col>
          <Col span={4}>短号：</Col>
          <Col span={8}>{user.shortPhone||'-'}</Col>
        </Row>
      </div>
    );

    return(
      <Fragment>
        {
          ("FLOWEND" !== type && type !== "XTZX") && userNo ? (
            <Popover
              content={content}
              title={title}
              ref="headImgPopover"
              style={{padding:"0"}}
              trigger="click"
              placement="bottomLeft"
            >
              {textRender ? (
                <a onClick={this.openUserInfo}>{textRender(userInfo)}</a>
              ) : (
                <div style={this.props.style} className={styles.imageWrapper} onClick={this.openUserInfo}>
                  {'FLOWEND' === type ?
                    <img src={logo} className={styles.headImage}/>
                    : <img src={src} onError={this.onHeadImgError.bind(this)} className={styles.headImage}/>
                  }
                </div>
              )}
            </Popover>
          ) : (
            <Fragment>
              {textRender ? (
                <a onClick={this.openUserInfo}>{textRender(userInfo)}</a>
              ) : (
                <div style={this.props.style} className={styles.imageWrapper} onClick={this.openUserInfo}>
                  {'FLOWEND' === type ?
                    <img src={logo} className={styles.headImage}/>
                    : <img src={src} onError={this.onHeadImgError.bind(this)} className={styles.headImage}/>
                  }
                </div>
              )}
            </Fragment>
          )
        }
      </Fragment>
    )

  }
}
