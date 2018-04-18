import {list,check,setStatus,del,login,logout,detial} from '../services/user';
import {message,notification} from 'antd';
import {showError} from '../utils/common';
import {routerRedux} from 'dva/router';
import queryString from 'query-string';

export default {
  namespace:"user",
  state:{
    items:[],
    page:1,
    maxResultCount:10,
    totalCount:0,
    filter:null,
    info:{}
  },
  subscriptions:{
    initList({dispatch,history}){
      history.listen(({pathname})=>{
        if(pathname === "/user"){
          dispatch({
            type:"getList",
            payload:{
              page:1,
              maxResultCount:10
            }
          })
        }
      })
    },
    initEdit({dispatch,history}){
      history.listen(({pathname})=>{
        if(pathname === "/user/check"){
          const {id} = queryString.parse(window.location.search);
          if(id){
            dispatch({
              type:"detail",
              payload:{
                id
              }
            })
          }
        }
      })
    }
  },
  effects:{
    *getList({payload},{call,put}){
      const {page,maxResultCount,filter} = payload;
      const {success,result,error = {}} = yield call(list,payload);
      if(success){
        const {items,totalCount} = result;
        yield put({
          type:"update",
          payload:{
            page,
            maxResultCount,
            filter,
            items,
            totalCount
          }
        })
      }else{
        message.error(error.message || "出错了，请重试")
      }
    },
    *login({payload},{call,put}){
      const {success,result,error = {}} = yield call(login,payload);
      if(success){
        message.success("登录成功");
        sessionStorage.setItem("user",JSON.stringify(result))
        yield put(routerRedux.push('/user'));
      }else{
        notification.error({message:error.message,description:error.details})
      }
    },
    *logout({payload},{call,put}){
      message.loading("安全退出中...",0);
      const {success,result,error = {}} = yield call(logout);
      message.destroy();
      if(success){
        message.success("已安全登出系统，请重新登录")
        sessionStorage.clear();
        yield put(routerRedux.push('/login'))
      }else{
        message.error(error.message || "注销失败，请重试")
      }
    },
    *setStatus({payload},{call,put,select}){
      message.loading("操作中...",0);
      const {success,result,error = {}} = yield call(setStatus,payload);
      message.destroy();
      if(success){
        message.success("操作成功");
        const {page,maxResultCount,filter} = yield select(state => state.user);
        yield put({
          type:"getList",
          payload:{
            page,
            maxResultCount,
            filter
          }
        })
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试")
      }
    },
    *check({payload,resetFields},{call,put}){
      const {success,result,error} = yield call(check,payload);
      if(success){
        message.success("操作成功")
        resetFields();
        yield put({
          type:"update",
          payload:{
            info:{}
          }
        })
        yield put(routerRedux.push('/user'));
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试")
      }
    },
    *detail({payload},{call,put}){
      const {success,result,error} = yield call(detial,payload);
      if(success){
        yield put({
          type:"update",
          payload:{
            info:result
          }
        })
      }else{
        message.error(error && error.message ? error.message : "获取用户详情失败，请重试")
      }
    },
    *delete({payload},{call,put,select}){
      message.loading("删除中...",0);
      const {success,result,error} = yield call(del,payload);
      message.destroy();
      if(success){
        message.success("操作成功")
        const {page,maxResultCount,filter} = yield select(state => state.user);
        yield put({
          type:"getList",
          payload:{
            page,
            maxResultCount,
            filter
          }
        })
      }else{
        message.error(error && error.message ? error.message : "删除用户失败，请重试")
      }
    }
  },
  reducers:{
    update(state,{payload}){
      return {...state,...payload}
    }
  }
}
