import React, { Component, PureComponent, Fragment } from 'react';
import { Button, Icon,Row,Col, Modal, Popover, message } from 'antd';
import { connect } from 'dva';
import { ProcessSelector } from '@/components/Selector';
import { changeParam, getConfig, nullToZero, fileDown } from '@/utils/utils';
import Plupload from "@/components/Plupload";
import styles from "./index.less"
import router from 'umi/router';

/**
 * 流程图组件
 */
class DiagramImgModal  extends PureComponent{
  state = {
    diagramModalWidth:'80%',
    diagramModalHeight:"50%",
    diagramModalMax:false,
    moveFlag:false,
  };
  // 设置图片弹窗的宽度
  setDiagramModalWidth = ()=>{
    const { processDiagramImgUrl } = this.props;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; // width
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; // Hidth
    const imgObj = new Image();
    imgObj.src = processDiagramImgUrl;
    const width = imgObj.naturalWidth;
    const height = imgObj.naturalHeight;

    if(width > windowWidth*0.8){
      this.setState({diagramModalWidth: '80%',diagramModalMax:false,moveFlag:true})
    }else{
      this.setState({diagramModalWidth: width+50,diagramModalMax:false})
    }
    if(height > windowHeight*0.8){
      this.setState({diagramModalHeight:windowHeight*0.6,moveFlag:true})
    }else{
      this.setState({diagramModalHeight:height})
    }
  }
  // 放大流程图
  setDiagramModalMax = ()=>{
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; // heihgt
      const antModalBody = document.getElementsByClassName("ant-modal-body")[0];
      // let imgWrapperHeight;
      const headerHeight = document.getElementsByClassName("ant-modal-header")[0].offsetHeight;
      const footerHeight = document.getElementsByClassName("ant-modal-footer")[0].offsetHeight;
      // 判断当放大后有横向滚动条时，图片父级高度加上17即滚动条高度
      const imgWrapperHeight = antModalBody.scrollWidth > antModalBody.clientWidth ? windowHeight - headerHeight - footerHeight - 24 - 17:windowHeight - headerHeight - footerHeight - 24;
      // 判断图片放大后，要不要出现拖动图标
      if(antModalBody.scrollHeight > antModalBody.clientHeight || antModalBody.scrollWidth > antModalBody.clientWidth){
        this.setState({moveFlag:true,diagramModalWidth:"100%",diagramModalHeight:imgWrapperHeight,diagramModalMax:true});
      }else{
        this.setState({moveFlag:false,diagramModalWidth:"100%",diagramModalHeight:imgWrapperHeight,diagramModalMax:true});
      }

  }
  //
  startDrag = (event)=>{
    if(this.state.moveFlag){
      event.preventDefault();
      const target = event.target;
      const startX = event.pageX;
      const startY = event.pageY;
      const ele = document.getElementsByClassName("ant-modal-body")[0];

      const scrollTop =ele.scrollTop;
      const scrollLeft =ele.scrollLeft;
      // const scrollTop = $(target).parent().parent().scrollTop();
      // const scrollLeft = $(target).parent().parent().scrollLeft();
      document.onmousemove = function(event){
        event.preventDefault();
        const top = event.pageY - startY;
        const left = event.pageX - startX;
        const endTop = scrollTop - top;
        const endLeft = scrollLeft - left;
        ele.scrollTop = endTop;
        ele.scrollLeft = endLeft;
        // $(target).parent().parent().scrollTop(endTop)
        // $(target).parent().parent().scrollLeft(endLeft)
      }
      document.onmouseup = function(){
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }
  }



  // 流程图节点内容
  flowNodeContent = (item) => {
    return (
      <Row>
        <h5>节点信息</h5>
        <Col>审批角色：{item.name?item.name:""}</Col>
        <Col>审批人员：{item.approver?item.approver:""}</Col>
        <Col>节点属性：{item.nodeType?item.nodeType:""}</Col>
        <hr />
        <h5>处理信息</h5>
        <Col>节点状态：{item.status?item.status:""}</Col>
        <Col>接收时间：{item.startDate?item.startDate:""}</Col>
        <Col>处理时间：{item.endDate?item.endDate:""}</Col>
        <Col>审批耗时：{item.duration?item.duration:""}</Col>
      </Row>
    );
  };

  // 流程图节点内容
  flowTile = (formTitle) => {
    return (
      <div>
        {formTitle + ' - 流程图'}
        <div style={{float:"right",marginRight:"35px"}}>
          <Icon type="shrink" style={{display:this.state.diagramModalMax?"inline-block":"none"}} onClick={this.setDiagramModalWidth} />
          <Icon type="arrows-alt" style={{display:this.state.diagramModalMax?"none":"inline-block"}} onClick={this.setDiagramModalMax}/>
        </div>
      </div>
    );
  };

  render(){
    const {processDiagramImgUrl, handleOk, handleCancel, handleDownImage, visibleDiagramModal, processDiagramData, formTitle} = this.props;
    const top = this.state.diagramModalMax?"0px":"100px";
    const cursor = this.state.moveFlag?"move":"auto";
    return  (
      <Modal
        title={this.flowTile(formTitle)}
        width={this.state.diagramModalWidth}
        style={{ top:top,paddingBottom:"0px" }}
        maskClosable={false}
        visible={visibleDiagramModal}
        onOk={handleOk}
        onCancel={handleCancel}
        bodyStyle={{ overflowX:'auto',position:"relative",padding:"0 0 24px 0",minHeight:'200px'}}
        footer={[
          <Button key="downImage" type="primary" onClick={handleDownImage}>导出图片</Button>,
          <Button key="back" onClick={handleCancel}>关闭</Button>
        ]}
      >
        <div style={{height:this.state.diagramModalHeight,cursor:cursor}}>
          <img alt={formTitle}
               onMouseDown={this.startDrag}
               onLoad={this.setDiagramModalWidth}
               src={processDiagramImgUrl}
          />
          {
            processDiagramData && processDiagramData.length>0?(processDiagramData.map((item) =>{

              return (
                <Popover
                  trigger="hover"
                  key={item.id}
                  content={this.flowNodeContent(item)}
                >
                  <div style={{position:"absolute",top:item.y,left:item.x,width:item.width ,height:item.height}} />
                </Popover>
              )
            })):null
          }
        </div>
      </Modal>
    );
  }
}

/**
 * 流程基本操作按钮式组件
 */
@connect(({ processForm, loading }) => ({
  processForm,
  loading: loading.models.processForm,
}))
class ProcessBaseAction extends Component {
  state = { visible: false, showProcessSelector: false, imgUrl: '', printVisible: false, diagramModalWidth:'50%' };

