import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Avatar, Tag, Divider } from 'antd';
// import styles from './index.less';
import { connect } from 'dva/index';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;

@connect(({ baseInfo, loading }) => ({
  baseInfo,
  loading: loading.models.baseInfo,
}))
export default class EduInfo extends PureComponent {
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
  }

  render() {
    const {
      baseInfo: {
        profile: { edu, langs },
      },
      loading,
    } = this.props;
    return (
      <div>
        <Card bordered={false} loading={loading} bodyStyle={{padding: '16px 0'}}>
          <DescriptionList key="edu" col="2" size="large" style={{ marginBottom: '32px' }}>
            <Description term="学历">{edu.education}</Description>
            <Description term="毕业时间">{edu.enddate}</Description>
            <Description term="学期">{edu.edusystem}</Description>
            <Description term="学位">{edu.degree}</Description>
            <Description term="学习方式">{edu.studymode}</Description>
            <Description term="专业">{edu.major}</Description>
            <Description term="就读院校">{edu.school}</Description>
          </DescriptionList>
          <DescriptionList key="language" col="2" size="large">
            <Description term="语言类别">{langs.length > 0 ? langs[0].langsort : ''}</Description>
            <Description term="级别">{langs.length > 0 ? langs[0].langlev : ''}</Description>
          </DescriptionList>
        </Card>
      </div>
    );
  }
}
