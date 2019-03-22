import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
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

@connect(({ addressBook, loading }) => ({
  addressBook,
  loading: loading.models.addressBook,
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

    /**
     * 获取组织机构属性结构
     */
    dispatch({
      type: 'addressBook/queryTreeData',
    });
    this.setState({expandAll:true});
  }
  render() {
    const { addressBook: { treeData  }, className, placeholder, ...restProps } = this.props;
    // delete restProps.defaultOpen; // for rc-select not affected
    const loop = data =>
      data.map(item => {
        if (item.orgTreeApiVos && item.orgTreeApiVos.length) {
          return (
            <TreeNode key={item.id} title={item.text}>
              {loop(item.orgTreeApiVos)}
            </TreeNode>
          );
        }

        if(item.id=='TOP-CONTACTS'){
          let itemName=item.text;
          return (<TreeNode key={item.id} title={itemName} />);
        }
        return <TreeNode key={item.id} title={item.text} />;
      });
    return (
      <div id="components-tree-demo-draggable" className={styles.treeMenuBox}>
        {
          treeData.length > 0
            ?(
              <Tree
                className={styles.treeMenu}
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
