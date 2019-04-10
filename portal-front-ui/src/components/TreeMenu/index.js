import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, AutoComplete, Tree } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import { connect } from 'dva/index';

const TreeNode = Tree.TreeNode;

const x = 3;
const y = 2;
const z = 1;
const gData = [];

/*
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
*/

@connect(({ process, loading }) => ({
  process,
  loading: loading.models.process,
}))
export default class TreeMenu extends PureComponent {
  static defaultProps = {
    defaultActiveFirstOption: false,
    onPressEnter: () => {},
    onSearch: () => {},
    className: '',
    placeholder: '',
    dataSource: [],
    defaultOpen: true,
  };
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
    onPressEnter: PropTypes.func,
    defaultActiveFirstOption: PropTypes.bool,
    dataSource: PropTypes.array,
    defaultOpen: PropTypes.bool,
  };
  state = {
    gData,
    expandedKeys: [],
    expandAll:true,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    //获取草稿数量
    dispatch({
      type: 'process/getDraftCount',
    });
    dispatch({
      type: 'process/queryTreeData',
    });
    this.setState({expandAll:true});
  }
  render() {
    const { process: { treeData,draftCount }, className, placeholder,defaultSelectedKeys, ...restProps } = this.props;
    // delete restProps.defaultOpen; // for rc-select not affected
    const loop = data =>
      data.map(item => {
        if (item.children && item.children.length) {
          return (
            <TreeNode key={item.id} title={item.name}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        if(item.id=='myDraft'){
          let itemName=item.name;
          if(draftCount){
            itemName=item.name+"("+draftCount+")";
          }
          return (<TreeNode key={item.id} title={itemName} />);
        }
        return <TreeNode key={item.id} title={item.name} />;
      });
    return (
      <div id="components-tree-demo-draggable" className={styles.treeMenuBox}>
        {
          treeData.length > 0
            ?(
              <Tree
                className={styles.treeMenu}
                defaultSelectedKeys={defaultSelectedKeys}
                defaultExpandedKeys={defaultSelectedKeys}
                autoExpandParent={true}
                checkedKeys={defaultSelectedKeys}
                onSelect={this.props.onSelect}
              >
                {loop(treeData)}
              </Tree>
            )
            : null
        }
      </div>
    );
  }
}
