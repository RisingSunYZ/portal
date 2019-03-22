import React from 'react';
import { Affix, Button } from 'antd';
import styles from './index.less';

export default class BackTop extends React.Component {
  state = {
    top: 10,
  }

  // 渲染之后
  componentDidMount() {
    window.onscroll = function () {
      // 变量t就是滚动条滚动时，到顶部的距离
      const t = document.documentElement.scrollTop || document.body.scrollTop;
      const topView = document.getElementById('top_view');
      if (topView !== null) {
        topView.style.display = t >= 100 ? 'block' : 'none';
      }
    };
  }

  // 返回顶部
  scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  render() {
    return (
      <div className={styles.backtop}>
        <Affix offsetBottom={this.state.top} >
          <Button
            id="top_view"
            className="back-top"
            shape="circle"
            icon="up"
            type="primary"
            size="large"
            onClick={this.scrollToTop}
          />
        </Affix>
      </div>
    )
  }

}
