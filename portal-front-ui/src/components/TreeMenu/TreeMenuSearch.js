import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, AutoComplete, Tree } from 'antd';
import styles from './index.less';
import { connect } from 'dva/index';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const gData = [];

@connect(({ process, loading }) => ({
  process,
  loading: loading.models.process,
}))
export default class TreeMenuSearch extends PureComponent {
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
    expandAll:false,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'process/queryTreeDataSearch',
    });
  }
  searchTree(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'process/queryTreeDataSearch',
      payload:{keyword:value},
    });
    this.setState({expandAll:true});
  }
  render() {
    const { process: { treeData,draftCount }, className, placeholder, ...restProps } = this.props;
    // delete restProps.defaultOpen; // for rc-select not affected
    const loop = data =>
      data.map(item => {
        if (item.children && item.children.length) {
          return (
            <TreeNode key={item.code} selectable={false} title={item.name}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.code} title={item.name} />;
      });
    return (
      <div id="components-tree-demo-draggable" className={styles.treeMenuBox}>
        <Search
          placeholder="请输入搜索内容"
          onSearch={this.searchTree.bind(this)}
        />
        {
          treeData.length > 0
            ?(
              <Tree
                className={styles.treeMenu}
                onSelect={this.props.onSelect}
                defaultExpandAll={this.state.expandAll}
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
