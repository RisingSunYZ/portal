import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  InputNumber,
  DatePicker,
  message,
  Badge,
} from 'antd';
import Calendar from '@/components/Calendar';
import WorkMenus from '@/components/WorkMenus';
// import Searcher from '../components/Searcher';
import NewsBanner from '@/components/NewsBanner';

import { nullToZero, getFormType } from '../../utils/utils';

const Search = Input.Search;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading }) => ({
  loading: loading.models.process,
}))
export default class TableList extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    const newsBannerStyle = {
      imgHeight: 160,
      iconTop: 90,
      iconLeftCurrent: 2,
      iconRightCurrent: 375,
    };

    return (
      <Fragment>
        <Card bordered={false}>
          <Row>
            <Col span={4}>
              <Calendar />
            </Col>
            <Col span={16}>
              <WorkMenus />
            </Col>
            <Col span={4}>
              {/*<Searcher />*/}
            </Col>
          </Row>
        </Card>
        <Card bordered={false}>
          <Row>
            <Col span={14}>
              <Card bordered={true}>通知公告</Card>
              <Card bordered={true}>常用系统</Card>
            </Col>
            <Col span={10}>
              <Card bordered={true}>
                <NewsBanner newsBannerStyle={newsBannerStyle} />
              </Card>
              <Card bordered={true}>公司动态</Card>
            </Col>
          </Row>
        </Card>
      </Fragment>
    );
  }
}
