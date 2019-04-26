import React, { PureComponent } from 'react';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import styles from './index.less';
import logo from '../../assets/logo_main.png';
import HeaderMenu from '../HeaderMenu';
import HeaderModule from '../HeaderModule';
import GlobalHeader from '@/components/GlobalHeader';


export default class MainHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
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

  handleNoticeClear = type => {
    message.success(
      `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
        id: `component.globalHeader.${type}`,
      })}`
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };
  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'userCenter') {
      router.push('/account/center');
      return;
    }
    if (key === 'triggerError') {
      router.push('/exception/trigger');
      return;
    }
    if (key === 'userinfo') {
      router.push('/account/settings/base');
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };
  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  render() {
    const {
      currentUser = {},
      collapsed,
      fetchingNotices,
      isMobile,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      handleMenuCollapse
    } = this.props;

    return (
      <div className={styles.header}>
        <div className={styles.main}>
          <a href="/" style={{marginRight:35}}><img src={logo} alt="亚厦股份" title="亚厦股份" /></a>
          <HeaderMenu />
          <HeaderModule />
        </div>
      </div>
    );
  }
}
