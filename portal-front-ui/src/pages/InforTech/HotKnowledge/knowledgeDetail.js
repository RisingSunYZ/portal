import React, { PureComponent } from 'react';
import { Card } from 'antd';
import './detail.less';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FileList from '@/components/FileList';

@connect(({ inforTech, loading }) => ({
  inforTech,
  loading: loading.models.inforTech,
}))
export default class knowledgeDetail extends PureComponent {
  state = {
  };

  componentWillMount () {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    document.addEventListener('selectstart', function (e) {
      e.preventDefault();
    });
    document.addEventListener('copy', function (e) {
      e.preventDefault();
    });
  }

  componentDidMount() {
    const { match: { params }, dispatch } = this.props;
    dispatch({
      type: 'inforTech/getKnowledgeDetail',
      payload: params.id
    });
  }

  render() {
    const {
      inforTech: { knowledgeDetail },
    } = this.props;
    return (
      <PageHeaderWrapper>
        <div className="notice-detail-container">
          <Card bordered={false} bodyStyle={{padding: '32px 0 0'}}>
            <div className="title-box">
              <p>
                {knowledgeDetail.title}
                {knowledgeDetail.files && knowledgeDetail.files.length>0 ? <Icon style={{color: '#0e65af'}} type="paper-clip" /> : ''}
              </p>
              <ul className="u-activity">
                <li>创建时间：<span>{knowledgeDetail.createTime}</span></li>
                <li>创建人：<span>{knowledgeDetail.createUserName}</span></li>
                <li>阅读量：<span>{knowledgeDetail.browseRecord}</span></li>
              </ul>
            </div>
            <div className="text-content">
              <div className="content-view">{knowledgeDetail.content}</div>
            </div>
          </Card>
          {knowledgeDetail.files && knowledgeDetail.files.length>0 ? (
            <div className="fujian-box">
              <div className="fujian">
                <span>附件：</span>
                <div className="fujian-list">
                  <FileList showDel={false} files={knowledgeDetail.files} />
                </div>
              </div>
            </div>
          ) : ''}
        </div>
      </PageHeaderWrapper>
    );
  }
}
