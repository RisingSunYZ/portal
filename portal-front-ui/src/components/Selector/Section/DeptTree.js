import React, { Component } from 'react';
import classNames from 'classnames';
import { Tabs, Button, Row, Col, Tree } from 'antd';
import ProcessTable from '@/components/StandardTable/ProcessTable';
import styles from '../index.less';
import { connect } from 'dva/index';

const TreeNode = Tree.TreeNode;


@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
class DeptTree extends Component {
  state = {
    expandedKeys: [],
  };
  componentDidMount() {
    const { dispatch, value } = this.props;
    console.log(value, '==================================');
    dispatch({
      type: 'user/getAllDept',
    });
  }

  render() {
    const {deptId} = this.props;
    const loop = data =>
      data.map(item => {
        if (item.orgTreeApiVos && item.orgTreeApiVos.length) {
          return (
            <TreeNode key={item.id} title={item.text}>
              {loop(item.orgTreeApiVos)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={item.text} />;
      });
    return (
      <div style={{ overflow: 'auto', height: '510px', border: '1px solid rgb(232, 232, 232)' }}>
        <Tree
          className="draggable-tree"
          defaultExpandedKeys={[this.props.user.currentUser.depId]}
          onSelect={this.props.onSelect}
        >
          {loop(this.props.user.orgTree)}
        </Tree>
      </div>
    );
  }
}

export default DeptTree;
