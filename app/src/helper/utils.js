import {message} from 'antd';
import md5 from 'js-md5';
/**
 * Created by bll on 2017/11/13.
 */
import request from './fetch';
import fetchConfig from '../config/fetch';

const XY_API = fetchConfig.XY_API;

/**
 * 请求数据序列化
 * @param  {object} [values]  参数对象
 * @return {string}          返回序列化参数
 */
export function serialize(values){
  let serializeStr = '';
  for(let k in values) {
    serializeStr += `${k}=${values[k]}&`;
  }
  return  serializeStr;
}

/**
 * 封装参数
 * @param {*} data 
 */
export function queryData2Md5(params, fields2Md5, deleteVerify) {
  const timestamp = (new Date()).valueOf();
  let appSerectToken = md5(fetchConfig.APP_SERECT + timestamp);
  let verify = appSerectToken;
  
  for (let k in params) {
    if (!fields2Md5) {
      verify += params[k];
    } else  if (fields2Md5.includes(k)) {
      verify += params[k];
    }
  }
  let o = {
    timestamp,
    verify: md5(verify)
  };

  if (deleteVerify) {
    delete o.verify;
  }
  return Object.assign({}, params, o);
}


/**
 * 处理请求成功后的数据
 * @param {*} name 
 */
export function handleData (data) {
  return new Promise((resolve, reject) => {
    if (data.data.status === 1) {
      resolve(data.data);
    } else {
      message.error(data.data.msg);
      reject(data.data);
    }
  })
}

/**
 * 获取url参数 （hash url）
 * @param {string} name  将要获取的参数名称
 */
export function getQuery(name){
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let hash = window.location.hash;
  let search = hash.substr(hash.indexOf('?'));
  let r = search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

/**
 * 获取url参数 （非hash url）
 * @param {string} name  将要获取的参数名称
 */
export function getQuery2(name) {
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}

/**
 * post请求
 * @param {string} url        请求链接
 * @param {object} [values]   请求参数
 */
export function post(url, values) {
  const timestamp = values.timestamp;
  const md5Ts = md5(fetchConfig.APP_SERECT + timestamp);
  delete values.timestamp;
  return request(`${XY_API}${url}`, {
    method: 'POST',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
      'appSerectToken': md5Ts,
      'timestamp': timestamp,
    },
    body: serialize(values)
  });
}

/**
 * put请求
 * @param {string} url        请求链接
 * @param {object} [values]   请求参数
 */
export function put(url, values) {
  return request(`${XY_API}${url}`, {
    method: 'PUT',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
    body: serialize(values)
  });
}

/**
 * get请求
 * @param {string} url        请求链接
 * @param {object} [values]   请求参数
 */
export function get(url, values, isOriginhttp, cb) {
  return request(`${isOriginhttp ? 'http://' : XY_API}${url}?${serialize(values)}`, {
    method: 'GET',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  }, cb);
}

/**
 * get请求
 * @param {string} url        请求链接
 * @param {object} [values]   请求参数
 */
export function get2(url, values, ip) {
  console.log(url, ip)
  let httpUrl = `usapi${url}?${serialize(values)}`;

  if (process.env.NODE_ENV !== 'development') {
    httpUrl = ip + `usapi?${serialize(values)}`;
  }
  console.log(httpUrl, 'httpurl')
  return request(httpUrl, {
    method: 'GET',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
    credentials : 'include'
  });
}


/**
 * delete请求
 * @param {string} url        请求链接
 * @param {object} [values]   请求参数
 */
export function del(url, values) {
  return request(`${XY_API}${url}`, {
    method: 'delete',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
    body: serialize(values)
  });
}

/**
 * 根据关键字搜索
 * @param {string} text        关键字
 * @param {object} [list]      被搜索列表
 * @param {object} fields      过滤字段
 */
export function search(text, list, fields) {
  let gl = JSON.parse(JSON.stringify(list));
  if (text === '' || gl.length === 0) return list;
  let pattern = new RegExp(text);

  let items = gl.filter ((item, key) => {

    let patternOk = false;

     for (let i in item) {
       if(fields && fields.indexOf(i) === -1) {
          continue;
       }
       if (pattern.test(item[i])) {
         patternOk = true;
         break;
       }
     }

     if (patternOk) {
        return item;
     }
     return undefined;
  });
  return items;
}

/**
 * 将时间戳转为字符串
 * @param {number} nS        时间戳
 * @return {string}          返回的时间字符串
 */
