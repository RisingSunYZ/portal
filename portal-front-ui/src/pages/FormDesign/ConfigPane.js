import React, { PureComponent } from 'react';
import { Form, Input, Card, InputNumber, DatePicker, Dropdown, Checkbox, Select, Icon, Tooltip, Radio, Button, Menu } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import styles from './index.less';
const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const CONFIG = {
  TEXT_TYPE_REGEXP: {
    mobile: "^1[34578]\\d{9}$",
    tel: "^(0[0-9]{2,3}\\-)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?$",
    zip: "^\\d{6}$",
    email: "^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$",
    ID: "(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)",
    money: "((^[$￥]?([1-9]\\d*))|^0)(\\.\\d{1,2})?$|(^[￥$]0\\.\\d{1,2}$)"
  }
};
class ConfigPane extends PureComponent{

  constructor(props){
    super(props);
    this.state = {
      field: {}
    }
  }

  componentWillMount() {
  }

  componentWillUpdate() {
    const { widget } = this.props;
    this.setState({
      field: widget
    });
  }

  createTitleConfig = () => {
    const { getFieldDecorator } = this.props.form;
    return <Form.Item {...formItemLayout} label="标题">
      {getFieldDecorator('labelName')(
        <Input placeholder="请输入标题" />
      )}
    </Form.Item>
  };

  createDescriptionConfig = () => {
    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link'];
    const { getFieldDecorator } = this.props.form;
    return <Form.Item {...formItemLayout} label="描述信息">
      {getFieldDecorator('fieldContent')(
        <BraftEditor
          className="formItemDescription"
          contentStyle={{height: 100}}
          controls={controls}
          onChange={e => e.toHTML()}
        />
      )}
    </Form.Item>
  };

