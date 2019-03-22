import React, { PureComponent } from 'react';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'umi/router';
import styles from './index.less';

export default class PrintHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  print = () => {
    print.portrait = false;

    let bdhtml = document.body.innerHTML;
    let begin = bdhtml.indexOf(
      $('#noPrint')
        .html()
        .toString()
    );
    let prnhtml = bdhtml.substr(0, begin);
    let endhtml = bdhtml.substr(
      begin +
        $('#noPrint')
          .html()
          .toString().length,
      bdhtml.length - 1
    );
    document.body.innerHTML = prnhtml + endhtml;
    window.print();

    window.location.reload(); //重新渲染当前页面html元素
  };

  printPart = () => {
    // let printHtml = $("#formData").html();
    // console.info(printHtml);
    // document.body.innerHTML = printHtml;
    // window.print();
    //window.location.reload();//重新渲染当前页面html元素
  };

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    return <div className={styles.header} />;
    const {
      currentUser = {},
      collapsed,
      fetchingNotices,
      isMobile,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
    } = this.props;
  }
}
