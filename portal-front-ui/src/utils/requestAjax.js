import { notification } from 'antd';
import router from 'umi/router';


const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  302: '发出的请求已经重定向。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response, result, response2) {
  response = typeof(response) ==='string'?JSON.parse(response):response;
  if (response2.status >= 200 && response2.status < 300) {
    return response;
  }
  const errortext = codeMessage[response2.status] || response2.statusText;
  notification.error({
    message: `请求错误 ${response2.status}: ${response2.url}`,
    description: errortext,
  });
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function requestAjax(url, options) {

  const defaultOptions = {
    url:url,
    type:options&&options.method,
    credentials: 'include',
    cache:false,
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.data instanceof FormData)) {
      newOptions.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...newOptions.headers,
      };
      if(typeof newOptions.data === "string"){
        newOptions.data = newOptions.data;
      }else{
        newOptions.data = JSON.stringify(newOptions.data);
      }
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        ...newOptions.headers,
      };
    }
  }


  return $.ajax(newOptions)
    .then(checkStatus)
    .fail((e) => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    });
}
