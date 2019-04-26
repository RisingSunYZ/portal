import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import memoizeOne from 'memoize-one';
import deepEqual from 'lodash.isequal';
import CommonHeader from '../components/CommonHeader';
import GlobalFooter from '../components/GlobalFooter';
import BackTop from '../components/BackTop';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../pages/404';
import { getRoutes, getCookie } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import styles from './CommonLayout.less';
import logo from '../assets/logo.svg';
// import MainHeader from '../components/MainHeader';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = memoizeOne(meun => {
  const routerMap = {};
  const mergeMeunAndRouter = meunData => {
    meunData.forEach(meunItem => {
      if (meunItem.children) {
        mergeMeunAndRouter(meunItem.children);
      }
      // Reduce memory usage
      routerMap[meunItem.path] = meunItem;
    });
  };
  mergeMeunAndRouter(meun);
  return routerMap;
}, deepEqual);


const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
  };
  getChildContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }
  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    let siamTgt = getCookie('SIAMTGT');
    debugger;
    this.props.dispatch({
      type: 'user/fetchCurrent',
      payload: {
        siamTgt: siamTgt,
      },
    });
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.breadcrumbNameMap = getBreadcrumbNameMap(getMenuData());
  }
  getPageTitle = pathname => {
    let currRouterData = null;
    // match params path
    Object.keys(this.breadcrumbNameMap).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = this.breadcrumbNameMap[key];
      }
    });
    if (!currRouterData) {
      return '流程中心';
    }
    return `${currRouterData.name} - 流程中心`;
  };
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };
  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };
  handleNoticeClear = type => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };
  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  };
  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  };
  render() {
    const {
      currentUser,
      collapsed,
      // fetchingNotices,
      // notices,
      routerData,
      match,
      location,
      children,
      mainBoxStyle,
      location: { pathname },
    } = this.props;
    // const bashRedirect = this.getBashRedirect();
    const layout = (
      <Layout className={classNames(mainBoxStyle)}>
        <Layout>
          <Header style={{ padding: 0, height: 50 }}>
            <CommonHeader
              logo={logo}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          {/*<Header style={{ padding: 0,height:80 }}>
            <MainHeader />
          </Header>*/}
          <Content className={styles.contentBox}>{children}</Content>
          <Footer style={{ padding: 0 }}>
            <GlobalFooter
              links={[
                {
                  key: '门户首页',
                  title: '门户首页',
                  href: 'http://home.chinayasha.com',
                  blankTarget: true,
                }
              ]}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> 2018 亚厦集团出品
                </Fragment>
              }
            />
          </Footer>
        </Layout>
        <BackTop />
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle(pathname)}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  mainBoxStyle: global.mainBoxStyle,
  // fetchingNotices: loading.effects['global/fetchNotices'],
  // notices: global.notices,
}))(BasicLayout);
