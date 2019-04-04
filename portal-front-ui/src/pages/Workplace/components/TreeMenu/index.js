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
    const { addressBook: { treeData  } } = this.props;

    const loop = data =>
      data.map(item => {
        if (item.orgTreeApiVos && item.orgTreeApiVos.length) {
          return (
            <TreeNode key={item.id} title={item.text} companyId={item.companyId}>
              {loop(item.orgTreeApiVos)}
            </TreeNode>
          );
        }

        if(item.id=='TOP-CONTACTS'){
          let itemName=item.text;
          return (<TreeNode key={item.id} title={itemName} />);
        }
        return <TreeNode key={item.id} title={item.text} companyId={item.companyId}/>;
      });
    return (
      <div id="components-tree-demo-draggable" className={styles.treeMenuBox}>
        {
          treeData.length > 0
            ?(
              <Tree
                className={styles.treeMenu}
                onSelect={this.props.onSelect}
                defaultExpandedKeys={this.props.defaultExpandedKeys}
                defaultSelectedKeys={this.props.defaultSelectedKeys}
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
