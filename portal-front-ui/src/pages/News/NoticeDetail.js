import React, { PureComponent } from 'react';
import { Icon, Card, Row, Col } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import FileList from '@/components/FileList';
import './detail.less';

@connect(({ newsNotice, loading }) => ({
  newsNotice,
  loading: loading.models.newsNotice,
}))

export default class NoticeDetail extends PureComponent {

  componentWillMount () {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    document.addEventListener('selectstart', function (e) {
      e.preventDefault();
    });
    document.addEventListener('copy', function (e) {
      e.preventDefault();
    });
  }

  watermark = (settings={}) => {
    //默认设置
    var defaultSettings={
      watermark_txt:"",
      watermark_x:30,//水印起始位置x轴坐标
      watermark_y:150,//水印起始位置Y轴坐标
      watermark_rows:(document.body.scrollHeight/window.screen.availHeight)*10,//水印行数
      watermark_cols:5,//水印列数
      watermark_x_space:50,//水印x轴间隔
      watermark_y_space:50,//水印y轴间隔
      watermark_color:'#000000',//水印字体颜色
      watermark_alpha:0.1,//水印透明度
      watermark_fontsize:'18px',//水印字体大小
      watermark_font:'微软雅黑',//水印字体
      watermark_width:150,//水印宽度
      watermark_height:100,//水印长度
      watermark_angle:45,//水印倾斜度数
    };
    //采用配置项替换默认值，作用类似jquery.extend

    for(let key in settings) {
      if(settings[key]&&defaultSettings[key]&&settings[key]===defaultSettings[key])
        continue;
      else if(settings[key])
        defaultSettings[key]=settings[key];
    }

    var oTemp = document.createDocumentFragment();

    //获取页面最大宽度

    var page_width = Math.max(document.body.scrollWidth,document.body.clientWidth);
    //获取页面最大长度
    var page_height = Math.max(document.body.scrollHeight,document.body.clientHeight,document.body.offsetHeight,window.screen.availHeight);

    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (defaultSettings.watermark_cols == 0 ||
      (parseInt(defaultSettings.watermark_x
        + defaultSettings.watermark_width *defaultSettings.watermark_cols
        + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1))
        > page_width)) {
      defaultSettings.watermark_cols =
        parseInt((page_width
          -defaultSettings.watermark_x
          +defaultSettings.watermark_x_space)
          / (defaultSettings.watermark_width
            + defaultSettings.watermark_x_space));
      defaultSettings.watermark_x_space =
        parseInt((page_width
          - defaultSettings.watermark_x
          - defaultSettings.watermark_width
          * defaultSettings.watermark_cols)
          / (defaultSettings.watermark_cols - 1));
    }
    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (defaultSettings.watermark_rows == 0 ||
      (parseInt(defaultSettings.watermark_y
        + defaultSettings.watermark_height * defaultSettings.watermark_rows
        + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1))
        > page_height)) {
      defaultSettings.watermark_rows =
        parseInt((defaultSettings.watermark_y_space
          + page_height - defaultSettings.watermark_y)
          / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
      defaultSettings.watermark_y_space =
        parseInt((page_height
          - defaultSettings.watermark_y
          - defaultSettings.watermark_height
          * defaultSettings.watermark_rows)
          / (defaultSettings.watermark_rows - 1));
    }
    var x;
    var y;
    for (var i = 0; i < defaultSettings.watermark_rows; i++) {

      y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
      for (var j = 0; j < defaultSettings.watermark_cols; j++) {
        x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

        var mask_div = document.createElement('div');
        mask_div.id = 'mask_div' + i + j;



        var texts = defaultSettings.watermark_txt.split("_");
        var nm=document.createElement('div');
        var no=document.createElement('div');
        no.style.top='40px';
        no.style.textAlign="center";
        nm.style.textAlign="center";
        no.style.position='relative';
        no.style.display='block';
        nm.style.display='block';
        nm.appendChild(document.createTextNode(texts[0]));
        no.appendChild(document.createTextNode(texts[1]));
        mask_div.appendChild(nm);
        mask_div.appendChild(no);



        //设置水印div倾斜显示
        mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
        mask_div.style.visibility = "";
        mask_div.style.position = "absolute";
        mask_div.style.left = x + 'px';
        mask_div.style.top = y + 'px';
        mask_div.style.overflow = "hidden";
        // mask_div.style.zIndex = "9999";
        mask_div.style.opacity = defaultSettings.watermark_alpha;
        mask_div.style.fontSize = defaultSettings.watermark_fontsize;
        mask_div.style.fontFamily = defaultSettings.watermark_font;
        mask_div.style.color = defaultSettings.watermark_color;
        mask_div.style.textAlign = "center";
        mask_div.style.width = defaultSettings.watermark_width + 'px';
        mask_div.style.height = defaultSettings.watermark_height + 'px';
        mask_div.style.display = "block";
        mask_div.style.pointerEvents="none";
        oTemp.appendChild(mask_div);
      };
    };
    this.refs.waterMarker && this.refs.waterMarker.appendChild(oTemp);
  };

  componentDidMount () {
    const { match: { params }, dispatch } = this.props;
    dispatch({
      type: 'newsNotice/queryNoticeDetail',
      payload: params.id,
      callback: (res)=>{
        if(res.code === '100' && res.data){
          this.watermark({
            watermark_txt: res.data.watermarkTxt
          });
        }
      }
    });
  }

  createApproveItem = (records) => {
    let approveRemark = '' , dom = [];
    if(records && records.length>0){
      records.map((record)=> {
        if(record.type==="SP" || record.type==="TJ"||record.type==="ZB" || record.type==="SPBJQ"){
          approveRemark = approveRemark + record.userName + record.typeName + "-&gt;";
        }
      });
      if(approveRemark){
        dom.push(<li><em>发文审批信息：</em><span>{approveRemark}</span></li>);
        approveRemark.length>0 && dom.push(<li><em>发文审批信息：</em><span>{approveRemark.split(0,approveRemark.length-6)}</span></li>)
      }
    }
    return dom
  };

  render() {

    const {
      newsNotice:{ noticeDetail: {notice, files, approveRecords} }} = this.props;

    return (
      <PageHeaderWrapper>
        <div className="notice-detail-container">
          <Card bordered={false} bodyStyle={{padding: '32px 0 0'}}>
            <div className="title-box">
              <p>
                <span className="art-no">{notice.articleNo}</span>
                {notice.title}
                {notice.files && notice.files.length>0 ? <Icon style={{color: '#0e65af'}} type="paper-clip" /> : ''}
              </p>
              <ul className="u-activity">
                {notice.signatory ? <li>签发人：<span>{notice.signatory}</span></li>: ''}
                <li>发布时间：<span>{notice.publishTime}</span></li>
                <li>阅读量：<span>{notice.visitCount}</span></li>
                {notice.categoryName?<li className="category-text"><span title={notice.categoryName}>{notice.categoryName} </span> </li>:''}
              </ul>
            </div>
            <div ref="waterMarker" className="text-content">
              <div id="watermark" />
              <div dangerouslySetInnerHTML={{__html: notice.content}} className="content-view" />
              <p align="right">{notice.ownerName}</p>
              {notice.writingTime ? <p align="right">{notice.writingTime}</p> : ''}
            </div>
          </Card>
          <div className="fixed-msg-box">
            <div className="anns-msg">
              <ul className="anns-list">
                {notice.ownerName ? <li><em>发文主体：</em><span>{notice.ownerName}</span></li> : ''}
                <li><em>发文范围：</em><span>{notice.rangeName}</span></li>
                {notice.keyword ? <li><em>关键词：</em><span>{notice.keyword}</span></li> : ''}
                {this.createApproveItem(approveRecords || [])}
              </ul>
            </div>
            {files && files.length>0 ? (
              <div className="fujian-box">
                <div className="fujian">
                  <span>附件：</span>
                  <div className="fujian-list">
                    <FileList showDel={false} files={notice.files} />
                  </div>
                </div>
              </div>
            ) : ''}
            </div>
          </div>
      </PageHeaderWrapper>
    );
  }
}
