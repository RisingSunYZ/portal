import React from 'react';
import { Card, message } from 'antd';
import styles from './index.less';
import { getConfig } from '../../utils/utils';

export default class FormBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { iframeHeight: '650px', loadingForm: true };
  }

  doFormFn(fnName,approveMsg) {
    const that = this;
    const iframeWin = that.refs.processFormIframe.contentWindow;
    try {
      // 开始执行Iframe子窗口内部的方法
      if(fnName === "doSave"){//如果提交或者存草稿 approveMsg value 为 modeId
        if('ems_business_flow' === approveMsg){//如果出差单特殊处理
          const con=(formId)=>{//出差单提交存草稿中confirm 确认按钮回调
            this.props.doSaveBaseInfo(formId);
          }
          iframeWin.YSForm.formSave(con);
        }else{

          const formId = iframeWin.YSForm.formSave();
          // 判断返回值，如果有返回值代表表单已经保存成功，否则把按钮加载
          if(formId) {

            this.props.doSaveBaseInfo(formId);
          }else{
            this.props.changeBtnState(false);
          }
        }

      }else if(fnName === "doSubmit"){//提交
        if('ems_business_flow'===approveMsg){
          const con=(formId)=>{
            this.props.doSaveBaseInfo(formId);
          }

          const conNo=(formId)=>{//出差单提交confirm 取消按钮回调
            this.props.changeBtnState(false);
          }

          iframeWin.YSForm.formSubmit(con,conNo);
        }else{
          const formId = iframeWin.YSForm.formSubmit();
          if(formId) {
            this.props.doSaveBaseInfo(formId);
          }else{
            this.props.changeBtnState(false);
          }
        }
      }else if(fnName==="doApprove"){//审批
        const con=()=>{
          this.props.doApprove(approveMsg);
        }
        if($(iframeWin.document).find('#jsIsEditData')[0] && $(iframeWin.document).find('#jsIsEditData').val() == 'true'){
          iframeWin.YSForm.formApprove(con);
        }else{
          this.props.doApprove(approveMsg);
        }
      }else if(fnName==="doAddSign"){//加签
        const con=()=>{
          this.props.doAddSign(approveMsg);
        };

        if(iframeWin.YSForm && iframeWin.YSForm.formAddSign&& $(iframeWin.document).find('#jsIsEditData')[0] && $(iframeWin.document).find('#jsIsEditData').val() == 'true'){
          iframeWin.YSForm.formAddSign(approveMsg,con);
        }else{
         this.props.doAddSign(approveMsg);
        }
      }else if(fnName==="doTurnDo"){//转办

        const con=()=>{
          this.props.doTurnDo(approveMsg);
        };
        const datas = approveMsg.datas?approveMsg.datas:{};
        if(iframeWin.YSForm && iframeWin.YSForm.formTurnDo  && $(iframeWin.document).find('#jsIsEditData')[0] && $(iframeWin.document).find('#jsIsEditData').val() == 'true'){
          iframeWin.YSForm.formTurnDo(datas ,con);
        }else{
          this.props.doTurnDo(approveMsg);
        }
      }else if(fnName==="doTurnRead"){//转阅
        if(iframeWin.YSForm && iframeWin.YSForm.formTurnRead && $(iframeWin.document).find('#jsIsEditData')[0] && $(iframeWin.document).find('#jsIsEditData').val() == 'true'){
          iframeWin.YSForm.formTurnRead(approveMsg);
        }
      }else if(fnName==="doReject"){//驳回
        if(iframeWin.YSForm && iframeWin.YSForm.formDoReject && $(iframeWin.document).find('#jsIsEditData')[0] && $(iframeWin.document).find('#jsIsEditData').val() == 'true'){
          iframeWin.YSForm.formDoReject();
        }
      }else{
        message.error('表单方法未找到！');
      }
    } catch (e) {
      message.error('表单节点未找到！');
    }
  }

  componentDidMount() {
    const _this = this;
    // 计算页面的实际高度，iframe自适应会用到
    function calcPageHeight(doc) {
      let height = 650;
      try {
        height = doc.body.scrollHeight || doc.body.clientHeight;
        // var bodyheight = $(doc.body).height();
        // var clientHeight = Math.max(doc.body.clientHeight, doc.documentElement.clientHeight);
        // height = Math.max(bodyheight, clientHeight);
      } catch (e) {}
      return height;
    }
    function setFormIframeHeight(height, ifr) {
      if (height < 650) {
        height = 650;
      }
      ifr.style.width = '1152px';
      ifr.style.height = height + 'px';
    }
    // 根据ID获取iframe对象
    const ifr = this.refs.processFormIframe;
    ifr.onload = function() {
      _this.setState({ loadingForm: false });
      // 解决打开高度太高的页面后再打开高度较小页面滚动条不收缩
      ifr.style.height = '0px';
      const iDoc = ifr.contentDocument || ifr.document;
      if(iDoc)iDoc.body.style.overflowY="hidden";
      let height = calcPageHeight(iDoc);
      setFormIframeHeight(height, ifr);
      clearInterval(_this.Intervaltimer);
      _this.Intervaltimer = setInterval(function() {
        let h = calcPageHeight(iDoc);
        setFormIframeHeight(h, ifr);
      }, 500);
    };
  };

  componentWillUnmount() {
    clearInterval(this.Intervaltimer);
  }

  render() {
    const { props:{ src }, state} = this;
    const iframeSrc  = `${src}&flowFileBasePath=${getConfig().ftpHost}&flowFileViewPath=${getConfig().filePreviewPath}`;
    return (
      <Card title="表单内容" className={styles.formMainBox} bordered={false} headStyle={{ height:'46px',lineHeight:'46px',padding:'0 24px',fontWeight:'bold' }}>
        <Card
          loading={state.loadingForm}
          bordered={false}
          className={styles.formMainLoadingBox}
        />
        <iframe
          title="formIframeBox"
          id="formData"
          ref="processFormIframe"
          src={iframeSrc}
          style={{ height: state.iframeHeight }}
          className={styles.formContentBox}
        />
      </Card>
    );
  }
}
