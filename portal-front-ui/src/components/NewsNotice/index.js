import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import Link from "umi/link";
import {getConfig} from "@/utils/utils";

@connect(({ newsNotice, loading }) => ({
  newsNotice,
  loading: loading.models.newsNotice,
}))
export default class NewsNotice extends PureComponent {
  state = {
      data: [],
      rows: [],
      total: 0
  };

  componentDidMount() {
    const { dispatch, typeSn, pageSize } = this.props;
    dispatch({
      type: 'newsNotice/queryNewsNoticeData',
      payload: {
        typeSn: typeSn,
        pageNumber: 1,
        pageSize: pageSize
      },
      callback: (res) => {
        this.setState({
          data:res.data,
          rows:res.rows,
          total:res.total,
        });
      },
    });
  }

  getNewsList = news => {
    const { type } = this.props;
    const url = type == "notice"?"/news-notice/notice-detail/":"/news-notice/news-detail/";
    return news &&news.length >0 && news.map((item, index) => {
      return (
        <li key={index} className={item.alreadyRead === 1 ? styles.alreadyRead : ''}>
          <span className={styles.content}>
            <Link title={item.title} to={url + item.id} target="_blank">
              {item.title}
            </Link>
          </span>
          <span className={styles.pubTime}>
            {item.publishTime.split(" ")[0]}
          </span>
        </li>
      );
    });
  };

  render() {
    const {data} = this.state
    return (
      <ul className={styles.newsList}>
        {this.getNewsList(data)}
      </ul>
    );
  }
}
