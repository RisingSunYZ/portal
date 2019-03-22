import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import NewsBanner from '@/components/NewsBanner';
import NewsList from '@/components/NewsList';
import Login from '@/components/Login';
import LoginBox from '@/components/LoginBox';
import styles from './Login.less';
import { getConfig } from '../../utils/utils';


const { UserName, Password, Submit } = Login;

@connect(({login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {

  state = {
    autoLogin: true,
    visible:false,
  };

  // 渲染前数据获取
  componentWillMount() {
    const { dispatch} = this.props;

    // dispatch({
    //   type: 'user/fetchCurrent',
    //   callback: res => {
    //     // FIXME 此处可能会出现死循环
    //     // if (res.code == '100' ) {
    //     //   router.push("/portal/main/workplace")
    //     // }else{
    //     //      router.push("/user/login")
    //     // }
    //   },
    // });
  }

  componentDidMount(){
    // 背景字体随窗口自适应
    window.onresize=()=>{this.setRem()}
    this.unbeforeunload()
  }

  componentWillUnmount(){
    window.onresize=null;
  }

  handleSubmit = (err, values) => {
    if (!err) {
      // this.setCookie('username',values.username,"password",values.password);
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  unbeforeunload=(e)=>{
    const height = document.body.offsetHeight;
    const htmlFont = document.getElementById('login-top-box');
    height <= 700 ? (htmlFont.style.display = "none") :(htmlFont.style.display = "")
  }

  // 字体大小随窗口变化自适应
  setRem=(e)=>{
    const htmlFont=document.getElementById('login-top-box');
    const height = document.body.offsetHeight;
    const textTopFont = document.getElementById('title-top');
    // console.log(height);
    height <= 700 ? ((htmlFont.style.display = "none") && (htmlFont.style.transition = "all .3s ease")) :(htmlFont.style.display = "")
    height <= 720 ? ((textTopFont.style.fontSize = "3vh") && (textTopFont.style.transition ="all .3s ease")) :(textTopFont.style.fontSize = "")
    height <= 650 ? (textTopFont.style.display="none") : (textTopFont.style.display="")
  }

  render() {
    const newsBannerStyle = {
      imgHeight: 180,
      iconTop: 85,
      iconLeftCurrent: 2,
      iconRightCurrent: 436,
    };
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    const moreNews = `${getConfig().domain}/portal/news/basic-list/company_news`;
    const moreTag = <a href={moreNews} target="_blank">更多 &gt;</a>;

    return (
      <div className={styles.container}>
        {/* 背景文字标题部分 */}
        <div className={styles.loginTopBox} id="login-top-box">
          <div className={styles.loginBgTitle}>
            <span id="title-top">让客户的等待变成期待</span>
          </div>
          <ul className={styles.lList}>
            <li className={styles.liTitle}>
              <div className={styles.listZh}>诚信务实</div>
              <div className={styles.listEn}>INTEGRITY AND PRAGMATISM</div>
            </li>
            <li className={styles.listLine}>/</li>
            <li className={styles.liTitle}>
              <div className={styles.listZh}>艰苦奋斗</div>
              <div className={styles.listEn}>HARD WORKING AND PLAINLIVING</div>
            </li>
            <li className={styles.listLine}>/</li>
            <li className={styles.liTitle}>
              <div className={styles.listZh}>创新变革</div>
              <div className={styles.listEn}>INNOVATION AND REFORMATION</div>
            </li>
            <li className={styles.listLine}>/</li>
            <li className={styles.liTitle}>
              <div className={styles.listZh}>感恩怀德</div>
              <div className={styles.listEn}>GRATITUDE AND GRATEFULLNESS</div>
            </li>
          </ul>
        </div>
        {/* 右侧登录 */}
        <div className={styles.loginBox}>
          <LoginBox dat={login} submitting={submitting} handleSubmit={this.handleSubmit} />
          {/* 左侧轮播和新闻列表 */}
          <div>
            <NewsBanner newsBannerStyle={newsBannerStyle} />
            <div className={styles.newsNoticeBox}>
              <NewsList width="100%" title="公司动态" typeSn="company_news" pageSize={4} extra={moreTag} />
            </div>
          </div>
          {/* 底部图片logo */}
          <div className={styles.btImg} />
        </div>
      </div>
    );
  }
}

export default LoginPage;
