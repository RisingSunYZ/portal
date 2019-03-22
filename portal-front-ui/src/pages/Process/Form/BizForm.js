import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';


@connect(({ process, loading }) => ({
  process,
  loading: loading.models.process,
}))
@Form.create()
class BizForm extends PureComponent {
  componentDidMount() {
    const { dispatch, process, form } = this.props;
  }

  render() {
    return (
      <Fragment>
        <Card bordered={false} >
          <div>{this.renderForm()}</div>
        </Card>
      </Fragment>
    );
  }
}


export default BizForm;
