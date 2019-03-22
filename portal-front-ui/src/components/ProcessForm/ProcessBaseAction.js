import React, { Component, PureComponent, Fragment } from 'react';
import { Button, Icon,Row,Col, Modal, Popover, Upload, message } from 'antd';
import { connect } from 'dva';
import { ProcessSelector } from '../Selector';
import { changeParam, getConfig, nullToZero } from '@/utils/utils';
import styles from "./index.less"

/**
 * 流程图组件
 */
class DiagramImgModal  extends PureComponent{
  state = { diagramModalWidth:'50%' };
  // 设置图片弹窗的宽度
  setDiagramModalWidth = ()=>{
    const { processDiagramImgUrl } = this.props;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; // width
    const imgObj = new Image();
    imgObj.src = processDiagramImgUrl;
    const width = imgObj.naturalWidth;
    if(width > windowWidth*0.8){
      this.setState({diagramModalWidth: '80%'})
    }else{
      this.setState({diagramModalWidth: width+50})
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

  render(){
    const {processDiagramImgUrl, handleOk, handleCancel, visibleDiagramModal, processDiagramData, formTitle} = this.props;
    return  (
      <Modal
        title="流程图"
        width={this.state.diagramModalWidth}
        keyboard="true"
        maskClosable="true"
        visible={visibleDiagramModal}
        onOk={handleOk}
        onCancel={handleCancel}
        bodyStyle={{ overflowX:'auto',position:"relative",padding:"0px 20px 30px 0px", minHeight:'200px'}}
        footer={[
          <Button key="back" type="primary" onClick={handleCancel}>关闭</Button>
        ]}
      >
        <div>
          <img alt={formTitle} onLoad={this.setDiagramModalWidth.bind(this)} src={processDiagramImgUrl} />
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

  // 收藏操作
  doCollect = () => {
    message.info('收藏成功！');
  };


  // 打印操作
  doPrint = () => {
    const { dispatch } = this.props;

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

    const modelKey = this.props.processForm.modelId;
    for (let i = 0; i < PrintObj.length; i++) {
      if (PrintObj[i].modelKey === modelKey) {
        let url = PrintObj[i].printUrl;
        if (this.props.processForm.bizId) {
          url = changeParam(url, 'bizId', this.props.processForm.bizId);
          url = changeParam(url, 'modelKey', this.props.processForm.modelId);
          url = changeParam(url, 'processInstId', this.props.processForm.instId);
        }
        window.open(url);
        return;
      }
    }

    dispatch({
      type: 'processForm/doPrint',
      payload: {
        modelId: nullToZero(this.props.processForm.modelId),
        instId: nullToZero(this.props.processForm.instId),
        bizId: nullToZero(this.props.processForm.bizId),
        taskId: nullToZero(this.props.processForm.taskId),
      },
    });
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });
    // You can use any AJAX library you like
    message.success('upload successfully.');
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

    // 上传组件相关属性配置
    const uploadProps = {
      name: 'file',
      action: getConfig().domain + '/website/tools/fileUpload/uploadFile.jhtml?filePath=form',
      multiple: true,
      accept: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.pdf,image/jpg,image/jpeg,image/png,image/bmp',
      showUploadList: false,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          dispatch({
            type: 'processForm/addProcessFile',
            payload: info.file,
          });
        }
        if (info.file.status === 'done' && info.file.response && info.file.response.responseCode == 1) {
          message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error' || (info.file.response &&info.file.response.responseCode == 0)) {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
      defaultFileList: fileLists,
    };

    const ProcessTip = () => formInfo.formDesc ? (
      <Popover content={<div style={{ width: '200px' }}>{formInfo.formDesc}</div>}>
        <Icon style={{ color: '#3FA3FF', marginLeft: '12px' }} type="info-circle-o" />
      </Popover>
    ) : null;

    const ActionBtn = () => {
      return this.props.actionType === 'launch'&& this.props.processForm.formType!='2' && this.props.processForm.formType!='3' ? (
        <Fragment>
          <Popover content="上传附件">
            <span style={{ marginLeft: '8px' }}>
              <Upload {...uploadProps}>
                <Button icon="upload" />
              </Upload>
            </span>
          </Popover>
          <Popover content="关联流程">
            <Button onClick={this.selectProcess} icon="link" style={{ marginLeft: '8px' }} />
            <ProcessSelector
              visible={this.state.showProcessSelector}
              onSelect={this.selectedProcess}
            />
          </Popover>
        </Fragment>
      ) : null;
    };
    const PrintBtn = () => {
      return this.props.processForm.formType!='2' && this.props.processForm.formType!='3' ?(<Popover content="打印">
        <Button
          target="_blank"
          onClick={this.doPrint}
          icon="printer"
          style={{ marginLeft: '8px' }}
        />
        <Modal
          title=""
          width="100%"
          visible={this.state.printVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText=""
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
        />
      </Fragment>
    );
  }
}

export default ProcessBaseAction;
/**
 * href={'/ys/process/form/preview/'+nullToZero(this.props.processForm.modelId)+'/'+nullToZero(this.props.processForm.instId)+'/'+nullToZero(this.props.processForm.bizId)+'/'+nullToZero(this.props.processForm.taskId)}
 */
