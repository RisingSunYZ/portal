import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip, Popover, Button } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';
import logo from '../../assets/logo_main.png';
import HeaderMenu from '../HeaderMenu';
import weixin from '../../assets/public/weixin.png';
import appEwm from '../../assets/public/app-download.png';
import appDown from '../../assets/public/app-ewm.png';
import birthdayCake from '../../assets/public/birthday-cake.png';
import phoneIcon from '../../assets/public/mobile-icon.png';
import msgIcon from '../../assets/public/msg-tip.png';
import holidaySkin from '../../layouts/MainLayout.less';
import { getConfig } from '../../utils/utils';
import { connect } from 'dva';
import router from "umi/router";
import { Link } from 'dva/router';
const SubMenu = Menu.SubMenu;
@connect(({ global,baseInfo,user, loading }) => ({
  global,
  user,
  baseInfo,
  loading: loading.models.global,
}))
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'global/getMsgCount'
    });
  }

  logOutSyn() {
    this.props.dispatch({
      type: 'login/logOut',
      // payload: {
      // },
      callback: (res) => {
        // let loginOutUrl = '<img src="'+dt.data.logoutUrl+'" width="0" height="0" border="0" style="width:0;height:0;overflow:hidden;margin:0;padding:0;"/>';
        // $('body').after(loginOutUrl);
        // window.location.href = getConfig().domain+'/main/hr-service';
        if (res.code == '100' ) {
          // 判断如果是IDM，如果是IDM，将IDM也退出
          router.push({
            pathname:'/user/login',
          });
        }
      }
    });
  }

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      user:{currentUser},
      global:{msgCount},
      fetchingNotices,
      isHoliday,
      onMenuClick,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userInfo">
          <Link to="/user-center/edit/baseInfo"><Icon type="edit" />编辑资料</Link>
        </Menu.Item>
        <Menu.Item key="lock">
          <Link to="/user-center/edit/password"><Icon type="lock" />修改密码</Link>
        </Menu.Item>
        <Menu.Item key="mobile">
          <Link to="/user-center/edit/mobile"><Icon type="mobile" />修改密保手机</Link>
        </Menu.Item>
        <SubMenu key="process" className={styles.processAuthorize} title={<span><Icon type="user" />流程授权</span>}>
          <Menu.Item key="new">
            <a href={getConfig().domain+"/portal/workplat/process/process-auth.jhtml"} target="_blank">新流程中心授权</a>
          </Menu.Item>
          <Menu.Item key="oa" target="_blank"> <a href={getConfig().seeyonPath+"/seeyon/yx.do?page=agentIFrame"} target="_blank">oa授权</a></Menu.Item>
        </SubMenu>
        <Menu.Divider />
        <Menu.Item key="logout" onClick={this.logOutSyn.bind(this)}>
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    const phonePopover = (
      <div>
        <ul className={styles.phonePop}>
          <li>
            <p>亚厦微信企业号</p>
            <div>
              <img src={weixin} alt="" />
            </div>
            <p>扫码关注</p>
          </li>
          <hr className={styles.phoneItemSlide} />
          <li>
            <p>致远M1客户端</p>
            <div>
              <img src={appEwm} alt="" />
            </div>
            <p>扫码下载</p>
          </li>
          <hr className={styles.phoneItemSlide} />
          <li>
            <p>亚厦移动门户客户端</p>
            <div>
              <img src={appDown} alt="" />
            </div>
            <p>扫码下载</p>
          </li>
        </ul>
      </div>
    );
    return (
      <div className={isHoliday ? `${styles.header} ${holidaySkin.skinHeader}` : styles.header}>
        <div className={styles.main}>
          <a href={getConfig().domain} style={{ marginRight: 35 }}>
            <img src={logo} alt="亚厦股份" title="亚厦股份" />
          </a>
          <HeaderMenu {...this.props} />
          <div className={styles.right}>
            <a href={getConfig().domain+"/portal/biz-sys/index.jhtml#sys=xxzx&m=lczx"} target="_blank">
              <NoticeIcon
                   msgIcon={msgIcon}
                   className={styles.action}
                   count={msgCount}
                   loading={fetchingNotices}
               ></NoticeIcon>
            </a>
            <div className={styles.birthModule}>
              {/*<img src={birthdayCake} alt="birthday" title="请至人力资源部领取生日卡"/>*/}
            </div>
            <Popover placement="bottom" content={phonePopover} trigger="hover">
              <img src={phoneIcon} alt=""/>
            </Popover>
            {currentUser.name ? (
              <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Avatar
                    size="large"
                    className={styles.avatar}
                    src={getConfig().ftpHost + currentUser.userImgUrl}
                  />
                  <span className={styles.name}>
                    {currentUser.name}({currentUser.no})
                  </span>
                </span>
              </Dropdown>
            ) : (
              <Spin size="small" style={{ marginLeft: 8 }} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
