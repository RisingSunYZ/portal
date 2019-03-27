import moment from 'moment';
import { message } from 'antd';
// import conf from '../../config/config';

export function getConfig() {
  const config = {
    domain:'http://hometest.chinayasha.com',
    appName: 'eip',
    appVision: '0.1',
    appAuthor: 'xietongjian',
    email: 'xietongjian@chinayasha.com',
    ftpHost : 'http://10.10.20.204',
    filePreviewPath : '/file-preview/index',
    homeText:"http://hometest.chinayasha.com",
    seeyonPath : 'http://neweiptest.chinayasha.com',
    trainSysPath: 'https://traintest.chinayasha.com',
    recruitSysPath: 'http://10.10.20.39:19081/overview',
    qiyuTemplateId : '1382778',
    mqTargetGroupId : '264109462',
    mqStaffId : '1816145',
    zsTargetGroupId : '264104623',
    zsStaffId : '1815233',
    idmLoginSwitch : false,// 是否启用IDM登录
    idmBaseUrl:'https://idmtest.chinayasha.com:8443/siam/login',// IDM登录服务
    idmLoginCallbackUrl:'http://homedev.chinayasha.com/rest/user/userLogin',// IDM登录回调URL
    idmLogoutUrl:'https://idmtest.chinayasha.com:8443/siam/logout',// IDM 退出请求地址
  };

  if(window.location.hostname.indexOf('hometest.chinayasha.com')!==-1){
    config.domain = 'http://hometest.chinayasha.com';
    config.ftpHost = 'http://10.10.20.204';
    config.seeyonPath = 'http://neweiptest.chinayasha.com';
  }else if(window.location.hostname.indexOf('home.chinayasha.com')!==-1){
    config.domain = 'http://home.chinayasha.com';
    config.ftpHost = 'http://file.chinayasha.com';
    config.seeyonPath = 'http://neweip.chinayasha.com';
    config.trainSysPath='https://train.chinayasha.com';
    config.recruitSysPath='http://10.10.15.14:19081/overview';
  }
  return config;
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

// 将null / undefined 转换为0
export function nullToZero(param) {
  return param||'0';
}
/**
 * 时间格式化 YYYY-MM-DD
 * @param date
 * @returns {string}
 */
export function simpleFormatDate(date) {
  let time = '';
  if (date !== undefined && date != null) {
    const value = new Date(date);
    const y = value.getFullYear();
    const m = value.getMonth() + 1;
    const d = value.getDate();
    time = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
  }
  return time;
}

export function simpleFormatTime(time){
  let times='';
  if(time !== undefined && time != null){
    const value = new Date(time);
    const h = value.getHours();
    const m = value.getMinutes();
    times=  (h< 10 ? '0'+ h : h)+ ':'+ (m<10 ? '0'+ m: m)
  }
  return times;
}

export function genSearchDateBox() {
  // 默认时间范围
  const now = new Date();
  const endY = now.getFullYear();
  let endM = now.getMonth() + 1;
  let d = now.getDate();
  const start = endM - 12;
  let startY = endY;
  let startM = start;
  if (endM - 12 <= 0) {
    startM = endM + 12 - 12;
    startY = endY - 1;
  }
  if (startM < 10) {
    startM = '0' + startM;
  }
  if (endM < 10) {
    endM = '0' + endM;
  }
  if (d < 10) {
    d = '0' + d;
  }
  return [moment(startY + '-' + startM + '-' + d), moment(endY + '-' + endM + '-' + d)];

}

export function genProcessViewUrl(modelKey, proInstId, bizKey, taskId){
  return `/process/form/view/${nullToZero(modelKey)}/${nullToZero(proInstId)}/${nullToZero(bizKey)}/${nullToZero(taskId)}/0`;
}

export function genProcessApproveUrl(modelKey, proInstId, bizKey, taskId){
  return `/process/form/approve/${nullToZero(modelKey)}/${nullToZero(proInstId)}/${nullToZero(bizKey)}/${nullToZero(taskId)}/0`;
}
export function genProcessLaunchUrl(modelKey, proInstId, bizKey, taskId, formType){
  return `/process/form/launch/${nullToZero(modelKey)}/${nullToZero(proInstId)}/${nullToZero(bizKey)}/${nullToZero(taskId)}/${formType}`;
}


export function zeroToNull(param) {
  return (param === '0' || param === 0)?'':param;
}

// 利用正则去掉前后空格
function spaceTrim(val) {
  return val.replace(/(^\s*)|(\s*$)/g, '');
}
// 判断是否为空
export function isEmpty(obj) {
  if (typeof obj === 'undefined' || obj == null || obj === '') {
    return true;
  } else {
    if (spaceTrim(obj) === '') {
      return true;
    }
    return false;
  }
}

/**
 * js深度拷贝对象
 * @param data
 * @returns {any}
 */
export function deepCopy(data) {
  return JSON.parse(JSON.stringify(data));
}
// 提取业务表单链接中的表单类型
export function getFormType(url) {
  let formType = '0';
  if (url) {
    const reg = new RegExp('(^|)formType=([^&]*)(|$)');
    const array = url.match(reg);
    if (array) {
      formType = array[2];
    }
  }
  return formType;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

/*
文件大小转换B KB  MB G
 */
export function convertFileSize(limit) {
  let size = '';
  if (limit < 0.1 * 1024) {
    // 如果小于0.1KB转化成B
    size = limit.toFixed(2) + 'B';
  } else if (limit < 0.1 * 1024 * 1024) {
    // 如果小于0.1MB转化成KB
    size = (limit / 1024).toFixed(2) + 'KB';
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    // 如果小于0.1GB转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }

  let sizestr = size + '';
  let len = sizestr.indexOf('.');
  let dec = sizestr.substr(len + 1, 2);
  if (dec == '00') {
    // 当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}

export function getFileExt(filePath) {
  return  filePath && filePath.replace(/.+\./, '');
}

// 获取文件图标
export function getFileIcon(sufixParam) {
  let sufix = sufixParam;
  let icon = '';
  sufix = sufix ? sufix.toUpperCase() : '';
  if ('JPG,JPEG,GIF,BMP,PNG'.indexOf(sufix) !== -1) {
    icon = 'file-jpg';
  } else if ('DOC,DOCX,DOT,DOTX,DOCM,DOTM'.indexOf(sufix) !== -1) {
    icon = 'file-word';
  } else if ('XLS,XLSX,XLSM,XLT,XLTX,XLTM'.indexOf(sufix) !== -1) {
    icon = 'file-excel';
  } else if ('PPT,PPTX'.indexOf(sufix) !== -1) {
    icon = 'file-ppt';
  } else if ('TXT'.indexOf(sufix) !== -1) {
    icon = 'file-text';
  } else if ('PDF'.indexOf(sufix) !== -1) {
    icon = 'file-pdf';
  } else if ('ZIP,RAR'.indexOf(sufix) !== -1) {
    icon = 'file';
  } else {
    icon = 'file';
  }
  return icon;
}

/*
文件预览
 */
export function filePreview(name, path) {
  window.open(
    getConfig().domain +
    '/common/fileOnline.jhtml?downloadUrl=' +
    encodeURIComponent(path) +
    '&htmlName=' +
    encodeURIComponent(name)
  );
  // window.location.href="/a/b/c/d/aaaaaaa.jhtml?name="+name + "&path="+path;
  // 如果是图片，直接预览否则跳转到Office在线预览
}

// 更改URL的参数
export function changeParam(url, name, value) {
  var newUrl = '';
  var reg = new RegExp('(^|)' + name + '=([^&]*)(|$)');
  var tmp = name + '=' + value;
  if (url.match(reg) != null) {
    newUrl = url.replace(eval(reg), tmp);
  } else {
    if (url.match('[?]')) {
      newUrl = url + '&' + tmp;
    } else {
      newUrl = url + '?' + tmp;
    }
  }
  return newUrl;
}

function getRelation(str1, str2) {
  if (str1 === str2) {
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}
export function setCookie (name, value,days){
  var expdate = new Date();   //初始化时间
  expdate.setTime(expdate.getTime() + days * 60 * 1000);   //时间单位毫秒
  document.cookie = name+"="+value+";expires="+expdate.toGMTString()+";path=/";
}
export function getCookie(name, value, options) {
  if (typeof value !== 'undefined') {
    options = options || {};
    if (value === null) {
      value = '';
      options.expires = -1;
    }
    let expires = '';
    if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
      let date;
      if (typeof options.expires === 'number') {
        date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString();
    }
    let path = options.path ? '; path=' + options.path : '/';
    let domain = options.domain ? '; domain=' + options.domain : '';
    let secure = options.secure ? '; secure' : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join(
      ''
    );
  } else {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].replace(/^\s+|\s+$/gm, '');
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

export function isAntdPro() {
  return window.location.hostname === 'http://homedev.chinayasha.com';
}

/**
 * 注册全局JS函数
 * @returns {null}
 */
export function regWindowFun() {
  /**
   * 注册图片预览函数
   * opt = {current:0, imgs:[{name:'', url:''}]}
   */
  window.imgPreviewCtrl = function(opt){
    const _box = $('<div />');
    const ftpHost = getConfig().ftpHost;
    if(opt&&opt.imgs&&opt.imgs.length>0){
      opt.imgs.forEach(o=>{
        const img = $('<img />');
        if (new RegExp("http://|https://").test(o.url) ){
          img.attr('src', o.url);
        }else{
          img.attr('src', ftpHost + (o.url.indexOf('/')===0 ? o.url: `/${o.url}`));
        }
        img.on('error', function(){
          img.unbind('error')
          this.src = `${getConfig().domain}/assets/img/public/img-onerror.png`;
        });
        img.attr('alt', o.name);
        _box.append(img);
      })
    }else{
      message.error("属性不正确，请设置【opt.imgs】！", 2000)
      return null;
    }
    const viewer = new Viewer(_box[0], {zIndex:999999,
      hidden: function () {
        viewer.destroy();
        _box.remove();
      }
    });
    viewer.view(opt.current>opt.imgs.length-1?opt.imgs.length-1:opt.current);
    viewer.show();
  }
  return null;
}

/*
文件下载
 */
export function fileDown(name, path) {
  if (!path) {
    message.error('路径不存在，无法下载！');
    return;
  }
  // /rest/portal/file-operation/download
  // window.location.href="http://home.chinayasha.com/website/tools/fileUpload/download.jhtml?path=%2Fform%2F2018%2F06%2F28%2F8a8a8c1d641b6a3301644510c56d21c9.xlsx&name=%E9%99%84%E4%BB%B61-%E9%97%A8%E6%88%B7%E5%B9%95%E5%A2%99%E8%90%A5%E9%94%80%E7%AE%A1%E7%90%86%E5%AE%A1%E6%89%B9%E6%B5%81%E7%A8%8B%E4%BC%98%E5%8C%96%E8%A7%84%E8%8C%83%E6%A0%87%E5%87%86.xlsx";
  window.location.href =
    getConfig().domain +
    '/rest/portal/file-operation/download?filePath=' +
    encodeURIComponent(path) +
    '&fileName=' +
    encodeURIComponent(name);
}
