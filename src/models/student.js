import apis from '../services/student';
import * as _apis from '../services/baseData';
import {fetch} from '../utils/common';
import queryString from 'query-string';
import {message} from 'antd';

export default {
  namespace:"student",
  state:{
    items:[],
    page:1,
    maxResultCount:10,
    totalCount:0,
    schoolZoneId:null,
    classesId:null,
    academicYearId:null,
    filter:null,
    config:{},
    classConfig:[],
    options:[],
    parentConfig:[],
    dataSource:[]
  },
  subscriptions:{
    initStudentList({dispatch,history}){
      history.listen(({pathname})=>{
        if(pathname === "/studen"){
          dispatch({
            type:"studentList",
            payload:{
              page:1,
              maxResultCount:10
            }
          })
          dispatch({type:"config"})
        }
      })
    },
    initEdit({dispatch,history}){
      history.listen(({pathname})=>{
        if(pathname === "/student/check"){
          const {id} = queryString.parse(window.location.search);
          dispatch({
            type:"config"
          })
        }
      })
    }
  },
  effects:{
    *studentList({payload},{call,put}){
      const {page,maxResultCount,filter,schoolZoneId,classesId,academicYearId} = payload;
      const {success,result,error} = yield call(fetch,{api:apis.studentList,payload});
      if(success){
        const {items,totalCount} = result;
        yield put({
          type:"update",
          payload:{
            page,
            maxResultCount,
            filter,
            schoolZoneId,
            classesId,
            academicYearId,
            items,
            totalCount
          }
        })
      }else{
        message.error(error && error.message ? error.message : "获取学生列表失败，请重试");
      }
    },
    *config({payload},{call,put}){
      message.loading("获取配置信息中...",0)
      const {success,result,error} = yield call(fetch,{api:_apis.config});
      message.destroy();
      if(success){
        yield put({
          type:"setConfig",
          config:result
        })
      }else{
        message.error(error && error.message ? error.message : "获取配置失败，请刷新页面重试");
      }
    },
    *classConfig({payload,target,school},{call,put,select}){
      if(target){
        target.loading = true;
      }
      const {success,result,error} = yield call(fetch,{api:apis.classConfig,payload});
      if(target){
        target.loading = false;
      }
      if(success){
        yield put({
          type:"update",
          payload:{
            classConfig:result
          }
        })
        if(target){
          const classes = result.map((item)=>({label:item.name,value:item.value}));
          const {options} = yield select(state => state.student);

          const schoolIndex = options.indexOf(school);

          const targetIndex = options[schoolIndex].children.indexOf(target);

          options[schoolIndex].children[targetIndex].children = classes;

          yield put({
            type:"update",
            payload:{
              options
            }
          })
        }
      }else{
        message.error(error && error.message ? error.message : "获取班级失败，请刷新页面重试");
      }
    },
    *parentConfig({filter},{call,put}){
      const {success,result,error} = yield call(fetch,{api:apis.parentsConfig,payload:{filter}});
      if(success){
        yield put({
          type:"update",
          payload:{
            parentConfig:result
          }
        })
      }else {
        message.error(error && error.message ? error.message : "请输入监护人信息进行搜索");
      }
    }
  },
  reducers:{
    update(state,{payload}){
      return {...state,...payload}
    },
    setConfig(state,{config}){
      const {schoolZoneList,academicYearList} = config;
      const [schools,schedules] = [
        schoolZoneList.map((item)=>({label:item.name,value:item.value})),
        academicYearList.map((item)=>({label:item.name,value:item.value,isLeaf:false}))
      ]


      let options = [];
      for (let item of schools){
        options.push({...item,children:schedules})
      }

      return {...state,config,options}
    },
    setParent(state,{value}){
      const _dataSource = state.dataSource;
      const __dataSource = value.map((item)=>{
        const names = item.label.split("——")
        const name = names[0];
        const phone = names[1];
        return {name,phone,id:item.key}
      });
      let dataSource = []
      if(_dataSource.length === 0){
        dataSource = __dataSource
      }else{
        dataSource = [..._dataSource,__dataSource[__dataSource.length - 1]]
      }

      return {...state,dataSource}
    },
    setRelationShip(state,{value,record}){
      const dataSource = state.dataSource;
      const itemIndex = dataSource.indexOf(record);
      dataSource[itemIndex].relationShip = value;
      return {...state,dataSource}
    }
  }
}
