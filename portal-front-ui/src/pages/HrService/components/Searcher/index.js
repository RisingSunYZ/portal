import React, { Component, Fragment } from 'react';
import { Popover, Icon, Row, Col, Input } from 'antd';
import styles from './index.less';

const Search = Input.Search;

export default class Searcher extends Component {
  state = {};
  render() {
    return (
      <Fragment>
        <Search placeholder="关键字" onSearch={value => console.log(value)} enterButton />
      </Fragment>
    );
  }
}
