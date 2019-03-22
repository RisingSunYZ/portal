import React from 'react';
import { Link } from 'dva/router';
import PageHeader from '../components/PageHeader';
import styles from './PageHeaderLayout.less';

export default ({ print, children, wrapperClassName, top, ...restProps }) => (
  <div className={wrapperClassName}>
    {top}
    <PageHeader key="pageheader" {...restProps} linkElement={Link} print={print} />
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
);
