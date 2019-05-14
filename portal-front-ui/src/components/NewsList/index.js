import React, { PureComponent } from 'react';
import { Card, Carousel } from 'antd';
import './index.less';
import { connect } from 'dva/index';
import Link from "umi/link";
import {getConfig} from "@/utils/utils";

@connect(({  newsNotice, loading }) => ({
  newsNotice,
  loading: loading.models.newsNotice,
}))
class NewsList extends PureComponent {
  state = {
    dataList: [],
    rows: [],
    total: 0
  };

  static defaultProps = {
    typeSn: 'home_notice',
    pageNumber: 3,
    pageSize: 7,
    title: '新闻公告',
    width: 550,
    height: 350,
    extra: <a href="#">更多&gt;</a>,
  };

  componentDidMount() {
    const { typeSn, pageNumber, pageSize, dispatch } = this.props;

    dispatch({
      type: 'newsNotice/queryNewsNoticeData',
      payload: {
        typeSn: typeSn,
        pageNumber: 1,
        pageSize: pageNumber*pageSize
      },
      callback: (res) => {
        this.setState({
          dataList:res.data,
          rows:res.rows,
          total:res.total,
        });
      },
    });
  }

  createAnnouncementSwiper = list => {
    const { pageSize, detailUrl,typeSn,type, itemRender } = this.props;
    const width = this.refs.newsArtList ? this.refs.newsArtList.container.offsetWidth : 430;

    const swiperList = [];

    if(list && list.length>0){
      let i = 0;
      const temp = [];
      list.map((item, index)=>{
        if((index+1)%pageSize === 1){
          temp[i] = [];
        }

        temp[i].push(
          itemRender ? itemRender(item) : (
            <li key={item.id}><i></i>
              <Link to={`/news-notice/${typeSn}/${item.id}`} className={item.alreadyRead ? 'already' : ''} style={{width: width-120}} target="_blank" title={item.title}>{item.title}</Link>
              <span>{item.publishTime ? item.publishTime.split(" ")[0] : ''}</span>
            </li>
          )
        );
        if((index+1)%pageSize === 0){
          swiperList.push(
            <ul key={"newsListBox"+index} className="news-list">{temp[i]}</ul>
          );
          i++;
        }
      });
    }
    return (
      <Carousel className="wp-news-box">{swiperList}</Carousel>
    )
  };

  render() {
    const {
      newsNotice,
      className,
      title,
      width,
      height,
      extra,
      style,
      itemRender,
      detailUrl,
      loading,
      typeSn,
    } = this.props;

    return (
      <Card
        ref="newsArtList"
        className={`marginBottom ${className || ''}`}
        title={title}
        style={{ width, height, ...style }}
        bordered={false}
        extra={extra}
        loading={loading}
        bodyStyle={{ padding: 0 }}
      >
        {this.createAnnouncementSwiper(this.state.dataList)}
      </Card>
    );
  }
}
export default NewsList;
