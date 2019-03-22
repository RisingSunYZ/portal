import React, { Fragment } from 'react';
import { Layout, message } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage } from 'umi/locale';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { getCookie } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import styles from './CommonLayout.less';
import holidaySkin from './MainLayout.less';
import logo from '../assets/logo.svg';
import footLogo from '../assets/logo_black.png';
import skinFootLogo from '../assets/skin/logo_black.png';
import GlobalHeader from '@/components/GlobalHeader';
import MainFooter from "@/components/MainFooter";
import {title} from "../defaultSettings";

import Context from './MenuContext';

const { Content, Header, Footer } = Layout;
const { check } = Authorized;

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

class MainLayout extends React.PureComponent {

  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    isMobile,
    isHoliday: false,
  };

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    const siamTgt = getCookie('SIAMTGT');

    this.props.dispatch({
      type: 'user/fetchCurrent',
      payload: {
        siamTgt,
      },
    });
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path && pathToRegexp(route.path).test(key)) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };


  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return title;
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName} - ${title}`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
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
      id: `component.globalHeader.${type}`,
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'triggerError') {
      routerRedux.push('/exception/trigger');
      return;
    }

/*    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }*/
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
      fetchingNotices,
      notices,
      children,
      isMobile,
      breadcrumbNameMap,
      location: { pathname },
      mainBoxStyle,
    } = this.props;
    // const bashRedirect = this.getBashRedirect();
    const { isHoliday } = this.state;
    const layout = (
      <Layout>
        {/*{isTop && !isMobile ? null : (*/}
        {/*<SiderMenu*/}
        {/*logo={logo}*/}
        {/*theme={navTheme}*/}
        {/*onCollapse={this.handleMenuCollapse}*/}
        {/*menuData={menuData}*/}
        {/*isMobile={isMobile}*/}
        {/*{...this.props}*/}
        {/*/>*/}
        {/*)}*/}
        <Layout
          className={classNames(mainBoxStyle)}
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header style={{ padding: 0, height: 80 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isHoliday={isHoliday}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              {...this.props}
            />
          </Header>
          <Content className={isHoliday ? holidaySkin.mainContentBg : ''}>
            {isHoliday && (<div className={holidaySkin.lBanner}> </div>)}
            {isHoliday && (<div className={holidaySkin.rBanner}> </div>)}
            <div className={isHoliday ? `${styles.contentBox} ${holidaySkin.skinPadding}` : styles.contentBox}>{children}</div>
          </Content>
          <Footer style={{ padding: 0 }}>
            <MainFooter
              className={isHoliday ? 'holidayMainFooter' : ''}
              footerLogo={isHoliday ? skinFootLogo : footLogo}
              links={[
                {
                  key: '集团介绍',
                  title: '集团介绍',
                  href: 'http://www.chinayasha.com/about.asp',
                  blankTarget: true,
                },
                {
                  key: '管理之道',
                  title: '管理之道',
                  href: 'http://www.chinayasha.com/management.asp#loc',
                  blankTarget: true,
                },
                {
                  key: '发展历程',
                  title: '发展历程',
                  href: 'http://www.chinayasha.com/history.asp#loc',
                  blankTarget: true,
                },
                {
                  key: '社会责任',
                  title: '社会责任',
                  href: 'http://www.chinayasha.com/responsibility.asp#loc',
                  blankTarget: true,
                },
              ]}
              copyright={
                <span>Copyright @ <span id="jsFooterYear">2018</span> 亚厦股份（YaSha） All Rights Reserved.</span>
              }
            />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ user, global, loading, setting, menu }) => ({
  currentUser: user.currentUser,
  mainBoxStyle: global.mainBoxStyle,
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <MainLayout {...props} isMobile={isMobile} />}
  </Media>
));
