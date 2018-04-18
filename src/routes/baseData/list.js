import React from 'react';
import { connect } from 'dva';
import {Button,Input,Table,Row,Col,Divider,Modal} from 'antd';
import apis from '../../services/baseData';
import {routerRedux} from 'dva/router';
import queryString from 'query-string';
import QueueAnim from 'rc-queue-anim';

class schoolList extends React.PureComponent{
  constructor(props){
    super(props);
    this.dispatch = props.dispatch;
  }

  check = (id)=>{
    let checkUrl = "";
    switch (this.props.baseData.api.api){
      case apis.schoolList.api:
        checkUrl = "/school/checkSchool";
        break;
      case apis.scheduleList.api:
        checkUrl = "/schedule/checkSchedule";
        break;
      case apis.classList.api:
        checkUrl = "/class/checkClass";
        break;
      case apis.nationalList.api:
        checkUrl = "/national/checkNational";
        break;
    }

    const _checkUrl = id ? `${checkUrl}?${queryString.stringify({id})}` : checkUrl

    this.dispatch(
      routerRedux.push(_checkUrl)
    )
  }

  /**
   * 编辑校区
   * @param record
   */
  checkSchool = (record)=>{
    localStorage.setItem("checkSchool",JSON.stringify(record));
    this.dispatch(routerRedux.push(`/school/checkSchool?${queryString.stringify({id:record.id})}`))
  }

  /**
   * 删除校区
   * @param Id
   */
  delSchool = (Id)=>{
    Modal.confirm({
      title:"操作提示",
      content:"确定要删除该校区？",
      onOk:()=>this.dispatch({
        type:"baseData/delSchool",
        payload:{
          Id
        }
      })
    })
  }

  /**
   * 编辑学届
   * @param record
   */
  checkSchedule = (record)=>{
    localStorage.setItem("checkSchedule",JSON.stringify(record));
    this.dispatch(routerRedux.push(`/schedule/checkSchedule?${queryString.stringify({id:record.id})}`))
  }

  /**
   * 删除学届
   * @param Id
   */
  delSchedule = (Id)=>{
    Modal.confirm({
      title:"操作提示",
      content:"确定要删除该学届？",
      onOk:()=>this.dispatch({
        type:"baseData/delSchedule",
        payload:{
          Id
        }
      })
    })
  }

  /**
   * 编辑班级
   * @param record
   */
  checkClass= (record)=>{
    this.dispatch(routerRedux.push(`/class/checkClass?${queryString.stringify({id:record.id})}`))
  }

  /**
   * 删除班级
   * @param Id
   */
  delClass = (Id)=>{
    Modal.confirm({
      title:"操作提示",
      content:"确定要删除该班级？",
      onOk:()=>this.dispatch({
        type:"baseData/delClass",
        payload:{
          Id
        }
      })
    })
  }

  /**
   * 编辑国籍
   * @param record
   */
  checkNational= (record)=>{
    localStorage.setItem("checkNational",JSON.stringify(record));
    this.dispatch(routerRedux.push(`/national/checkNational?${queryString.stringify({id:record.id})}`))
  }

  /**
   * 删除国籍
   * @param Id
   */
  delNational = (Id)=>{
    Modal.confirm({
      title:"操作提示",
      content:"确定要删除该国籍？",
      onOk:()=>this.dispatch({
        type:"baseData/delNational",
        payload:{
          Id
        }
      })
    })
  }

  action = ()=>{
    const api = this.props.baseData.api;
    let action;
    switch (api.api){
      case apis.schoolList.api:
        action = (text,record,index)=>(
          <span>
            <a onClick={()=>this.checkSchool(record)}>编辑</a>
            <Divider type={"vertical"}/>
            <a onClick={()=>this.delSchool(record.id)}>删除</a>
          </span>
        );
        break;
      case apis.scheduleList.api:
        action = (text,record,index)=>(
          <span>
            <a onClick={()=>this.checkSchedule(record)}>编辑</a>
            <Divider type={"vertical"}/>
            <a onClick={()=>this.delSchedule(record.id)}>删除</a>
          </span>
        );
        break;
      case apis.classList.api:
        action = (text,record,index)=>(
          <span>
            <a onClick={()=>this.checkClass(record)}>编辑</a>
            <Divider type={"vertical"}/>
            <a onClick={()=>this.delClass(record.id)}>删除</a>
          </span>
        );
        break;
      case apis.nationalList.api:
        action = (text,record,index)=>(
          <span>
            <a onClick={()=>this.checkNational(record)}>编辑</a>
            <Divider type={"vertical"}/>
            <a onClick={()=>this.delNational(record.id)}>删除</a>
          </span>
        );
        break;
    }

    return {title:"操作",render:action,key:"action"}
  }

  render(){
    const {
      baseData:{
        columns,
        items,
        totalCount,
        api,
        page,
        maxResultCount,
        filter
      },
      loading:{
        effects:{
          "baseData/list":initLoading = false
        }
      }
    } = this.props;

    return (
      <div>
        <Row style={{marginBottom:30}}>
          <Col span={4}>
            <Button type={"primary"} onClick={()=>this.check(null)}>新增</Button>
          </Col>
          {
            api.api === apis.nationalList.api ? null :
              <Col span={8} offset={12}>
                <Input.Search placeholder={"搜索"} onSearch={(val)=>this.dispatch({type:"baseData/list",payload:{page:1,maxResultCount:10,filter:val},api,columns})}/>
              </Col>
          }
        </Row>
        <Table columns={[...columns,this.action()]} dataSource={items} loading={initLoading} size={"middle"} rowKey={record => record.id} pagination={
          api.api === apis.nationalList.api ? false :
            {
              current:page,
              pageSize:maxResultCount,
              onChange:(current)=>this.dispatch({type:"baseData/list",payload:{page:current,maxResultCount,filter},api,columns}),
              showSizeChanger:true,
              onShowSizeChange:(current,size)=>this.dispatch({type:"baseData/list",payload:{page:1,maxResultCount:size,filter},api,columns}),
              total:totalCount,
              showTotal:total => `共${total}条`
            }
        }/>
      </div>
    )
  }
}

export default connect(({baseData,loading})=>({baseData,loading}))(schoolList)
