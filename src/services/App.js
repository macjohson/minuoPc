import request from '../utils/request';

/**
 * 获取菜单
 * @returns {Object}
 */
export const menu = ()=>{
  return request("/api/Menu");
}
