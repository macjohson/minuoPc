import request from '../utils/request';
import queryString from 'query-string';

/**
 * 获取用户列表
 * @param param
 * @returns {Object}
 */
export const list = (param)=>{
  return request(`/api/services/app/user/GetUserList`,{
    method:"POST",
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(param)
  })
};

/**
 * 新增或编辑用户
 * @param param
 * @returns {Object}
 */
export const check = (param)=>{
  return request("/api/services/app/user/AddOrUpdateUser",{
    method:"POST",
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(param)
  })
}

/**
 * 启用或禁用用户
 * @param param
 * @returns {Object}
 */
export const setStatus = (param)=>{
  return request(`/api/services/app/user/EnableOrDisableUser?${queryString.stringify(param)}`,{
    method:"POST",
  })
}

/**
 * 删除用户
 * @param param
 * @returns {Object}
 */
export const del = (param)=>{
  return request(`/api/services/app/user/DeleteUser?${queryString.stringify(param)}`,{
    method:"DELETE"
  })
}

/**
 * 登录
 * @param param
 * @returns {Object}
 */
export const login = (param)=>{
  return request(`/api/services/app/user/Login`,{
    method:"POST",
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(param)
  })
}

/**
 * 注销登录
 * @param param
 */
export const logout = (param)=>{
  return request("/api/services/app/user/Logout",{
    method:"POST"
  })
}

/**
 * 获取用户详情
 * @param param
 * @returns {Object}
 */
export const detial = (param)=>{
  return request("/api/services/app/user/Get",{
    method:"POST",
    headers:{
      'Content-Type':"application/json"
    },
    body:JSON.stringify(param)
  })
}
