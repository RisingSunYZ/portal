import React, { PureComponent } from 'react';
import { List, Col, Icon } from 'antd';
import Ellipsis from '@/components/Ellipsis'
import styles from './index.less';
import { connect } from 'dva';
import {getConfig} from "../../utils/utils";

@connect(({ newsNotice, loading }) => ({
  newsNotice,
  loading: loading.models.newsNotice,
}))
export default class NewsNotice extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch, typeSn, pageSize } = this.props;
    dispatch({
      type: 'newsNotice/queryNewsNoticeData',
      payload: {
        typeSn: typeSn,
        pageNumber: 1,
        pageSize: pageSize
      }
    });
  }

  getNewsList = news => {
    return news &&news.length >0 && news.map((item, index) => {
      return (
        <li key={index}>
          <span className={styles.content}>
            <a title={item.title}
               href={getConfig().domain +'/portal/news/noticeDetail.jhtml?id='+item.id+'&typeSn=hr_notice'} target="_blank"
            >
              {item.title}
            </a>
          </span>
          <span className={styles.pubTime}>
            {item.publishTime.split(" ")[0]}
          </span>
        </li>
      );
    });
  };

  render() {
    const {
      newsNotice,
      typeSn="hr_notice",
    } = this.props;
    return (
      <ul className={styles.newsList}>
        {this.getNewsList(newsNotice[typeSn].data)}
      </ul>
    );
  }
}
