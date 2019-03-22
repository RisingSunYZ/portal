import React, { PureComponent } from 'react';
import './index.less';
import { connect } from 'dva';
import {getConfig} from "../../../utils/utils";

@connect(({ inforTech, loading }) => ({
  inforTech,
  loading: loading.models.inforTech,
}))
export default class NewsNotice extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inforTech/queryHotKnowledge',
      payload: {
        pageNumber: 1,
        pageSize: 5
      }
    });
  }

  getHotList = news => {
    return news &&news.length >0 && news.map((item, index) => {
      return (
        <li key={index} className={index<2 ? 'hot' : ''}>
          <a className={item.already ? 'already' : ''} title={item.title} href={getConfig().domain +'/portal/news/noticeDetail.jhtml'} target="_blank"><i />{item.title}</a>
        </li>
      );
    });
  };

  render() {
    const {
      inforTech: { hotKnowledge },
    } = this.props;
    return (
      <ul className="hot-knowledge">
        {this.getHotList(hotKnowledge.datas)}
      </ul>
    );
  }
}