  createWidgetEditableConfig = () => {
    const { getFieldDecorator } = this.props.form;
    return <div>
      <Form.Item {...formItemLayout} label="校验">
        是否可编辑： {getFieldDecorator('fieldEnable')(
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item {...formItemLayout}>
        是否可见： {getFieldDecorator('fieldIsshow')(
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item {...formItemLayout}>
        是否必填： {getFieldDecorator('fieldIsnull')(
          <Radio.Group>
            <Radio value={0}>是</Radio>
            <Radio value={1}>否</Radio>
          </Radio.Group>
        )}
      </Form.Item>
    </div>
  };

  createFlowConfig = () => {
    const {field} = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form.Item {...formItemLayout}>
          可在流程引擎中使用： {getFieldDecorator('fieldIswf')(
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout}>
          {getFieldDecorator('fieldName')(
            <Input style={{display: field.fieldIswf===1 ? 'block' : 'none'}} />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout}>
          为流程标题后缀： {getFieldDecorator('fieldIsname')(
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </div>
    );
  };

  createWidgetTypeLengthConfig = () => {
    const { getFieldDecorator } = this.props.form;
    return <Form.Item
      {...formItemLayout}
      label={(
        <span>字段限制长度&nbsp;
          <Tooltip title="长度不超过六位数，且为整数">
            <Icon type="question-circle-o" />
          </Tooltip>
        </span>
      )}>
      {getFieldDecorator('fieldLength')(
        <InputNumber style={{width: '100%'}} max={999999} precision={0} />
      )}
    </Form.Item>
  };

  createFlowSubmitConfig = () => {
    const { getFieldDecorator } = this.props.form;
    return <Form.Item {...formItemLayout}>
      是否是提交者： {getFieldDecorator('fieldIssubmit')(
        <Radio.Group>
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>
      )}
    </Form.Item>
  };

  createFlowSubmitDeptConfig = () => {
    const { getFieldDecorator } = this.props.form;
    return <Form.Item {...formItemLayout}>
      是否是提交部门： {getFieldDecorator('fieldIssubmitDept')(
        <Radio.Group>
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>
      )}
    </Form.Item>
  };

  createLayoutConfig = () => {
    const { field } = this.state;
    const items = [{code: 4, text: "1/3"}, {code: 8, text: "2/3"}, {code: 12, text: "全部"}];
    const { getFieldDecorator } = this.props.form;
    return field.fieldLayout==='normal' ? "" : (
      <Form.Item {...formItemLayout} label="布局">
        控件宽度占整行的 {getFieldDecorator('fieldLineWidth')(
          <Select style={{width: 100}}>
            {items.map(item=><Option key={item.code}>{item.text}</Option>)}
          </Select>
        )}
      </Form.Item>
    )
  };

  createWidgetconfigs = type => {
    const { getFieldDecorator } = this.props.form;
    const a = [
      this.createTitleConfig(),
      this.createDescriptionConfig()
    ];
    const b = [
      this.createWidgetEditableConfig(),
      this.createFlowConfig(),
    ];
    let configs=[];
    switch (type) {
      case 'text':
        configs = this.getTextConfigItems(a, b);break;
      case 'textarea':
        configs = [...a, (<Form.Item {...formItemLayout} label="默认值">
          {getFieldDecorator('fieldDefaultValue')(
            <Input.TextArea row={3} />
        )}
        </Form.Item>),(<Form.Item {...formItemLayout}>
          可自增长： {getFieldDecorator('fieldIsAutoIncrement')(
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
          )}
        </Form.Item>), ...b, this.createFlowSubmitConfig(), this.createLayoutConfig()];break;
      case 'number':
        configs = this.getNumberConfigItems(a, b);break;
      case 'datetime':
        configs = this.getDateTimeConfigItems(a, b);break;
      case 'radiogroup':
      case 'checkboxgroup':
      case 'combocheck':
        configs = this.getButtonGroupConfigItems(a, b);break;
      case 'combo':
        configs = [this.getButtonGroupConfigItems(a, b), ...this.createLinkedWidget()];break;
      case 'address':
        configs = [...a, (
          <Form.Item {...formItemLayout}>
            显示详细地址： {getFieldDecorator('needDetail')(
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
            )}
          </Form.Item>
        ), this.createWidgetTypeLengthConfig(), ...b];break;
      case 'upload':
        configs = [...a,(
          <Form.Item {...formItemLayout} label="上传文件限制个数">
            {getFieldDecorator('maxFileCount')(
              <InputNumber max={20} />
            )}
          </Form.Item>
        ),this.createWidgetTypeLengthConfig(),...b, this.createLayoutConfig()];break;
      case 'subform':
        configs = this.getSubFormConfigItems(a, b);break;
      case 'user':
      case 'usergroup':
        configs = [...a, this.createWidgetTypeLengthConfig(),...b,  this.createFlowSubmitConfig(), this.createLayoutConfig()];break;
      case 'dept':
      case 'deptgroup':
        configs = [...a, (
          <Form.Item {...formItemLayout} label="可选类型">
            {getFieldDecorator('type')(
              <Select>
                <Option key="company">公司</Option>
                <Option key="dept">公司和部门</Option>
              </Select>
            )}
          </Form.Item>
        ),this.createWidgetTypeLengthConfig(),...b,  this.createFlowSubmitDeptConfig(), this.createLayoutConfig()];break;
      case 'deptadmin':
        configs = [...a, this.SelectViewDeptAdmin(), this.createWidgetTypeLengthConfig(),...b, this.createLayoutConfig()];break;
      case 'bistable':
        configs = [...a, this.createBisTableDialog(),this.createWidgetTypeLengthConfig(), ...b, this.createLayoutConfig()];break;
      case 'usermsg':
        configs = [...a, this.createUserMsgFieldDialog(),this.createWidgetTypeLengthConfig(), ...b, this.createLayoutConfig()];break;
      default:
        configs = a;
    }
    return configs;
  };

  getTextConfigItems = (configs, editConfigs) => {
    const { getFieldDecorator } = this.props.form;
    const { field } = this.state;
    return [
      ...configs,
      (
        <Form.Item {...formItemLayout} label="数据格式">
          {getFieldDecorator('fieldRegexl')(
            <Select>
              <Option key="none" value="">无</Option>
              <Option key="mobile" value={CONFIG.TEXT_TYPE_REGEXP.mobile}>手机号码</Option>
              <Option key="tel" value={CONFIG.TEXT_TYPE_REGEXP.tel}>电话号码</Option>
              <Option key="zip" value={CONFIG.TEXT_TYPE_REGEXP.zip}>邮政编码</Option>
              <Option key="ID" value={CONFIG.TEXT_TYPE_REGEXP.ID}>身份证号码</Option>
              <Option key="email" value={CONFIG.TEXT_TYPE_REGEXP.email}>邮箱</Option>
              <Option key="money" value={CONFIG.TEXT_TYPE_REGEXP.money}>金额</Option>
            </Select>
          )}
        </Form.Item>
      ),
      (<div>
        <Form.Item {...formItemLayout} label="默认值">
          <Select style={{width: '100%'}} value={field.formula ? 'formula' : 'normal'}>
            <Option key="normal">自定义</Option>
            <Option key="formula">公式编辑</Option>
          </Select>
          {getFieldDecorator('fieldDefaultValue')(
            <Input />
          )}
          <Button style={{display: field.formula ? 'block' : 'none'}} block type="default">编辑公式</Button>
        </Form.Item>
        <Form.Item {...formItemLayout}>
          可自增长： {getFieldDecorator('fieldIsAutoIncrement')(
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </div>),
      this.createWidgetTypeLengthConfig(),
      ...editConfigs,
      this.createFlowSubmitConfig(),
      this.createLayoutConfig()
    ]
  };

  getNumberConfigItems = (configs, editConfigs) => {
    const { getFieldDecorator } = this.props.form;
    return [
      ...configs,
      (<div>
        <Form.Item {...formItemLayout} label="默认值">
          <Select style={{width: '100%'}}>
            <Option key="normal">自定义</Option>
            <Option key="formula">公式编辑</Option>
          </Select>
          {getFieldDecorator('fieldDefaultValue')(
            <Input />
          )}
          <Button block type="default">编辑公式</Button>
        </Form.Item>
        <Form.Item {...formItemLayout}>
          可自增长： {getFieldDecorator('fieldIsAutoIncrement')(
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </div>),
      this.createWidgetTypeLengthConfig(),
      (
        <Form.Item {...formItemLayout} label="小数位数">
          {getFieldDecorator('fieldDecimalLength')(
            <InputNumber max={6} />
          )}
        </Form.Item>
      ),
      ...editConfigs,
      this.createFlowSubmitConfig(),
      this.createLayoutConfig()
    ]
  };

  getDateTimeConfigItems = (configs, editConfigs) => {
    const { getFieldDecorator } = this.props.form;
    const { field } = this.state;
    return [
      ...configs,
      (
        <Form.Item {...formItemLayout} label="类型">
          {getFieldDecorator('fieldFormat')(
            <Select >
              <Option key="yyyy-MM-dd">时间</Option>
              <Option key="yyyy-MM-dd HH:mm:ss">时间日期</Option>
            </Select>
          )}
        </Form.Item>
      ),
      (
        <Form.Item {...formItemLayout} label="默认值">
          {getFieldDecorator('fieldDefaultValue')(
            <DatePicker showTime={field.format !== "yyyy-MM-dd"} />
          )}
        </Form.Item>
      ),
      this.createWidgetTypeLengthConfig(),
      ...editConfigs,
      this.createFlowSubmitConfig(),
      this.createLayoutConfig()
    ]
  };

  getButtonGroupConfigItems = (configs, editConfigs) => {
    const { getFieldDecorator } = this.props.form;
    return [
      ...configs,
      (
        <Form.Item {...formItemLayout} label="数据来源">
          <Button onClick={()=>this.selectAjaxUrlDialog()}>选择数据源</Button>
          {getFieldDecorator('ajaxurl')(
            <Input type="hidden" />
          )}
        </Form.Item>
      ),
      this.createWidgetTypeLengthConfig(),
      ...editConfigs,
      this.createFlowSubmitConfig(),
      this.createLayoutConfig()
    ]
  };

  getSubFormConfigItems = (a, b) => {
    const menu = (
      <Menu>
        <Menu.Item key="text">单行文本</Menu.Item>
        <Menu.Item key="number">数字</Menu.Item>
        <Menu.Item key="datetime">日期时间</Menu.Item>
        <Menu.Item key="combo">下拉框</Menu.Item>
        <Menu.Item key="combocheck">下拉复选框</Menu.Item>
        <Menu.Item key="user">成员单选</Menu.Item>
        <Menu.Item key="usergroup">成员多选</Menu.Item>
        <Menu.Item key="dept">部门单选</Menu.Item>
        <Menu.Item key="deptgroup">部门多选</Menu.Item>
      </Menu>
    );
    return [
      ...a,
      {
        label: '字段',
        widget: (
          <div>

            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">
                <Icon type="plus" />添加字段
              </a>
            </Dropdown>
          </div>
        )
      },
      {
        label: '默认值',
        widget: (
          <Button type="default" block onClick={this.setSubFormDefaultValue}>设置</Button>
        )
      }, this.createFlowConfig()
    ]
  };

  createLinkedWidget = () => {//选择关联控件

  };

  selectAjaxUrlDialog = () => {//选择数据字典

  };

  createFormConfigPane = widget => {
    if(widget && widget.type){
      return this.createWidgetconfigs(widget.type);
    }
    return (
      <div />
    )
  };

  render() {
    const {
      widget,
      title,
    } = this.props;
    return (
      <Card style={{height: '100%'}} bordered={false} title={title||'控件属性设置'} bodyStyle={{padding: 10}}>
        <Form prefixCls="widget-config-form">
          {this.createFormConfigPane(widget)}
        </Form>
      </Card>
    )
  }
}
export default Form.create({
  mapPropsToFields(props){
    const { widget } = props;
    const fields = {};
    for( var key in widget){
      if(key === "fieldContent" && typeof widget[key] !== 'string'){
        widget[key] = widget[key].toHTML()
      }
      fields[key] = Form.createFormField({
        value: widget[key],
      });
    }
    return fields
  },
  onValuesChange(props, values){
    props.onChange(values);
  }
})(ConfigPane);
