const menu = [
  {
    name:"活动管理",
    children:[
      {
        name:"活动列表",
        url:"/form"
      }
    ]
  },
  {
    name:"米诺郎朗书声",
    url:"/read"
  },
  {
    name:"学生管理",
    children:[
      {
        name:"学生列表",
        url:"/student"
      },
      {
        name:"家长列表",
        url:"/parants"
      }
    ]
  },
  {
    name:"基础信息维护",
    children:[
      {
        name:"校区",
        url:"/school"
      },
      {
        name:"学届",
        url:"/schedule"
      },
      {
        name:"班级",
        url:"/class"
      },
      {
        name:"国籍",
        url:"/national"
      }
    ]
  },
  {
    name:"用户管理",
    children:[
      {
        name:"用户列表",
        url:"/user"
      }
    ]
  }
];

export default menu;
