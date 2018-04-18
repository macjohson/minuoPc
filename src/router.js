import React from 'react';
import { Router, Route, Switch,routerRedux,Redirect } from 'dva/router';
import App from './routes/App';
import dynamic from 'dva/dynamic';

const {ConnectedRouter} = routerRedux;

const routers = [
  {
    //活动列表
    path:"/form",
    models:()=>[import('./models/form')],
    component:()=>import('./routes/form/index')
  },
  {
    path:"/form/check",
    models:()=>[import('./models/form')],
    component:()=>import('./routes/form/check')
  },
  {
    //登录
    path:"/login",
    component:()=>import('./routes/Login')
  },
  {
    //报名表
    path:"/form/subList",
    models:()=>[import('./models/form')],
    component:()=>import('./routes/form/subList')
  },
  {
    //学生列表
    path:"/studen",
    models:()=>[import('./models/student')],
    component:()=>import('./routes/student/index')
  },
  {
    //监护人列表
    path:"/guardian",
    models:()=>[import('./models/parents')],
    component:()=>import('./routes/student/parentsIndex')
  },
  {
    //监护人维护
    path:"/guardian/check",
    models:()=>[import('./models/parents')],
    component:()=>import('./routes/student/parentsCheck')
  },
  {
    //新增或编辑学生
    path:"/student/check",
    models:()=>[import('./models/student')],
    component:()=>import('./routes/student/check')
  },
  {
    path:"/user",
    component:()=>import('./routes/user/index')
  },
  {
    path:"/user/check",
    component:()=>import('./routes/user/check')
  },
  {
    path:"/school",
    models:()=>[import('./models/baseData')],
    component:()=>import('./routes/baseData/list')
  },
  {
    path:"/schedule",
    models:()=>[import('./models/baseData')],
    component:()=>import('./routes/baseData/list')
  },
  {
    path:"/class",
    models:()=>[import('./models/baseData')],
    component:()=>import('./routes/baseData/list')
  },
  {
    path:"/national",
    models:()=>[import('./models/baseData')],
    component:()=>import('./routes/baseData/list')
  },
  {
    path:"/school/checkSchool",
    models:()=>[import('./models/baseData')],
    component:()=>import('./routes/baseData/checkSchool')
  },
  {
    path:"/schedule/checkSchedule",
    models:()=>[import('./models/baseData')],
    component:()=>import('./routes/baseData/checkSchedule')
  },
  {
    path:"/class/checkClass",
    models:()=>[import('./models/baseData')],
    component:()=>import('./routes/baseData/checkClass')
  },
  {
    path:"/national/checkNational",
    models:()=>[import('./models/baseData')],
    component:()=>import('./routes/baseData/checkNational')
  },
  {
    path:"/interimenroll",
    models:()=>[import('./models/interimenroll')],
    component:()=>import('./routes/form/interimenroll')
  }
];

function RouterConfig({ history,app }) {
  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
        <Route exact path="/" render={()=><Redirect to="/form"/>}/>
          {
            routers.map(({path,...dynamics},key)=>(
              <Route path={path} exact key={key} component={
                dynamic({
                  app,
                  ...dynamics
                })
              }/>
            ))
          }
        </Switch>
      </App>
    </ConnectedRouter>
  );
}

export default RouterConfig;
