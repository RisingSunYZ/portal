import React from 'react';
import FormWidget from './FormWidget';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { createForm, formShape, createFormField } from 'rc-form';
import createDOMForm from 'rc-form/lib/createDOMForm';

class CustomForm extends React.Component{
  constructor(props){
    super(props);
  }

  static defaultProps = {
    prefixCls: 'ant-form',
    layout: 'grid-3',
    onSubmit: function onSubmit(e) {
      e.preventDefault();
    }
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    layout: PropTypes.oneOf(['normal', 'grid-2', 'grid-3']),
    children: PropTypes.any,
    onSubmit: PropTypes.func,
    form: formShape
  };

  static Field = FormWidget;

  static createFormField = createFormField;

  static create = function() {
    const options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return createDOMForm({...{fieldNameProp: 'fieldid'}, ...options});
  };

  render(){
    const {
      prefixCls,
      children,
      style
    } = this.props;

    const formClassName = classnames(prefixCls, `${prefixCls}-horizontal`);
    return (
      <form className={formClassName} style={style}>
        {children}
      </form>
    );
  }
}

export default CustomForm;
