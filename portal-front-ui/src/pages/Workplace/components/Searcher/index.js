import React, { Component, Fragment } from 'react';
import { Popover, Icon, Row, Col, Input } from 'antd';
import styles from './index.less';
import {getConfig} from "@/utils/utils";

const Search = Input.Search;

export default class Searcher extends Component {
  state = {};

  onSearch = (value) =>{
    window.open( getConfig().domain + "/portal/newsNotice/searchNotice.jhtml")
  }

  render() {
    return (
      <Fragment>
        <Search placeholder="关键字" onSearch={this.onSearch} className={styles.searchItem} />
      </Fragment>
    );
  }
}
