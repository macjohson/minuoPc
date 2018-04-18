import {routerRedux} from 'dva/router';
import {message,notification} from 'antd';
import {menu} from '../services/App';

export default {
  namespace:"App",
  state:{
    selectedKeys:[],
    visible:false
  },
  subscriptions:{
    setMenu({dispatch,history}){
      history.listen(({pathname})=>{
        dispatch({
          type:"setMenu",
          selectedKeys:[pathname]
        })
      })
    },
    loginInit({dispatch,history}){
      history.listen(({pathname})=>{
        const user = sessionStorage.getItem('user');
        if(pathname !== '/login'){
          if(!user){
            dispatch(routerRedux.push('/login'))
          }
        }else{
          if(user){
            dispatch(routerRedux.push('/'))
          }
        }
      })
    },
    initMenu({dispatch,history}){
      history.listen(({pathname})=>{
        if(sessionStorage.getItem('user')){
          dispatch({
            type:"menu"
          })
        }
      })
    }
  },
  effects:{
    *menu({},{call,put}){
      const {success,result,error} = yield call(menu);
      if(success){
        const menu = localStorage.getItem('menu');
        if(menu){
          if(menu !== JSON.stringify(result)){
            localStorage.setItem('menu',JSON.stringify(result));
          }
        }else{
          localStorage.setItem('menu',JSON.stringify(result));
        }
      }else{
        message.error(error && error.message ? error.message : "获取菜单失败，请刷新重试");
      }
    }
  },
  reducers:{
    setMenu(state,{selectedKeys}){
      return {...state,selectedKeys}
    },
    modalAction(state){
      return {...state,visible:!state.visible}
    }
  }
}
