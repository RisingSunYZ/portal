import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {Tabs, Button, Icon, Modal, Timeline, Card, Affix, Popover, message, Row, Col, Input, Tag} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { deepCopy, getRoutes, nullToZero } from '@/utils/utils';
import FormWrapper from '../../components/FormWrapper';
import styles from '../../components/ProcessForm/index.less';

import {
  FormApproveTool,
  CreatorInfo,
  ApproveRecord,
  TransferRecord,
  PostscriptRecord,
  ProcessFileList,
  ProcessBaseAction,
} from '../../components/ProcessForm';
import formLogo from '../../assets/form-logo.png';
import OwnerInfo from '../../components/ProcessForm/OwnerInfo';
import ProcessBaseInfo from '../../components/ProcessForm/ProcessBaseInfo';

@connect(({ processForm, loading }) => ({
  processForm,
  loading: loading.models.processForm,
}))
export default class ProcessFormPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: { visibility: 'visible' },
      operationkey: 'formInfo',
      formTitle: null,
    };
  }


  // 获取父页面的样式和脚本
  loadScript= () =>{
    const iframe = document.getElementById('formData');
    let baseUrl = iframe.getAttribute('src');
    if(baseUrl && typeof baseUrl != 'undefined'){
      var indexCustmForm = baseUrl.indexOf('page');
      if(indexCustmForm != -1){
        baseUrl = baseUrl.substr(0,indexCustmForm)
      }
    }


    // 获取父页面里面的表单内容对象
    var links = [];
    var urls = [];
    $.each($($("#formData").contents()).find('link'), function(i, o){
      urls.push(o.href);
    });
    $.each(urls, function(i, o){
      links.push('<link rel="stylesheet" href="'+o+'">');
    });
    $.each($($("#formData").contents()).find('style'), function(i, o){
      var newStyle = document.createElement('style');
      newStyle.innerHTML = o.innerHTML;
      $('head')[0].appendChild(newStyle);
    });
    $('head').append(links.join(''));

    setTimeout(function(){
      $('#jsPrintCtrl input').attr('disabled', false);
    }, 500);
  };


  //正文内容全部显示
  mainContentView = () =>{
    var mainCt = '';
    setTimeout(function () {
      try{
        mainCt = $($("#formData").contents()).find(".widget-view");
        $.each(mainCt, function(i, widget){
          if($(widget).hasClass("fui_subform")){
            //子表单
            $(widget).find(".fui_subform table").css("width","100%");
            var itms = $(widget).find(".subform-line td");
            $.each(itms, function(i, itm){
              var cell = $(itm).find(".form-cell"), html = '';
              if(cell.find("input")[0]){
                html += cell.find("input").val();
              }else{
                var ls = cell.find(".select-list li");
                $.each(ls, function(k, t){
                  html += (k==0 ? $(t).text() : (','+$(t).text()));
                });
              }
              $(itm).html('<div class="itm-box">'+ html +'</div>');
            });
          }else if($(widget).hasClass("fui_textarea")){
            //多行文本
            var text = $(widget).find("textarea").val();
            $(widget).find(".fl-widget .fui_textarea").html(text).css({"height":"auto","border":"1px solid #e5e5e5","padding":"5px 10px"});
          }
        });
      }catch(e){
        console.error(e);
      }
    },1000)
  };

  print = () => {
    this.mainContentView();
    this.loadScript();

    document.getElementsByClassName('ant-layout-content')[0].firstChild.style.width = '1200px';
    let bdhtml = document.getElementsByClassName('ant-layout-content')[0].innerHTML;
    document.body.innerHTML = bdhtml;
    $("#noPrint").remove();

    setTimeout(function() {
      var mainCt = $($("#formData").contents()).find("#jsProcessForm");
      $("#formData").remove();

      var new_fMainCtt = mainCt.clone();
      var fMainCttObj = $(new_fMainCtt);
      // 解决百度编辑器打印时无法显示内容的问题
      if(fMainCttObj.find('div[id^="edui1_iframeholder"]')[0]){
        fMainCttObj.find('div[id^="edui1_iframeholder"]').html(fMainCttObj.find('.ueditor-txt').text());
      }
      $("#formDataDiv").append(fMainCttObj);
      window.print();
      window.location.reload(); //重新渲染当前页面html元素
    }, 2500);

  };

  closePrint = () => {
    history.go(-1);
  };

  printPart = () => {

    this.mainContentView();

    var iframe = document.getElementById('formData');
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    window.location.reload(); //重新渲染当前页面html元素
  };

  componentDidMount() {
    const { match } = this.props;
    // 存储基本参数
    this.props.dispatch({
      type: 'processForm/initProcessForm',
      payload: {
        taskId: nullToZero(this.props.taskId),
        modelId: nullToZero(match.params.modelId),
        instId: nullToZero(this.props.instId),
        bizId: nullToZero(this.props.bizId),
      },
    });

    this.props.dispatch({
      type: 'processForm/getFormUrl',
      payload: this.props.match.params,
    });
    this.props.dispatch({
      type: 'processForm/getBaseInfo',
      payload: this.props.match.params,
    });
    this.props.dispatch({
      type: 'processForm/getFormInfo',
      payload: this.props.match.params,
    });

    window.changeFormTitle=function(name) {
      _this.props.dispatch({
        type: 'processForm/changeFormTitle',
        payload: {
          formTitle: name,
        },
      });
    }


    this.mainContentView();


  }

  render() {
    const {
      processForm: { formInfo },
      match,
    } = this.props;
    class TitleAction extends Component {
      render() {
        return (
          <Fragment>
            {this.props.formInfo.formTitle}
            <ProcessBaseAction formInfo={this.props.formInfo} actionType="view" print={'1'} />
          </Fragment>
        );
      }
    }

    return (
      <PageHeaderLayout
        title={<TitleAction formInfo={formInfo} />}
        logo={<img alt="" src={formLogo} />}
        print={'1'}
        content={
          <Fragment>
            <OwnerInfo
              ownerDept={formInfo.ownDeptName}
              userName={formInfo.processDockingName}
              userNo={formInfo.processDockingNo}
            />
            <ProcessBaseInfo />
          </Fragment>
        }
      >
        <Affix
          id={'noPrint'}
          style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            left: 0,
            background: 'white',
            zIndex: 999,
          }}
        >
          {/* borderBottom: '3px solid rgba(24,144,255,1)',*/}

          <Card
            className={styles.approveTool}
            style={{ height: '50px', marginBottom: 24, width: '1200px', margin: 'auto' }}
            bordered={false}
          >
            <Row>
              <Col span={24}>
                <Card
                  bordered={false}
                  title=""
                  style={{ width: 300, height: 50 }}
                  className={styles.card}
                >
                  <p>预览</p>
                </Card>
                <Button className={styles.printBtn} onClick={this.closePrint} type="primary">
                  关闭
                </Button>
                <Button className={styles.printBtn} onClick={this.print} type="primary">
                  打印全部
                </Button>
                <Button className={styles.printBtn} onClick={this.printPart}>
                  只打印申请信息
                </Button>
              </Col>
            </Row>
          </Card>
        </Affix>

        <ProcessFileList files={formInfo.files} refDocs={formInfo.refDocs} />
        <div id={'formDataDiv'}>
          <FormWrapper src={formInfo.formUrl} />
        </div>
        <PostscriptRecord
          postscripts={formInfo.postscripts}
          proInstId={this.props.processForm.instId}
          print={'1'}
          showPost={formInfo.postscripts.length}
        />
        <ApproveRecord
          approveRecords={formInfo.approveRecords}
          flowEnd={formInfo.flowEnd}
          showApprove={formInfo.approveRecords.length}
        />
        <TransferRecord
          transferRecords={formInfo.transferRecords}
          showTransfer={formInfo.transferRecords.length}
        />
      </PageHeaderLayout>
    );
  }
}
