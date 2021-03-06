import React, { Fragment } from 'react';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import Result from '@/components/Result';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './Result.less';
import router from 'umi/router';
// import conf from '../../../config';
import {getConfig} from "../../../utils/utils";

export default class Success extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 2,
      msg:"秒后自动跳转",
    };
  }

  componentDidMount() {
     const _this = this;

     window.opener?window.opener.location.reload():null;

     this.tId = setInterval(function(){
       _this.setState({
        seconds: _this.state.seconds-1,
      });
    }, 1000);
  }
  componentWillUpdate() {

    if(this.state.seconds<=1){
      const { match } = this.props;
      const isSubmit = match.params.isSubmit;
      clearInterval(this.tId);

      const href = window.opener?(isSubmit==1?'/eip/process/list/already-send':window.opener.location.href):"/eip/process/list/already-send";
      if(href.search('/eip') !== -1 ){
        router.push( href.split("eip")[1] );
      }else{
        window.opener?window.close():location.href = href;
      }

    }
  }

  render(){

    return(
      <PageHeaderLayout className={styles.hidBread}>
        <Card bordered={false}>
          <Result
            type="success"
            title="处理成功"
            description={this.state.seconds+this.state.msg}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
