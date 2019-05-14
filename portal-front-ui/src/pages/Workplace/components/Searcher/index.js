import React, { Component, Fragment,createElement } from 'react';
// import React, { PureComponent, createElement } from 'react';
import { Popover, Icon, Row, Col, Input } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import {getConfig} from "@/utils/utils";
import { Base64 } from 'js-base64';

import Link from  "umi/link";

const Search = Input.Search;
const Searcher = ({ dispatch}) => {
  function onSearch(value) {

    const keyWord = Base64.encode(value);
    if(keyWord){
      window.open(`/eip/workplace/search-list/${keyWord}`,"_blank")
    }else{
      window.open(`/eip/workplace/search-list/0`,"_blank")
    }
  }
  return (
    <Fragment>
      <Search placeholder="关键字" onSearch={onSearch} className={styles.searchItem} />
    </Fragment>
  );
};

export default connect(() => ({}))(Searcher);
