// import fetch from 'dva/fetch';

const fetch = require("dva").fetch;


function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options, cb) {
  const opt = Object.assign({}, options);
  const response = await fetch(url, opt);
  // console.log(response,cb, 11111)
  cb && cb(response);
  checkStatus(response);

  const data = await response.json();

  const ret = {
    data,
    headers: {}
  };
  

  if (response.headers.get('x-total-count')) {
    ret.headers['x-total-count'] = response.headers.get('x-total-count');
  }

  return ret;
}
