import React, { Fragment, PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import {getConfig} from "@/utils/utils";
import Link from "umi/link";

@connect(({ inforTech, loading }) => ({
  inforTech,
  loading: loading.models.inforTech,
}))
export default class TrendNews extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inforTech/getITtrendNews'
    });
  }

  getTrendList = news => {
    const list1 = [], list2 = [];
    news && news.map((item, index) => {
      if(index === 0){
        list1.push(
          <Row gutter={16} key={item.id} className={styles.headNews}>
            <Col className={styles.picBox} span={12}>
              <img src={getConfig().ftpHost + item.thumbImg} alt="" />
            </Col>
            <Col span={12} className={styles.infoBox}>
              <h5>
                <i />
                <Link className={item.alreadyRead == 1 ? styles.already : ''} to={`/news-notice/news-detail/${item.id}`}  target="_blank" title={item.title}>{item.title}</Link>
              </h5>
              <p>{item.remark}</p>
            </Col>
          </Row>
        )
      }else if(index === 1){
        list2.push(
          <Row gutter={16} key={item.id} className={styles.headNews}>
            <Col className={styles.picBox} span={12}>
              <img src={getConfig().ftpHost + item.thumbImg} alt="" />
            </Col>
            <Col span={12} className={styles.infoBox}>
              <h5>
                <i className={styles.new} />
                <Link className={item.alreadyRead == 1 ? styles.already : ''} to={`/news-notice/news-detail/${item.id}`} target="_blank" title={item.title}>{item.title}</Link>
              </h5>
              <p>{item.remark}</p>
            </Col>
          </Row>
        )
      }else{
        const li = (
          <div className={styles.textNews} key={item.id}>
            <Link className={item.alreadyRead == 1 ? styles.already : ''} to={`/news-notice/news-detail/${item.id}`} title={item.title} target="_blank"><i />{item.title}</Link>
          </div>
        );
        index < 6 ? list1.push(li) : list2.push(li);
      }
    });
    return (
      <Row className={styles.ItTrendNewsList}>
        <Col span={12}>
          {list1}
        </Col>
        <Col span={12}>
          {list2}
        </Col>
      </Row>
    );
  };

  render() {
    const {
      inforTech: { trendNews },
    } = this.props;
    return (
      <Fragment>
        {this.getTrendList(trendNews)}
      </Fragment>
    );
  }
}
