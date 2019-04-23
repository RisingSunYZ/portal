import React from 'react';
import { Card, message, Skeleton } from 'antd';
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
        if($(iframeWin.document).find('#jsIsEditPoint')[0] && $(iframeWin.document).find('#jsIsEditPoint').val() == 'true'){
          iframeWin.YSForm.formApprove(con);
        }else{
          this.props.doApprove(approveMsg);
        }
      }else if(fnName==="doApproveReview"){//评审
        const con=()=>{
          this.props.doApproveReview(approveMsg);
        }
        if($(iframeWin.document).find('#jsIsEditPoint')[0] && $(iframeWin.document).find('#jsIsEditPoint').val() == 'true'){
          iframeWin.YSForm.formApprove(con);
        }else{
          this.props.doApproveReview(approveMsg);
        }
      } else if(fnName==="doApproveCooperate"){//协同
        const con=()=>{
          this.props.doApproveCooperate(approveMsg);
        }
        if($(iframeWin.document).find('#jsIsEditPoint')[0] && $(iframeWin.document).find('#jsIsEditPoint').val() == 'true'){
          iframeWin.YSForm.formApprove(con);
        }else{

          this.props.doApproveCooperate(approveMsg);
        }
      }else if(fnName==="doAddSign"){//加签
        const con=()=>{
          this.props.doAddSign(approveMsg);
        };

        if(iframeWin.YSForm && iframeWin.YSForm.formAddSign&& $(iframeWin.document).find('#jsIsEditPoint')[0] && $(iframeWin.document).find('#jsIsEditPoint').val() == 'true'){
          iframeWin.YSForm.formAddSign(approveMsg,con);
        }else{
         this.props.doAddSign(approveMsg);
        }
      }else if(fnName==="doTurnDo"){//转办

        const con=()=>{
          this.props.doTurnDo(approveMsg);
        };
        const datas = approveMsg.datas?approveMsg.datas:{};
        if(iframeWin.YSForm && iframeWin.YSForm.formTurnDo  && $(iframeWin.document).find('#jsIsEditPoint')[0] && $(iframeWin.document).find('#jsIsEditPoint').val() == 'true'){
          iframeWin.YSForm.formTurnDo(datas ,con);
        }else{
          this.props.doTurnDo(approveMsg);
        }
      }else if(fnName==="doTurnRead"){//转阅
        if(iframeWin.YSForm && iframeWin.YSForm.formTurnRead && $(iframeWin.document).find('#jsIsEditPoint')[0] && $(iframeWin.document).find('#jsIsEditPoint').val() == 'true'){
          iframeWin.YSForm.formTurnRead(approveMsg);
        }
      }else if(fnName==="doReject"){//驳回
        if(iframeWin.YSForm && iframeWin.YSForm.formDoReject && $(iframeWin.document).find('#jsIsEditPoint')[0] && $(iframeWin.document).find('#jsIsEditPoint').val() == 'true'){
          iframeWin.YSForm.formDoReject();
        }
      }else{
        message.error('表单方法未找到！');
      }
    } catch (e) {
      message.error('表单节点未找到！');
    }
  }

  calcPageHeight = (doc) => {
    let height = 650;
    try {
      height = doc.body.scrollHeight > doc.body.clientHeight ? doc.body.scrollHeight : doc.body.clientHeight;
    } catch (e) {}
    return height;
  };

  setFormIframeHeight = (height, ifr) => {
    if (height < 650) {
      height = 650;
    }
    ifr.style.width = '1152px';
    ifr.style.height = height + 'px';
  };

  componentDidMount() {
  };

  componentWillUnmount() {
    clearInterval(this.Intervaltimer);
  }

  calcFrameHeight = (e) => {
    const ifr = e.currentTarget, _this = this;
    _this.setState({ loadingForm: false });
    // 解决打开高度太高的页面后再打开高度较小页面滚动条不收缩
    ifr.style.height = '0px';
    const iDoc = ifr.contentDocument || ifr.document;
    try{
      iDoc.body.style.overflowY="hidden";
      iDoc.body.classList.add('reactFormData');
    }catch (e) {
    }
    let height = _this.calcPageHeight(iDoc);
    _this.setFormIframeHeight(height, ifr);
    clearInterval(_this.Intervaltimer);
    _this.Intervaltimer = setInterval(function() {
      let h = _this.calcPageHeight(iDoc);
      _this.setFormIframeHeight(h, ifr);
    }, 500);
  };

  render() {
    const { props:{ src }, state} = this;
    const iframeSrc  = `${getConfig().domain}${src}&flowFileBasePath=${getConfig().ftpHost}&flowFileViewPath=${getConfig().filePreviewPath}`;

    const isLoading = src?false:true;

    return (
      <Card title="表单内容" className={styles.formMainBox} bordered={false}>
        <Card
          loading={state.loadingForm}
          bordered={false}
          className={styles.formMainLoadingBox}
        />
        {
          <Skeleton loading={isLoading} active paragraph={{rows:10}} >
            <iframe
              title="formIframeBox"
              id="formData"
              ref="processFormIframe"
              src={iframeSrc}
              style={{ height: 650 }}
              className={styles.formContentBox}
              onLoad={this.calcFrameHeight}
            />
          </Skeleton>
        }

      </Card>
    );
  }
}
