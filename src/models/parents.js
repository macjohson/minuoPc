import apis from '../services/parents';
import {fetch} from '../utils/common';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
import queryString from 'query-string';

export default{
    namespace:"parents",
    state:{
        items:[],
        totalCount:0,
        page:1,
        maxResultCount:10,
        filter:null,
        info:{}
    },
    subscriptions:{
        init({dispatch,history}){
            history.listen(({pathname})=>{
                if(pathname === "/guardian"){
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
                if(pathname === "/guardian/check"){
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
        }
    },
    effects:{
        *list({payload},{call,put}){
            const {page,maxResultCount,filter} = payload;
            const {success,result,error} = yield call(fetch,{api:apis.list,payload});
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
                message.error(error && error.message ? error.message : "获取列表失败");
            }
        },
        *check({payload},{call,put}){
            const {success,result,error} = yield call(fetch,{api:apis.check,payload});
            if(success){
                message.success("操作成功");
                yield put({
                    type:"update",
                    payload:{
                        info:{}
                    }
                })
                yield put(routerRedux.push('/guardian'))
            }else{
                message.error(error && error.message ? error.message : "操作失败");
            }
        },
        *del({payload},{call,put,select}){
            message.loading("删除中...",0);
            const {success,result,error} = yield call(fetch,{api:apis.del,payload});
            message.destroy();
            if(success){
                message.success("操作成功");
                const {page,maxResultCount,filter} = yield select(state => state.parents);
                yield put({
                    type:"list",
                    payload:{
                        page,
                        maxResultCount,
                        filter
                    }
                })
            }else{
                message.error(error && error.message ? error.message : "操作失败");
            }
        },
        *detail({payload},{call,put}){
            const {success,result,error} = yield call(fetch,{api:apis.detail,payload});
            if(success){
                yield put({
                    type:"update",
                    payload:{
                        info:result
                    }
                })
            }else{
                message.error(error && error.message ? error.message : "获取详情失败");
            }
        }
    },
    reducers:{
        update(state,{payload}){
            return {...state,...payload}
        }
    }
}