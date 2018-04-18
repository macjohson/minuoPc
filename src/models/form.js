import {list,check,del,detail,joinList,_export} from '../services/form';
import queryString from 'query-string';
import {message} from 'antd';
import {routerRedux} from 'dva/router';

export default {
  namespace:"form",
  state:{
    items:[],
    page:1,
    maxResultCount:10,
    filter:null,
    totalCount:0,
    info:{},
    joinList:{
      items:[],
      page:1,
      maxResultCount:10,
      filter:null,
      totalCount:0,
    },
    downloadUrl:null
  },
  effects:{
    *list({payload},{call,put}){
      const {page,maxResultCount,filter} = payload;
      const {success,result,error} = yield call(list,payload);
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
        message.error(error && error.message ? error.message : "获取列表失败，请重试")
      }
    },
    *export({opts},{call,put}){
      const {success,result,error} = yield call(_export,opts);
      if(success){
        yield put({
          type:"update",
          payload:{
            downloadUrl:result
          }
        })
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试")
      }
    },
    *check({payload},{call,put}){
      const {success,result,error} = yield call(check,payload);
      if(success){
        message.success("操作成功")
        yield put({
          type:"update",
          payload:{
            info:{}
          }
        })
        yield put(routerRedux.push("/form"))
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试")
      }
    },
    *detail({payload},{call,put}){
      const {success,result,error} = yield call(detail,payload);
      if(success){
        yield put({
          type:"update",
          payload:{
            info:result
          }
        })
      }else{
        message.error(error && error.message ? error.message : "获取活动详情失败，请重试")
      }
    },
    *del({payload},{call,put,select}){
      message.loading("删除中...",0);
      const {success,result,error} = yield call(del,payload);
      message.destroy();
      if(success){
        message.success("操作成功");
        const {page,maxResultCount,filter} = yield select(state => state.form);
        yield put({
          type:"list",
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
    *joinList({payload},{call,put}){
      const {page,maxResultCount,filter} = payload
      const {success,result,error} = yield call(joinList,payload);
      if(success){
        const {items,totalCount} = result;
        yield put({
          type:"update",
          payload:{
            joinList:{
              page,
              maxResultCount,
              filter,
              items,
              totalCount
            }
          }
        })
      }else{
        message.error(error && error.message ? error.message : "获取报名列表失败，请重试")
      }
    }
  },
  reducers:{
    update(state,{payload}){
      return {...state,...payload}
    }
  },
  subscriptions:{
    initFormList({dispatch,history}){
      history.listen(({pathname})=>{
        if(pathname === "/form"){
          dispatch({
            type:"list",
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
        if(pathname === "/form/check"){
          const {id} = queryString.parse(window.location.search);
          if(id){
            dispatch({
              type:"detail",
              payload:{
                Id:id
              }
            })
          }
        }
      })
    },
    initSubList({dispatch,history}){
      history.listen(({pathname})=>{
        if(pathname === "/form/subList"){
          const {id} = queryString.parse(window.location.search);
          if(id){
            dispatch({
              type:"joinList",
              payload:{
                activityId:id,
                page:1,
                maxResultCount:10
              }
            })
          }
        }
      })
    }
  }
}
