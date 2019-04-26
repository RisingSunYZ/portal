import React, { Component, Fragment } from 'react';
import { routerRedux, Route, Switch } from 'umi/router';
import { connect } from 'dva';
import { getRoutes } from '../../utils/utils';

@connect(({ processForm, loading }) => ({
  processForm,
  loading: loading.models.processForm,
}))
export default class FormMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: { visibility: 'visible' },
      operationkey: 'formInfo',
      //formTitle:props.formTitle
    };
  }
  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };
  changeFormTitle(title) {
    this.setState({ formTitle: title });
  }
  componentDidMount() {
    /*this.props.dispatch({
      type: 'processForm/getFormInfo',
      payload: this.props.match.params,
    });*/
    window.getScrollTopHeight = function() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return scrollTop;
    };
  }

  render() {
    const { match, routerData } = this.props;
    return <div style={{ width: '100%' }}>{this.props.children}</div>;
  }
}
