import fetch from 'dva/fetch';

function parseJSON(response) {
  if (response.status == 500) {
    return response.text();
  } else {
    return response.json();
  }

}

function checkStatus(response) {
  if (response.status == 401) {
    return response;
  }

  if ((response.status >= 200 && response.status < 300) || response.status == 500) {
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
export default function request(url, options) {
  let __options = options || {};

  __options.credentials = 'include';
  // const _url = "http://api.macjohson.com" + url;
  return fetch(url, __options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      let d = (typeof data == 'string') ? JSON.parse(data) : data
      return d;
    })
    .catch(err => ({
      err
    }));
}
