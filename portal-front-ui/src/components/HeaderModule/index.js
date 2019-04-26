import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { Route, Link } from 'dva/router';
import styles from './index.less';


import weixin from '../../assets/public/weixin.png';
import appEwm from '../../assets/public/app-download.png';
import appDown from '../../assets/public/app-ewm.png';
import birthdayCake from '../../assets/public/birthday-cake.png';

export default class HeaderModule extends PureComponent{
  render() {
    return (
      <div className={styles.headerModuleBox}>
        <div className={styles.mobileModule}>
          <div className={styles.dropdownHead}>
            <Icon type="mobile" style={{ fontSize: 24, color: 'white' }} />
            <Icon type="bell" style={{ fontSize: 24, color: 'white' }} />
          </div>
          <div className={styles.dropdownContent}>
            <i className={styles.dropIcon}></i>
            <ul className={styles.ewmList}>
              <li className={styles.weixinBox}>
                <p>亚厦微信企业号</p>
                <div className={styles.ewmShow}>
                  <img src={weixin} alt=""/>
                </div>
                <p>扫码关注</p>
              </li>
              {/*<hr style={width: 1px,height: 135px,float: left,margin: 15px 20px,background: #ccc,border: none}/>*/}
              <li>
                <p>致远M1客户端</p>
                <div className={styles.ewmShow}>
                  <img src={appEwm} alt=""/>
                </div>
                <p>扫码下载</p>
              </li>
              {/*<hr style={width: 1px,height: 135px,float: left,margin: 15px 20px,background: #ccc,border: none}/>*/}
              <li>
                <p>亚厦移动门户客户端</p>
                <div className={styles.ewmShow}>
                  <img src={appDown} alt=""/>
                </div>
                <p>扫码下载</p>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.birthModule}>
          {/*<img src={birthdayCake} alt="birthday" title="请至人力资源部领取生日卡"/>*/}
        </div>
        <div className={styles.messageModule}>
          <Icon type="bell" style={{ fontSize: 24, color: '#08c' }} title="您有新消息！" />
          {/*<a id="msgUnRead" target="_blank" className="msg-sign" style="display:inline;"*/}
             {/*href="/portal/biz-sys/index.jhtml#sys=xxzx&m=lczx">*/}
            {/*<i style="display:none;"className="number-mark"></i>*/}
            {/*<Icon type="bell" style={{ fontSize: 24, color: '#08c' }} title="您有新消息！" />*/}
          {/*</a>*/}
        </div>
        <div className={styles.userModule}>
          <Icon type="bell" style={{ fontSize: 24, color: '#08c' }} title="您有新消息！" />
          {/*<div className="dropdown-head">*/}
            {/*<div className="user-pic-box">*/}
              {/*/!*<img src={} alt="${(loginUser.name)!''}"*!/*/}
                   {/*/!*onError="this.src='/assets/img/public/default-user-head.jpg'"/>*!/*/}
            {/*</div>*/}
            {/*<span>用户姓名(工号)</span><i className="dropdown-icon"></i>*/}
          {/*</div>*/}
          {/*<div className="dropdown-content">*/}
            {/*<i className="drop-icon"></i>*/}
            {/*<div>*/}
              {/*<ul className="drop-list">*/}
                {/*<li><a href="/portal/hr/baseInfo/editUserInfo.jhtml" target="_blank"><i*/}
                  {/*className="user-edit"></i>编辑资料</a></li>*/}
                {/*<li><a href="/portal/hr/baseInfo/editUserPwd.jhtml" target="_blank"><i className="user-pwd"></i>修改密码</a>*/}
                {/*</li>*/}
                {/*<li><a href="/portal/hr/baseInfo/editUserMobile.jhtml" target="_blank"><i className="modify-num"></i>修改密保手机</a>*/}
                {/*</li>*/}
                {/*<li className="drop-list2">*/}
                  {/*<a href="javascript:void (0);"><i className="pro-col"></i>流程授权</a>*/}
                  {/*<a style="float: right;">></a>*/}
                  {/*<ul className="dropdown-content2">*/}
                    {/*<li><a href="/portal/workplat/process/process-auth.jhtml" target="_blank">新流程中心授权</a></li>*/}
                    {/*<li><a href="${seeyonPath}/seeyon/yx.do?page=agentIFrame" target="_blank">oa流程授权</a></li>*/}
                  {/*</ul>*/}
                {/*</li>*/}
                {/*<li><a href="javascript:void(0);" id="jsLogOut"><i className="user-exit"></i>退出</a></li>*/}
              {/*</ul>*/}
            {/*</div>*/}
          {/*</div>*/}
        </div>
      </div>
    )
  }
}
