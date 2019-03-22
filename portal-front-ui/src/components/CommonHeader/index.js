import React, { PureComponent } from 'react';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import styles from './index.less';
import logo from '../../assets/yasha-white.png';
import { getConfig } from '../../utils/utils';
export default class CommonHeader extends PureComponent {
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
  render() {
    const {
      currentUser = {},
      collapsed,
      fetchingNotices,
      isMobile,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
    } = this.props;
    return (
      <div className={styles.header}>
        <div className={styles.main}>
          <Link to={"/main/workplace"}><img src={logo} alt="亚厦股份" title="亚厦股份" /></Link>
        </div>
      </div>
    );
  }
}
