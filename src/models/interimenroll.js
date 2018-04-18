import {list,excel} from '../services/interimenroll';
import {message} from 'antd';

export default {
  namespace:"interimenroll",
  state:{
   items:[],
   totalCount:0,
   filter:null,
    page:1,
    maxResultCount:10,
    url:null
  },
  subscriptions:{
    init({dispatch,history}){
      history.listen(({pathname})=>{
        if(pathname === "/interimenroll"){
          dispatch({
            type:"list",
            opts:{
              page:1,
              maxResultCount:10
            }
          })
        }
      })
    }
  },
  effects:{
    *list({opts},{call,put}){
      const {success,result,error} = yield call(list,opts);
      if(success){
        const {items,totalCount} = result;
        yield put({
          type:"update",
          opts:{
            items,
            totalCount,
            ...opts
          }
        })
      }else {
        message.error(error.message)
      }
    },
    *export({opts},{call,put}){
      const {success,result,error} = yield call(excel);
      if(success){
        yield put({
          type:"update",
          opts:{
            url:result
          }
        })
      }else{
        message.error(error.message)
      }
    }
  },
  reducers:{
    update(state,{opts}){
      return {...state,...opts}
    }
  }
}
