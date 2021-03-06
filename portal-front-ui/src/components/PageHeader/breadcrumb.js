import React, { PureComponent, createElement } from 'react';
import pathToRegexp from 'path-to-regexp';
import { Breadcrumb } from 'antd';
import styles from './index.less';
import { urlToList } from '../_utils/pathTools';
import {getConfig} from "@/utils/utils";
import Link from "umi/link";


export const getBreadcrumb = (breadcrumbNameMap, url) => {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach(item => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
};

export default class BreadcrumbView extends PureComponent {
  state = {
    breadcrumb: null,
    key:"",
    url:""
  };

  componentDidMount() {
    this.getBreadcrumbDom();
  }

  componentDidUpdate(preProps) {
    const { location } = this.props;
    if (!location || !preProps.location) {
      return;
    }
    const prePathname = preProps.location.pathname;
    if (prePathname !== location.pathname) {
      this.getBreadcrumbDom();
    }
  }

  getBreadcrumbDom = () => {
    const breadcrumb = this.conversionBreadcrumbList();
    this.setState({
      breadcrumb,
    });
  };

  getBreadcrumbProps = () => {
    const { routes, params, location, breadcrumbNameMap } = this.props;
    return {
      routes,
      params,
      routerLocation: location,
      breadcrumbNameMap,
    };
  };

  // Generated according to props
  conversionFromProps = () => {
    const { breadcrumbList, breadcrumbSeparator, itemRender, linkElement = 'a' } = this.props;

    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {breadcrumbList.map(item => {
          const title = itemRender ? itemRender(item) : item.title;
          return (
            <Breadcrumb.Item key={item.title}>
              {item.href
                ? createElement(
                    linkElement,
                    {
                      [linkElement === 'a' ? 'href' : 'to']: item.href,
                    },
                    title
                  )
                : title}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  };

  AddBreadcrumbDom=(routerLocation)=>{
      switch(routerLocation.split("/")[1]){
        case "process" :return <Link to={"/main/workplace"}>工作台</Link>;break;
        case "workplace" :return <Link to={"/main/workplace"}>工作台</Link>;break;
        case "biz-sys" :return <Link to={"/main/workplace"}>工作台</Link>;break;
        case "hr-service" :return <Link to={"/main/hr-service"}>HR服务</Link>;break;
        case "infor-tech" :return <Link to={"/main/infor-tech"}>IT服务</Link>;break;
        case "fnc-service" :return <Link to={"/main/fnc-service"}>财务服务</Link>;break;
        case "news" :return <Link to={"/main/news"}>新闻资讯</Link>;break;
        case "news-notice" :return <Link to={"/main/news"}>新闻资讯</Link>;break;
        default : return <a href={ getConfig().domain+"/main.jhtml"}>工作台</a>;break;
      }
  }

  conversionFromLocation = (routerLocation, breadcrumbNameMap) => {
    const { breadcrumbSeparator, home, itemRender, linkElement = 'a' } = this.props;
    // Convert the url to an array
    const pathSnippets = urlToList(routerLocation.pathname);

    // Loop data mosaic routing
    let extraBreadcrumbItems  = [];
    // 当有自定义面包屑数据时，创建自定义面包屑 ，否则按照路由创建
    if(this.props.diyBreadCrumb && this.props.diyBreadCrumb.length>0){
      extraBreadcrumbItems = this.props.diyBreadCrumb.map((obj, index) => {
        const isLinkable = index !== this.props.diyBreadCrumb.length - 1 ;
        const name = obj ?  obj.name:"";
        return (
            <Breadcrumb.Item key={obj.url}>
              { index == 0? "您所在的位置：":""}
              {createElement(
                isLinkable ? linkElement : 'span',
                { [linkElement === 'a' ? 'href' : 'to']: obj.url },
                name
              )}
            </Breadcrumb.Item>
          );
      });
    }else{
      extraBreadcrumbItems = pathSnippets.map((url, index) => {
        const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
        if (currentBreadcrumb.inherited) {
          return null;
        }
        const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
        const name = itemRender ? itemRender(currentBreadcrumb) : currentBreadcrumb.name;
        return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
          <Breadcrumb.Item key={url}>
            {createElement(
              isLinkable ? linkElement : 'span',
              { [linkElement === 'a' ? 'href' : 'to']: url },
              name
            )}
          </Breadcrumb.Item>
        ) : null;
      });
      // Add home breadcrumbs to your head
      const  homeDem  = this.AddBreadcrumbDom(routerLocation.pathname);
      extraBreadcrumbItems.unshift(
        <Breadcrumb.Item key="home">
          您所在的位置：{homeDem}
          {/*{createElement(*/}
          {/*linkElement,*/}
          {/*{*/}
          {/*[linkElement === 'a' ? 'href' : 'to']: '/',*/}
          {/*},*/}
          {/*home || 'Home'*/}
          {/*)}*/}
        </Breadcrumb.Item>
      );
    }

    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {extraBreadcrumbItems}
      </Breadcrumb>
    );
  };

  /**
   * 将参数转化为面包屑
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { breadcrumbList, breadcrumbSeparator } = this.props;
    const { routes, params, routerLocation, breadcrumbNameMap } = this.getBreadcrumbProps();
    if (breadcrumbList && breadcrumbList.length) {
      return this.conversionFromProps();
    }
    // 如果传入 routes 和 params 属性
    // If pass routes and params attributes
    if (routes && params) {
      return (
        <Breadcrumb
          className={styles.breadcrumb}
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
          separator={breadcrumbSeparator}
        />
      );
    }
    // 根据 location 生成 面包屑
    // Generate breadcrumbs based on location
    if (routerLocation && routerLocation.pathname) {
      return this.conversionFromLocation(routerLocation, breadcrumbNameMap);
    }
    return null;
  };

  // 渲染Breadcrumb 子节点
  // Render the Breadcrumb child node
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return last || !route.component ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      createElement(
        linkElement,
        {
          href: paths.join('/') || '/',
          to: paths.join('/') || '/',
        },
        route.breadcrumbName
      )
    );
  };

  render() {
    const { breadcrumb } = this.state;
    return breadcrumb;
  }
}
