import React, {Component} from "react";
import Draggable from 'react-draggable'; // Both at the same time
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Drawer,
  Tooltip,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Draggable.less';

export default class CustomDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      onIcon: false,
      buttonPosition:{
        top: 100, right: 300
      }
    };
    this.deltaPosition = {
      x: 0, y: 0
    }
  }

  showDrawer = () => {
    console.log("showDrawer");
    const {visible} = this.state;
    this.setState({
      visible: !visible,
    });
  };

  componentDidMount() {
    const localButtonPosition = JSON.parse(window.localStorage.getItem("handleButton"));
    if (localButtonPosition && !Number.isNaN(localButtonPosition.top) && !Number.isNaN(localButtonPosition.right)) {
      if (localButtonPosition.top < 0 || localButtonPosition.right < 0) {
        window.localStorage.removeItem('handleButton');
        return
      } else {
        this.setState({
          buttonPosition: {
            top: localButtonPosition.top,
            right: localButtonPosition.right
          }
        })
        document.getElementById("handleButton").style.top = localButtonPosition.top + 'px';
        document.getElementById("handleButton").style.right = localButtonPosition.right + 'px';
      }
    } else {
      window.localStorage.removeItem('handleButton');
      return
    }
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleStart = (e, data) => {
    console.log("handleStart");
    // console.log('Event: ', e);
    // console.log('Data: ', data);
    // window.localStorage// this.setState({activeDrags: ++this.state.activeDrags});
  }

  handleStop = (e, ui) => {
    console.log("handleStop");
    const {x, y} = this.deltaPosition;
    const {top, right} = this.state.buttonPosition;
    const _top = top + y;
    const _right = right - x;
    window.localStorage.setItem('handleButton', `{"top": ${_top}, "right": ${_right}}`)
  }

  handleDrag = (e, ui) => {
    console.log("handleDrag")
    const {x, y} = this.deltaPosition;
    this.deltaPosition = {
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    }
  }

  handleMoveOnIcon = () => {
    console.log("handleMoveOnIcon")
    this.setState({onIcon: true})
  }

  handleLeaveIcon = () => {
    console.log("handleLeaveIcon")
    this.setState({onIcon: false})
  }

  render() {
    const {  onIcon, visible  } = this.state;
    return (
      <PageHeaderWrapper title="拖拽demo1">
        <Card bordered={false}>
          <div>
            <Draggable
              bounds="body"
              handle=".handle"
              cancel="i"
              defaultPosition={{x: 0, y: 0}}
              position={null}
              onStart={this.handleStart}
              onDrag={this.handleDrag}
              onStop={this.handleStop}
            >
              <div className={styles.handle} id='handleButton'>
                <Tooltip placement="top" title={onIcon ? '点击打开' : '长按移动'} id='tooltip'>
                  <div className={styles.handleInner} draggable="true">
                    <Icon
                      onMouseLeave={this.handleLeaveIcon}
                      onMouseOver={this.handleMoveOnIcon}
                      onClick={this.showDrawer}
                      type={visible ? 'close' : 'setting'}
                      style={{
                        color: '#fff',
                        fontSize: 23,
                        cursor: 'pointer'
                      }}/>
                  </div>
                </Tooltip>
              </div>
            </Draggable>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
