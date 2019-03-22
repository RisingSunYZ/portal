import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
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

import {DraggableArea, DraggableAreasGroup} from '@/components/Draggable';

import deleteBtn from '../../assets/delete.png';
import deleteBtn2x from '../../assets/delete@2x.png';

import mock from './mock.js';

const group = new DraggableAreasGroup();
const DraggableArea1 = group.addArea();
const DraggableArea2 = group.addArea();

//demo来源:   https://www.colabug.com/2968052.html


const leftTags = [{type: "text", name: "单行文本"},
  {type: "textarea", name: "多行文本"},
  {type: "number", name: "数字"},
  {type: "datetime", name: "日期时间"},
  {type: "radiogroup", name: "单选按钮组"},
  {type: "checkboxgroup", name: "复选框组"},
  {type: "combo", name: "下拉框"},
  {type: "combocheck", name: "下拉复选框"},
  {type: "separator", name: "分割线" }];



import styles from './drag.less';

class CrossArea  extends PureComponent {
  constructor() {
    super();
    this.state = {
      leftTags: leftTags,
      rightTags: []
    }
  }

  handleClickDelete(tag) {
    const rightTags = this.state.rightTags.filter(t => tag.id !== t.id);
    this.setState({rightTags});
  }

  componentDidMount() {

  }

  render() {

    return (
      <PageHeaderWrapper title="拖拽demo2">
        <Card bordered={false}>
          <div className={styles.CrossArea}>
            <div className={styles.left}>
              <DraggableArea1
                tags={this.state.leftTags}
                isCopy
                itemRender={({tag}) => (
                  <div className={styles.tag}>
                    {tag.name}
                  </div>
                )}
                grid="2"
                textField="name"
                keyField="type"
                onChange={leftTags => {
                }}
              />
            </div>
            <div className={styles.right}>
              <DraggableArea2
                tags={this.state.rightTags}
                itemRender={({tag}) => (
                  <div className={styles.tag}>
                    <img
                      className={styles.delete}
                      src={deleteBtn}
                      srcSet={`${deleteBtn2x} 2x`}
                      onClick={() => this.handleClickDelete(tag)}
                    />
                    {tag.name}
                  </div>
                )}
                grid="3"
                textField="name"
                keyField="type"
                onChange={rightTags => {
                }}
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CrossArea;
