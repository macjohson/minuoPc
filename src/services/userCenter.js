import {fetchPost,fetchGet} from '../utils/common';

export const list = (param)=>{
    return fetchGet("/api/userList",param);
}

export const viewWxInfo = (param)=>{
    return fetchGet("/api/wxInfo",param);
}