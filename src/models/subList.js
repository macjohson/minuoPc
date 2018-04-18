import { subList } from '../services/form';
import { notification } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';

export default {
    namespace: "subList",
    state: {
        list: [],
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        keyWord: null,
        _id: null
    },
    effects: {
        *getList({ payload }, { call, put }) {
            const { pageIndex, pageSize, keyWord, _id } = payload;
            const { success, result, error } = yield call(subList, payload);
            if (success) {
                const {list,total} = result;
                yield put({
                    type: "update",
                    payload: {
                        list,
                        total,
                        pageIndex,
                        pageSize,
                        keyWord
                    }
                })
            }
        },
    },
    subscriptions: {
        init({ dispatch, history }) {
            history.listen(({ pathname, location }) => {
                const { _id } = queryString.parse(window.location.search);
                if (pathname === "/form/subList") {
                    if (!_id) {
                        notification.error({ message: "错误提示", description: "参数错误，请重试" })
                        dispatch(routerRedux.push('/form'))
                        return
                    }

                    dispatch({
                        type: "getList",
                        payload: {
                            pageIndex: 1,
                            pageSize: 10,
                            _id
                        }
                    })
                }
            })
        }
    },
    reducers: {
        update(state,{payload}){
            return {...state,...payload}
        }
    }
}
