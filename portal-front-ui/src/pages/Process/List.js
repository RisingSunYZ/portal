import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Tabs, Button, Icon, Modal, Badge } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import { getRoutes, setCookie, getCookie, getConfig } from '../../utils/utils';

class Action extends React.Component {
  handelSend() {
    this.props.toProcessModel();
  }
  render() {
    const toSend = '/seeyon/yx.do?method=workFlowCenter&tabId=sendWF&timestamp=';
    return (
      <Fragment>
        <div>
          <Button style={this.props.btnStyle} type="primary" onClick={this.handelSend.bind(this)}>
            <Icon type="plus" />
            发起流程
          </Button>
          {/*<Button href={toSend} ><Icon type="left" />返回流程中心</Button>*/}
        </div>
      </Fragment>
    );
  }
}

@connect(({ process, user, loading }) => ({
  user,
  process,
  loading: loading.models.process,
}))
export default class ProcessList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: { visibility: 'visible' },
      modalVisible: true,
      oldFlowCount: 0,
      step: 1,
    };
  }
  handleTabChange = key => {
    const { dispatch, match } = this.props;
    this.setState({ style: { visibility: 'visible' } });

    //获取待办数量
    dispatch({
      type: 'process/getTodoCount',
    });

    switch (key) {
      case 'todo':
        router.push(`${match.url}/todo`);
        break;
        case 'already-do':
        router.push(`${match.url}/already-do`);
        break;
      case 'already-send':
        router.push(`${match.url}/already-send`);
        break;
      case 'draft':
        router.push(`${match.url}/draft`);
        break;
      case 'process-model':
        this.setState({ style: { visibility: 'hidden' } });
        router.push(`${match.url}/process-model`);
        break;
      case 'process-search':
        this.setState({ style: { visibility: 'hidden' } });
        router.push(`${match.url}/process-search`);
        break;
      default:
        break;
    }
  };
  toProcessModel() {
    const { dispatch, match } = this.props;
    this.setState({ style: { visibility: 'hidden' } });
    router.push(`${match.url}/process-model`);
  }

  componentDidMount() {
    const { match, location, dispatch } = this.props;
    if (location.pathname.replace(`${match.path}/`, '') === 'process-model') {
      this.setState({ style: { visibility: 'hidden' } });
    } else {
      this.setState({ style: { visibility: 'visible' } });
    }

    // 获取待办数量
    dispatch({
      type: 'process/getTodoCount',
    });

    // 获取是否有表单查询权限
    dispatch({
      type: 'process/getPermission',
    });
    this.setState({ modalVisible: false });
    dispatch({
      type: 'process/getProcessEnums',
    });
  }
  // 设置发起按钮显示隐藏
  handleOk() {
    this.setState({ modalVisible: false });
    setCookie('process_guide', 'read', 3000);
  }
  nextStep() {
    if (this.state.step < 4) {
      this.setState({ step: this.state.step + 1 });
    } else {
      this.setState({ modalVisible: false });
      setCookie('process_guide', 'read', 3000);
    }
  }
  render() {
    const {
      process: { hasPermission,todoCount },
    } = this.props;
    const seeyongPath =
      getConfig().seeyonPath + '/seeyon/yx.do?method=workFlowCenter&tabId=pending&timestamp=';
    const tabList = [
      {
        key: 'todo',
        tab: (
          <span>
            待办
            <Badge offset={[4, -4]} count={todoCount} overflowCount={99} />
          </span>
        ),
      },
      {
        key: 'already-do',
        tab: '已办',
      },
      {
        key: 'already-send',
        tab: '已发',
      },
      /*   {
           key: 'draft',
           tab: <span>草稿<Badge offset={[0,5]} count={this.props.process.draftCount} overflowCount={99}></Badge></span>,
         },*/
      {
        key: 'process-model',
        tab: '发起',
      },
      {
        key: 'old-process',
        tab: (
          <a style={{ color: '#595959' }} href={seeyongPath}>
            老流程中心
            <Badge offset={[4, -4]} count={this.state.oldFlowCount} overflowCount={99} />
          </a>
        ),
      },
    ];
    if (hasPermission) {
      tabList.splice(tabList.length - 2, 0, {
        key: 'process-search',
        tab: '表单查询',
      });
    }
    const { match, routerData, location } = this.props;
    return (
      <PageHeaderWrapper
        title="新流程中心"
        action={
          <Action toProcessModel={this.toProcessModel.bind(this)} btnStyle={this.state.style} />
        }
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        <div>
          <Modal
            visible={this.state.modalVisible}
            title="欢迎使用新版流程中心"
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleOk.bind(this)}
            closable={false}
            maskClosable={false}
            width="785px"
            footer={[
              <Button key="submit" type="primary" onClick={this.nextStep.bind(this)}>
                {this.state.step == 4 ? '立即体验' : '继续探索'}
              </Button>,
            ]}
          >
            <img src={'/ys/assets/image/guide_' + this.state.step + '.jpg'} heigt={480} />
          </Modal>
          {this.props.children}
        </div>
      </PageHeaderWrapper>
    );
  }
}
