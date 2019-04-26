/**
 * 组织选择组件
 */
import React, { PureComponent } from 'react';
import { TreeSelect ,Row, Col,Button} from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva';

const TreeNode = TreeSelect.TreeNode;

@connect(({ hrService, loading }) => ({
  hrService,
  loading: loading.models.hrService,
}))

export default class OrgSelect extends PureComponent {
  state={
    selectDeptIds:[],
  };
  constructor(props){
    super(props);
    this.state = {
      value: null,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    let isBlack = this.props.isBlack;
    var _this = this;
    dispatch({
      type:'hrService/getDeptTree',
      payload:{},
      callback:function (data) {
        let deptIdArray=[];

        const recursiveDeptId=(data,deptIdArray)=>{
          data && data.map((val)=>{
            deptIdArray.push(val.id);
            recursiveDeptId(val.children,deptIdArray);
          })
        };
        recursiveDeptId(data,deptIdArray);
        if(isBlack){
          _this.setState({
            selectDeptIds:deptIdArray,
            value:deptIdArray[0]
          });
        }else {
          _this.setState({
            selectDeptIds:deptIdArray,
          });
        }
        _this.props.initPage && _this.props.initPage(deptIdArray);
      }
    })
  }

  renderTree = (data,idx) =>{
    return data && data.map(item => {
      if (!item.children) {
        return (
          <TreeNode title={item.name} value={item.id} key={item.id} />
        )
      } else {
        return (
          <TreeNode title={item.name}  value={item.id} key={item.id}>
            {this.renderTree(item.children)}
          </TreeNode>
        )
      }
    })

  };
  render() {
    const {
      defaultvalue,
      onOrgChange,
      hrService:{deptTreeSelect},
    } = this.props;
    const { value } = this.state;
    const _this=this;
    const onChange = (value, node, extra) => {
      _this.setState({
        value: value
      });
      let deptIdArray=[];
      const recursiveDeptId=(data,deptIdArray)=>{
        data && data.map((val)=>{
          deptIdArray.push(val.key);
          recursiveDeptId(val.props.children,deptIdArray);
        })
      };
      extra.triggerNode && extra.triggerNode.props.children && recursiveDeptId(extra.triggerNode.props.children,deptIdArray);
      let deptMap={};
      deptMap.currentDeptId=value;
      deptMap.childrenDeptId=value?deptIdArray:_this.state.selectDeptIds;
      onOrgChange && onOrgChange(deptMap);
    };
    return (
      <div>
        <TreeSelect
          value = {value}
          style={{ width: 300 }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="请选择"
          allowClear
          showCheckedStrategy = "SHOW_ALL"
          onChange={onChange}
        >
          {this.renderTree(deptTreeSelect)}
        </TreeSelect>
      </div>
    );
  }
}
