import {Modal} from 'antd';
import request from './request';
import queryString from 'query-string';

/**
 * 默认表单布局
 * @type {{labelCol: {span: number}, wrapperCol: {span: number}}}
 */
export const defaultLayout = {
  labelCol:{
    span:4
  },
  wrapperCol:{
    span:8
  }
}

/**
 * 离开表单提示
 * @param onOk
 */
export const leaveFormTip = (onOk)=>{
  Modal.confirm({
    title:"操作提示",
    content:"您当前有未保存的信息，确定取消？",
    onOk
  })
}

/**
 * 移动端相关配置
 * @type {{mobileUrl: string}}
 */
export const mobileConfig = {
  mobileUrl:"http://mnd.macjohson.com",
}


/**
 * fetch
 * @param api
 * @param method
 * @param isBody
 * @param payload
 * @returns {Object}
 */
export const fetch = ({api:{api,method = "GET",isBody = false},payload})=>{

  const _api = isBody ? api : `${api}?${queryString.stringify(payload)}`;

  const headers = isBody ? {
    "Content-Type":"application/json"
  } : null

  const body = isBody ? JSON.stringify(payload) : null;

  const options = {
    method,
    headers,
    body
  }

  if(!isBody){
    delete options.headers
    delete options.body
  }

  return request(_api,options)
}
