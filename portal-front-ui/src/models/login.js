import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin,changePwd ,captchaCode, checkCaptchaCode,imgCaptchaCode,fakeAccount,checkPicCode,
  logoutAccount,updateAccountInfo,logOutSyn,logOutIdmSyn } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, getConfig } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import {message} from "antd/lib/index";

export default {
  namespace: 'login',

  state: {
    status: undefined,
    code:0,
    loginMsg:"",
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);

      // Login successfully
      if (response.code === '100') {
        reloadAuthorized();
        // 改变登录状态
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        yield put(routerRedux.push('/'));
      } else {
        message.error(response.msg)
      }
    },


  /**
   * 退出登录
   * @param payload
   * @param callback
   * @param call
   * @returns {IterableIterator<*>}
   */
    *logOut({ payload ,callback }, { call }) {
      if(getConfig().idmLoginSwitch){
        var img=document.createElement("iframe");
        img.src=getConfig().idmLogoutUrl + "?t=" + Math.random();
        img.style.width=0;
        img.style.height=0;
        img.style.border=0;
        document.body.appendChild(img);
      }
      const response = yield call(logOutSyn);
      if(response.code=='100'){
        if (callback && typeof callback === 'function') {
          callback(response);
        }
      }
    },

    /**
     * 登录后-->修改密码
     * @param payload
     * @param callback
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *findPW({ payload,callback }, { call, put }) {
      const response = yield call(changePwd, payload);
      if (response && callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    //修改手机号
    *editMobile({ payload,callback }, { call, put }) {
      const response = yield call(updateAccountInfo, payload);
      if (response && callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    // 获取短信验证码
    *getCaptcha({ payload, callback }, { call }) {
      const response = yield call(captchaCode, payload);
      if (response && callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    // 找回密码
    *checkCaptchaCode({ payload, callback }, { call, put }) {
      const response = yield call(checkCaptchaCode, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *getImgCaptcha({ payload,callback }, { call }) {
      const response = yield call(imgCaptchaCode, payload);
      if (response && callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *checkAccount({ payload,callback }, { call, put }) {
      const response = yield call(fakeAccount, payload);
      if (response && callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *checkImgCaptcha({ payload,callback }, { call, put }) {
      const response = yield call(checkPicCode, payload);
      if (response && callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },

    *logout({ payload }, { call ,put }) {

      const response = yield call(logoutAccount,payload);

      if(response.code == "0"){
        message.error(response.msg);
        return
      }
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },

  },

  reducers: {

    changeLoginStatus(state, { payload }) {
      setAuthority("user");
      return {
        ...state,
        status: payload.status,
        code: payload.code,
        type: payload.type,
        loginMsg:payload.msg
      };
    }

  },
};
