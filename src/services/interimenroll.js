import request from '../utils/request';

export const list = (param)=>{
  return request('/api/services/app/activities/GetInterimEnrollList',{
    method:"POST",
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(param)
  })
};


export const excel = ()=>{
  return request('/api/services/app/activities/ExportInterimActivity',{
    method:"POST"
  })
};
