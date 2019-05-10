import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Popover, Icon, Row, Col, Carousel } from 'antd';
import styles from './index.less';
import { getConfig } from '../../utils/utils';

@connect(({ newsNotice, loading }) => ({
  newsNotice,
  loading: loading.models.newsNotice,
}))
export default class NewsBanner extends Component {
  state = {
    overTimer: null,
    outTimer: null,
    icon: {
      left: this.props.newsBannerStyle.iconLeftCurrent,
      right: this.props.newsBannerStyle.iconRightCurrent,
      show: false,
    },
    bannerData:[]
  };

  componentDidMount() {
    const typeSn = this.props.typeSn ? this.props.typeSn : "home_banner";
    const { dispatch } = this.props;
    dispatch({
      type: 'newsNotice/fetchNewsBanner',
      payload: {
        typeSn: typeSn,
        pageNumber: 1,
        pageSize: 3,
      },
      callback: (res) => {
        this.setState({
          bannerData:res.data,
          rows:res.rows,
          total:res.total,
        });
      },
    });
  }

  // NewBanner鼠标移入事件
  handleMouseOver = () => {
    clearTimeout(this.state.outTimer);

    //定时执行
    var t1 = setInterval(this.handleIconOverFlash, 10);

    //去掉定时器的方法
    setTimeout(function() {
      clearTimeout(t1);
    }, 10 * 40);

    this.setState({
      overTimer: t1,
    });
  };

  // ICON鼠标移入效果
  handleIconOverFlash = () => {
    var left = this.state.icon.left;
    var right = this.state.icon.right;

    var maxLeft = this.props.newsBannerStyle.iconLeftCurrent + 34;
    var minRight = this.props.newsBannerStyle.iconRightCurrent - 34;

    left = left >= maxLeft ? maxLeft : left + 1;
    right = right <= minRight ? minRight : right - 1;
    this.setState({
      icon: {
        left: left,
        right: right,
      },
    });
  };

  // NewBanner鼠标移出事件
  handleMouseOut = () => {
    clearTimeout(this.state.overTimer);

    //定时执行
    var t1 = setInterval(this.handleIconOutFlash, 10);

    //去掉定时器的方法
    setTimeout(function() {
      clearTimeout(t1);
    }, 10 * 40);

    this.setState({
      outTimer: t1,
    });
  };

  handleIconOutFlash = () => {
    var left = this.state.icon.left;
    var right = this.state.icon.right;

    var maxLeft = this.props.newsBannerStyle.iconLeftCurrent;
    var minRight = this.props.newsBannerStyle.iconRightCurrent;

    left = left <= maxLeft ? maxLeft : left - 1;
    right = right >= minRight ? minRight : right + 1;
    this.setState({
      icon: {
        left: left,
        right: right,
      },
    });
  };

  handleIconShow = () => {
    this.setState({
      icon: {
        show: true,
      },
    });
  };

  handleIconHide = () => {
    this.setState({
      icon: {
        show: false,
      },
    });
  };

  // NewBanner向前事件
  handlePrev = () => {
    this.refs.img.prev(); //ref = img
  };

  // NewBanner向后事件
  handleNext = () => {
    this.refs.img.next();
  };

  render() {
    const {
      newsNotice: { newsBanners },
      newsBannerStyle,
    } = this.props;
    const {bannerData} = this.state;
    const { left, right, show } = this.state.icon;
    const ftpHost = getConfig().ftpHost;
    return (
      <div
        className={styles.bannerBox}
        onMouseOver={this.handleIconShow}
        onMouseOut={this.handleIconHide}
      >
        <Icon
          type="left"
          theme="outlined"
          style={{
            fontSize: '30px',
            top: newsBannerStyle.iconTop,
            left: 2,
            cursor: 'pointer',
            display: show ? 'block' : 'none',
          }}
          onClick={this.handlePrev}
          className={styles.iconLeft}
        />
        <Icon
          type="right"
          theme="outlined"
          style={{
            fontSize: '30px',
            top: newsBannerStyle.iconTop,
            left: 436,
            cursor: 'pointer',
            display: show ? 'block' : 'none',
          }}
          onClick={this.handleNext}
          className={styles.iconRight}
        />
        <Carousel autoplay ref="img">
          {bannerData !== undefined && bannerData.length > 0 ? (
            bannerData.map(item => {
              // item.sourceUrl ="http://www.baidu.com"
              return (
                <div key={"homeBanner"+item.id} style={{ height: '100%' }}>
                  {item.sourceUrl ? (
                    <a href={item.sourceUrl} target="_blank">
                      <img
                        className="banner-image"
                        src={ftpHost + item.thumbImg}
                        style={{
                          verticalAlign: 'middle',
                          width: '100%',
                          height:
                            newsBannerStyle.imgHeight < newsBannerStyle.imgHeight
                              ? newsBannerStyle.imgHeight
                              : newsBannerStyle.imgHeight,
                        }}
                      />
                    </a>
                  ) : (
                    <img
                      className="banner-image"
                      src={ftpHost + item.thumbImg}
                      style={{
                        verticalAlign: 'middle',
                        width: '100%',
                        height:
                          newsBannerStyle.imgHeight < newsBannerStyle.imgHeight
                            ? newsBannerStyle.imgHeight
                            : newsBannerStyle.imgHeight,
                      }}
                    />
                  )}
                </div>
              );
            })
          ) : (
            <div></div>
          )}
        </Carousel>
      </div>
    );
  }
}
