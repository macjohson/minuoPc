import request from '../utils/request';
import queryString from 'query-string';

/**
 * 获取活动列表
 * @param param
 * @returns {Object}
 */
export const list = (param)=>{
  return request("/api/services/app/activities/GetActivityList",{
    method:"POST",
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(param)
  })
}

/**
 * 新增或编辑活动
 * @param param
 * @returns {Object}
 */
export const check = (param)=>{
  return request("/api/services/app/activities/AddOrUpdateActivities",{
    method:"POST",
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(param)
  })
}

/**
 * 获取活动详情
 * @param param
 * @returns {Object}
 */
export const detail = (param)=>{
  return request(`/api/services/app/activities/GetActivityDetail?${queryString.stringify(param)}`)
}

/**
 * 删除活动
 * @param param
 * @returns {Object}
 */
export const del = (param)=>{
  return request(`/api/services/app/activities/DeleteActivities?${queryString.stringify(param)}`,{
    method:"DELETE"
  })
}

/**
 * 获取报名列表
 * @param param
 * @returns {Object}
 */
export const joinList = (param)=>{
  return request("/api/services/app/activities/GetEnrollList",{
    method:"POST",
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(param)
  })
}

export const _export = (param)=>{
  return request(`/api/services/app/activities/ExportActivity?${queryString.stringify(param)}`,{
    method:"POST"
  })
}
