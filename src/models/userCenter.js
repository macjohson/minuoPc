import {list, viewWxInfo} from '../services/userCenter';
import {notification} from 'antd';

export default{
  namespace:"userCenter",
  state:{
    visible:false,
    list:[],
    total:0,
    pageIndex:1,
    pageSize:10,
    keyWord:null,
    wxInfo:{}
  },
  effects:{
    *getList({payload},{call,put}){
      const {pageIndex,pageSize,keyWord} = payload;
      const {success,result,error} = yield call(list,payload);
      if(success){
        const {list,total} = result;
        yield put({
          type:"update",
          payload:{
            list,
            total,
            pageIndex,
            pageSize,
            keyWord
          }
        })
      }
    },
    *viewWx({payload},{call,put}){
      const {success,result,error} = yield call(viewWxInfo,payload);
      if(success){
        yield put({
          type:"update",
          payload:{
            wxInfo:result
          }
        })
      }else{
        notification.error({message:"获取微信用户信息失败！"});
      }
    }
  },
  subscriptions:{
    init({dispatch,history}){
      history.listen(({pathname})=>{
        if(pathname === "/userCenter"){
          dispatch({
            type:"getList",
            payload:{
              pageIndex:1,
              pageSize:10
            }
          })
        }
      })
    }
  },
  reducers:{
    modalAction(state){
      return {...state,visible:!state.visible}
    },
    update(state,{payload}){
      return {...state,...payload}
    }
  }
}
