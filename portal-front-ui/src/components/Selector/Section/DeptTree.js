import React, { Component } from 'react';
import classNames from 'classnames';
import { Tabs, Button, Row, Col, Tree } from 'antd';
import ProcessTable from '@/components/StandardTable/ProcessTable';
import styles from '../index.less';
import { connect } from 'dva/index';

const TreeNode = Tree.TreeNode;

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
class DeptTree extends Component {
  state = {
    gData,
    expandedKeys: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getAllDept',
    });
  }
  onDragEnter = info => {
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  onDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // const dragNodesKeys = info.dragNodesKeys;
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.state.gData];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (info.dropToGap) {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    } else {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    }
    this.setState({
      gData: data,
    });
  };

  render() {
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
          draggable
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          onSelect={this.props.onSelect}
        >
          {loop(this.props.user.orgTree)}
        </Tree>
      </div>
    );
  }
}

export default DeptTree;
