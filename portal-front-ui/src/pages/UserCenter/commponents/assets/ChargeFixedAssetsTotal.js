import React, { PureComponent } from 'react';
import { Input,List,Table,Select,Map } from 'antd';
import styles from './index.less';
import { connect } from 'dva/index';

@connect(({ assets, loading }) => ({
  assets,
  loading: loading.models.assets,
}))
export default class ChargeFixedAssetsTotal extends PureComponent {
  state = {
    userNo:'',
    type:"charge",
    cateName:"固定资产",
    nextCateName:"",
    keyWord : "",//输入框输入值
  };
  componentDidMount() {
    this.setState({
      userNo:this.props.userNo
    });
  }

  handleChange = (value)=> {
    this.setState({
      nextCateName:value
    }, function() {
      this.handlePost();
    });

  };

  handleGetValue = (event) => {
    this.setState({
      keyWord : event.target.value,
    })
  };
  handlePost = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'assets/getChargeFixedAssetsList',
      payload: this.state,
    });
  };

  render() {
    const {
      assets: { cData },
    } = this.props;
    const children = [];
    children.push(<Select.Option key={null}>{'全部'}</Select.Option>);
    if(cData.fixedCateTitle){
      for (let i = 1; i < cData.fixedCateTitle.length; i++) {
        children.push(<Select.Option key={cData.fixedCateTitle[i].title}>{cData.fixedCateTitle[i].title}</Select.Option>);
      }
    }
    const Search = Input.Search;
    return (
      <div>
        <div>
          <Table columns={cData.fixedCateTitle} dataSource={cData.cfCateNumber} pagination={false} />
        </div>
        <div className={styles.marginTop}>
          <Select
            className={styles.selectcss}
            onChange={this.handleChange}
            placeholder="全部"
          >
            {children}
          </Select>
          <Search
            placeholder="请输入编码/物品名称"
            value={this.state.keyWord}
            onChange={this.handleGetValue}
            onSearch={this.handlePost}
            className={styles.inputcss}
          />
        </div>
      </div>
    );
  }
}
