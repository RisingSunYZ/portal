import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Popover } from 'antd';
import Login from '@/components/Login';
import styles from './index.less';
import {getConfig} from "../../utils/utils";


const { UserName, Password, Submit } = Login;


class LoginBox extends Component {

  state = {
    autoLogin: true,
    visible:false,
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  detectCapsLock = e => {
    e = event||window.event;
    const keyCode  =  e.keyCode||e.which; // 按键的keyCode
    const isShift  =  e.shiftKey ||(keyCode  ==   16 ) || false ; // shift键是否按住
    if (
      ((keyCode >=   65   &&  keyCode  <=   90 )  &&   !isShift) // Caps Lock 打开，且没有按住shift键
      || ((keyCode >=   97   &&  keyCode  <=   122 )  &&  isShift)// Caps Lock 打开，且按住shift键
    ){
      this.setState({
        visible: true,
      });
    }
    else{
      this.setState({
        visible: false,
      });
    }
  };

  onPwChange = e => {
    const pw = document.getElementById("password");
    if(pw){
      pw.onkeypress = this.detectCapsLock;
    }
  };


  render() {
    const { login, submitting,handleSubmit } = this.props;
    const { type, autoLogin } = this.state;
    const url = getConfig().idmBaseUrl+"?type=2&service="+getConfig().idmLoginCallbackUrl;

    return (

       <div className={styles.loginRt}>
         {getConfig().idmLoginSwitch == true ?(
             <div>
               <iframe
                 ref={"loginIframe"}
                 style={{width:"100%",height:"410px",border:"none",background:"rgba(219,230,243,0.8)"}}
                 src={url}>
               </iframe>
             </div>
           )
            :
           (
             <div>
               <h2 className={styles.title}>亚厦集成门户</h2>
               <Login
                 defaultActiveKey={type}
                 onSubmit={handleSubmit}
                 ref={form => {
                   this.loginForm = form;
                 }}
               >
                 <UserName className={styles.userInput} name="userName" placeholder="请输入用户名/工号/手机号" />
                 <Popover
                   content={
                     <div>
                       大小写锁定已打开
                     </div>
                   }
                   placement="rightTop"
                   visible={this.state.visible}>
                   <Password
                     name="password"
                     placeholder="请输入密码"
                     className={styles.userInput}
                     onPressEnter={() => this.loginForm.validateFields(handleSubmit)}
                     onChange={this.onPwChange}
                   />
                 </Popover>

                 <div style={{color:"white",marginLeft:"2px"}}>
                   <Link className={styles.register} to="/user/forget-pw" style={{ marginLeft: 8,color:"#007AFF", float: 'right',marginRight:"2px"  }}>
                     <FormattedMessage id="app.login.forgot-password" />
                   </Link>
                   <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                     <FormattedMessage id="app.login.remenber-user-name" />
                   </Checkbox>
                 </div>
                 <Submit loading={submitting}>
                   <FormattedMessage id="app.login.login" />
                 </Submit>
                 <div id="msg" className={styles.falseVerify}>{login&&login.loginMsg}</div>
               </Login>
             </div>
           )}
       </div>


    );


  }
}

export default LoginBox;
