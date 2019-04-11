import React, { Fragment, PureComponent } from 'react';
import { Card, Row, Col, Tree, Input, Table } from 'antd';
import Link from 'umi/link';
import styles from './index.less';
import { connect } from 'dva';

const columns = [{title: '标题', dataIndex: 'title', key: 'title',render: (text, record) => (
    <Link target="_blank" to={`/infor-tech/knowledge/detail/${record.id}`}><a>{text}</a></Link>
  )},
  {title: '关键字', dataIndex: 'keyword', key: 'keyword'},
  {title: '知识分类', dataIndex: 'categoryName', key: 'categoryName'},
  {title: '创建人', dataIndex: 'createUser', key: 'createUser'},
  ];

@connect(({ inforTech, loading }) => ({
  inforTech,
  loading: loading.models.inforTech,
}))
export default class knowledgeList extends PureComponent {
  state = {
    linkCode: '',
    keyword: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { keyword } = this.state;
    dispatch({
      type: 'inforTech/getKnowledgeCategory',
    });
    dispatch({
      type: 'inforTech/getKnowledgeList',
      payload: {
        keyword,
        pageSize: 10,
        pageNum: 1,
      }
    });
  }

  searchKnowledge = value =>{
    const { dispatch } = this.props;
    const { linkCode } = this.state;
    this.setState({
      keyword: value,
    });
    dispatch({
      type: 'inforTech/getKnowledgeList',
      payload: {
        keyword: value,
        linkCode,
        pageSize: 10,
        pageNum: 1,
      }
    });
  };

  getKnowledgeListByType = (selectedKeys, e) => {
    const { dispatch } = this.props;
    const { keyword } = this.state;
    this.setState({
      linkCode: e.node.props.linkCode
    });
    dispatch({
      type: 'inforTech/getKnowledgeList',
      payload: {
        linkCode: e.node.props.linkCode,
        keyword,
        pageSize: 10,
        pageNum: 1,
      }
    });
  };

  updateKldTable = (pagination) =>{
    const { dispatch } = this.props;
    const { linkCode, keyword } = this.state;

    dispatch({
      type: 'inforTech/getKnowledgeList',
      payload: {
        linkCode,
        keyword,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  render() {
    const loop = data =>
      data.map(item => {
        if (item.children && item.children.length) {
          return (
            <TreeNode key={item.id} linkCode={item.linkCode} title={item.name}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} linkCode={item.linkCode} title={item.name} />;
      });
    const {
      inforTech: { knowledgeCategory, knowledgeList},
    } = this.props;
    return (
      <Fragment>
        <Card bordered={false}>
          <div style={{padding: 10, textAlign: 'right'}}>
            <Input.Search style={{width: 200}} placeholder="请输入关键字" onSearch={this.searchKnowledge} />
          </div>
          <Row style={{border: '1px solid #e5e5e5'}}>
            <Col span={5}>
              <p className={styles.knowledgeTitle}>知识分类</p>
              <Tree onSelect={this.getKnowledgeListByType}>
                {loop(knowledgeCategory || [])}
              </Tree>
            </Col>
            <Col style={{borderLeft: '1px solid #e5e5e5'}} span={19}>
              <Table
                columns={columns}
                dataSource={knowledgeList.rows || []}
                pagination={{
                  pageSize: 10,
                  total: knowledgeList ? knowledgeList.total : 0,
                  onChange: this.updateKldTable
                }}
              />
            </Col>
          </Row>
        </Card>
      </Fragment>
    );
  }
}