  componentDidMount() {
    const { processForm: { formInfo } } = this.props;
  }

  showFlowChartByLayer = () => {
    const { processForm:{ formInfo }, processForm, dispatch } = this.props;
    const values = {processInstId:processForm.instId === "0" ? "" :processForm.instId, processDefineId: formInfo.processDefineId};
    dispatch({
      type: 'processForm/getProcessDiagramData',
      payload: values,
    });
  };

  handleOk = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'processForm/setProcessDiagramImgModal',
      payload: false,
    });
  };

  handleCancel = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'processForm/setProcessDiagramImgModal',
      payload: false,
    });
  };

  // 下载图片
  handleDownImage = e => {
    const { formInfo:{formTitle}, processForm:{ processDiagramImgUrl } } = this.props;
    fileDown( formTitle + '-流程图.jpg', getConfig().domain + processDiagramImgUrl);
  };

  // 收藏操作
  doCollect = () => {
    message.info('收藏成功！');
  };


  // 打印操作
  doPrint = () => {
    const { processForm:{modelId, instId, bizId, taskId} } = this.props;

    // 打印表单常量对象（特殊表单打印配置）
    const PrintObj = [
      {
        modelKey: 'ysportal-express-sfjj',
        printUrl: getConfig().domain + '/portal/form/expressApply/expressOrderPreview.jhtml',
      }, // 顺丰快递单
      {
        modelKey: 'ems_expense_client_flow',
        printUrl: getConfig().domain + '/portal/form/expAccountPub/printPreview.jhtml',
      }, // 报销单打印模板
      {
        modelKey: 'ems_repayment_flow',
        printUrl: getConfig().domain + '/portal/form/expRepay/printPreview.jhtml',
      }, // 还款单打印模板
      {
        modelKey: 'ems_loan_client_flow',
        printUrl: getConfig().domain + '/portal/form/expLoan/printPreview.jhtml',
      }, // 备用金打印模板
      {
        modelKey: 'GFHR0009',
        printUrl: getConfig().domain + '/portal/hr/favform/personnelCertificate/printPreview.jhtml',
      }, // 人事证明打印模板
      {
        modelKey: 'GFHR0007',
        printUrl: getConfig().domain + '/portal/hr/favform/dimissionForm/printPreview.jhtml',
      }, // 离职证明打印模板
    ];

    let printOpenUrl = null;
    for (let i = 0; i < PrintObj.length; i++) {
      if (PrintObj[i].modelKey === modelId) {
        let url = PrintObj[i].printUrl;
        if (bizId) {
          url = changeParam(url, 'bizId', bizId);
          url = changeParam(url, 'modelKey', modelId);
          url = changeParam(url, 'processInstId', instId);
        }
        printOpenUrl = url;
        break;
      }
    }
    if(printOpenUrl){
      window.open(printOpenUrl);
    }else{
      const printUrl = `/print/form/print/${modelId}/${instId}/${bizId}/${taskId}`;
      router.push(printUrl);
    }
  };

  selectProcess = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'process/queryTodo',
    });

    this.setState({ showProcessSelector: !this.state.showProcessSelector });
  };

  selectedProcess = obj => {
    this.setState({ showProcessSelector: !this.state.showProcessSelector });
    this.props.dispatch({
      type:'processForm/addRefDocs',
      payload:obj,
    });
  };


  render() {
    const {processForm:{ visibleDiagramModal,processDiagramData, processDiagramImgUrl, formInfo }, dispatch } = this.props;

    const fileLists = formInfo.files;
    if (fileLists) {
      for (let i = 0; i < fileLists.length; i++) {
        fileLists[i].uid = fileLists[i].id;
        fileLists[i] = {
          uid: fileLists[i].id,
          name: fileLists[i].fileName,
          status: 'done',
          response: 'Server Error 500', // custom error message to show
          url: fileLists[i].fileUrl,
          ...fileLists[i],
        };
      }
    }

    const ProcessTip = () => formInfo.formDesc ? (
      <Popover content={<div style={{ width: '200px' }}>{formInfo.formDesc}</div>}>
        <Icon style={{ color: '#3FA3FF', marginLeft: '12px' }} type="info-circle-o" />
      </Popover>
    ) : null;

    // 上传组件相关属性配置
    const mime_types = [
      { title: 'Image files', extensions: 'png,jpg,jpeg,image/jpg,image/jpeg,image/png' },
      { title: 'Office files', extensions: 'pdf,txt,doc,docx,ppt,pptx,xls,xlsx' },
      { title: 'Zip files', extensions: 'zip,rar' },
      { title: 'Cad files', extensions: 'dwg' },
      { title: 'Msg files', extensions: 'msg' }
    ];

    const ActionBtn = () => {
      return this.props.actionType === 'launch'&& this.props.processForm.formType!='2' && this.props.processForm.formType!='3' ? (
        <Fragment>
          <Popover content="上传附件">
            <span style={{ marginLeft: '8px'}}>
              <Plupload saveDataCall={"processForm/addProcessFile"}
                        idName={"btn"}
                        mime_types={mime_types} />
            </span>
          </Popover>
          <Popover content="关联流程">
            <Button onClick={this.selectProcess} icon="link" style={{ marginLeft: '8px' }} />
          </Popover>
          <ProcessSelector
            visible={this.state.showProcessSelector}
            onSelect={this.selectedProcess}
          />
        </Fragment>
      ) : null;
    };
    const PrintBtn = () => {
      return this.props.processForm.formType!='2' && this.props.processForm.formType!='3' ?(<Popover content="打印">
        <Button
          target="_blank"
          onClick={this.doPrint.bind(this)}
          icon="printer"
          style={{ marginLeft: '8px' }}
        />
      </Popover>):null;
    };
    const FlowChartBtn = () => {
      return this.props.taskType!='search' ?(
        <Popover content="流程图">
          <Button onClick={this.showFlowChartByLayer} icon="cluster" style={{ marginLeft: '8px' }} />
        </Popover>
      ):null;
    };

    if (this.props.print > 0) {
      return (
        <Fragment>
          <ProcessTip />
        </Fragment>
      );
    }

    return (
      <Fragment>
        <ProcessTip />
        <ActionBtn />
        <PrintBtn />
        <FlowChartBtn />
        <DiagramImgModal
          visibleDiagramModal={visibleDiagramModal}
          processDiagramData={processDiagramData}
          processDiagramImgUrl={processDiagramImgUrl}
          formTitle={formInfo.formTitle}
          handleOk={this.handleOk}
          handleCancel={this.handleCancel}
          handleDownImage={this.handleDownImage.bind(this)}
        />
      </Fragment>
    );
  }
}

export default ProcessBaseAction;
/**
 * href={'/ys/process/form/preview/'+nullToZero(this.props.processForm.modelId)+'/'+nullToZero(this.props.processForm.instId)+'/'+nullToZero(this.props.processForm.bizId)+'/'+nullToZero(this.props.processForm.taskId)}
 */
