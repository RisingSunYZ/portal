/**
 * 部门资产搜索框
 */
import React, { PureComponent } from 'react';
import { Select, Input } from 'antd';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../../Assets/index.less';

// @connect(({ teamPerformance, loading }) => ({
//   teamPerformance,
//   loading: loading.models.teamPerformance,
// }))

export default class SearchBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cateName: '全部资产',
      assetsType: '个人资产',
      keyWord: '',
    };
  }

  onValueChange = (type, value) => {
    let newState = {};
    newState[type] = value;
    this.setState(newState, () => {
    //  const search = `${this.state.cateName}-${this.state.assetsType}-${this.state.keyWord}`;
      this.props.onSearchChange(this.state);
    });
  };

  handleGetValue = event => {
    this.setState({
      keyWord: event.target.value,
    });
  };

  clearAndFocusInput=()=>{
    this.setState({keyWord: ''}); // Clear the input
    // We wish to focus the <input /> now!
    // if (this.refs.myTextInput !== null) {
    //   this.refs.myTextInput.focus();
    // }
  };

  clear = () => {
    this.setState({
      cateName: '全部资产',
      assetsType: '个人资产',
      keyWord: '',
    });
  };


  render() {
    const children1 = [];
    children1.push(<Select.Option key={'全部资产'}>{'全部资产'}</Select.Option>);
    children1.push(<Select.Option key={'固定资产'}>{'固定资产'}</Select.Option>);
    children1.push(<Select.Option key={'软件资产'}>{'软件资产'}</Select.Option>);

    const children2 = [];
    children2.push(<Select.Option key={'个人资产'}>{'个人资产'}</Select.Option>);
    children2.push(<Select.Option key={'责任资产'}>{'责任资产'}</Select.Option>);
    const Search = Input.Search;
    return (
      <div style={{ paddingBottom: 8 }}>
        <Select
          className={styles.selectcss}
          onChange={assetsType => {
            this.onValueChange('assetsType', assetsType);
          }}
          value={this.state.assetsType}
        >
          {children2}
        </Select>
        <Select
          className={styles.selectcss}
          onChange={cateName => {
            this.onValueChange('cateName', cateName);
          }}
          value={this.state.cateName}
        >
          {children1}
        </Select>
        <Search
          placeholder="请输入编码/物品名称/使用人"
          value={this.state.keyWord}
          onChange={this.handleGetValue}
          onSearch={keyWord => {
            this.onValueChange('keyWord', keyWord);
          }}
          className={styles.inputcss}
          // ref="myTextInput"
      />
      </div>
    );
  }
}
