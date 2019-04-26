import React, { Component } from 'react';
import styles from './index.less';
import DescriptionList from '../DescriptionList';

const { Description } = DescriptionList;

export default class CreatorInfo extends Component {
  render() {
    return (
      <DescriptionList className={styles.headerList} size="small" col="3">
        <Description className={styles.item} term="提交人">曲丽丽</Description>
        <Description className={styles.item} term="移动电话">13800138000</Description>
        <Description className={styles.item} term="职务级别">职员</Description>
        <Description className={styles.item} term="提交单位">
          <a href="">亚厦股份</a>
        </Description>
        <Description className={styles.item} term="提交部门">产品开发部</Description>
      </DescriptionList>
    );
  }
}
