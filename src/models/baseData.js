import {fetch} from '../utils/common';
import apis from '../services/baseData';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
import queryString from 'query-string';

const urls = ["/school","/schedule","/class","/national"];

const urlToApi = {}
urlToApi[urls[0]] = apis.schoolList;
urlToApi[urls[1]] = apis.scheduleList
urlToApi[urls[2]] = apis.classList;
urlToApi[urls[3]] = apis.nationalList;

const urlToColumns = {}
/**
 * 校区columns
 * @type {*[]}
 */
urlToColumns[urls[0]] = [
  ["校区编码","code"],
  ["校区名称","schoolZoneName"],
  ["校区描述","remark"],
  ["创建时间","creationTimeText"]
]
/**
 * 学届columns
 * @type {*[]}
 */
urlToColumns[urls[1]] = [
  ["学届名称","name"],
  ["备注","remark"],
  ["创建时间","creationTimeText"]
]
/**
 * 班级columns
 * @type {*[]}
 */
urlToColumns[urls[2]] = [
  ["班级编码","code"],
  ["班级名称","className"],
  ["校区","schoolZoneName"],
  ["学届","academicYearName"],
  ["创建时间","creationTimeText"],
]

/**
 * 国籍columns
 * @type {*[]}
 */
urlToColumns[urls[3]] = [
  ["国籍名称","name"],
  ["创建时间","creationTimeText"],
]

const defaultState = {
  items:[],
  page:1,
  maxResultCount:10,
  totalCount:0,
  filter:null,
  api:{},
  config:{},
  info:{}
}

export default {
  namespace:"baseData",
  state:{
    ...defaultState,
    columns:[]
  },
  subscriptions:{
    initList({dispatch,history}){
      history.listen(({pathname})=>{
        if(urls.includes(pathname)){
          const columns = urlToColumns[pathname].map((item)=>{
            return {title:item[0],dataIndex:item[1],key:item[1]}
          })

          dispatch({type:"setDefault"});
          dispatch({
            type:"list",
            payload:pathname === urls[3] ? {} : {page:1, maxResultCount:10},
            api:urlToApi[pathname],
            columns
          })
        }
      })
    },
    initConfig({dispatch,history}){
      history.listen(({pathname})=>{
        const configPage = ["/class/checkClass"];
        if(configPage.includes(pathname)){
          dispatch({
            type:"config"
          })
        }
      })
    },
    classEditInit({dispatch,history}){
      history.listen(({pathname})=>{
        if(pathname === "/class/checkClass"){
          const {id} = queryString.parse(window.location.search);
          if(id){
            dispatch({
              type:"classDetail",
              payload:{
                Id:id
              }
            })
          }
        }
      })
    }
  },
  effects:{
    *list({payload,api,columns},{call,put}){
      yield put({
        type:"update",
        payload:{
          columns,
          api
        }
      })
      const {page,maxResultCount,filter} = payload;
      const {success,result,error} = yield call(fetch,{api,payload});
      if(success){
        let items = [],totalCount = 0;
        if(api.api === apis.nationalList.api){
          items = result
          totalCount = 0
        }else{
          items = result.items;
          totalCount = result.totalCount;
        }
        yield put({
          type:"update",
          payload:{
            items,
            totalCount,
            filter,
            page,
            maxResultCount,
          }
        })
      }else{
        message.error(error && error.message ? error.message : "获取列表失败，请重试")
      }
    },
    *checkSchool({payload},{call,put}){
      const {success,result,error} = yield call(fetch,{api:apis.checkSchool,payload});
      if(success){
        message.success("操作成功");
        localStorage.removeItem("checkSchool");
        yield put(routerRedux.push('/school'))
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试");
      }
    },
    *delSchool({payload},{call,put,select}){
      message.loading("删除中...",0);
      const {success,result,error} = yield call(fetch,{api:apis.delSchool,payload});
      message.destroy();
      if(success){
        message.success("删除成功")
        const {api,columns,page,maxResultCount,filter} = yield select(state => state.baseData);
        yield put({
          type:"list",
          payload:{
            page,
            maxResultCount,
            filter
          },
          api,
          columns
        })
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试");
      }
    },
    *config({payload},{call,put}){
      const {success,result,error} = yield call(fetch,{api:apis.config});
      if(success){
          yield put({
            type:"update",
            payload:{
              config:result
            }
          })
      }else{
        message.error(error && error.message ? error.message : "获取配置失败，请刷新页面");
      }
    },
    *checkSchedule({payload},{call,put}){
      const {success,result,error} = yield call(fetch,{api:apis.checkSchedule,payload});
      if(success){
        message.success("操作成功");
        localStorage.removeItem("checkSchedule");
        yield put(routerRedux.push("/schedule"));
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试");
      }
    },
    *delSchedule({payload},{call,put}){
      message.loading("删除中...",0);
      const {success,result,error} = yield call(fetch,{api:apis.delSchedule,payload});
      message.destroy();
      if(success){
        message.success("操作成功");
        yield put({type:"reload"})
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试");
      }
    },
    *reload({payload},{call,put,select}){
      const {api,columns,page,maxResultCount,filter} = yield select(state => state.baseData);
      yield put({
        type:"list",
        payload:{
          page,
          maxResultCount,
          filter
        },
        api,
        columns
      })
    },
    *checkClass({payload},{call,put}){
      const {success,result,error} = yield call(fetch,{api:apis.checkClass,payload});
      if(success){
        message.success("操作成功");
        yield put({
          type:"update",
          payload:{
            info:{}
          }
        })
        yield put(routerRedux.push("/class"));
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试");
      }
    },
    *delClass({payload},{call,put}){
      message.loading("删除中...",0);
      const {success,result,error} = yield call(fetch,{api:apis.delClass,payload});
      message.destroy();
      if(success){
        message.success("操作成功");
        yield put({type:"reload"});
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试");
      }
    },
    *classDetail({payload},{call,put}){
      const {success,result,error} = yield call(fetch,{api:apis.classDetail,payload});
      if(success){
        yield put({
          type:"update",
          payload:{
            info:result
          }
        })
      }else{
        message.error(error && error.message ? error.message : "获取班级详情失败，请重试");
      }
    },
    *checkNational({payload},{call,put}){
      const {success,result,error} = yield call(fetch,{api:apis.checkNational,payload});
      if(success){
        message.success("操作成功");
        localStorage.removeItem("checkNational");
        yield put(routerRedux.push('/national'))
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试");
      }
    },
    *delNational({payload},{call,put}){
      message.loading("删除中",0);
      const {success,result,error} = yield call(fetch,{api:apis.delNational,payload});
      message.destroy();
      if(success){
        message.success("操作成功");
        yield put({type:"reload"});
      }else{
        message.error(error && error.message ? error.message : "操作失败，请重试");
      }
    }
  },
  reducers:{
    setDefault(state){
      return {...state,...defaultState}
    },
    update(state,{payload}){
      return {...state,...payload}
    }
  }
}