export function getLocalTime(nS) {
  let timeStr = (new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')).replace('上午12', '上午00');
  return timeStr;
}

/**
 * 将时间戳转为字符串
 * @param {number} timestamp        时间戳
 * @return {string}          返回的时间字符串
 */
export function time2Str(timestamp) {
  let d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
  let date = (d.getFullYear()) + "-" + 
           (d.getMonth() + 1) + "-" +
           (d.getDate()) + " " + 
           (d.getHours()) + ":" + 
           (d.getMinutes()) + ":" + 
           (d.getSeconds());
  return date;
}

/**
 * 将时间戳转为年月日
 * @param {number} nS        时间戳
 * @return {string}          返回的时间字符串
 */
export function timeInt2Str(ns) {
  var now = new Date(ns * 1000);  
  var yy = now.getFullYear();      //年
  var mm = now.getMonth() + 1;     //月
  var dd = now.getDate();          //日
  return `${yy}年${mm}月${dd}日`;
}


/**
 * 范围随机取整数
 * @param {number} lowerValue        最小值
 * @param {number} upperValue        最大值
 * @return {string}                  返回的随机数
 */
// function randomFrom(lowerValue,upperValue) {
//  return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
// }


/**
 * 范围随机不取整数，保留两位
 * @param {number} lowerValue        最小值
 * @param {number} upperValue        最大值
 * @return {string}                  返回的随机数
 */
// function randomFrom2(lowerValue,upperValue) {
//   return (Math.random() * (upperValue - lowerValue + 1) + lowerValue).toFixed(2);
// }

/**
 * 将时间转为分秒
 * @param {number} time              时间（s）
 * @return {string}                  返回几分几秒
 */
export function timeToMS(time) {
    if (time < 0) return '';
    let m = parseInt(parseInt(time) / 60);
    let s = parseInt(time) % 60;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return m + ':' + s;
}

/**
 * 计算多久前
 * @param {number} beforeTime         时间戳
 * @return {string}                   返回多久之前
 */
export function beforeTime(beforeTime) {
    const currentTime = Date.parse(new Date()) / 1000;
    let differenceTime = currentTime - beforeTime;

    if (differenceTime > 60 && differenceTime <= 3600) {
      //1小时内
      return parseInt(differenceTime / 60) + '分钟前';
    } else if (differenceTime > 3600 && differenceTime <= 3600 * 24) {
      //大于1小时
      return parseInt(differenceTime / 3600) + '小时前';
    } else if (differenceTime > 3600 * 24  && differenceTime <= 3600 * 24 * 30) {
      //大于1天
      return parseInt(differenceTime / (3600 * 24)) + '天前';
    } else if (differenceTime > 3600 * 24 * 30 && differenceTime <= 3600 * 24 * 30 * 365) {
      //大于1个月
      return parseInt(differenceTime / (3600 * 24 * 30)) + '月前';
    } else if (differenceTime > 3600 * 24 * 30 * 365) {
      //大于1年
      return parseInt(differenceTime / (3600 * 24 * 30 * 365)) + '年前';
    } else {
      //刚刚
      return '刚刚';
    }
}

/**
 * 开发环境打印
 * @param {any} o        
 */
export function ld(o) {
  if (process.env.NODE_ENV === 'production') {
    console.log(o);
  }
}

/**
 * 计算文件大小
 * @return {number}                   文件大小（字节）
 */
export function size2Str(size) {
  if (size < 1024) {
     return size + 'B';
  }else if(size >= 1024 && size < Math.pow(1024, 2)){
    return parseFloat(size / 1024).toFixed(2) + 'KB';
  }else if(size >= Math.pow(1024, 2) && size < Math.pow(1024, 3)){
    return parseFloat(size / Math.pow(1024, 2)).toFixed(2) + 'MB';
  }else if(size > Math.pow(1024, 3)){
    return parseFloat(size / Math.pow(1024, 3)).toFixed(2) + 'GB';
  }else {
    return 0 + 'B';
  }
}

 /**
   * Format time into 'hh:mm:ss:SS'
   *
   * @static
   * @param {number} [seconds=0]
   * @returns {string}
   * @memberof Format
   */
export function formatTimecode (seconds) {
    const safeSeconds = Number(seconds);
    if (isNaN(safeSeconds)) {
      return seconds;
    }

    const msec = ('00' + Math.floor(safeSeconds * 100 % 100)).substr(-2);
    const sec = ('00' + Math.floor(safeSeconds % 60)).substr(-2);
    const min = ('00' + Math.floor(safeSeconds / 60 % 60)).substr(-2);
    const hour = ('00' + Math.floor(safeSeconds / 3600 % 60)).substr(-2);

    return `${hour}:${min}:${sec}:${msec}`;
}


 /**
   * 触发事件
   * @param {object} [n]       触发节点
   * @param {string} [event]      触发事件
   */
export function trigger(n, event) {
    const eo= new window.MouseEvent(event);
    n.dispatchEvent(eo);
}

/**
 * 字符串转为时间戳
 * @param {string} [timestr]      事件字符串
 */
 export function ts2Ti(timestr) {
  let date = timestr.substring(0,19);    
  date = date.replace(/-/g,'/'); 
  return new Date(date).getTime() / 1000;
 }

/**
 * 根据某个字段排序
 * @param {string} [name]      字段名
 * @param {string} [minor]      callback
 */
export function sortBy(name,minor){
  return function(o,p){
    let a,b;
    if(o && p && typeof o === 'object' && typeof p ==='object'){
      a = o[name];
      b = p[name];
      if(a === b){
        return typeof minor === 'function' ? minor(o,p):0;
      }
      if(typeof a === typeof b){
        return a < b ? -1:1;
      }
      return typeof a < typeof b ? -1 : 1;
    }else{
      // throw("error");
    }
  };
}

//判断是否为IE
export function isIE() {
	return (!!window.ActiveXObject || "ActiveXObject" in window) ? true : false;
}


/**
 * 发送验证码方法
 */
export function sendSMS () {

}

/**
 *   将数组分组
 */
export function groupArr(array, subGroupLength) {
  let index = 0;
  let newArray = [];
  while(index < array.length) {
      newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
}

