import React, { Component, Fragment,PureComponent } from 'react';
import { Popover,Menu, Icon, Row, Col, Badge, Avatar } from 'antd';
import email from '../../assets/workplace/email.png';
import mail from '../../assets/workplace/mail.png';
import process from '../../assets/workplace/process.png';
import schedule from '../../assets/workplace/schedule.png';
import work from '../../assets/workplace/work-undo.png';
import {getConfig} from "@/utils/utils";

import router from 'umi/router';
import Link from 'umi/link';
import styles from './index.less';
import { connect } from 'dva';
import global from "../../models/global";

@connect(({user, global,loading }) => ({
  user,
  global,
  loading: loading.models.global,
}))

export default class WorkMenus extends PureComponent {

  state = {
    current:"workplace",
    size:"large",
  };

  componentDidMount(){

  }

  render() {
    const { size } = this.state;
    const { global } = this.props;
    return (
      <Fragment>
        <Row className={styles.menuWraper}>
          <Col span={2} />
          <Col span={4}>
            <a href={ getConfig().domain + "/portal/schedule/list.jhtml"} target={"_blank"}>
              <Badge count={global.scheduleCount}>
                <Avatar shape="square" size={size} src={schedule} />
              </Badge>
              <br />
              <span className="schedule">日程</span>
            </a>

          </Col>
          <Col span={4}>
            <Link to="/process/list/todo" target={"_blank"}>
              <Badge count={global.todoCount}>
                <Avatar shape="square" size={size} src={work} />
              </Badge>
              <br />
              <span>待办事项</span>
            </Link>

          </Col>
          <Col span={4}>

            <a href={getConfig().domain+ "/workplace/address-book"} target={"_blank"}>
              <Badge>
                <Avatar shape="square" size={size} src={mail} />
              </Badge>
              <br />
              <span className="mail">通讯录</span>
            </a>
          </Col>
          <Col span={4}>
            <a href={"https://mail.chinayasha.com/owa/#path=/mail"} target={"_blank"}>
              <Badge>
                <Avatar shape="square" size={size} src={email} />
              </Badge>
              <br />
              <span>我的邮箱</span>
            </a>
          </Col>
          <Col span={4}>
            <Link to="/process/list/process-model" target={"_blank"}>
              <Badge>
                <Avatar shape="square" size={size} src={process} />
              </Badge>
              <br />
              <span>流程中心</span>
            </Link>
          </Col>
          <Col span={2} />
        </Row>
      </Fragment>
    );
  }
}
