import React, { Fragment, PureComponent } from 'react';
import { Icon } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import {getConfig} from "../../../utils/utils";

@connect(({ inforTech, loading }) => ({
  inforTech,
  loading: loading.models.inforTech,
}))
export default class ContactUs extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inforTech/getContactList'
    });
  }

  render() {
    const {
      inforTech: { contact },
    } = this.props;
    return (
      <ul className={styles.contactList}>
        {contact.map((item,index)=>(
          <li key={index}>
            <p className={styles.name}><Icon type="phone" style={{ color: '#1890FF',marginRight: 5, fontSize: 16 }} />{item.deptName}：</p>
            <p>{item.tel}</p>
          </li>
        ))}
      </ul>
    );
  }
}
