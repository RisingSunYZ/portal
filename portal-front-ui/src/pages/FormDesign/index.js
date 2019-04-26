import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Layout, Input, Card, InputNumber, DatePicker, Radio, Checkbox, Select, Icon, Tooltip } from 'antd';
import {DraggableArea, DraggableAreasGroup} from '@/components/Draggable';
import CustomForm from '@/components/CustomForm';
import { createForm, formShape } from 'rc-form';
import styles from './index.less';
import ConfigPane from './ConfigPane';

const { Sider, Content } = Layout;
const group = new DraggableAreasGroup();
const DraggableArea1 = group.addArea('widgetLabels');
const DraggableArea2 = group.addArea('widgetList');

const widgetsList = [
  {code: 'base', title: '基础字段', items: [
      {type: "text", name: "单行文本"},
      {type: "textarea", name: "多行文本"},
      {type: "number", name: "数字"},
      {type: "datetime", name: "日期时间"},
      {type: "radiogroup", name: "单选按钮组"},
      {type: "checkboxgroup", name: "复选框组"},
      {type: "combo", name: "下拉框"},
      {type: "combocheck", name: "下拉复选框"},
      {type: "separator", name: "分割线" }
    ]},
  {code: 'more', title: '增强字段', items: [
      {type: "address", name: "地址"},
      {type: "upload", name: "文件上传"},
      {type: "subform", name: "子表单"},
      {type: "user", name: "成员单选"},
      {type: "usergroup", name: "成员多选"},
      {type: "dept", name: "部门单选"},
      {type: "deptgroup", name: "部门多选"},
      {type: "deptadmin", name: "部门管理者信息"},
      {type: "bistable", name: "底表数据"},
      {type: "usermsg", name: "人员信息"},
      {type: "mqprojectmsg", name: "幕墙项目编码"},
      {type: "zsprojectmsg", name: "装饰项目编码"}
    ]}
];
const widgetTypeMap = {
  'text': <Input disabled />,
  'textarea': <Input.TextArea disabled rows={2} />,
  'number': <InputNumber style={{width:"100%"}} disabled />,
  'datetime': <DatePicker disabled />,
  'radiogroup': <Radio disabled />,
  'checkboxgroup': <Checkbox disabled />,
  'combo': <Select disabled />,
  'combocheck': <Select disabled mode='multiple' />
};

class FormDesign extends Component {
  state = {
    column: 3,
    items: [],
    selectedWidget: {}
  };

  /* 左侧列表渲染 */
  getWidgetTypeList = () => {
    return widgetsList.map((item) => {
      return (
        <div>
          <div style={{marginBottom: 12}}>
            <p className={styles.fieldsGroup}>{item.title}</p>
            {item.items ? (
              <DraggableArea1
                tags={item.items}
                isCopy
                itemRender={({tag}) => (
                  <div className={styles.fieldItem}>
                    {tag.name}
                  </div>
                )}
                grid="2"
                textField="name"
                keyField="type"
              />
            ) : ''}
          </div>
        </div>
      )
    })
  };

  createFormWidget = tag => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { selectedWidget } = this.state;
    return (
      <div className={`widget-view ${selectedWidget.fieldId===tag.fieldId ? 'selected' : ''}`} onClick={e=>this.setWidgetProperty(e, tag)}>
        <CustomForm.Field
          labelName={tag.labelName}
          fieldLineWidth={24}
        >
          {getFieldDecorator('field')(
            widgetTypeMap[tag.type] || (<Input disabled />)
          )}
        </CustomForm.Field>
      </div>
    )
  };

  updateWidgetProperty = values => {
    const { selectedWidget } = this.state;
    this.setState({
      selectedWidget: {
        ...selectedWidget,
        ...values
      }
    },()=>{
      console.log(this.state.selectedWidget)
    })
  };

  setWidgetProperty = (e, widget) => {
    if(widget){
      this.setState({
        selectedWidget: widget
      });
    }
  };

  render() {
    const { column, items, selectedWidget } = this.state;
    return (
      <Layout>
        <Sider width={300} style={{background:'#fff'}}>
          <Card bodyStyle={{padding: '0 8px'}}>
            {this.getWidgetTypeList()}
          </Card>
        </Sider>
        <Content style={{padding: '0 16px'}}>
          <Card style={{height: '100%'}} bodyStyle={{padding: 0,height: '100%'}}>
            <CustomForm prefixCls='cstm-design-form' layout={`grid-${column}`} style={{height: '100%'}}>
              <DraggableArea2
                tags={items || []}
                useDragHandle
                dataTransfer={tag=>{
                  tag.labelName = tag.name;
                  if(!tag.fieldId){
                    tag.fieldId = `_field_${new Date().getTime()}`
                  }
                  return tag;
                }}
                itemRender={({tag}) => this.createFormWidget(tag)}
                grid="3"
                textField="name"
                keyField="fieldId"
                onChange={rightTags => {
                  this.setState({items: rightTags});
                }}
              />
            </CustomForm>
          </Card>
        </Content>
        <Sider width={280}>
          <ConfigPane title="控件属性" widget={selectedWidget} onChange={this.updateWidgetProperty} />
        </Sider>
      </Layout>
    );
  }
}

export default CustomForm.create()(FormDesign);
