import React, { Component, Fragment } from 'react';
import { Popover, Icon, Row, Col, Input } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import {getConfig} from "@/utils/utils";

const Search = Input.Search;
const Searcher = ({ dispatch}) => {
  function onSearch(value) {
    dispatch(routerRedux.push({
      pathname: '/news/search-list',
      keyword: value,
    }))
  }
  return (
    <Fragment>
      <Search placeholder="关键字" onSearch={onSearch} className={styles.searchItem} />
    </Fragment>
  );
};

export default connect(() => ({}))(Searcher);
