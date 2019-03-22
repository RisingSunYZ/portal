import React, { Component } from 'react';
import { Col, Popover, Icon } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class FormWidget extends Component{
  static defaultProps = {
    prefixCls: 'ant-form',
    fieldLineWidth: 6,
    fieldIsnull: 1,
    fieldOrderno: -1,
    fieldIswf: 0,
    fieldIsOwer: 0,
    fieldIsshow: 1,
    fieldIsdel: 1,
    fieldIssubmit: 0,
    fieldIssubmitDept: 0,
    fieldIsAutoIncrement: 1,
    fieldIsname: 0,
    fieldEnable: 1,
    needDetail: 1
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    validateStatus: PropTypes.oneOf(['', 'success', 'warning', 'error', 'validating']),
    children: PropTypes.node
  };

  static contextTypes = {
    vertical: PropTypes.bool
  };

  componentDidMount(){

  }

  getHelpMessage = () => {
    const { fieldErrmsg } = this.props;

    if (fieldErrmsg === undefined && this.getOnlyControl()) {
      const errors = this.getField().errors;
      if (errors) {
        return errors.map((e, index) => {
          return React.isValidElement(e.message) ? React.cloneElement(e.message, { key: index }) : e.message;
        })
      }
      return '';
    }
    return fieldErrmsg;
  };

  getControls = (children, recursively) => {
    const controls = [];
    const childrenArray = React.Children.toArray(children);
    for (let i = 0; i < childrenArray.length; i++) {
      if (!recursively && controls.length > 0) {
        break;
      }
      const child = childrenArray[i];
      if (child.type && (child.type === FormWidget || child.type.displayName === 'FormWidget')) {
        continue;
      }
      if (!child.props) {
        continue;
      }
      if (child.props.children) {
        controls = controls.concat(this.getControls(child.props.children, recursively));
      }
    }
    return controls;
  };

  getOnlyControl = () => {
    const { children } = this.props;
    const child = this.getControls(children, false)[0];
    return child !== undefined ? child : null;
  };

  getChildProp = (prop) => {
    const child = this.getOnlyControl();
    return child && child.props && child.props[prop];
  };

  getFieldId = () => this.getChildProp('fieldId');

  getMeta = () => this.getChildProp('data-meta');

  getField = () => this.getChildProp('fieldName');

  renderHelp = () => {
    const { prefixCls } = this.props;
    const help = this.getHelpMessage();
    const children = help ? (
        <div className={classNames(`${prefixCls}-explain`)} key="help">
          {help}
        </div>
    ) : null;
    if (children) {
      this.helpShow = !!children;
    }
    return (
      <div>
        {children}
      </div>
    )
  };

  renderExtra = () => {
    const { prefixCls, fieldContent } = this.props;
    return fieldContent ? (
        <div className={classNames(`${prefixCls}-extra`)} key="extra">
          <Popover content={fieldContent}>
            <Icon type="info-circle" />
          </Popover>
        </div>
    ) : null;
  };

  getValidateStatus = () => {
    const onlyControl = this.getOnlyControl();
    if (!onlyControl) {
      return '';
    }
    const field = this.getField();
    if (field.validating) {
      return 'validating';
    }
    if (field.errors) {
      return 'error';
    }
    const fieldValue = 'value' in field ? field.value : this.getMeta().initialValue;
    if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
      return 'success';
    }
    return '';
  };

  renderValidateWrapper = (c1, c2) => {
    const { validateStatus, prefixCls } = this.props;
    const onlyControl = this.getOnlyControl;
    const v = validateStatus === undefined && onlyControl ? this.getValidateStatus() : validateStatus;
    let classes = `${prefixCls}-item-control`;
    if (validateStatus) {
      classes = classNames(`${prefixCls}-item-control`, {
        'has-success': v === 'success',
        'has-warning': v === 'warning',
        'has-error': v === 'error',
        'is-validating': v === 'validating'
      });
    }
    return (
      <div className={classes}>
        <span className={`${prefixCls}-item-children`}>{c1}</span>
        {c2}
      </div>
    );
  };

  renderWrapper = (children) => {
    const { prefixCls } = this.props;
    const className = classNames(`${prefixCls}-item-control-wrapper`);
    return (
      <div className={className} key="wrapper">
        {children}
      </div>
    );
  };

  isRequired = () => {
    const required = this.props.fieldIsnull;

    if (required !== undefined) {
      return !required;
    }
    if (this.getOnlyControl()) {
      const meta = this.getMeta() || {};
      const validate = meta.validate || [];
      return validate.filter((item) => {
        return !!item.rules;
      }).some((item)=>{
        return item.rules.some((rule) => {
          return rule.required;
        });
      });
    }
    return false;
  };

  renderLabel = (c1) => {
    const { prefixCls, labelName, fieldId } = this.props;
    const required = this.isRequired();
    const labelColClassName = classNames(`${prefixCls}-item-label`);
    const labelClassName = required ? `${prefixCls}-item-required` : '';
    return labelName ? (
      <div className={labelColClassName} key='label'>
        <label htmlFor={fieldId || this.getFieldId()} className={labelClassName} title={labelName}>
          {labelName}
          {c1}
        </label>
      </div>
    ) : null;
  };

  renderChildren = () => {
    const { children } = this.props;
    return [this.renderLabel(this.renderExtra()), this.renderWrapper(this.renderValidateWrapper(children, this.renderHelp()))];
  };

  renderFormItem = (children) => {
    const { prefixCls, fieldLineWidth, fieldId } = this.props;
    const itemClassName = classNames(`${prefixCls}-item`,{[`${prefixCls}-item-with-help`]: this.helpShow});
    return (
      <Col id={fieldId} span={fieldLineWidth} className={itemClassName}>
        {children}
      </Col>
    );
  };

  render(){
    const children = this.renderChildren();
    return this.renderFormItem(children);
  }
}
export default FormWidget;

